export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function positiveMoney(value: unknown, max = 10_000_000_000): number | null {
  const amount = Number(value);
  if (!Number.isSafeInteger(amount) || amount <= 0 || amount > max) return null;
  return amount;
}
