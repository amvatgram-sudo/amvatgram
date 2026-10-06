import { Router } from 'express';
import { randomInt } from 'node:crypto';
import { query, withTransaction } from '../db';
import { AuthenticatedRequest, requireAuth, requirePermission } from '../middleware/auth';
import { audit } from '../services/audit';
import { cleanPlainText, rateLimit, sanitizeJson, validateJsonDepth } from '../middleware/security';
import { isUuid } from '../services/validation';

const router = Router();
const MOD_ROLES = new Set(['moderator', 'super_admin']);
const EDITABLE_STATUSES = new Set(['pending', 'approved', 'rejected', 'suspended', 'archived']);

function publicPayload(payload: Record<string, any>) {
  const copy = { ...payload };
  delete copy.ownerNationalCode;
  delete copy.deceasedNationalCode;
  delete copy.ownerPhone;
  delete copy.contactPhones;
  delete copy.paymentId;
  return copy;
}

function trackingCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = 'AMG-';
  for (let i = 0; i < 10; i++) out += chars[randomInt(chars.length)];
  return out;
}

function validAdId(value: string) { return isUuid(value); }
function validPayload(payload: unknown) { return !!payload && typeof payload === 'object' && !Array.isArray(payload) && validateJsonDepth(payload); }

router.get('/', async (_req, res, next) => {
  try {
    const result = await query<any>(
      `SELECT id, tracking_code, status, payload, rejection_reason, view_count, heart_count, created_at, updated_at, approved_at
       FROM ads WHERE status = 'approved' ORDER BY created_at DESC LIMIT 100`
    );
    res.json({ ads: result.rows.map((ad) => ({ ...ad, payload: publicPayload(ad.payload || {}) })) });
  } catch (error) { next(error); }
});

router.get('/moderation/pending', requireAuth, requirePermission('AD_APPROVE'), async (_req, res, next) => {
  try {
    const result = await query<any>(
      `SELECT id, tracking_code, status, payload, rejection_reason, view_count, heart_count, created_at, updated_at, approved_at
       FROM ads WHERE status = 'pending' ORDER BY created_at ASC LIMIT 100`
    );
    res.json({ ads: result.rows.map((ad) => ({ ...ad, payload: publicPayload(ad.payload || {}) })) });
  } catch (error) { next(error); }
});

router.get('/moderation/comments', requireAuth, requirePermission('COMMENT_APPROVE'), async (_req, res, next) => {
  try {
    const result = await query<any>(
      `SELECT c.id,c.ad_id,c.user_id,c.author_name,c.text,c.status,c.created_at,a.tracking_code
       FROM ad_comments c JOIN ads a ON a.id=c.ad_id
       WHERE c.status='pending' ORDER BY c.created_at ASC LIMIT 200`
    );
    res.json({ comments: result.rows });
  } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  if (!validAdId(req.params.id)) return res.status(404).json({ error: 'AD_NOT_FOUND' });
  try {
    const result = await query<any>(
      `UPDATE ads SET view_count = view_count + 1, updated_at = NOW() WHERE id = $1 AND status = 'approved'
       RETURNING id, tracking_code, status, payload, view_count, heart_count, created_at, updated_at, approved_at`, [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'AD_NOT_FOUND' });
    res.json({ ad: { ...result.rows[0], payload: publicPayload(result.rows[0].payload || {}) } });
  } catch (error) { next(error); }
});

router.post('/', requireAuth, requirePermission('AD_CREATE'), rateLimit({ windowMs: 60 * 60 * 1000, max: 20, key: 'ad-create' }), async (req: AuthenticatedRequest, res, next) => {
  try {
    if (req.user!.role !== 'super_admin') {
      const verification = await query<{ verified: boolean }>(`SELECT EXISTS (SELECT 1 FROM owner_verifications WHERE user_id = $1 AND status = 'verified') AS verified`, [req.user!.id]);
      if (!verification.rows[0]?.verified) return res.status(403).json({ error: 'OWNER_VERIFICATION_REQUIRED' });
    }

    const payload = req.body?.payload;
    if (!validPayload(payload)) return res.status(400).json({ error: 'INVALID_AD_PAYLOAD' });
    const safePayload = sanitizeJson(payload) as Record<string, any>;
    const selectedFrameId = cleanPlainText(safePayload.selectedFrameId, 128);
    const paymentId = cleanPlainText(safePayload.paymentId, 64);
    delete safePayload.paymentId;
    const frame = selectedFrameId ? (await query<any>('SELECT frame_id, price_toman FROM frame_prices WHERE frame_id=$1 AND is_active=TRUE', [selectedFrameId])).rows[0] : null;
    if (selectedFrameId && !frame) return res.status(400).json({ error: 'FRAME_NOT_FOUND' });
    const framePrice = Number(frame?.price_toman || 0);
    if (framePrice > 0) {
      if (!paymentId || !isUuid(paymentId)) return res.status(402).json({ error: 'PAYMENT_REQUIRED' });
      const payment = (await query<any>(`SELECT id,status,amount_toman,user_id,purpose,metadata FROM payment_intents WHERE id=$1 AND user_id=$2 LIMIT 1`, [paymentId, req.user!.id])).rows[0];
      if (!payment || payment.purpose !== 'frame' || payment.status !== 'successful' || Number(payment.amount_toman) !== framePrice || payment.metadata?.frameId !== selectedFrameId) {
        return res.status(402).json({ error: 'PAYMENT_NOT_VERIFIED' });
      }
    } else if (paymentId) {
      return res.status(400).json({ error: 'UNEXPECTED_PAYMENT' });
    }
    const code = trackingCode();
    const result = await withTransaction(async (client) => {
      if (framePrice > 0) {
        const paymentResult = await client.query<any>(
          `UPDATE payment_intents
           SET consumed_at=NOW()
           WHERE id=$1 AND user_id=$2 AND purpose='frame' AND status='successful'
             AND consumed_at IS NULL AND amount_toman=$3
             AND metadata->>'frameId'=$4
           RETURNING id`,
          [paymentId, req.user!.id, framePrice, selectedFrameId]
        );
        if (!paymentResult.rows[0]) throw Object.assign(new Error('PAYMENT_ALREADY_CONSUMED'), { statusCode: 409, publicCode: 'PAYMENT_ALREADY_CONSUMED' });
      }
      return client.query<any>(
        `INSERT INTO ads(tracking_code, owner_id, status, payload) VALUES($1,$2,'pending',$3)
         RETURNING id, tracking_code, status, payload, view_count, heart_count, created_at, updated_at`,
        [code, req.user!.id, safePayload]
      );
    });
    await audit(req, 'AD_CREATED', 'ad', result.rows[0].id, { trackingCode: code, paymentId: paymentId || null });
    res.status(201).json({ ad: result.rows[0] });
  } catch (error) { next(error); }
});

router.patch('/:id', requireAuth, requirePermission('AD_EDIT_OWN'), async (req: AuthenticatedRequest, res, next) => {
  if (!validAdId(req.params.id)) return res.status(404).json({ error: 'AD_NOT_FOUND' });
  try {
    const existing = await query<any>(`SELECT id, owner_id, status FROM ads WHERE id = $1`, [req.params.id]);
    const ad = existing.rows[0];
    if (!ad) return res.status(404).json({ error: 'AD_NOT_FOUND' });
    const isModerator = MOD_ROLES.has(req.user!.role);
    if (ad.owner_id !== req.user!.id && !isModerator) return res.status(403).json({ error: 'FORBIDDEN' });
    const payload = req.body?.payload;
    if (!validPayload(payload)) return res.status(400).json({ error: 'INVALID_AD_PAYLOAD' });
    const safePayload = sanitizeJson(payload) as Record<string, any>;
    delete safePayload.paymentId;
    const requestedStatus = cleanPlainText(req.body?.status, 32);
    const nextStatus = isModerator && requestedStatus ? requestedStatus : 'pending';
    if (!EDITABLE_STATUSES.has(nextStatus)) return res.status(400).json({ error: 'INVALID_AD_STATUS' });
    if (!isModerator && ['approved', 'suspended', 'archived'].includes(ad.status)) return res.status(409).json({ error: 'AD_NOT_EDITABLE' });
    const result = await query<any>(
      `UPDATE ads SET payload=$1, status=$2::text, rejection_reason=NULL,
       approved_at=CASE WHEN $2::text='approved' THEN COALESCE(approved_at,NOW()) ELSE approved_at END,
       updated_at=NOW() WHERE id=$3
       RETURNING id, tracking_code, status, payload, view_count, heart_count, created_at, updated_at, approved_at`,
      [safePayload, nextStatus, req.params.id]
    );
    await audit(req, isModerator ? 'AD_MODERATED_EDIT' : 'AD_EDITED', 'ad', req.params.id, { status: nextStatus });
    res.json({ ad: result.rows[0] });
  } catch (error) { next(error); }
});

router.delete('/:id', requireAuth, requirePermission('AD_DELETE'), async (req: AuthenticatedRequest, res, next) => {
  if (!validAdId(req.params.id)) return res.status(404).json({ error: 'AD_NOT_FOUND' });
  try {
    const result = await query<any>(`UPDATE ads SET status='archived', updated_at=NOW() WHERE id=$1 RETURNING id, status`, [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'AD_NOT_FOUND' });
    await audit(req, 'AD_DELETED', 'ad', req.params.id);
    res.json({ ok: true, ad: result.rows[0] });
  } catch (error) { next(error); }
});

router.get('/:id/comments', async (req, res, next) => {
  if (!validAdId(req.params.id)) return res.status(404).json({ error: 'AD_NOT_FOUND' });
  try {
    const result = await query<any>(`SELECT id, author_name, text, created_at FROM ad_comments WHERE ad_id=$1 AND status='approved' ORDER BY created_at DESC LIMIT 100`, [req.params.id]);
    res.json({ comments: result.rows });
  } catch (error) { next(error); }
});

router.post('/:id/comments', requireAuth, rateLimit({ windowMs: 10 * 60 * 1000, max: 15, key: 'comments' }), async (req: AuthenticatedRequest, res, next) => {
  if (!validAdId(req.params.id)) return res.status(404).json({ error: 'AD_NOT_FOUND' });
  try {
    const text = cleanPlainText(req.body?.comment?.text, 2000);
    if (!text) return res.status(400).json({ error: 'COMMENT_REQUIRED' });
    const ad = await query(`SELECT id FROM ads WHERE id=$1 AND status='approved'`, [req.params.id]);
    if (!ad.rows[0]) return res.status(404).json({ error: 'AD_NOT_FOUND' });
    const result = await query<any>(`INSERT INTO ad_comments(ad_id,user_id,author_name,text,status) VALUES($1,$2,$3,$4,'pending') RETURNING id, author_name, text, status, created_at`, [req.params.id, req.user!.id, cleanPlainText(req.user!.fullName, 200), text]);
    await audit(req, 'CONDOLENCE_SUBMITTED', 'ad_comment', result.rows[0].id);
    res.status(201).json({ comment: result.rows[0] });
  } catch (error) { next(error); }
});

async function moderateComment(req: AuthenticatedRequest, res: any, id: string, status: 'approved' | 'rejected' | 'hidden') {
  if (!isUuid(id)) return res.status(404).json({ error: 'COMMENT_NOT_FOUND' });
  const result = await query<any>(`UPDATE ad_comments SET status=$1 WHERE id=$2 RETURNING id,ad_id,status`, [status, id]);
  if (!result.rows[0]) return res.status(404).json({ error: 'COMMENT_NOT_FOUND' });
  await audit(req, `COMMENT_${status.toUpperCase()}`, 'ad_comment', id);
  return res.json({ comment: result.rows[0] });
}

router.post('/comments/:id/approve', requireAuth, requirePermission('COMMENT_APPROVE'), async (req: AuthenticatedRequest, res, next) => { try { await moderateComment(req, res, req.params.id, 'approved'); } catch (error) { next(error); } });
router.post('/comments/:id/reject', requireAuth, requirePermission('COMMENT_REJECT'), async (req: AuthenticatedRequest, res, next) => { try { await moderateComment(req, res, req.params.id, 'rejected'); } catch (error) { next(error); } });
router.post('/comments/:id/hide', requireAuth, requirePermission('COMMENT_HIDE'), async (req: AuthenticatedRequest, res, next) => { try { await moderateComment(req, res, req.params.id, 'hidden'); } catch (error) { next(error); } });

router.post('/:id/approve', requireAuth, requirePermission('AD_APPROVE'), async (req: AuthenticatedRequest, res, next) => {
  if (!validAdId(req.params.id)) return res.status(404).json({ error: 'AD_NOT_FOUND' });
  try {
    const result = await query<any>(`UPDATE ads SET status='approved', rejection_reason=NULL, approved_at=NOW(), updated_at=NOW() WHERE id=$1 AND status='pending' RETURNING id, status, approved_at`, [req.params.id]);
    if (!result.rows[0]) return res.status(409).json({ error: 'AD_NOT_PENDING' });
    await audit(req, 'AD_APPROVED', 'ad', req.params.id);
    res.json({ ad: result.rows[0] });
  } catch (error) { next(error); }
});

router.post('/:id/reject', requireAuth, requirePermission('AD_REJECT'), async (req: AuthenticatedRequest, res, next) => {
  if (!validAdId(req.params.id)) return res.status(404).json({ error: 'AD_NOT_FOUND' });
  try {
    const reason = cleanPlainText(req.body?.reason, 1000);
    if (!reason) return res.status(400).json({ error: 'REJECTION_REASON_REQUIRED' });
    const result = await query<any>(`UPDATE ads SET status='rejected', rejection_reason=$1, updated_at=NOW() WHERE id=$2 AND status='pending' RETURNING id, status, rejection_reason`, [reason, req.params.id]);
    if (!result.rows[0]) return res.status(409).json({ error: 'AD_NOT_PENDING' });
    await audit(req, 'AD_REJECTED', 'ad', req.params.id, { reason });
    res.json({ ad: result.rows[0] });
  } catch (error) { next(error); }
});

router.post('/:id/heart', requireAuth, rateLimit({ windowMs: 60 * 60 * 1000, max: 60, key: 'heart' }), async (req: AuthenticatedRequest, res, next) => {
  if (!validAdId(req.params.id)) return res.status(404).json({ error: 'AD_NOT_FOUND' });
  try {
    const result = await query<any>(`INSERT INTO ad_reactions(ad_id, user_id) SELECT $1,$2 WHERE EXISTS(SELECT 1 FROM ads WHERE id=$1 AND status='approved') ON CONFLICT DO NOTHING RETURNING ad_id`, [req.params.id, req.user!.id]);
    if (!result.rows[0]) return res.status(409).json({ error: 'ALREADY_REACTED_OR_NOT_AVAILABLE' });
    const count = await query<{ heart_count: number }>(`UPDATE ads SET heart_count = heart_count + 1 WHERE id=$1 AND status='approved' RETURNING heart_count`, [req.params.id]);
    await audit(req, 'AD_REACTED', 'ad', req.params.id, { type: 'heart' });
    res.json({ heartCount: count.rows[0]?.heart_count || 0 });
  } catch (error) { next(error); }
});

export default router;
