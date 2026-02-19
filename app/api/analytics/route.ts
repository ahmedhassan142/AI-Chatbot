// app/api/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { User, Conversation } from '../../../lib/models';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '../../../lib/auth';

export async function GET(req: NextRequest) {
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
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get('range') || 'month';

    // Calculate date ranges based on timeRange
    const now = new Date();
    const startDate = new Date();
    
    switch(timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    // Get today's date at midnight for today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ============ REAL USER STATISTICS ============
    
    // 1. Basic user counts
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ emailVerified: { $ne: null } });
    const unverifiedUsers = totalUsers - verifiedUsers;
    
    // 2. Users by role
    const adminCount = await User.countDocuments({ role: 'admin' });
    const regularUserCount = await User.countDocuments({ role: 'user' });
    
    // 3. New users in selected time period
    const newUsers = await User.countDocuments({ 
      createdAt: { $gte: startDate } 
    });
    
    // 4. Users created today
    const usersToday = await User.countDocuments({
      createdAt: { $gte: today }
    });
    
    // 5. Users by department - REAL DATA from your database
    const departmentStats = await User.aggregate([
      { 
        $group: { 
          _id: { $ifNull: ['$department', 'Unassigned'] }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } }
    ]);

    // ============ REAL CONVERSATION STATISTICS ============
    
    const totalConversations = await Conversation.countDocuments();
    
    const newConversations = await Conversation.countDocuments({
      createdAt: { $gte: startDate }
    });
    
    const conversationsToday = await Conversation.countDocuments({
      createdAt: { $gte: today }
    });
    
    // Get unique users who have conversations
    const usersWithConversations = await Conversation.distinct('userId');
    const activeUsers = usersWithConversations.length;
    
    // Average conversations per user (real calculation)
    const avgConversationsPerUser = activeUsers > 0 
      ? (totalConversations / activeUsers).toFixed(1) 
      : '0';
    
    // Conversion rate (users who actually use the chat)
    const conversionRate = totalUsers > 0 
      ? ((activeUsers / totalUsers) * 100).toFixed(1)
      : '0';

    // ============ MONTHLY TRENDS (LAST 6 MONTHS) ============
    
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);
    
    // REAL user growth data - cumulative over time
    const userGrowth = await User.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sixMonthsAgo } 
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // REAL conversation trends
    const conversationTrends = await Conversation.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sixMonthsAgo } 
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Format month names
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Build user growth data array
    let cumulativeCount = 0;
    const userGrowthData = [];
    
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const monthYear = {
        year: d.getFullYear(),
        month: d.getMonth() + 1
      };
      
      const found = userGrowth.find(u => 
        u._id.year === monthYear.year && u._id.month === monthYear.month
      );
      
      cumulativeCount += found?.count || 0;
      
      userGrowthData.push({
        month: monthNames[d.getMonth()],
        users: cumulativeCount
      });
    }

    // Build conversation trend data
    const conversationData = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const monthYear = {
        year: d.getFullYear(),
        month: d.getMonth() + 1
      };
      
      const found = conversationTrends.find(c => 
        c._id.year === monthYear.year && c._id.month === monthYear.month
      );
      
      conversationData.push({
        month: monthNames[d.getMonth()],
        conversations: found?.count || 0
      });
    }

    // ============ DEPARTMENT DISTRIBUTION ============
    
    const departmentColors: { [key: string]: string } = {
      'Engineering': '#3b82f6',
      'Sales': '#10b981',
      'Marketing': '#8b5cf6',
      'HR': '#ec4899',
      'Finance': '#f59e0b',
      'Support': '#6366f1',
      'IT': '#06b6d4',
      'Operations': '#f97316',
      'general': '#6b7280',
      'Unassigned': '#94a3b8'
    };

    const departmentData = departmentStats.map(dept => ({
      name: dept._id,
      value: dept.count,
      color: departmentColors[dept._id] || '#6b7280'
    }));

    // ============ TEAM PERFORMANCE (REAL DATA) ============
    
    const topTeams = [];
    
    for (const dept of departmentStats) {
      const deptName = dept._id;
      if (deptName === 'Unassigned') continue;
      
      // Get users in this department
      const deptUsers = await User.countDocuments({ department: deptName });
      
      // Get conversations from this department
      const deptConversations = await Conversation.countDocuments({ 
        department: deptName.toLowerCase() 
      });
      
      // Calculate productivity score (conversations per user * 10)
      const productivity = deptUsers > 0 
        ? Math.min(Math.round((deptConversations / deptUsers) * 10), 100)
        : 0;
      
      // Calculate growth compared to last month
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      const prevMonthConversations = await Conversation.countDocuments({
        department: deptName.toLowerCase(),
        createdAt: { $lt: lastMonth }
      });
      
      const growth = prevMonthConversations > 0
        ? `+${Math.round((deptConversations - prevMonthConversations) / prevMonthConversations * 100)}%`
        : '+0%';
      
      topTeams.push({
        team: deptName,
        productivity,
        growth,
        conversations: deptConversations,
        members: deptUsers
      });
    }

    // Sort by productivity and take top 5
    topTeams.sort((a, b) => b.productivity - a.productivity);

    // ============ RECENT ACTIVITY ============
    
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role department createdAt');
    
    const recentConversations = await Conversation.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email')
      .select('title department createdAt');

    // ============ KPI DATA ============
    
    const kpiData = {
      totalUsers,
      verifiedUsers,
      unverifiedUsers,
      adminCount,
      regularUserCount,
      totalConversations,
      newUsers,
      newConversations,
      usersToday,
      conversationsToday,
      activeUsers,
      conversionRate,
      avgConversationsPerUser,
    };

    return NextResponse.json({
      kpi: kpiData,
      userGrowthData,
      conversationData,
      departmentData,
      topTeams: topTeams.slice(0, 5),
      recentUsers,
      recentConversations: recentConversations.map(c => ({
        id: c._id,
        title: c.title,
        user: c.userId?.name || 'Unknown',
        department: c.department,
        createdAt: c.createdAt
      })),
      timeRange
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}