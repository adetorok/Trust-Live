import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import * as adminController from '../controllers/admin.controller.js';

const r = Router();

// All admin routes require authentication and admin role
r.use(requireAuth);
r.use(requireRole('admin'));

// Dashboard stats
r.get('/stats', adminController.getDashboardStats);

// User management
r.get('/users', adminController.listUsers);
r.post('/users', adminController.createUser);

// Site management
r.get('/sites', adminController.listSites);
r.post('/sites', adminController.createSite);

// Study management
r.get('/studies', adminController.listStudies);
r.post('/studies', adminController.createStudy);

// Lead management (potential participants)
r.get('/leads', adminController.listLeads);

export default r;


