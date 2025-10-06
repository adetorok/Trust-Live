import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { scopeGuard } from '../middleware/scope.js';
import * as sponsorsController from '../controllers/sponsors.controller.js';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// List sponsors (admin, sponsor)
router.get('/', requireRole('admin', 'sponsor'), sponsorsController.listSponsors);

// Get specific sponsor (admin, sponsor with scope)
router.get('/:id', requireRole('admin', 'sponsor'), scopeGuard('Sponsor'), sponsorsController.getSponsor);

// Create sponsor (admin only)
router.post('/', requireRole('admin'), sponsorsController.createSponsor);

// Update sponsor (admin, sponsor with scope)
router.put('/:id', requireRole('admin', 'sponsor'), scopeGuard('Sponsor'), sponsorsController.updateSponsor);

// Delete sponsor (admin only)
router.delete('/:id', requireRole('admin'), sponsorsController.deleteSponsor);

// Get sponsor's studies (admin, sponsor with scope)
router.get('/:id/studies', requireRole('admin', 'sponsor'), scopeGuard('Sponsor'), sponsorsController.getSponsorStudies);

export default router;
