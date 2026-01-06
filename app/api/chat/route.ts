// app/api/chat/route.ts (Updated with authentication)
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Conversation } from '@/lib/models';
import { verifyAccessToken } from '@/lib/auth';
import { GrokClient } from '@/lib/grokClient';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
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
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { messages } = await request.json();
    const userId = decoded.userId;

    await connectDB();
    
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return new Response('API key not configured', { status: 500 });
    }

    const grokClient = new GrokClient(apiKey);
    
    // Add ERP context to system message
    const systemMessage = {
      role: 'system' as const,
      content: `You are an ERP AI assistant for a business enterprise. 
      You help with sales data analysis, customer support, task management, 
      and business intelligence. Be professional, concise, and data-driven.
      
      User Context:
      - User ID: ${userId}
      - User Role: ${decoded.role}
      
      - Department: ${decoded.department || 'General'}
      
      Always consider business implications and provide actionable insights.
      When analyzing data, suggest next steps and potential optimizations.
      For customer issues, provide resolution paths and escalation options.`
    };

    const allMessages = [systemMessage, ...messages];
    
    // Stream response from Grok
    const stream = await grokClient.chatCompletion(allMessages, true, 0.7, 1500);
    
    // Save conversation to database
    if (messages.length > 0) {
      const conversation = new Conversation({
        userId,
        title: messages[messages.length - 1]?.content.substring(0, 50) || 'ERP Conversation',
        messages: allMessages.map(m => ({
          content: m.content,
          role: m.role,
          timestamp: new Date(),
        })),
        department: decoded.department,
        tags: ['erp', 'business', decoded.department || 'general'],
      });
      
      await conversation.save();
    }

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}