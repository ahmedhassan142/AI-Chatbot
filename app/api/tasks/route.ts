import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Task } from '@/lib/models';
import { verifyAccessToken } from '@/lib/auth';

// GET tasks with filtering
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
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const department = searchParams.get('department');
    const assignedTo = searchParams.get('assignedTo');
    
    const query: any = {
      $or: [
        { assignedTo: decoded.userId },
        { createdBy: decoded.userId },
        //@ts-ignore
        { department: decoded.department },
      ],
    };
    
    if (status) {
      query.status = status;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    if (department) {
      query.department = department;
    }
    
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1, priority: -1 });

    return NextResponse.json({
      tasks,
    });
  } catch (error: any) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// Create new task
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

    const task = await Task.create({
      ...data,
      createdBy: decoded.userId,
    });

    return NextResponse.json({
      message: 'Task created successfully',
      task,
    });
  } catch (error: any) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

// Update task
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
        { status: 403 }
      );
    }

    const { id, ...updates } = await req.json();
    
    await connectDB();

    // Check if user has permission to update
    const task = await Task.findOne({ _id: id });
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Only creator or assignee can update
    if (
      task.createdBy.toString() !== decoded.userId &&
      task.assignedTo?.toString() !== decoded.userId &&
      decoded.role !== 'admin'
    ) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    ).populate('assignedTo', 'name email');

    return NextResponse.json({
      message: 'Task updated',
      task: updatedTask,
    });
  } catch (error: any) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}