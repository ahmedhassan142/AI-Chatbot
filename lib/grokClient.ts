import axios from 'axios';

const GROK_API_URL = process.env.GROK_API_URL || 'https://api.x.ai/v1';
const GROK_MODEL = process.env.NEXT_PUBLIC_GROK_MODEL || 'grok-2-mini';

export class GrokClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chatCompletion(
    messages: Array<{ role: string; content: string }>,
    stream = false,
    temperature = 0.7,
    maxTokens = 1000
  ) {
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    const data = {
      model: GROK_MODEL,
      messages,
      stream,
      temperature,
      max_tokens: maxTokens,
    };

    try {
      const response = await axios.post(
        `${GROK_API_URL}/chat/completions`,
        data,
        { headers, responseType: stream ? 'stream' : 'json' }
      );
      
      return response.data;
    } catch (error) {
      console.error('Grok API error:', error);
      throw error;
    }
  }

  // Stream processing utility
  async* processStream(stream: any) {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.choices?.[0]?.delta?.content) {
                yield parsed.choices[0].delta.content;
              }
            } catch (e) {
              // Ignore parsing errors for incomplete JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}