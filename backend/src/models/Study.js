import mongoose from 'mongoose';

const StudySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    protocolId: { type: String, required: true, unique: true, trim: true },
    therapeuticArea: { type: String, required: true, trim: true },
    sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sponsor', required: true },
    status: { 
      type: String, 
      enum: ['Recruitment', 'Active', 'CloseOut', 'Closed'], 
      default: 'Recruitment' 
    },
    expectedSubjects: { type: Number, required: true, min: 0 },
    enrolledSubjects: { type: Number, default: 0, min: 0 },
    linkedSites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Site' }],
    milestones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Milestone' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// Virtual for percent complete based on milestones
StudySchema.virtual('percentComplete').get(function() {
  if (!this.milestones || this.milestones.length === 0) return 0;
  // This would be calculated from milestone completion
  return 0; // Placeholder - will be calculated in service
});

StudySchema.set('toJSON', { virtuals: true });

export const Study = mongoose.model('Study', StudySchema);
