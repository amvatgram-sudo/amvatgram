import express from 'express';
import cors from 'cors';
import { config } from './config';
import { pool } from './db';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import adRoutes from './routes/ads';
import paymentRoutes from './routes/payments';
import locationRoutes from './routes/locations';
import { requireTrustedOrigin, securityHeaders } from './middleware/security';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: '768kb', strict: true }));
app.use(securityHeaders);
app.use(requireTrustedOrigin);

app.get('/health', async (_req, res) => {
  try { await pool.query('SELECT 1'); res.json({ ok: true, service: 'amvatgram-api' }); }
  catch { res.status(503).json({ ok: false, service: 'amvatgram-api' }); }
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/locations', locationRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'NOT_FOUND', requestId: res.getHeader('X-Request-Id') });
});

app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[API]', { requestId: res.getHeader('X-Request-Id'), method: req.method, path: req.path, error: err?.message || err });
  if (res.headersSent) return;
  const status = Number(err?.statusCode);
  if (Number.isInteger(status) && status >= 400 && status < 500) return res.status(status).json({ error: err?.publicCode || err?.message || 'REQUEST_FAILED', requestId: res.getHeader('X-Request-Id') });
  res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', requestId: res.getHeader('X-Request-Id') });
});

const server = app.listen(config.port, () => console.info(`Amvatgram API listening on http://localhost:${config.port}`));

async function shutdown(signal: string) {
  console.info(`Received ${signal}; shutting down.`);
  server.close(async () => { await pool.end(); process.exit(0); });
}
process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
