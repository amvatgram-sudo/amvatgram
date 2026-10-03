const base = process.env.SMOKE_BASE_URL || 'http://localhost:4000';
const checks = ['/health', '/api/ads'];
let failed = false;
for (const path of checks) {
  try {
    const res = await fetch(`${base}${path}`);
    const body = await res.text();
    if (path === '/health' && !res.ok) throw new Error(`health returned ${res.status}`);
    if (path === '/api/ads' && !res.ok) throw new Error(`ads returned ${res.status}: ${body.slice(0,200)}`);
    console.log(`PASS ${path} ${res.status}`);
  } catch (error) {
    failed = true;
    console.error(`FAIL ${path}: ${error.message}`);
  }
}
process.exitCode = failed ? 1 : 0;
