// app/api/reports/[id]/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/db';
import { Report } from '../../../../../lib/models';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '../../../../../lib/auth';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid report ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const report = await Report.findById(params.id);

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    if (report.status !== 'generated') {
      return NextResponse.json(
        { error: 'Report not ready' },
        { status: 400 }
      );
    }

    // Increment download count
    report.downloads += 1;
    await report.save();

    // Return the report data as JSON (can be converted to PDF/CSV later)
    return NextResponse.json({
      report: {
        id: report._id,
        title: report.title,
        description: report.description,
        type: report.type,
        format: report.format,
        data: report.data,
        generatedAt: report.generatedAt,
        author: report.author
      }
    });

  } catch (error) {
    console.error('Download report error:', error);
    return NextResponse.json(
      { error: 'Failed to download report' },
      { status: 500 }
    );
  }
}