import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Conversation } from '@/lib/models';
import { verifyAccessToken } from '@/lib/auth';

// GET conversations for authenticated user
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
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

    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const department = searchParams.get('department');
    const isArchived = searchParams.get('archived') === 'true';
    
    const query: any = { userId: decoded.userId };
    
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
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// Create new conversation
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
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

    const data = await req.json();
    
    await connectDB();

    const conversation = await Conversation.create({
      userId: decoded.userId,
      title: data.title,
      messages: data.messages,
      //@ts-ignore
      department: decoded.department || 'general',
      tags: data.tags || ['erp', 'chat'],
    });

    return NextResponse.json({
      message: 'Conversation saved',
      conversation,
    });
  } catch (error: any) {
    console.error('Save conversation error:', error);
    return NextResponse.json(
      { error: 'Failed to save conversation' },
      { status: 500 }
    );
  }
}

// Update conversation (archive, add tags, etc.)
export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
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

    const { id, ...updates } = await req.json();
    
    await connectDB();

    const conversation = await Conversation.findOneAndUpdate(
      { _id: id, userId: decoded.userId },
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

// Delete conversation
export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Conversation ID required' },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await Conversation.deleteOne({
      _id: id,
      userId: decoded.userId,
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