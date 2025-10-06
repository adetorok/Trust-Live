import mongoose from 'mongoose';

const SponsorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    companyEmail: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: { type: String, default: 'US' }
    },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    studies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Study' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export const Sponsor = mongoose.model('Sponsor', SponsorSchema);
