import { Router } from 'express';
import { config } from '../config';
import { query, withTransaction } from '../db';
import { AuthenticatedRequest, requireAuth, requirePermission } from '../middleware/auth';
import { audit } from '../services/audit';
import { hmac, randomToken, timingSafeEqualHex } from '../services/crypto';
import { isUuid } from '../services/validation';
import { rateLimit, cleanPlainText } from '../middleware/security';

const router = Router();
const gateways = new Set(['saman', 'zarinpal', 'mellat']);
const plans = new Set(['1_month', '3_months', '1_year']);

function paymentUrl(id: string, gateway: string, authority: string) {
  if (!config.paymentGatewayBaseUrl) return null;
  const url = new URL(config.paymentGatewayBaseUrl);
  url.searchParams.set('gateway', gateway);
  url.searchParams.set('payment_id', id);
  url.searchParams.set('authority', authority);
  if (config.paymentReturnUrl) url.searchParams.set('return_url', config.paymentReturnUrl);
  return url.toString();
}

function gatewayReady(gateway: string) {
  return gateways.has(gateway) && !!config.paymentGatewayBaseUrl;
}

async function finalizeSuccessfulPayment(client: import('pg').PoolClient, payment: any) {
  if (payment.purpose !== 'subscription') return;
  const planId = payment.metadata?.planId;
  if (!plans.has(planId)) throw Object.assign(new Error('INVALID_SUBSCRIPTION_PLAN'), { statusCode: 400 });
  const row = (await client.query<any>('SELECT duration_days FROM subscription_plans WHERE id=$1 AND is_active=TRUE', [planId])).rows[0];
  if (!row) throw Object.assign(new Error('SUBSCRIPTION_PLAN_UNAVAILABLE'), { statusCode: 409 });
  await client.query(
    `UPDATE users SET subscription_plan=$2,
      subscription_expires_at = GREATEST(COALESCE(subscription_expires_at,NOW()),NOW()) + ($3 || ' days')::interval,
      role = CASE WHEN role='user' THEN 'owner' ELSE role END,
      updated_at=NOW() WHERE id=$1`,
    [payment.user_id, planId, row.duration_days]
  );
}

router.get('/frame-prices', async (_req, res, next) => {
  try {
    const rows = (await query<any>('SELECT frame_id,title,price_toman,is_active,updated_at FROM frame_prices WHERE is_active=TRUE ORDER BY frame_id')).rows;
    res.json({ frames: rows });
  } catch (error) { next(error); }
});

router.patch('/frame-prices/:frameId', requireAuth, requirePermission('FRAME_PRICE_MANAGE'), rateLimit({ windowMs: 60 * 60 * 1000, max: 30, key: 'frame-price' }), async (req: AuthenticatedRequest, res, next) => {
  try {
    const price = Number(req.body?.priceToman);
    if (!Number.isInteger(price) || price < 0 || price > 5000000) return res.status(400).json({ error: 'INVALID_FRAME_PRICE' });
    const frameId = cleanPlainText(req.params.frameId, 128);
    const result = await query<any>(`UPDATE frame_prices SET price_toman=$2, updated_at=NOW() WHERE frame_id=$1 RETURNING frame_id,title,price_toman,is_active,updated_at`, [frameId, price]);
    if (!result.rows[0]) return res.status(404).json({ error: 'FRAME_NOT_FOUND' });
    await audit(req, 'FRAME_PRICE_UPDATED', 'frame_price', frameId, { priceToman: price });
    res.json({ frame: result.rows[0] });
  } catch (error) { next(error); }
});

router.post('/intents', requireAuth, requirePermission('PAYMENT_CREATE'), rateLimit({ windowMs: 10 * 60 * 1000, max: 10, key: 'payment-intent' }), async (req: AuthenticatedRequest, res, next) => {
  try {
    const purpose = String(req.body?.purpose || '');
    const gateway = String(req.body?.gateway || '');
    const referenceId = cleanPlainText(req.body?.referenceId, 128) || null;
    if (!['frame', 'subscription'].includes(purpose) || !gateways.has(gateway)) return res.status(400).json({ error: 'INVALID_PAYMENT_INTENT' });
    if (!gatewayReady(gateway)) return res.status(503).json({ error: 'PAYMENT_GATEWAY_NOT_CONFIGURED' });

    let amount = 0;
    let metadata: Record<string, unknown> = {};
    if (purpose === 'frame') {
      const frameId = cleanPlainText(req.body?.frameId, 128);
      const row = (await query<any>('SELECT frame_id, title, price_toman FROM frame_prices WHERE frame_id = $1 AND is_active = TRUE', [frameId])).rows[0];
      if (!row || Number(row.price_toman) <= 0) return res.status(400).json({ error: 'FRAME_NOT_PAYABLE' });
      amount = Number(row.price_toman);
      metadata = { frameId, frameTitle: row.title };
    } else {
      const planId = String(req.body?.planId || '');
      if (!plans.has(planId)) return res.status(400).json({ error: 'INVALID_SUBSCRIPTION_PLAN' });
      const row = (await query<any>('SELECT id, title, duration_days, price_toman FROM subscription_plans WHERE id = $1 AND is_active = TRUE', [planId])).rows[0];
      if (!row) return res.status(400).json({ error: 'SUBSCRIPTION_PLAN_UNAVAILABLE' });
      amount = Number(row.price_toman);
      metadata = { planId, planTitle: row.title, durationDays: row.duration_days };
    }

    const trackingCode = `AMV-${randomToken(8).toUpperCase()}`;
    const authority = randomToken(18);
    const inserted = await query<any>(
      `INSERT INTO payment_intents(user_id,purpose,reference_id,gateway,amount_toman,tracking_code,authority,metadata)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, purpose, reference_id, gateway, amount_toman, status, tracking_code, authority, expires_at, created_at`,
      [req.user!.id, purpose, referenceId, gateway, amount, trackingCode, authority, metadata]
    );
    const payment = inserted.rows[0];
    await audit(req, 'PAYMENT_INTENT_CREATED', 'payment', payment.id, { purpose, gateway, amountToman: amount });
    res.status(201).json({ payment: { ...payment, payment_url: paymentUrl(payment.id, gateway, authority) } });
  } catch (error) { next(error); }
});

router.get('/:id', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!isUuid(req.params.id)) return res.status(404).json({ error: 'PAYMENT_NOT_FOUND' });
    const row = (await query<any>(
      `UPDATE payment_intents SET status='expired' WHERE id=$1 AND user_id=$2 AND status='pending' AND expires_at < NOW()
       RETURNING id,purpose,reference_id,gateway,amount_toman,status,tracking_code,reference_number,card_mask,created_at,paid_at,expires_at,consumed_at`, [req.params.id, req.user!.id]
    )).rows[0] || (await query<any>(
      `SELECT id,purpose,reference_id,gateway,amount_toman,status,tracking_code,reference_number,card_mask,created_at,paid_at,expires_at,consumed_at
       FROM payment_intents WHERE id = $1 AND user_id = $2`, [req.params.id, req.user!.id])).rows[0];
    if (!row) return res.status(404).json({ error: 'PAYMENT_NOT_FOUND' });
    res.json({ payment: row });
  } catch (error) { next(error); }
});

router.get('/', requireAuth, requirePermission('PAYMENT_READ'), async (_req: AuthenticatedRequest, res, next) => {
  try {
    const rows = (await query<any>(
      `SELECT p.id,p.user_id,p.purpose,p.reference_id,p.gateway,p.amount_toman,p.status,p.tracking_code,p.reference_number,p.card_mask,p.metadata,p.created_at,p.paid_at,p.consumed_at,u.full_name,u.phone
       FROM payment_intents p JOIN users u ON u.id=p.user_id ORDER BY p.created_at DESC LIMIT 500`)).rows;
    res.json({ payments: rows });
  } catch (error) { next(error); }
});

router.post('/verify/:id', requireAuth, requirePermission('PAYMENT_VERIFY'), rateLimit({ windowMs: 15 * 60 * 1000, max: 30, key: 'payment-verify' }), async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!isUuid(req.params.id)) return res.status(404).json({ error: 'PAYMENT_NOT_FOUND' });
    const referenceNumber = cleanPlainText(req.body?.referenceNumber, 200);
    if (!referenceNumber) return res.status(400).json({ error: 'REFERENCE_NUMBER_REQUIRED' });
    const payment = await withTransaction(async (client) => {
      const result = await client.query<any>(
        `UPDATE payment_intents SET status='successful', reference_number=$2, paid_at=COALESCE(paid_at,NOW())
         WHERE id=$1 AND status='pending' AND expires_at > NOW() RETURNING *`, [req.params.id, referenceNumber]);
      if (!result.rows[0]) throw Object.assign(new Error('PAYMENT_NOT_PENDING'), { statusCode: 409 });
      await finalizeSuccessfulPayment(client, result.rows[0]);
      return result.rows[0];
    });
    await audit(req, 'PAYMENT_VERIFIED', 'payment', req.params.id, { referenceNumber });
    res.json({ payment });
  } catch (error) { next(error); }
});

router.post('/webhook/:gateway', rateLimit({ windowMs: 60 * 1000, max: 120, key: 'payment-webhook' }), async (req, res, next) => {
  try {
    const gateway = String(req.params.gateway || '');
    if (!gateways.has(gateway) || !config.paymentWebhookSecret) return res.status(404).json({ error: 'WEBHOOK_NOT_AVAILABLE' });
    const signature = String(req.header('x-amvatgram-signature') || '');
    const rawPayload = JSON.stringify(req.body || {});
    const expected = hmac(rawPayload, config.paymentWebhookSecret);
    if (!signature || !timingSafeEqualHex(signature, expected)) return res.status(401).json({ error: 'INVALID_WEBHOOK_SIGNATURE' });

    const eventId = cleanPlainText(req.body?.eventId, 200);
    const paymentId = cleanPlainText(req.body?.paymentId, 64);
    const status = String(req.body?.status || '').trim();
    if (!eventId || !isUuid(paymentId) || !['successful', 'failed', 'refunded'].includes(status)) return res.status(400).json({ error: 'INVALID_WEBHOOK_PAYLOAD' });

    const payloadHash = hmac(rawPayload, config.paymentWebhookSecret);
    const outcome = await withTransaction(async (client) => {
      const eventInsert = await client.query<any>(
        `INSERT INTO webhook_events(gateway,event_id,payload_hash) VALUES($1,$2,$3) ON CONFLICT(gateway,event_id) DO NOTHING RETURNING id`,
        [gateway, eventId, payloadHash]
      );
      if (!eventInsert.rows[0]) {
        const previous = (await client.query<any>('SELECT payload_hash FROM webhook_events WHERE gateway=$1 AND event_id=$2', [gateway, eventId])).rows[0];
        if (previous?.payload_hash !== payloadHash) throw Object.assign(new Error('WEBHOOK_EVENT_REUSE'), { statusCode: 409 });
        return { duplicate: true };
      }
      const result = await client.query<any>(
        `UPDATE payment_intents SET status=$2, reference_number=COALESCE($3,reference_number), card_mask=COALESCE($4,card_mask), paid_at=CASE WHEN $2='successful' THEN COALESCE(paid_at,NOW()) ELSE paid_at END
         WHERE id=$1 AND gateway=$5 AND status='pending' RETURNING *`,
        [paymentId, status, req.body?.referenceNumber ? cleanPlainText(req.body.referenceNumber, 200) : null, req.body?.cardMask ? cleanPlainText(req.body.cardMask, 32) : null, gateway]
      );
      if (!result.rows[0]) throw Object.assign(new Error('PAYMENT_ALREADY_FINALIZED_OR_NOT_FOUND'), { statusCode: 409 });
      if (status === 'successful') await finalizeSuccessfulPayment(client, result.rows[0]);
      return { duplicate: false };
    });
    res.json({ ok: true, duplicate: outcome.duplicate });
  } catch (error) { next(error); }
});

export default router;
