// lib/models/User.ts
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// ============ USER SCHEMA ============
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
    enum: ['admin', 'user'],
    default: 'user',
    required: true,
  },
  emailVerified: {
    type: Date,
    default: null,
  },
  verificationToken: {
    type: String,
    default: null,
  },
  verificationTokenExpires: {
    type: Date,
    default: null,
  },
  department: {
    type: String,
    enum: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Support', 'IT', 'Operations', 'general'],
    default: 'general',
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

// Helper method to check if user is admin
UserSchema.methods.isAdmin = function(): boolean {
  return this.role === 'admin';
};

// ============ CONVERSATION SCHEMA ============
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

// ============ REPORT SCHEMA ============
const ReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    enum: ['financial', 'performance', 'analytics', 'audit', 'sales', 'users'],
    required: true,
  },
  status: {
    type: String,
    enum: ['generated', 'pending', 'failed'],
    default: 'pending',
  },
  format: {
    type: String,
    enum: ['pdf', 'excel', 'csv'],
    default: 'pdf',
  },
  url: {
    type: String,
    default: null,
  },
  size: {
    type: String,
    default: '0 MB',
  },
  downloads: {
    type: Number,
    default: 0,
  },
  author: {
    type: String,
    required: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  parameters: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  generatedAt: {
    type: Date,
    default: null,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  tags: [{
    type: String,
  }],
}, {
  timestamps: true,
});

// Index for faster queries
ReportSchema.index({ authorId: 1, createdAt: -1 });
ReportSchema.index({ type: 1, status: 1 });
ReportSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired reports

// ============ EXPORT MODELS ============
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
export const Report = mongoose.models.Report || mongoose.model('Report', ReportSchema);