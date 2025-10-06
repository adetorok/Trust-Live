import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema(
  {
    ownerType: { 
      type: String, 
      enum: ['Study', 'Site', 'Participant'], 
      required: true 
    },
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    filename: { type: String, required: true, trim: true },
    originalName: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true, min: 0 },
    storageUrl: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    uploadedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Index for efficient queries
FileSchema.index({ ownerType: 1, ownerId: 1 });
FileSchema.index({ uploadedBy: 1 });

export const File = mongoose.model('File', FileSchema);
