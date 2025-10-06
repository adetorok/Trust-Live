import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { listUsers } from '../controllers/admin.controller.js';

const r = Router();
r.get('/users', requireAuth, requireRole('org_admin'), listUsers);

export default r;


