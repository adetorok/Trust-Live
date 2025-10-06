import mongoose from 'mongoose';

const MilestoneSchema = new mongoose.Schema(
  {
    studyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Study', required: true },
    code: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    plannedDate: { type: Date, required: true },
    baselineDate: Date,
    actualDate: Date,
    status: { 
      type: String, 
      enum: ['NotStarted', 'InProgress', 'Complete'], 
      default: 'NotStarted' 
    },
    percentComplete: { type: Number, default: 0, min: 0, max: 100 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// Index for efficient queries
MilestoneSchema.index({ studyId: 1 });

export const Milestone = mongoose.model('Milestone', MilestoneSchema);
