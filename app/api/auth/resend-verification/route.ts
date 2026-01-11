import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/db';
import { User } from '../../../../lib/models';
import crypto from 'crypto';

// In-memory store (use database in production)
const resendAttempts = new Map<string, { count: number; lastAttempt: Date }>();

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Rate limiting
    const attempts = resendAttempts.get(email) || { count: 0, lastAttempt: new Date(0) };
    const now = new Date();
    
    // Reset count if last attempt was more than 1 hour ago
    if (now.getTime() - attempts.lastAttempt.getTime() > 60 * 60 * 1000) {
      attempts.count = 0;
    }

    // Limit to 3 attempts per hour
    if (attempts.count >= 3) {
      return NextResponse.json(
        { error: 'Too many resend attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    // Store token (use database in production)
    const verificationTokens = new Map();
    verificationTokens.set(verificationToken, {
      token: verificationToken,
      userId: user._id.toString(),
      expires,
    });

    // In production: Send verification email here
    // await sendVerificationEmail(email, verificationToken);

    // Update rate limiting
    attempts.count += 1;
    attempts.lastAttempt = now;
    resendAttempts.set(email, attempts);

    return NextResponse.json({
      success: true,
      message: 'Verification email has been resent',
    });
  } catch (error: any) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Failed to resend verification email' },
      { status: 500 }
    );
  }
}