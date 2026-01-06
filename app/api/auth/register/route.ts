import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await connectDB();
    
    // Get data from request
    const { name, email, password, confirmPassword } = await req.json();
    
    // Basic validation
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
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }
    
    // Hash password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user directly with hashed password
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
    });
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
    
  } catch (error: any) {
    console.error('Registration error:', error.message);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}