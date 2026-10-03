import { createHash, createHmac, randomBytes, randomInt, scrypt as nodeScrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { config } from '../config';

const scrypt = promisify(nodeScrypt);

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString('hex');
}

export function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export function timingSafeEqualHex(a: string, b: string) {
  const left = Buffer.from(a, 'hex');
  const right = Buffer.from(b, 'hex');
  return left.length === right.length && timingSafeEqual(left, right);
}

export function hmac(value: string, key = config.otpHmacKey) {
  return createHmac('sha256', key).update(value).digest('hex');
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString('hex')}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, salt, expectedHex] = stored.split(':');
  if (scheme !== 'scrypt' || !salt || !expectedHex) return false;
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(expectedHex, 'hex');
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}

export function normalizeDestination(value: string) {
  return value.trim().toLowerCase();
}

export function normalizeNationalCode(value: string) {
  return value.replace(/\D/g, '');
}
