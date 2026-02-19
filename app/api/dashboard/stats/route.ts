// app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/db';
import { User, Conversation } from '../../../../lib/models';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '../../../../lib/auth';

export async function GET() {
  try {
    // Get token from cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyAccessToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();

    // Get stats
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ emailVerified: { $ne: null } });
    const totalConversations = await Conversation.countDocuments();
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    return NextResponse.json({
      stats: {
        totalUsers,
        verifiedUsers,
        pendingVerification: totalUsers - verifiedUsers,
        totalConversations,
        recentUsers,
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}