import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    ini: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'designer'], required: true },
    phone: { type: String, default: '' },
    skills: { type: [String], default: [] },
    rating: { type: Number, default: 4.0 },
    active: { type: Boolean, default: true },
    limit: { type: Number, default: 2 },
    load: { type: Number, default: 0 },
    joined: { type: String, default: '' },
    earned: { type: Number, default: 0 },
    bids: { type: Number, default: 0 },
    won: { type: Number, default: 0 },
    portfolio: { type: String, default: '' },
    tempPassword: { type: String, default: null },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', UserSchema);
