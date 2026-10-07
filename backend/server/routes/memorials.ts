import { Router } from 'express';
import { query } from '../db';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { audit } from '../services/audit';

const router = Router();

router.get('/public/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query<any>('SELECT id, deceased_full_name, father_name, avatar_url, birth_date, death_date, description, biography, city, published_at, view_count FROM memorials WHERE id=$1 AND status=$2 LIMIT 1', [id, 'published']);
    if (!result.rows.length) return res.status(404).json({ error: 'MEMORIAL_NOT_FOUND' });
    await query('UPDATE memorials SET view_count=view_count+1 WHERE id=$1', [id]);
    const memorial = result.rows[0];
    memorial.view_count = Number(memorial.view_count) + 1;
    res.json({ memorial });
  } catch (error) {
    next(error);
  }
});

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
  } catch (error) {
    next(error);
  }
});

router.post('/:id/consent', requireAuth, requireRole('moderator', 'super_admin'), async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    const familyContactName = String(req.body?.familyContactName || '').trim();
    const familyContactPhone = String(req.body?.familyContactPhone || '').trim();
    const familyRelationship = String(req.body?.familyRelationship || '').trim();
    const familyConsentNote = String(req.body?.familyConsentNote || '').trim();
    const result = await query<any>('UPDATE memorials SET family_consent=TRUE, family_consent_at=NOW(), family_consent_note=$1, family_contact_name=COALESCE($2, family_contact_name), family_contact_phone=COALESCE($3, family_contact_phone), family_relationship=COALESCE($4, family_relationship), status=CASE WHEN status=$6 OR status=$7 THEN $8 ELSE status END, updated_at=NOW() WHERE id=$5 RETURNING *', [familyConsentNote || null, familyContactName || null, familyContactPhone || null, familyRelationship || null, id, 'draft', 'awaiting_family_consent', 'approved']);
    if (!result.rows.length) return res.status(404).json({ error: 'MEMORIAL_NOT_FOUND' });
    const memorial = result.rows[0];
    await audit(req, 'MEMORIAL_FAMILY_CONSENT_RECORDED', 'memorial', memorial.id, { familyContactName, familyRelationship });
    res.json({ memorial });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/publish', requireAuth, requireRole('moderator', 'super_admin'), async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    const result = await query<any>('UPDATE memorials SET status=$1, approved_by=$2, approved_at=NOW(), published_at=NOW(), updated_at=NOW() WHERE id=$3 AND family_consent=TRUE AND status=$4 RETURNING *', ['published', req.user!.id, id, 'approved']);
    if (!result.rows.length) return res.status(400).json({ error: 'MEMORIAL_NOT_READY_FOR_PUBLICATION' });
    const memorial = result.rows[0];
    await audit(req, 'MEMORIAL_PUBLISHED', 'memorial', memorial.id, { deceasedFullName: memorial.deceased_full_name, status: memorial.status });
    res.json({ memorial });
  } catch (error) {
    next(error);
  }
});

export default router;
