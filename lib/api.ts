// lib/api.ts
import { ChatMessage } from '@/types';

const API_BASE_URL = '/api';

export async function sendChatMessage(
  messages: ChatMessage[],
  model: string = 'llama-3.3-70b-versatile'
): Promise<{ content: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        model,
        stream: false
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${error}`);
    }

    const data = await response.json();
    return { content: data.message.content };
  } catch (error) {
    console.error('Failed to send message:', error);
    return { 
      content: '', 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

export async function fetchAvailableModels() {
  // You can expand this to fetch models from your API
  return [
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', provider: 'Groq' },
    { id: 'gemma2-9b-it', name: 'Gemma 2 9B', provider: 'Groq' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', provider: 'Groq' },
  ];
}