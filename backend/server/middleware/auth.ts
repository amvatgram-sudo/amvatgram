import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { query } from '../db';
import { sha256 } from '../services/crypto';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; fullName: string; role: string; madhhab: 'sunni' | 'shia'; isVerified: boolean };
}

function readCookie(req: Request, name: string) {
  const raw = req.headers.cookie || '';
  const item = raw.split(';').map((x) => x.trim()).find((x) => x.startsWith(`${name}=`));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : null;
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const token = readCookie(req, config.cookieName);
    if (!token) return res.status(401).json({ error: 'UNAUTHENTICATED' });
    const result = await query<{ id: string; full_name: string; role: string; madhhab: 'sunni' | 'shia'; is_verified: boolean; subscription_expires_at: string | null }>(
      `SELECT u.id, u.full_name, u.role, u.madhhab, u.is_verified, u.subscription_expires_at
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = $1 AND s.revoked_at IS NULL AND s.expires_at > NOW()`,
      [sha256(token)]
    );
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'SESSION_EXPIRED' });
    const effectiveRole = user.role === 'owner' && (!user.subscription_expires_at || new Date(user.subscription_expires_at).getTime() <= Date.now()) ? 'user' : user.role;
    req.user = { id: user.id, fullName: user.full_name, role: effectiveRole, madhhab: user.madhhab, isVerified: user.is_verified };
    next();
  } catch (error) { next(error); }
}

export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'UNAUTHENTICATED' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'FORBIDDEN' });
    next();
  };
}

export function requirePermission(permission: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'UNAUTHENTICATED' });
    if (req.user.role === 'super_admin') return next();
    try {
      const result = await query<{ allowed: boolean }>(
        `SELECT EXISTS (
          SELECT 1 FROM role_permissions rp
          JOIN roles r ON r.id = rp.role_id
          JOIN permissions p ON p.id = rp.permission_id
          JOIN users u ON u.id = $3
          WHERE r.name = $1 AND p.name = $2
            AND NOT ($1 = 'owner' AND $2 IN ('AD_CREATE','AD_EDIT_OWN','PAYMENT_CREATE')
                     AND (u.subscription_expires_at IS NULL OR u.subscription_expires_at <= NOW()))
        ) AS allowed`,
        [req.user.role, permission, req.user.id]
      );
      if (!result.rows[0]?.allowed) return res.status(403).json({ error: 'FORBIDDEN' });
      next();
    } catch (error) { next(error); }
  };
}

export function setSessionCookie(res: Response, token: string, maxAgeMs: number) {
  const parts = [
    `${config.cookieName}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'Path=/',
    `Max-Age=${Math.floor(maxAgeMs / 1000)}`,
    'SameSite=Lax',
  ];
  if (config.cookieSecure) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

export function clearSessionCookie(res: Response) {
  const parts = [`${config.cookieName}=`, 'HttpOnly', 'Path=/', 'Max-Age=0', 'SameSite=Lax'];
  if (config.cookieSecure) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}
