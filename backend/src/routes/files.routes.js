import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { scopeGuard } from '../middleware/scope.js';
import { uploadSingle, uploadMultiple, getFileUrl, deleteFile } from '../middleware/upload.js';
import { File } from '../models/File.js';
import { Participant } from '../models/Participant.js';
import { Site } from '../models/Site.js';
import { Study } from '../models/Study.js';
import { EventLog } from '../models/EventLog.js';
import path from 'path';
import fs from 'fs';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Upload single file for participant
router.post('/participants/:id/upload', 
  requireRole('admin', 'site'), 
  scopeGuard('Participant'),
  uploadSingle('file'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { fileType, description } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const participant = await Participant.findById(id);
      if (!participant) {
        return res.status(404).json({ error: 'Participant not found' });
      }

      // Create file record
      const fileRecord = await File.create({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        entityType: 'Participant',
        entityId: id,
        uploadedBy: req.user.id,
        fileType: fileType || 'document',
        description: description || ''
      });

      // Update participant with file reference
      if (!participant.files) {
        participant.files = [];
      }
      participant.files.push(fileRecord._id);
      await participant.save();

      // Log the event
      await EventLog.create({
        actorId: req.user.id,
        action: 'UPLOAD_FILE',
        entityType: 'Participant',
        entityId: id,
        meta: { 
          fileId: fileRecord._id, 
          filename: fileRecord.originalName,
          fileType: fileRecord.fileType
        }
      });

      res.status(201).json({
        file: {
          id: fileRecord._id,
          filename: fileRecord.originalName,
          url: getFileUrl(req, fileRecord.filename, 'participants'),
          size: fileRecord.size,
          mimetype: fileRecord.mimetype,
          uploadedAt: fileRecord.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Upload multiple files for participant
router.post('/participants/:id/upload-multiple',
  requireRole('admin', 'site'),
  scopeGuard('Participant'),
  uploadMultiple('files'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { fileType, description } = req.body;
      
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const participant = await Participant.findById(id);
      if (!participant) {
        return res.status(404).json({ error: 'Participant not found' });
      }

      const fileRecords = [];
      
      for (const file of req.files) {
        const fileRecord = await File.create({
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
          entityType: 'Participant',
          entityId: id,
          uploadedBy: req.user.id,
          fileType: fileType || 'document',
          description: description || ''
        });
        
        fileRecords.push(fileRecord);
        
        if (!participant.files) {
          participant.files = [];
        }
        participant.files.push(fileRecord._id);
      }

      await participant.save();

      // Log the event
      await EventLog.create({
        actorId: req.user.id,
        action: 'UPLOAD_FILES',
        entityType: 'Participant',
        entityId: id,
        meta: { 
          fileIds: fileRecords.map(f => f._id),
          count: fileRecords.length
        }
      });

      res.status(201).json({
        files: fileRecords.map(fileRecord => ({
          id: fileRecord._id,
          filename: fileRecord.originalName,
          url: getFileUrl(req, fileRecord.filename, 'participants'),
          size: fileRecord.size,
          mimetype: fileRecord.mimetype,
          uploadedAt: fileRecord.createdAt
        }))
      });
    } catch (error) {
      next(error);
    }
  }
);

// Upload site list (CSV/Excel)
router.post('/sites/upload-list',
  requireRole('admin', 'sponsor'),
  uploadSingle('file'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Validate file type
      const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ 
          error: 'Invalid file type. Only CSV and Excel files are allowed for site lists.' 
        });
      }

      // Create file record
      const fileRecord = await File.create({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        entityType: 'Site',
        entityId: null, // Bulk upload
        uploadedBy: req.user.id,
        fileType: 'site_list',
        description: 'Bulk site upload'
      });

      // Log the event
      await EventLog.create({
        actorId: req.user.id,
        action: 'UPLOAD_SITE_LIST',
        entityType: 'Site',
        entityId: null,
        meta: { 
          fileId: fileRecord._id, 
          filename: fileRecord.originalName
        }
      });

      res.status(201).json({
        file: {
          id: fileRecord._id,
          filename: fileRecord.originalName,
          url: getFileUrl(req, fileRecord.filename, 'sites'),
          size: fileRecord.size,
          mimetype: fileRecord.mimetype,
          uploadedAt: fileRecord.createdAt
        },
        message: 'Site list uploaded successfully. Processing will begin shortly.'
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get files for an entity
router.get('/:entityType/:id/files',
  requireRole('admin', 'sponsor', 'site'),
  async (req, res, next) => {
    try {
      const { entityType, id } = req.params;
      
      // Validate entity type
      if (!['Participant', 'Site', 'Study'].includes(entityType)) {
        return res.status(400).json({ error: 'Invalid entity type' });
      }

      // Apply scope guard based on entity type
      if (entityType === 'Participant') {
        const participant = await Participant.findById(id);
        if (!participant) {
          return res.status(404).json({ error: 'Participant not found' });
        }
        
        // Check access
        if (req.user.role === 'sponsor') {
          const study = await Study.findById(participant.studyId);
          if (!study || study.sponsorId.toString() !== req.user.sponsorId.toString()) {
            return res.status(403).json({ error: 'Access denied' });
          }
        } else if (req.user.role === 'site') {
          if (participant.siteId.toString() !== req.user.siteId.toString()) {
            return res.status(403).json({ error: 'Access denied' });
          }
        }
      }

      const files = await File.find({ 
        entityType, 
        entityId: id 
      }).populate('uploadedBy', 'name email');

      res.json({
        files: files.map(file => ({
          id: file._id,
          filename: file.originalName,
          url: getFileUrl(req, file.filename, entityType.toLowerCase() + 's'),
          size: file.size,
          mimetype: file.mimetype,
          fileType: file.fileType,
          description: file.description,
          uploadedBy: file.uploadedBy,
          uploadedAt: file.createdAt
        }))
      });
    } catch (error) {
      next(error);
    }
  }
);

// Download file
router.get('/download/:fileId',
  requireRole('admin', 'sponsor', 'site'),
  async (req, res, next) => {
    try {
      const { fileId } = req.params;
      
      const file = await File.findById(fileId);
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }

      // Check access permissions
      if (file.entityType === 'Participant') {
        const participant = await Participant.findById(file.entityId);
        if (!participant) {
          return res.status(404).json({ error: 'Participant not found' });
        }
        
        if (req.user.role === 'sponsor') {
          const study = await Study.findById(participant.studyId);
          if (!study || study.sponsorId.toString() !== req.user.sponsorId.toString()) {
            return res.status(403).json({ error: 'Access denied' });
          }
        } else if (req.user.role === 'site') {
          if (participant.siteId.toString() !== req.user.siteId.toString()) {
            return res.status(403).json({ error: 'Access denied' });
          }
        }
      }

      // Check if file exists on disk
      if (!fs.existsSync(file.path)) {
        return res.status(404).json({ error: 'File not found on disk' });
      }

      // Set appropriate headers
      res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
      res.setHeader('Content-Type', file.mimetype);

      // Stream the file
      const fileStream = fs.createReadStream(file.path);
      fileStream.pipe(res);
    } catch (error) {
      next(error);
    }
  }
);

// Delete file
router.delete('/:fileId',
  requireRole('admin', 'site'),
  async (req, res, next) => {
    try {
      const { fileId } = req.params;
      
      const file = await File.findById(fileId);
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }

      // Check access permissions
      if (file.entityType === 'Participant') {
        const participant = await Participant.findById(file.entityId);
        if (!participant) {
          return res.status(404).json({ error: 'Participant not found' });
        }
        
        if (req.user.role === 'site' && participant.siteId.toString() !== req.user.siteId.toString()) {
          return res.status(403).json({ error: 'Access denied' });
        }
      }

      // Delete file from disk
      const deleted = deleteFile(file.path);
      if (!deleted) {
        console.warn(`File not found on disk: ${file.path}`);
      }

      // Remove file reference from entity
      if (file.entityType === 'Participant') {
        await Participant.findByIdAndUpdate(file.entityId, {
          $pull: { files: fileId }
        });
      }

      // Delete file record
      await File.findByIdAndDelete(fileId);

      // Log the event
      await EventLog.create({
        actorId: req.user.id,
        action: 'DELETE_FILE',
        entityType: file.entityType,
        entityId: file.entityId,
        meta: { 
          fileId: fileId,
          filename: file.originalName
        }
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
