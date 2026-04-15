// app/api/chat/route.ts - UPDATED WITH COOKIE AUTH & GROQ LLAMA MODELS
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { Conversation } from '../../../lib/models';
import { verifyAccessToken } from '../../../lib/auth';
import { GroqClient, GroqModels } from '../../../lib/grokClient';
import mongoose from 'mongoose';
import { cookies } from 'next/headers';

// ==============================================
// GROQ CONFIGURATION - READ FROM ENVIRONMENT VARIABLES
// ==============================================
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || GroqModels.LLAMA_3_1_8B; // Fastest 8B model
// const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
// const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'ERP AI Assistant';

export async function POST(request: NextRequest) {
  try {
    const { messages, authType } = await request.json();
    
    // Validate API key
    if (!GROQ_API_KEY) {
      console.error('❌ GROQ_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'API key not configured. Please add GROQ_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }
    
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

    // Connect to database
    await connectDB();
    
    // Initialize Groq Client (no hardcoded keys!)
    const groqClient = new GroqClient(GROQ_API_KEY);

    // Get model info for context
    //@ts-ignore
    const modelInfo = groqClient.getModelInfo(GROQ_MODEL);
    
    // Enhanced system message with model context
    const systemMessage = {
      role: 'system' as const,
      content: `You are an ERP AI assistant for a business enterprise running on ${GROQ_MODEL} (${modelInfo.description}).

Current Context:
- Model: ${GROQ_MODEL} (Context Window: ${modelInfo.contextWindow} tokens)
- User ID: ${userId}
- User Role: ${userRole}
- Department: ${userDepartment}
- Auth Type: ${isAuthenticatedUser ? 'Authenticated' : 'Guest'}

Your capabilities:
• Sales Analytics: Revenue trends, forecasting, pipeline analysis
• Customer Support: Ticket resolution, escalation paths, SLA tracking
• Task Management: Prioritization, deadlines, resource allocation
• Business Intelligence: KPI monitoring, anomaly detection, insights
• Code Generation: SQL queries, API endpoints, data processing scripts
• Documentation: Technical writing, user guides, API documentation

Response Guidelines:
- Be concise and professional
- Provide actionable insights with specific steps
- Use markdown formatting for code blocks and lists
- Include relevant metrics and data points when available
- If you don't know something, say so clearly
- For complex tasks, break down into smaller steps

Remember: You're helping a business user make data-driven decisions.`
    };

    const allMessages = [systemMessage, ...messages];
    
    // Log request info (without exposing sensitive data)
    console.log(`🤖 Processing request with ${GROQ_MODEL} for ${userRole} user`);
    
    // Make API call to Groq
    const response = await groqClient.chatCompletion(allMessages, {
      //@ts-ignore
      model: GROQ_MODEL,
      stream: false,
      temperature: 0.7,
      maxTokens: 2000,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0
    });

    // Extract the response content
    const assistantMessage = response.choices[0]?.message?.content || '';
    
    // Save conversation for authenticated users with valid ObjectId
    if (isAuthenticatedUser && messages.length > 0) {
      try {
        // Validate that userId is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(userId)) {
          const lastMessage = messages[messages.length - 1];
          const title = lastMessage?.content?.substring(0, 50) || 'ERP Conversation';
          
          // Create conversation record
          const conversation = await Conversation.create({
            userId: new mongoose.Types.ObjectId(userId),
            title,
            messages: allMessages.map((m: any) => ({
              content: m.content,
              role: m.role,
              timestamp: new Date(),
            })),
            department: userDepartment,
            tags: ['erp', 'business', userDepartment, 'groq', GROQ_MODEL],
            model: GROQ_MODEL,
            provider: 'groq',
            tokens: response.usage?.total_tokens || 0
          });
          
          console.log('✅ Conversation saved for authenticated user:', conversation._id);
        } else {
          console.log('⚠️ Invalid userId format, skipping conversation save:', userId);
        }
      } catch (dbError) {
        console.error('❌ DB save error:', dbError);
        // Don't fail the request if DB save fails
      }
    } else {
      console.log('👤 Guest user - skipping conversation save');
    }

    // Return response in OpenRouter-compatible format for frontend compatibility
    return NextResponse.json({
      ...response,
      // Add metadata about the model used
      model_used: GROQ_MODEL,
      provider: 'groq',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Chat API error:', error);
    
    // Provide more detailed error messages
    let errorMessage = 'Failed to process request';
    let statusCode = 500;
    
    if (error.message?.includes('GROQ_API_KEY')) {
      errorMessage = 'API key not configured. Please check your environment variables.';
      statusCode = 500;
    } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      errorMessage = 'Invalid API key. Please check your GROQ_API_KEY.';
      statusCode = 401;
    } else if (error.message?.includes('429')) {
      errorMessage = 'Rate limit exceeded. Groq free tier: 30 requests per minute. Please try again later.';
      statusCode = 429;
    } else if (error.message?.includes('503')) {
      errorMessage = 'Groq service is busy. Please retry in a few seconds.';
      statusCode = 503;
    } else {
      errorMessage = error.message || 'Failed to process request';
    }
    
    return NextResponse.json(
      { error: errorMessage, details: process.env.NODE_ENV === 'development' ? error.stack : undefined },
      { status: statusCode }
    );
  }
}

// Optional: Add GET endpoint for conversation history
export async function GET(request: NextRequest) {
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
    if (!decoded || !mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return NextResponse.json(
        { error: 'Invalid authentication' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const conversations = await Conversation.find({ 
      userId: new mongoose.Types.ObjectId(decoded.userId) 
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .select('title createdAt department model provider');
    
    return NextResponse.json({ conversations });
    
  } catch (error: any) {
    console.error('❌ GET conversations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}