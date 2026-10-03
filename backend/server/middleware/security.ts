import { randomUUID } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';

const buckets = new Map<string, { count: number; resetAt: number }>();
const MAX_BUCKETS = 10_000;
let lastCleanup = 0;

function cleanupBuckets(now: number) {
  if (now - lastCleanup < 30_000 && buckets.size < MAX_BUCKETS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  if (buckets.size > MAX_BUCKETS) {
    const overflow = buckets.size - MAX_BUCKETS;
    let removed = 0;
    for (const key of buckets.keys()) {
      buckets.delete(key);
      if (++removed >= overflow) break;
    }
  }
}

function clientKey(req: Request) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.ip || 'unknown';
  return ip.slice(0, 100);
}

export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  const requestId = randomUUID();
  res.setHeader('X-Request-Id', requestId);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  if (req.path.startsWith('/api/')) res.setHeader('Cache-Control', 'no-store');
  next();
}

export function requireTrustedOrigin(req: Request, res: Response, next: NextFunction) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next();
  const origin = req.get('origin');
  if (!origin) return next();
  const allowed = process.env.CORS_ORIGIN || 'http://localhost:3000';
  if (origin !== allowed) return res.status(403).json({ error: 'UNTRUSTED_ORIGIN' });
  next();
}

export function rateLimit(options: { windowMs: number; max: number; key?: string }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    cleanupBuckets(now);
    const prefix = options.key || 'default';
    const key = `${prefix}:${clientKey(req)}`;
    const current = buckets.get(key);
    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + options.windowMs });
      return next();
    }
    current.count += 1;
    if (current.count > options.max) {
      res.setHeader('Retry-After', Math.max(1, Math.ceil((current.resetAt - now) / 1000)));
      return res.status(429).json({ error: 'RATE_LIMITED' });
    }
    next();
  };
}

export function validateJsonDepth(value: unknown, depth = 0): boolean {
  if (depth > 8) return false;
  if (Array.isArray(value)) return value.length <= 500 && value.every((item) => validateJsonDepth(item, depth + 1));
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    return entries.length <= 200 && entries.every(([key, item]) => key.length <= 100 && validateJsonDepth(item, depth + 1));
  }
  if (typeof value === 'string') return value.length <= 100_000;
  return value === null || ['string', 'number', 'boolean'].includes(typeof value);
}

export function cleanPlainText(value: unknown, maxLength: number): string {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/<\/?(script|iframe|object|embed|style|link|meta)[^>]*>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .trim()
    .slice(0, maxLength);
}

export function sanitizeJson(value: unknown): unknown {
  if (typeof value === 'string') return cleanPlainText(value, 100_000);
  if (Array.isArray(value)) return value.map(sanitizeJson);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [cleanPlainText(key, 100), sanitizeJson(item)]));
  }
  return value;
}
