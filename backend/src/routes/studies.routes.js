import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { scopeGuard } from '../middleware/scope.js';
import * as studiesController from '../controllers/studies.controller.js';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// List studies (admin, sponsor, site)
router.get('/', requireRole('admin', 'sponsor', 'site'), studiesController.listStudies);

// Get specific study (admin, sponsor with scope, site with scope)
router.get('/:id', requireRole('admin', 'sponsor', 'site'), scopeGuard('Study'), studiesController.getStudy);

// Create study (admin, sponsor)
router.post('/', requireRole('admin', 'sponsor'), studiesController.createStudy);

// Update study (admin, sponsor with scope)
router.put('/:id', requireRole('admin', 'sponsor'), scopeGuard('Study'), studiesController.updateStudy);

// Delete study (admin only)
router.delete('/:id', requireRole('admin'), studiesController.deleteStudy);

// Get study participants (admin, sponsor with scope, site with scope)
router.get('/:id/participants', requireRole('admin', 'sponsor', 'site'), scopeGuard('Study'), studiesController.getStudyParticipants);

// Add site to study (admin, sponsor with scope)
router.post('/:id/sites/:siteId', requireRole('admin', 'sponsor'), scopeGuard('Study'), studiesController.addSiteToStudy);

// Remove site from study (admin, sponsor with scope)
router.delete('/:id/sites/:siteId', requireRole('admin', 'sponsor'), scopeGuard('Study'), studiesController.removeSiteFromStudy);

export default router;
