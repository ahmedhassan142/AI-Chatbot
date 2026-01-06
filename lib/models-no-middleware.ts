// lib/models-no-middleware.ts
import mongoose from 'mongoose';

// User Schema WITHOUT any middleware
const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  role: {
    type: String,
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);