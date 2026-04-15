// client.ts - Groq Client with Llama 7B Model
// Uses GROQ_API_KEY from environment variables (NEVER hardcode)

import axios, { AxiosInstance } from 'axios';

// ==============================================
// GROQ API CONFIGURATION - READ FROM ENV VARIABLES
// ==============================================

const GROQ_API_URL = 'https://api.groq.com/openai/v1';
// ⚠️ CRITICAL: Never hardcode API keys - always use environment variables
const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY || '';

// Available Llama models on Groq (with performance specs)
export const GroqModels = {
  // LLAMA 7B MODELS (Best for most tasks)
  LLAMA_3_70B: 'llama3-70b-8192',           // Most powerful - 70B params
  LLAMA_3_8B: 'llama3-8b-8192',             // Fast & efficient - 8B params
  LLAMA_2_70B: 'llama2-70b-4096',           // Legacy 70B model
  LLAMA_3_1_70B: 'llama-3.1-70b-versatile', // Latest Llama 3.1 70B
  LLAMA_3_1_8B: 'llama-3.1-8b-instant',     // Latest Llama 3.1 8B (FASTEST)
  
  // MIXTRAL MODELS (Alternative)
  MIXTRAL_8X7B: 'mixtral-8x7b-32768',       // MoE model, good for complex tasks
  
  // GEMMA MODELS (Lightweight)
  GEMMA_2_9B: 'gemma2-9b-it',               // Google's 9B model
  
  // SPECIALIZED MODELS
  LLAMA_GUARD: 'llama-guard-3-8b',          // Safety/Moderation model
} as const;

export type GroqModelType = typeof GroqModels[keyof typeof GroqModels];

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  model?: GroqModelType;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stream?: boolean;
  stop?: string | string[];
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export class GroqClient {
  private apiKey: string;
  private baseURL: string;
  private defaultModel: GroqModelType;
  private axiosInstance: AxiosInstance;

  /**
   * Create a new GroqClient for Llama models
   * @param apiKey - Your Groq API key from https://console.groq.com/keys
   */
  constructor(apiKey?: string) {
    this.apiKey = apiKey || GROQ_API_KEY;
    
    if (!this.apiKey) {
      throw new Error(
        'GROQ_API_KEY is not set. Please add it to your environment variables.\n' +
        'Get your free API key at: https://console.groq.com/keys'
      );
    }
    
    this.baseURL = GROQ_API_URL;
    this.defaultModel = GroqModels.LLAMA_3_1_8B; // Fastest 8B model by default

    // Create axios instance with default config
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 60000, // 60 seconds
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      }
    });
  }

  /**
   * Set the default model for all requests
   */
  setDefaultModel(model: GroqModelType): void {
    this.defaultModel = model;
  }

  /**
   * Get current default model
   */
  getDefaultModel(): GroqModelType {
    return this.defaultModel;
  }

  /**
   * Send a chat completion request to Groq (Llama models)
   */
  async chatCompletion(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {}
  ) {
    const {
      model = this.defaultModel,
      temperature = 0.7,
      maxTokens = 1024,
      topP = 1,
      stream = false,
      stop,
      frequencyPenalty = 0,
      presencePenalty = 0
    } = options;

    const requestData: any = {
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      top_p: topP,
      stream,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty
    };

    // Add stop sequences if provided
    if (stop) {
      requestData.stop = stop;
    }

    try {
      const response = await this.axiosInstance.post(
        '/chat/completions',
        requestData,
        {
          responseType: stream ? 'stream' : 'json'
        }
      );

      return response.data;
    } catch (error) {
      console.error('Groq API error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Simple one-message chat (convenience method)
   */
  async chat(
    prompt: string,
    systemPrompt?: string,
    options: ChatCompletionOptions = {}
  ) {
    const messages: ChatMessage[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: prompt });

    const response = await this.chatCompletion(messages, options);
    return response.choices[0]?.message?.content || '';
  }

  /**
   * Stream chat completion with token-by-token yield
   */
  async *streamChat(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {}
  ): AsyncGenerator<string, void, unknown> {
    const {
      model = this.defaultModel,
      temperature = 0.7,
      maxTokens = 1024,
      topP = 1,
      frequencyPenalty = 0,
      presencePenalty = 0
    } = options;

    const requestData: any = {
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      top_p: topP,
      stream: true,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty
    };

    try {
      const response = await this.axiosInstance.post(
        '/chat/completions',
        requestData,
        {
          responseType: 'stream'
        }
      );

      yield* this.processStream(response.data);
    } catch (error) {
      console.error('Groq stream error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Process streaming response from Groq
   */
  private async *processStream(stream: any): AsyncGenerator<string, void, unknown> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();

    try {
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last partial line in buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            // Check for stream end
            if (data === '[DONE]') {
              return;
            }

            try {
              const parsed = JSON.parse(data);
              
              if (parsed.choices?.[0]?.delta?.content) {
                yield parsed.choices[0].delta.content;
              }
            } catch (e) {
              // Skip incomplete JSON chunks
              continue;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Get available models from Groq
   */
  async listModels(): Promise<any> {
    try {
      const response = await this.axiosInstance.get('/models');
      return response.data;
    } catch (error) {
      console.error('Failed to list models:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Check if API key is valid
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.listModels();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get model information and context window size
   */
  getModelInfo(model: GroqModelType): { contextWindow: number; description: string } {
    const modelInfo = {
      [GroqModels.LLAMA_3_70B]: { contextWindow: 8192, description: 'Most powerful Llama 3 70B model' },
      [GroqModels.LLAMA_3_8B]: { contextWindow: 8192, description: 'Fast and efficient Llama 3 8B model' },
      [GroqModels.LLAMA_2_70B]: { contextWindow: 4096, description: 'Legacy Llama 2 70B model' },
      [GroqModels.LLAMA_3_1_70B]: { contextWindow: 8192, description: 'Latest Llama 3.1 70B - Versatile' },
      [GroqModels.LLAMA_3_1_8B]: { contextWindow: 8192, description: 'Fastest Llama 3.1 8B - Instant responses' },
      [GroqModels.MIXTRAL_8X7B]: { contextWindow: 32768, description: 'Mixtral MoE - Large context window' },
      [GroqModels.GEMMA_2_9B]: { contextWindow: 8192, description: 'Google Gemma 2 9B - Lightweight' },
      [GroqModels.LLAMA_GUARD]: { contextWindow: 8192, description: 'Llama Guard 3 - Content moderation' },
    };
    
    return modelInfo[model] || { contextWindow: 4096, description: 'Unknown model' };
  }

  /**
   * Handle API errors with useful messages
   */
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      
      if (status === 401) {
        return new Error(
          'Invalid Groq API key. Get your free key at: https://console.groq.com/keys\n' +
          'Then add GROQ_API_KEY to your environment variables.'
        );
      }
      if (status === 429) {
        return new Error('Rate limit exceeded. Groq free tier: 30 requests per minute. Please try again later.');
      }
      if (status === 503) {
        return new Error('Groq service is busy. Models may be loading. Please retry in a few seconds.');
      }
      
      return new Error(`Groq API error (${status}): ${JSON.stringify(data)}`);
    }
    
    return error instanceof Error ? error : new Error(String(error));
  }
}

// ==============================================
// SINGLETON EXPORT - Uses environment variables
// ==============================================

// Create a configured client (reads API key from process.env)
let groqClientInstance: GroqClient | null = null;

export function getGroqClient(): GroqClient {
  if (!groqClientInstance) {
    groqClientInstance = new GroqClient();
  }
  return groqClientInstance;
}

// Export singleton for easy use
export const groqClient = getGroqClient();

// ==============================================
// USAGE EXAMPLES
// ==============================================

/*
// EXAMPLE 1: Basic chat with Llama 7B (actually 8B model)
async function basicExample() {
  const client = getGroqClient();
  const response = await client.chat(
    'What is the capital of France?',
    'You are a helpful assistant.'
  );
  console.log(response);
}

// EXAMPLE 2: Use specific Llama model
async function modelExample() {
  const client = getGroqClient();
  const response = await client.chat(
    'Explain quantum computing simply',
    'You are a physics teacher',
    { model: GroqModels.LLAMA_3_70B } // Use 70B for complex tasks
  );
  console.log(response);
}

// EXAMPLE 3: Multi-turn conversation
async function conversationExample() {
  const client = getGroqClient();
  const messages = [
    { role: 'system', content: 'You are a helpful coding assistant.' },
    { role: 'user', content: 'Write a React component for a counter.' },
    { role: 'assistant', content: 'Here is a counter component...' },
    { role: 'user', content: 'Add a reset button to it.' }
  ];
  
  const response = await client.chatCompletion(messages, {
    temperature: 0.3,
    maxTokens: 2000
  });
  
  console.log(response.choices[0].message.content);
}

// EXAMPLE 4: Streaming
async function streamExample() {
  const client = getGroqClient();
  const stream = client.streamChat([
    { role: 'user', content: 'Tell me a short story about AI.' }
  ]);
  
  for await (const token of stream) {
    process.stdout.write(token);
  }
}

// EXAMPLE 5: Check available models
async function listAvailableModels() {
  const client = getGroqClient();
  const models = await client.listModels();
  console.log('Available models:', models.data.map((m: any) => m.id));
}
*/

export default groqClient;