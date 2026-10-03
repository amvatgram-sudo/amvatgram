import { hashPassword } from '../services/crypto';
const password = process.argv[2];
if (!password || password.length < 12) {
  console.error('Usage: npm run hash:password -- "a-strong-password-of-12-chars-min"');
  process.exit(1);
}
console.log(await hashPassword(password));
