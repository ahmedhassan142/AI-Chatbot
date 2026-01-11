// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    
    console.log(`🔐 Login attempt for: ${email}`);
    
    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    console.log(`📋 User ${email} verification status: ${user.emailVerified}`);
    
    // Check if email is verified
    if (!user.emailVerified) {
      console.log(`❌ Email not verified for: ${email}`);
      return NextResponse.json(
        { 
          error: 'Please verify your email address before logging in.',
          requiresVerification: true,
          email: user.email 
        },
        { status: 401 }
      );
    }
    
    console.log(`✅ Email verified for: ${email}`);
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`❌ Invalid password for: ${email}`);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id.toString(),
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: '7d' }
    );
    
    console.log(`✅ Login successful for: ${email}`);
    
    // Return user data with token
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token, // Changed from accessToken to token
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
    
  } catch (error: any) {
    console.error('Login error:', error.message);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}