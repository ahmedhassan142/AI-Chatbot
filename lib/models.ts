// models/User.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
  emailVerified: {
    type: Date,
    default: null,  // Keep as Date, null means not verified
  },
  verificationToken: {
    type: String,
    default: null,
  },
  verificationTokenExpires: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Password comparison method
UserSchema.methods.checkPassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Helper method to check if email is verified
UserSchema.methods.isEmailVerified = function(): boolean {
  return this.emailVerified !== null;
};

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
const ConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  messages: [{
    content: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  department: {
    type: String,
    enum: ['sales', 'support', 'hr', 'finance', 'it', 'operations', 'general'],
    default: 'general',
  },
  tags: [{
    type: String,
  }],
  isArchived: {
    type: Boolean,
    default: false,
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
