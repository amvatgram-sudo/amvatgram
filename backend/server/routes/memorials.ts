import { Router } from 'express';
import { query } from '../db';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { audit } from '../services/audit';

const router = Router();

router.get('/', requireAuth, requireRole('moderator', 'super_admin'), async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await query<any>('SELECT * FROM memorials ORDER BY created_at DESC LIMIT 500');
    res.json({ memorials: result.rows });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, requireRole('moderator', 'super_admin'), async (req: AuthenticatedRequest, res, next) => {
  try {
    const body = req.body || {};
    const deceasedFullName = String(body.deceasedFullName || '').trim();
    const deathDate = String(body.deathDate || '').trim();
    if (!deceasedFullName) return res.status(400).json({ error: 'DECEASED_FULL_NAME_REQUIRED' });
    if (!deathDate) return res.status(400).json({ error: 'DEATH_DATE_REQUIRED' });
    const result = await query<any>('INSERT INTO memorials (created_by, deceased_full_name, father_name, avatar_url, birth_date, death_date, description, biography, city, family_contact_name, family_contact_phone, family_relationship, family_consent, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,FALSE,$13) RETURNING *', [req.user!.id, deceasedFullName, body.fatherName || null, body.avatarUrl || null, body.birthDate || null, deathDate, body.description || null, body.biography || null, body.city || null, body.familyContactName || null, body.familyContactPhone || null, body.familyRelationship || null, 'draft']);
    const memorial = result.rows[0];
    await audit(req, 'MEMORIAL_CREATED', 'memorial', memorial.id, { deceasedFullName, status: memorial.status });
    res.status(201).json({ memorial });
  } catch (error) { next(error); }
});
export default router;


