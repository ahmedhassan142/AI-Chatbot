// app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { User } from '../../../../lib/models';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(
        new URL('/auth/verify-email?error=no-token', request.url)
      );
    }

    // Connect to database
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Find user with valid token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL('/auth/verify-email?error=invalid-token', request.url)
      );
    }

    // Update user as verified - Set emailVerified to current date
    const now = new Date();
    await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          emailVerified: now, // Set to Date, not boolean
          verificationToken: null,
          verificationTokenExpires: null,
        }
      },
      { new: true }
    );

    console.log(`✅ User ${user.email} verified at ${now}`);

    // Redirect to success page
    return NextResponse.redirect(
      new URL('/auth/verify-email?success=true', request.url)
    );

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.redirect(
      new URL('/auth/verify-email?error=server-error', request.url)
    );
  }
}