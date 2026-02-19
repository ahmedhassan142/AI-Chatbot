// app/api/chat/route.ts - UPDATED WITH COOKIE AUTH
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { Conversation } from '../../../lib/models';
import { verifyAccessToken } from '../../../lib/auth';
import { GrokClient, GrokModels } from '../../../lib/grokClient';
import mongoose from 'mongoose';
import { cookies } from 'next/headers';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';
const OPENROUTER_SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const OPENROUTER_SITE_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'ERP AI Assistant';
const GROK_MODEL = process.env.NEXT_PUBLIC_GROK_MODEL || GrokModels.GROK_3_MINI;

export async function POST(request: NextRequest) {
  try {
    const { messages, authType } = await request.json();
    
    // Get authentication info from headers OR cookies
    const authHeader = request.headers.get('authorization');
    
    // Try to get token from cookie
    let token = authHeader?.split(' ')[1];
    
    // If no token in header, try to get from cookie
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value;
    }
    
    const guestId = request.headers.get('x-guest-id');
    
    let userId = null;
    let userRole = 'guest';
    let userDepartment = 'general';
    let isAuthenticatedUser = false;
    
    // Handle authenticated user
    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        if (decoded) {
          userId = decoded.userId;
          userRole = decoded.role || 'user';
          userDepartment = decoded.department || 'general';
          isAuthenticatedUser = true;
          console.log('✅ Authenticated request for user:', userId);
        }
      } catch (error) {
        console.log('❌ Invalid token, treating as guest');
        // Token invalid - continue as guest
      }
    }
    
    // Handle guest user
    if (!isAuthenticatedUser && guestId) {
      userId = guestId;
      userRole = 'guest';
      console.log('👤 Guest request with ID:', guestId);
    }
    
    // If no user ID at all, create one
    if (!userId) {
      userId = 'temp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
      console.log('🆕 Temporary session created:', userId);
    }

    await connectDB();
    
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    const grokClient = new GrokClient(
      OPENROUTER_API_KEY,
      OPENROUTER_SITE_URL,
      OPENROUTER_SITE_NAME
    );

    const systemMessage = {
      role: 'system' as const,
      content: `You are an ERP AI assistant for a business enterprise. 
      
User Context:
- User ID: ${userId}
- User Role: ${userRole}
- Department: ${userDepartment}
- Auth Type: ${isAuthenticatedUser ? 'Authenticated' : 'Guest'}

You help with:
• Sales Analytics: Revenue trends, forecasting, pipeline analysis
• Customer Support: Ticket resolution, escalation paths, SLA tracking
• Task Management: Prioritization, deadlines, resource allocation
• Business Intelligence: KPI monitoring, anomaly detection, insights

Be concise, professional, and provide actionable insights.`
    };

    const allMessages = [systemMessage, ...messages];
    
    const response = await grokClient.chatCompletion(allMessages, {
      //@ts-ignore
      model: GROK_MODEL,
      stream: false,
      temperature: 0.7,
      maxTokens: 2000,
      reasoningEffort: 'medium'
    });

    // Only save conversation for authenticated users with valid ObjectId
    if (isAuthenticatedUser && messages.length > 0) {
      try {
        // Validate that userId is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(userId)) {
          const lastMessage = messages[messages.length - 1];
          const title = lastMessage?.content?.substring(0, 50) || 'ERP Conversation';
          
          await Conversation.create({
            userId: new mongoose.Types.ObjectId(userId), // Convert to ObjectId
            title,
            messages: allMessages.map((m: any) => ({
              content: m.content,
              role: m.role,
              timestamp: new Date(),
            })),
            department: userDepartment,
            tags: ['erp', 'business', userDepartment],
            model: GROK_MODEL
          }).catch(err => console.error('Failed to save conversation:', err));
          
          console.log('✅ Conversation saved for authenticated user');
        } else {
          console.log('⚠️ Invalid userId format, skipping conversation save:', userId);
        }
      } catch (dbError) {
        console.error('DB save error:', dbError);
        // Don't fail the request if DB save fails
      }
    } else {
      console.log('👤 Guest user - skipping conversation save');
    }

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}