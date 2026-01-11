import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/db';
import { User } from '../../../../lib/models';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const refreshToken = req.cookies.get('refreshToken')?.value;
    
    if (refreshToken) {
      // Clear refresh token from database
      await User.findOneAndUpdate(
        { refreshToken },
        { $unset: { refreshToken: 1 } }
      );
    }

    const response = NextResponse.json({
      message: 'Logout successful',
    });

    // Clear cookies
    response.cookies.delete('refreshToken');
    response.cookies.delete('accessToken');

    return response;
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}