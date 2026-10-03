import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { pool } from '../db';

const schemaPath = new URL('../../../database/schema.sql', import.meta.url);
try {
  const sql = await readFile(schemaPath, 'utf8');
  await pool.query(sql);
  console.info('Database schema applied successfully.');
} catch (error) {
  console.error('Database migration failed:', error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
