import 'dotenv/config';

const requiredInProduction = ['DATABASE_URL', 'SESSION_SECRET', 'OTP_HMAC_KEY', 'NATIONAL_CODE_HMAC_KEY', 'PAYMENT_WEBHOOK_SECRET', 'ADMIN_USERNAME', 'ADMIN_PASSWORD_HASH'];
if (process.env.NODE_ENV === 'production') {
  if ((process.env.OTP_DELIVERY || 'console') === 'console') throw new Error('OTP_DELIVERY=console is not allowed in production');
  if (!process.env.CORS_ORIGIN || !/^https:\/\//.test(process.env.CORS_ORIGIN)) throw new Error('CORS_ORIGIN must be an explicit HTTPS origin in production');
  if (!process.env.PAYMENT_GATEWAY_BASE_URL || !/^https:\/\//.test(process.env.PAYMENT_GATEWAY_BASE_URL)) throw new Error('PAYMENT_GATEWAY_BASE_URL must be HTTPS in production');
  const missing = requiredInProduction.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

export const config = {
  port: Number(process.env.API_PORT || 4000),
  databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/amvatgram',
  sessionSecret: process.env.SESSION_SECRET || 'development-only-session-secret-change-me',
  otpHmacKey: process.env.OTP_HMAC_KEY || 'development-only-otp-key-change-me',
  nationalCodeHmacKey: process.env.NATIONAL_CODE_HMAC_KEY || 'development-only-national-key-change-me',
  sessionDays: Number(process.env.SESSION_DAYS || 30),
  otpMinutes: Number(process.env.OTP_MINUTES || 5),
  otpMaxAttempts: Number(process.env.OTP_MAX_ATTEMPTS || 5),
  otpDelivery: process.env.OTP_DELIVERY || 'console',
  cookieName: process.env.SESSION_COOKIE_NAME || 'amvatgram_session',
  cookieSecure: process.env.NODE_ENV === 'production',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  adminUsername: process.env.ADMIN_USERNAME || '',
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || '',
  paymentWebhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || '',
  paymentGatewayBaseUrl: process.env.PAYMENT_GATEWAY_BASE_URL || '',
  paymentReturnUrl: process.env.PAYMENT_RETURN_URL || '',
};
