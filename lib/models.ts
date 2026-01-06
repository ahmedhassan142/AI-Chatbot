import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Simple User Schema - NO middleware at all
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// No middleware - simple method for password comparison
UserSchema.methods.checkPassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.models.User || mongoose.model('User', UserSchema);