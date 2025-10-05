import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    roles: { type: [String], default: ['user'] },
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator);

UserSchema.methods.verifyPassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

UserSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const User = mongoose.model('User', UserSchema);


