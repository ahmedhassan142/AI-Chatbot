// app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { Report, User, Conversation } from '../../../lib/models';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '../../../lib/auth';
import mongoose from 'mongoose';

// GET all reports
export async function GET(req: NextRequest) {
  try {
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
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const query: any = {};
    if (type && type !== 'all') query.type = type;
    if (status && status !== 'all') query.status = status;

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Report.countDocuments(query);

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

// Generate new report with REAL data
export async function POST(req: NextRequest) {
  try {
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

    const { type, parameters = {} } = await req.json();
    
    await connectDB();

    // Get the current user info
    const currentUser = await User.findById(decoded.userId);

    // Generate report data based on type
    let reportData = null;
    let reportTitle = '';
    let reportDescription = '';

    switch(type) {
      case 'users':
        reportTitle = `User Report - ${new Date().toLocaleDateString()}`;
        reportDescription = 'Complete user analytics and statistics';
        reportData = await generateUserReport(parameters);
        break;
        
      case 'conversations':
        reportTitle = `Conversation Report - ${new Date().toLocaleDateString()}`;
        reportDescription = 'Chat conversation analysis and metrics';
        reportData = await generateConversationReport(parameters);
        break;
        
      case 'performance':
        reportTitle = `Performance Report - ${new Date().toLocaleDateString()}`;
        reportDescription = 'Team and department performance metrics';
        reportData = await generatePerformanceReport(parameters);
        break;
        
      case 'financial':
        reportTitle = `Financial Report - ${new Date().toLocaleDateString()}`;
        reportDescription = 'Revenue and expense analysis';
        reportData = await generateFinancialReport(parameters);
        break;
        
      default:
        reportTitle = `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${new Date().toLocaleDateString()}`;
        reportDescription = `Comprehensive ${type} analysis`;
        reportData = await generateGenericReport(type, parameters);
    }

    // Create report record with REAL data
    const report = await Report.create({
      title: reportTitle,
      description: reportDescription,
      type,
      status: 'generated', // Set to generated immediately since we have data
      format: parameters.format || 'pdf',
      author: currentUser?.name || 'Admin',
      authorId: decoded.userId,
      parameters,
      data: reportData, // Store the actual report data
      generatedAt: new Date(),
      size: calculateReportSize(reportData),
      downloads: 0,
      tags: [type, ...(parameters.tags || [])],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      message: 'Report generated successfully',
      report
    });

  } catch (error) {
    console.error('Generate report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

// Helper function to generate user report
async function generateUserReport(parameters: any) {
  const { department, role, dateRange } = parameters;
  
  const query: any = {};
  if (department && department !== 'all') query.department = department;
  if (role && role !== 'all') query.role = role;
  
  const users = await User.find(query)
    .select('-password -verificationToken -verificationTokenExpires')
    .sort({ createdAt: -1 });
  
  const stats = {
    total: users.length,
    byRole: await User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    byDepartment: await User.aggregate([{ $group: { _id: '$department', count: { $sum: 1 } } }]),
    verified: await User.countDocuments({ emailVerified: { $ne: null } }),
    unverified: await User.countDocuments({ emailVerified: null }),
  };
  
  return { users, stats };
}

// Helper function to generate conversation report
async function generateConversationReport(parameters: any) {
  const { department, userId, dateRange } = parameters;
  
  const query: any = {};
  if (department && department !== 'all') query.department = department;
  if (userId) query.userId = userId;
  
  const conversations = await Conversation.find(query)
    .populate('userId', 'name email department')
    .sort({ createdAt: -1 });
  
  const stats = {
    total: conversations.length,
    byDepartment: await Conversation.aggregate([{ $group: { _id: '$department', count: { $sum: 1 } } }]),
    averageMessagesPerConversation: conversations.reduce((acc, c) => acc + c.messages.length, 0) / conversations.length || 0,
    topUsers: await Conversation.aggregate([
      { $group: { _id: '$userId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } }
    ])
  };
  
  return { conversations, stats };
}

// Helper function to generate performance report
async function generatePerformanceReport(parameters: any) {
  const departments = await User.distinct('department');
  
  const performance = [];
  
  for (const dept of departments) {
    if (!dept) continue;
    
    const userCount = await User.countDocuments({ department: dept });
    const conversationCount = await Conversation.countDocuments({ department: dept.toLowerCase() });
    const activeUsers = await Conversation.distinct('userId', { department: dept.toLowerCase() });
    
    performance.push({
      department: dept,
      userCount,
      conversationCount,
      activeUsers: activeUsers.length,
      productivity: userCount > 0 ? (conversationCount / userCount).toFixed(2) : 0,
      engagementRate: userCount > 0 ? ((activeUsers.length / userCount) * 100).toFixed(1) + '%' : '0%'
    });
  }
  
  return performance;
}

// Helper function to generate financial report
async function generateFinancialReport(parameters: any) {
  // This would integrate with your financial data
  // For now, return a structure
  return {
    revenue: { total: 0, monthly: [] },
    expenses: { total: 0, monthly: [] },
    profit: { total: 0, margin: 0 },
    projections: {}
  };
}

// Helper function for generic reports
async function generateGenericReport(type: string, parameters: any) {
  return {
    type,
    parameters,
    generatedAt: new Date(),
    data: {} // Custom implementation based on your needs
  };
}

// Helper to calculate report size
function calculateReportSize(data: any): string {
  const size = JSON.stringify(data).length;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}