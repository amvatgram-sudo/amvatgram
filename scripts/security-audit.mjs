import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const roots = ['frontend/src', 'backend/server'];
const files = [];
function walk(dir) { for (const name of readdirSync(dir)) { const full=join(dir,name); if (name==='node_modules'||name==='dist') continue; const st=statSync(full); if(st.isDirectory()) walk(full); else if(/\.(ts|tsx|js|mjs)$/.test(name)) files.push(full); } }
roots.forEach(walk);
const text=files.map(f=>[f,readFileSync(f,'utf8')]);
const checks=[
 ['hardcoded admin password',/amvatgram7788|admin123/i],
 ['fixed OTP',/b123456b/],
 ['browser payment success simulation',/setTimeout\([^\n]*(payment|paid|transaction)/i],
 ['client session token persistence',/localStorage\.(setItem|getItem)\([^\n]*(session|token|auth)/i],
 ['dangerous eval',/\beval\s*\(/],
];
let failed=false;
for(const [label,pattern] of checks){const hits=text.filter(([,body])=>pattern.test(body)).map(([file])=>file); if(hits.length){failed=true;console.error(`FAIL: ${label}: ${hits.join(', ')}`)}else console.log(`PASS: ${label}`)}
for(const file of ['backend/server/middleware/security.ts','backend/server/services/validation.ts','database/schema.sql']){if(!readFileSync(file,'utf8').trim()){failed=true;console.error(`FAIL: missing/empty ${file}`)}else console.log(`PASS: ${file}`)}
process.exitCode=failed?1:0;
