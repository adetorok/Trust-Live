import mongoose from 'mongoose';

const ParticipantSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    studyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Study', required: true },
    siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
    status: { 
      type: String, 
      enum: ['Potential', 'PendingConsent', 'Screening', 'Enrolled', 'Completed', 'Disqualified', 'Withdrawn'],
      default: 'Potential'
    },
    consent: {
      fileUrl: String,
      receivedAt: Date
    },
    attributes: {
      dob: Date,
      sex: { type: String, enum: ['M', 'F', 'Other'] },
        notes: String
      },
      activityNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
      files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }]
  },
  { timestamps: true }
);

// Index for efficient queries
ParticipantSchema.index({ studyId: 1, siteId: 1 });
ParticipantSchema.index({ status: 1 });

export const Participant = mongoose.model('Participant', ParticipantSchema);
