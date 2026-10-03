import { Router } from 'express';
import { randomInt } from 'node:crypto';
import { config } from '../config';
import { query } from '../db';
import { clearSessionCookie, requireAuth, AuthenticatedRequest, setSessionCookie } from '../middleware/auth';
import { hmac, normalizeDestination, normalizeNationalCode, randomToken, sha256 } from '../services/crypto';
import { audit } from '../services/audit';
import { rateLimit } from '../middleware/security';

const router = Router();
const SUPPORTED_PROVIDERS = new Set(['sms', 'email', 'telegram', 'whatsapp']);

function generateOtp() {
  return String(randomInt(100000, 1000000));
}

function validDestination(provider: string, destination: string) {
  if (!destination || destination.length < 5 || destination.length > 320) return false;
  if (provider === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destination);
  return /^[+\d@._\-\s]{5,128}$/.test(destination);
}

router.post('/request-otp', rateLimit({ windowMs: 10 * 60 * 1000, max: 12, key: 'otp-request' }), async (req, res, next) => {
  try {
    const provider = String(req.body?.provider || 'sms');
    const destination = normalizeDestination(String(req.body?.destination || ''));
    const fullName = String(req.body?.fullName || '').trim().slice(0, 200);
    const madhhab = req.body?.madhhab === 'shia' ? 'shia' : 'sunni';
    if (!SUPPORTED_PROVIDERS.has(provider) || !validDestination(provider, destination)) {
      return res.status(400).json({ error: 'INVALID_OTP_DESTINATION' });
    }
    const recent = await query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM otp_challenges WHERE destination = $1 AND created_at > NOW() - INTERVAL '10 minutes'`,
      [destination]
    );
    if (Number(recent.rows[0]?.count || 0) >= 3) return res.status(429).json({ error: 'OTP_RATE_LIMITED' });

    const otp = generateOtp();
    await query(
      `INSERT INTO otp_challenges(destination, provider, code_hash, metadata, expires_at)
       VALUES($1,$2,$3,$4,NOW() + ($5 || ' minutes')::interval)`,
      [destination, provider, hmac(otp), { fullName, madhhab }, config.otpMinutes]
    );

    // Development delivery only. The OTP never goes to the browser response.
    if (config.otpDelivery === 'console') console.info(`[Amvatgram OTP][DEV ONLY] ${destination}: ${otp}`);
    if (config.otpDelivery !== 'console') {
      // Provider integrations are intentionally not faked. Configure a real provider in production.
      return res.status(503).json({ error: 'OTP_PROVIDER_NOT_CONFIGURED' });
    }

    res.json({ ok: true, expiresInSeconds: config.otpMinutes * 60 });
  } catch (error) { next(error); }
});

router.post('/verify-otp', rateLimit({ windowMs: 10 * 60 * 1000, max: 20, key: 'otp-verify' }), async (req, res, next) => {
  try {
    const provider = String(req.body?.provider || 'sms');
    const destination = normalizeDestination(String(req.body?.destination || ''));
    const code = String(req.body?.code || '').trim();
    const fullName = String(req.body?.fullName || '').trim().slice(0, 200) || 'کاربر امواتگرام';
    const madhhab = req.body?.madhhab === 'shia' ? 'shia' : 'sunni';
    if (!/^\d{6}$/.test(code)) return res.status(400).json({ error: 'INVALID_OTP' });

    const result = await query<any>(
      `SELECT * FROM otp_challenges
       WHERE destination = $1 AND provider = $2 AND consumed_at IS NULL AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [destination, provider]
    );
    const challenge = result.rows[0];
    if (!challenge) return res.status(400).json({ error: 'OTP_EXPIRED_OR_NOT_FOUND' });
    if (challenge.attempts >= config.otpMaxAttempts) return res.status(429).json({ error: 'OTP_ATTEMPTS_EXCEEDED' });
    await query(`UPDATE otp_challenges SET attempts = attempts + 1 WHERE id = $1`, [challenge.id]);
    if (hmac(code) !== challenge.code_hash) return res.status(400).json({ error: 'INVALID_OTP' });
    await query(`UPDATE otp_challenges SET consumed_at = NOW() WHERE id = $1`, [challenge.id]);

    const metadata = challenge.metadata || {};
    const existing = await query<any>(
      `SELECT id, phone, email, telegram_id, full_name, role, madhhab, is_verified, subscription_plan, subscription_expires_at FROM users
       WHERE phone = $1 OR email = $1 OR telegram_id = $1 LIMIT 1`, [destination]
    );
    let user = existing.rows[0];
    if (!user) {
      const fields = provider === 'email' ? ['email'] : provider === 'telegram' ? ['telegram_id'] : ['phone'];
      const column = fields[0];
      const created = await query<any>(
        `INSERT INTO users(${column}, full_name, madhhab, is_verified) VALUES($1,$2,$3,TRUE)
         RETURNING id, phone, email, telegram_id, full_name, role, madhhab, is_verified, subscription_plan, subscription_expires_at`,
        [destination, fullName || metadata.fullName || 'کاربر امواتگرام', madhhab]
      );
      user = created.rows[0];
    } else {
      await query(`UPDATE users SET full_name = COALESCE(NULLIF($2,''), full_name), madhhab = $3, is_verified = TRUE, updated_at = NOW() WHERE id = $1`, [user.id, fullName, madhhab]);
      user = { ...user, full_name: fullName || user.full_name, madhhab, is_verified: true };
    }

    const token = randomToken(32);
    const expiresMs = config.sessionDays * 24 * 60 * 60 * 1000;
    await query(`INSERT INTO sessions(user_id, token_hash, expires_at) VALUES($1,$2,NOW() + ($3 || ' days')::interval)`, [user.id, sha256(token), config.sessionDays]);
    setSessionCookie(res, token, expiresMs);
    await audit(req as AuthenticatedRequest, 'AUTH_LOGIN', 'user', user.id, { provider });

    res.json({
      user: { id: user.id, phone: user.phone, email: user.email, fullName: user.full_name, role: user.role, madhhab: user.madhhab, isVerified: user.is_verified, subscriptionPlan: user.subscription_plan || 'none', subscriptionExpiresAt: user.subscription_expires_at || undefined, createdAt: new Date().toISOString() }
    });
  } catch (error) { next(error); }
});

router.post('/owner-verification', requireAuth, rateLimit({ windowMs: 10 * 60 * 1000, max: 5, key: 'owner-verification' }), async (req: AuthenticatedRequest, res, next) => {
  try {
    const ownerCode = normalizeNationalCode(String(req.body?.ownerNationalCode || ''));
    const deceasedCode = normalizeNationalCode(String(req.body?.deceasedNationalCode || ''));
    const relation = String(req.body?.ownerRelation || '').trim().slice(0, 80);
    if (!/^\d{10,12}$/.test(ownerCode) || !/^\d{10,12}$/.test(deceasedCode) || !relation) {
      return res.status(400).json({ error: 'INVALID_OWNER_VERIFICATION_DATA' });
    }
    const result = await query<any>(
      `INSERT INTO owner_verifications(user_id, owner_national_code_hash, deceased_national_code_hash, relation, status)
       VALUES($1,$2,$3,$4,'pending') RETURNING id, status, created_at`,
      [req.user!.id, hmac(ownerCode, config.nationalCodeHmacKey), hmac(deceasedCode, config.nationalCodeHmacKey), relation]
    );
    await audit(req, 'OWNER_VERIFICATION_REQUESTED', 'owner_verification', result.rows[0].id);
    res.status(202).json({ verification: result.rows[0] });
  } catch (error) { next(error); }
});

router.get('/me', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const row = (await query<any>(`SELECT id,full_name,phone,email,role,madhhab,is_verified,subscription_plan,subscription_expires_at,
      CASE WHEN role='owner' AND (subscription_expires_at IS NULL OR subscription_expires_at <= NOW()) THEN 'user' ELSE role END AS effective_role
      FROM users WHERE id=$1`, [req.user!.id])).rows[0];
    res.json({ user: { id: row.id, fullName: row.full_name, phone: row.phone, email: row.email, role: row.effective_role || row.role, madhhab: row.madhhab, isVerified: row.is_verified, subscriptionPlan: row.subscription_plan || 'none', subscriptionExpiresAt: row.subscription_expires_at || undefined } });
  } catch (error) { next(error); }
});

router.post('/logout', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const raw = (req.headers.cookie || '').split(';').map((x) => x.trim()).find((x) => x.startsWith(`${config.cookieName}=`));
    if (raw) {
      const token = decodeURIComponent(raw.slice(config.cookieName.length + 1));
      await query(`UPDATE sessions SET revoked_at = NOW() WHERE token_hash = $1`, [sha256(token)]);
    }
    await audit(req, 'AUTH_LOGOUT', 'user', req.user!.id);
    clearSessionCookie(res);
    res.json({ ok: true });
  } catch (error) { next(error); }
});

export default router;
