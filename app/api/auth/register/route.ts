// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/email';
import { generateVerificationToken } from '@/lib/token';
import { User } from '@/lib/models';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, confirmPassword } = await request.json();

    // Validate input
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Connect to database
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user with correct fields - DON'T set emailVerified, let it be null
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
      // emailVerified: null, // Don't set it, let it default to null
      verificationToken,
      verificationTokenExpires,
      createdAt: new Date(),
    });

    console.log(`✅ User created: ${user.email}, emailVerified: ${user.emailVerified}`);

    // Send verification email
    await sendVerificationEmail(user.email, user.name, verificationToken);

    // Return success
    return NextResponse.json({
      message: 'Registration successful. Please check your email to verify your account.',
      requiresVerification: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'An error occurred during registration: ' + error.message },
      { status: 500 }
    );
  }
}