import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import * as proposalController from '../controllers/proposals.controller.js';

const r = Router();

// Public route for proposal submission (no auth required)
r.post('/', proposalController.createProposal);

// Admin routes for proposal management
r.use(requireAuth);
r.use(requireRole(['admin']));

r.get('/', proposalController.listProposals);
r.get('/:id', proposalController.getProposal);
r.put('/:id', proposalController.updateProposal);
r.delete('/:id', proposalController.deleteProposal);

export default r;
