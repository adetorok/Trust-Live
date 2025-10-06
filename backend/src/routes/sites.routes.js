import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { scopeGuard } from '../middleware/scope.js';
import * as sitesController from '../controllers/sites.controller.js';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// List sites (admin, sponsor, site)
router.get('/', requireRole('admin', 'sponsor', 'site'), sitesController.listSites);

// Get specific site (admin, sponsor with scope, site with scope)
router.get('/:id', requireRole('admin', 'sponsor', 'site'), scopeGuard('Site'), sitesController.getSite);

// Create site (admin, sponsor)
router.post('/', requireRole('admin', 'sponsor'), sitesController.createSite);

// Update site (admin, sponsor with scope, site with scope)
router.put('/:id', requireRole('admin', 'sponsor', 'site'), scopeGuard('Site'), sitesController.updateSite);

// Delete site (admin only)
router.delete('/:id', requireRole('admin'), sitesController.deleteSite);

// Get site participants (admin, sponsor with scope, site with scope)
router.get('/:id/participants', requireRole('admin', 'sponsor', 'site'), scopeGuard('Site'), sitesController.getSiteParticipants);

// Get site studies (admin, sponsor with scope, site with scope)
router.get('/:id/studies', requireRole('admin', 'sponsor', 'site'), scopeGuard('Site'), sitesController.getSiteStudies);

export default router;
