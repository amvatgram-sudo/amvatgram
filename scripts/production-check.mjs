import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'backend/Dockerfile.api', 'frontend/Dockerfile.web', 'docker-compose.yml', 'frontend/deploy/nginx.conf',
  'backend/server/scripts/migrate.ts', 'database/schema.sql', 'backend/server/middleware/security.ts'
];
let failed = false;
for (const file of requiredFiles) {
  if (!existsSync(file) || !readFileSync(file, 'utf8').trim()) {
    failed = true;
    console.error(`FAIL: ${file}`);
  } else console.log(`PASS: ${file}`);
}
const env = readFileSync('.env.example', 'utf8');
for (const key of ['DATABASE_URL','SESSION_SECRET','OTP_HMAC_KEY','NATIONAL_CODE_HMAC_KEY','PAYMENT_WEBHOOK_SECRET','PAYMENT_GATEWAY_BASE_URL','ADMIN_PASSWORD_HASH']) {
  if (!env.includes(`${key}=`)) { failed = true; console.error(`FAIL: env ${key}`); }
  else console.log(`PASS: env ${key}`);
}
const compose = readFileSync('docker-compose.yml','utf8');
for (const token of ['postgres:17-alpine','condition: service_healthy','PAYMENT_WEBHOOK_SECRET','ADMIN_PASSWORD_HASH']) {
  if (!compose.includes(token)) { failed = true; console.error(`FAIL: compose ${token}`); }
}
if (!readFileSync('backend/server/routes/ads.ts','utf8').includes('consumed_at')) { failed = true; console.error('FAIL: frame payment consumption'); }
if (!readFileSync('backend/server/routes/payments.ts','utf8').includes('withTransaction')) { failed = true; console.error('FAIL: transactional payments'); }
if (!readFileSync('backend/server/middleware/security.ts','utf8').includes('MAX_BUCKETS')) { failed = true; console.error('FAIL: bounded rate limiter'); }
console.log(failed ? 'Production readiness check: FAIL' : 'Production readiness check: PASS');
process.exitCode = failed ? 1 : 0;
