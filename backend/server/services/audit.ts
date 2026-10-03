import { query } from '../db';
import { AuthenticatedRequest } from '../middleware/auth';

export async function audit(req: AuthenticatedRequest, action: string, targetType?: string, targetId?: string, metadata: Record<string, unknown> = {}) {
  await query(
    `INSERT INTO audit_logs(actor_user_id, actor_role, action, target_type, target_id, ip_address, user_agent, metadata)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
    [req.user?.id || null, req.user?.role || null, action, targetType || null, targetId || null, req.ip || null, req.get('user-agent') || null, metadata]
  );
}
