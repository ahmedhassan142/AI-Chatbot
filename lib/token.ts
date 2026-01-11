// lib/tokens.ts
import crypto from 'crypto';

// Generate verification token
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Generate password reset token
export function generatePasswordResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Generate random OTP
export function generateOTP(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}