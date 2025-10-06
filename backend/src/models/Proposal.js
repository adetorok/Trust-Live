import mongoose from 'mongoose';

const ProposalSchema = new mongoose.Schema(
  {
    // Basic info
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    role: { 
      type: String, 
      enum: ['sponsor', 'site'], 
      required: true 
    },
    
    // Study info
    studyName: { type: String, trim: true },
    therapeuticDiscipline: { type: String, trim: true },
    numberOfStudies: { type: Number, default: 1, min: 1 },
    
    // Sponsor/CRO specific
    numberOfSites: { type: String, trim: true },
    studyScope: { 
      type: String, 
      enum: ['US', 'Global'], 
      default: 'US' 
    },
    fpfvDate: { type: Date },
    studyDuration: { type: String, trim: true },
    studyDurationUnit: { 
      type: String, 
      enum: ['months', 'weeks', 'years'], 
      default: 'months' 
    },
    
    // Site specific
    numberOfSubjects: { type: String, trim: true },
    activationDate: { type: Date },
    studyEndDate: { type: Date },
    
    // Additional info
    message: { type: String, trim: true },
    
    // Status tracking
    status: { 
      type: String, 
      enum: ['New', 'In Review', 'Contacted', 'Qualified', 'Rejected'], 
      default: 'New' 
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }]
  },
  { timestamps: true }
);

// Index for efficient queries
ProposalSchema.index({ email: 1 });
ProposalSchema.index({ status: 1 });
ProposalSchema.index({ role: 1 });
ProposalSchema.index({ createdAt: -1 });

export const Proposal = mongoose.model('Proposal', ProposalSchema);
