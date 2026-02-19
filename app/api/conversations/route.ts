// app/api/conversations/route.ts - UPDATED WITH COOKIE AUTH
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { Conversation } from '../../../lib/models';
import { verifyAccessToken } from '../../../lib/auth';
import mongoose from 'mongoose';
import { cookies } from 'next/headers';

// GET conversations - Only for authenticated users, return empty for guests
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    let token = authHeader?.split(' ')[1];
    
    // If no token in header, try to get from cookie
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value;
    }
    
    // If no token, return empty conversations (guest mode)
    if (!token) {
      return NextResponse.json({
        conversations: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0,
        },
        message: 'Guest mode - no saved conversations',
      });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      // Token invalid but don't throw error - just return empty for guest
      return NextResponse.json({
        conversations: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0,
        },
        message: 'Invalid token - guest mode',
      });
    }

    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const department = searchParams.get('department');
    const isArchived = searchParams.get('archived') === 'true';
    
    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return NextResponse.json({
        conversations: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0,
        },
      });
    }
    
    const query: any = { userId: new mongoose.Types.ObjectId(decoded.userId) };
    
    if (department && department !== 'all') {
      query.department = department;
    }
    
    if (isArchived) {
      query.isArchived = true;
    }

    const conversations = await Conversation.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ updatedAt: -1 });

    const total = await Conversation.countDocuments(query);

    return NextResponse.json({
      conversations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get conversations error:', error);
    // Return empty array instead of error for guest users
    return NextResponse.json({
      conversations: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
      },
    });
  }
}

// Create new conversation - Only for authenticated users
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    let token = authHeader?.split(' ')[1];
    
    // If no token in header, try to get from cookie
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value;
    }
    
    // If no token, just return success without saving (guest mode)
    if (!token) {
      return NextResponse.json({
        message: 'Guest mode - conversation not saved',
        saved: false,
      });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      // Token invalid but don't throw error
      return NextResponse.json({
        message: 'Invalid token - conversation not saved',
        saved: false,
      });
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return NextResponse.json({
        message: 'Invalid user ID - conversation not saved',
        saved: false,
      });
    }

    const data = await req.json();
    
    await connectDB();

    const conversation = await Conversation.create({
      userId: new mongoose.Types.ObjectId(decoded.userId),
      title: data.title || 'New Conversation',
      messages: data.messages || [],
      department: decoded.department || 'general',
      tags: data.tags || ['erp', 'chat'],
    });

    return NextResponse.json({
      message: 'Conversation saved',
      saved: true,
      conversation,
    });
  } catch (error: any) {
    console.error('Save conversation error:', error);
    // Don't throw error for guest users
    return NextResponse.json({
      message: 'Failed to save conversation',
      saved: false,
    });
  }
}

// Update conversation - Only for authenticated users
export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    let token = authHeader?.split(' ')[1];
    
    // If no token in header, try to get from cookie
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value;
    }
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required to update conversations' },
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

    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    const { id, ...updates } = await req.json();
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid conversation ID format' },
        { status: 400 }
      );
    }
    
    await connectDB();

    const conversation = await Conversation.findOneAndUpdate(
      { 
        _id: new mongoose.Types.ObjectId(id), 
        userId: new mongoose.Types.ObjectId(decoded.userId) 
      },
      { $set: updates },
      { new: true }
    );

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Conversation updated',
      conversation,
    });
  } catch (error: any) {
    console.error('Update conversation error:', error);
    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    );
  }
}

// Delete conversation - Only for authenticated users
export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    let token = authHeader?.split(' ')[1];
    
    // If no token in header, try to get from cookie
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value;
    }
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required to delete conversations' },
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

    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Conversation ID required' },
        { status: 400 }
      );
    }
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid conversation ID format' },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await Conversation.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(decoded.userId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Conversation deleted',
    });
  } catch (error: any) {
    console.error('Delete conversation error:', error);
    return NextResponse.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}