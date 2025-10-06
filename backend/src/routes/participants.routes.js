import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { scopeGuard } from '../middleware/scope.js';
import * as participantsController from '../controllers/participants.controller.js';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// List participants (admin, sponsor, site with scope)
router.get('/', requireRole('admin', 'sponsor', 'site'), participantsController.listParticipants);

// Get specific participant (admin, sponsor, site with scope)
router.get('/:id', requireRole('admin', 'sponsor', 'site'), scopeGuard('Participant'), participantsController.getParticipant);

// Create participant (admin, sponsor, site with scope)
router.post('/', requireRole('admin', 'sponsor', 'site'), participantsController.createParticipant);

// Update participant (admin, sponsor, site with scope)
router.put('/:id', requireRole('admin', 'sponsor', 'site'), scopeGuard('Participant'), participantsController.updateParticipant);

// Transition participant status (admin, sponsor, site with scope)
router.post('/:id/transition', requireRole('admin', 'sponsor', 'site'), scopeGuard('Participant'), participantsController.transitionParticipant);

// Add note to participant (admin, sponsor, site with scope)
router.post('/:id/notes', requireRole('admin', 'sponsor', 'site'), scopeGuard('Participant'), participantsController.addParticipantNote);

export default router;
