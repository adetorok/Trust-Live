import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true }, // Generated filename on server
    originalName: { type: String, required: true }, // Original filename from user
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true }, // Stored path on server/cloud
    entityType: { type: String, enum: ['Participant', 'Study', 'Site', 'User'], required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, refPath: 'entityType' }, // Can be null for bulk uploads
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileType: { type: String, enum: ['document', 'consent', 'screening', 'site_list', 'other'], default: 'document' },
    description: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Index for efficient queries
FileSchema.index({ entityType: 1, entityId: 1 });
FileSchema.index({ uploadedBy: 1 });
FileSchema.index({ fileType: 1 });

export const File = mongoose.model('File', FileSchema);
