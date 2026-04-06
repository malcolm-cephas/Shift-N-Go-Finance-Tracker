import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['ADMIN', 'MANAGER', 'INVESTOR'],
    default: 'INVESTOR',
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
