import { Router } from 'express';
import { query } from '../db';
import { AuthenticatedRequest, requireAuth, requirePermission } from '../middleware/auth';
import { audit } from '../services/audit';
import { cleanPlainText, rateLimit } from '../middleware/security';
import { isUuid } from '../services/validation';

const router = Router();
const types = new Set(['mosque', 'cemetery', 'hall', 'hussainiya']);

function normalize(body: any) {
  const lat = Number(body?.lat), lng = Number(body?.lng);
  return {
    id: body?.id && isUuid(String(body.id)) ? String(body.id) : undefined,
    name: cleanPlainText(body?.name, 300),
    city: cleanPlainText(body?.city, 120),
    neighborhood: cleanPlainText(body?.neighborhood, 160),
    address: cleanPlainText(body?.address, 500),
    lat, lng,
    khademPhone: cleanPlainText(body?.khademPhone, 32) || null,
    type: cleanPlainText(body?.type, 32),
  };
}

router.get('/', async (_req, res, next) => {
  try {
    const rows = (await query<any>(`SELECT id,name,city,neighborhood,address,lat,lng,khadem_phone,type FROM locations ORDER BY city,name LIMIT 5000`)).rows;
    res.json({ locations: rows.map((r) => ({ id: r.id, name: r.name, city: r.city, neighborhood: r.neighborhood, address: r.address, lat: Number(r.lat), lng: Number(r.lng), khademPhone: r.khadem_phone || undefined, type: r.type })) });
  } catch (error) { next(error); }
});

router.post('/', requireAuth, requirePermission('LOCATION_MANAGE'), rateLimit({ windowMs: 60 * 60 * 1000, max: 100, key: 'location-create' }), async (req: AuthenticatedRequest, res, next) => {
  try {
    const value = normalize(req.body?.location);
    if (!value.name || !value.city || !value.address || !Number.isFinite(value.lat) || !Number.isFinite(value.lng) || Math.abs(value.lat) > 90 || Math.abs(value.lng) > 180 || !types.has(value.type)) return res.status(400).json({ error: 'INVALID_LOCATION' });
    const row = (await query<any>(`INSERT INTO locations(name,city,neighborhood,address,lat,lng,khadem_phone,type) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id,name,city,neighborhood,address,lat,lng,khadem_phone,type`, [value.name,value.city,value.neighborhood,value.address,value.lat,value.lng,value.khademPhone,value.type])).rows[0];
    await audit(req, 'LOCATION_CREATED', 'location', row.id, { city: row.city, type: row.type });
    res.status(201).json({ location: { id: row.id, name: row.name, city: row.city, neighborhood: row.neighborhood, address: row.address, lat: Number(row.lat), lng: Number(row.lng), khademPhone: row.khadem_phone || undefined, type: row.type } });
  } catch (error) { next(error); }
});

export default router;
