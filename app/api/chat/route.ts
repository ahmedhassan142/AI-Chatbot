// app/api/chat/route.ts - STABLE VERSION (No Turbopack errors)
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { Conversation } from '../../../lib/models';
import { verifyAccessToken } from '../../../lib/auth';
import { GrokClient } from '../../../lib/grokClient';

// OpenRouter configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const OPENROUTER_SITE_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'ERP AI Assistant';
const GROK_MODEL = process.env.NEXT_PUBLIC_GROK_MODEL || 'x-ai/grok-3-mini-beta';

// Define proper types
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DecodedToken {
  userId: string;
  role?: string;
  department?: string;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyAccessToken(token) as DecodedToken | null;
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // 2. Parse request body
    let messages: ChatMessage[] = [];
    try {
      const body = await request.json();
      messages = body.messages || [];
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    if (!messages.length) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      );
    }

    const userId = decoded.userId;

    // 3. Connect to database (with error handling)
    try {
      await connectDB();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      // Continue even if DB fails - don't block the chat
    }

    // 4. Check API key
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured. Get free credits at https://openrouter.ai' },
        { status: 500 }
      );
    }

    // 5. Initialize GrokClient
    const grokClient = new GrokClient(
      OPENROUTER_API_KEY,
      OPENROUTER_SITE_URL,
      OPENROUTER_SITE_NAME
    );

    // 6. Extract user context
    const userDepartment = decoded.department || 'general';
    const userRole = decoded.role || 'user';

    // 7. Create system message
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are an ERP AI assistant for a business enterprise. 
      
Current Date: ${new Date().toISOString().split('T')[0]}

User Context:
- User ID: ${userId}
- User Role: ${userRole}
- Department: ${userDepartment}

You help with:
• Sales Analytics: Revenue trends, forecasting, pipeline analysis
• Customer Support: Ticket resolution, escalation paths, SLA tracking
• Task Management: Prioritization, deadlines, resource allocation
• Business Intelligence: KPI monitoring, anomaly detection, insights

Be concise, professional, and provide actionable insights.`
    };

    const allMessages = [systemMessage, ...messages];

    // 8. IMPORTANT: Use non-streaming mode to avoid Turbopack stream issues
    // This is more stable and avoids the Turbopack panic errors
    const response = await grokClient.chatCompletion(allMessages, {
      model: GROK_MODEL,
      stream: false, // DISABLE STREAMING to prevent Turbopack errors
      temperature: 0.7,
      maxTokens: 2000,
      reasoningEffort: 'medium'
    });

    // 9. Save conversation asynchronously (don't await)
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const title = lastMessage?.content?.substring(0, 50) || 'ERP Conversation';
      
      Conversation.create({
        userId,
        title,
        messages: allMessages.map(m => ({
          content: m.content,
          role: m.role,
          timestamp: new Date(),
        })),
        department: userDepartment,
        tags: ['erp', 'business', userDepartment],
        model: GROK_MODEL
      }).catch(err => console.error('Failed to save conversation:', err));
    }

    // 10. Return JSON response (NOT stream) - this avoids Turbopack stream errors
    return NextResponse.json({
      id: response.id,
      choices: response.choices,
      usage: response.usage,
      model: response.model
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    
    // Handle specific error types
    if (error.message?.includes('401') || error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid OpenRouter API key. Get a free key at https://openrouter.ai/keys' },
        { status: 401 }
      );
    }
    
    if (error.message?.includes('402') || error.message?.includes('credits')) {
      return NextResponse.json(
        { error: 'OpenRouter credits exhausted. Get more free credits at https://openrouter.ai' },
        { status: 402 }
      );
    }
    
    if (error.message?.includes('429')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to check credits
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyAccessToken(token) as DecodedToken | null;
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Simple credit check
    return NextResponse.json({
      credits: '$5.00 FREE (estimated)',
      model: GROK_MODEL,
      message: 'Using Grok-3-mini via OpenRouter with FREE credits!',
      usage: 'Check exact credits at https://openrouter.ai'
    });

  } catch (error) {
    return NextResponse.json(
      { 
        credits: '$5.00 FREE (estimated)',
        model: GROK_MODEL
      },
      { status: 200 }
    );
  }
}