import mongoose from 'mongoose';

const EventLogSchema = new mongoose.Schema(
  {
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { 
      type: String, 
      enum: ['CREATE', 'UPDATE', 'DELETE', 'STATE_CHANGE', 'LOGIN', 'FILE_UPLOAD'],
      required: true 
    },
    entityType: { 
      type: String, 
      enum: ['User', 'Sponsor', 'Site', 'Study', 'Participant', 'Milestone', 'Note', 'File'],
      required: true 
    },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    from: mongoose.Schema.Types.Mixed, // Previous state
    to: mongoose.Schema.Types.Mixed,   // New state
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    requestId: String, // For tracing requests
    ipAddress: String,
    userAgent: String
  },
  { timestamps: true }
);

// Index for efficient queries
EventLogSchema.index({ actorId: 1, createdAt: -1 });
EventLogSchema.index({ entityType: 1, entityId: 1 });
EventLogSchema.index({ action: 1, createdAt: -1 });

export const EventLog = mongoose.model('EventLog', EventLogSchema);
