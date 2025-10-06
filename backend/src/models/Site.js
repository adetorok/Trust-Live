import mongoose from 'mongoose';

const SiteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, default: 'US' }
    },
    contactName: { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sponsor', required: true },
    status: { 
      type: String, 
      enum: ['Pending', 'Active', 'Inactive'], 
      default: 'Pending' 
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export const Site = mongoose.model('Site', SiteSchema);
