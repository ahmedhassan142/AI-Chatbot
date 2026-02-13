// client.ts - Grok Client for OpenRouter API
// Using your API key: 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

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// ==============================================
// OPENROUTER CONFIGURATION - FREE API CREDITS
// ==============================================

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';
const OPENROUTER_API_KEY = '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';

// Available Grok models on OpenRouter (from cheapest to most expensive)
export const GrokModels = {
  GROK_3_MINI: 'x-ai/grok-3-mini-beta',     // CHEAPEST: $0.30/1M tokens - recommended for most tasks
  GROK_3: 'x-ai/grok-3-beta',               // $3.00/1M tokens - best reasoning
  GROK_2_MINI: 'x-ai/grok-2-mini-beta',     // Legacy, slightly cheaper but slower
  GROK_VISION: 'x-ai/grok-vision-beta',     // For image understanding
  GROK_4: 'x-ai/grok-4'                     // Latest model
} as const;

export type GrokModelType = typeof GrokModels[keyof typeof GrokModels];

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  model?: GrokModelType;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  reasoningEffort?: 'high' | 'medium' | 'low';  // For Grok-3-mini
  siteUrl?: string;    // Your site URL for OpenRouter ranking
  siteName?: string;   // Your app name for OpenRouter ranking
}

export class GrokClient {
  private apiKey: string;
  private baseURL: string;
  private defaultModel: GrokModelType;
  private axiosInstance: AxiosInstance;
  private siteUrl?: string;
  private siteName?: string;

  /**
   * Create a new GrokClient for OpenRouter
   * @param apiKey - Your OpenRouter API key (get free at https://openrouter.ai/keys)
   * @param siteUrl - Optional: Your website URL for OpenRouter leaderboard
   * @param siteName - Optional: Your app name for OpenRouter leaderboard
   */
  constructor(
    apiKey: string = OPENROUTER_API_KEY,
    siteUrl?: string,
    siteName?: string
  ) {
    this.apiKey = apiKey;
    this.baseURL = OPENROUTER_API_URL;
    this.defaultModel = GrokModels.GROK_3_MINI; // Most cost-effective
    this.siteUrl = siteUrl;
    this.siteName = siteName;

    // Create axios instance with default config
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 60000, // 60 seconds
      headers: this.getHeaders()
    });
  }

  /**
   * Get headers for OpenRouter API requests
   */
  private getHeaders(streaming: boolean = false): Record<string, string> {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    // Optional headers for OpenRouter leaderboard (helps track your app)
    if (this.siteUrl) {
      headers['HTTP-Referer'] = this.siteUrl;
    }
    if (this.siteName) {
      headers['X-Title'] = this.siteName;
    }

    return headers;
  }

  /**
   * Set the default model for all requests
   */
  setDefaultModel(model: GrokModelType): void {
    this.defaultModel = model;
  }

  /**
   * Send a chat completion request to Grok via OpenRouter
   */
  async chatCompletion(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {}
  ) {
    const {
      model = this.defaultModel,
      temperature = 0.7,
      maxTokens = 1000,
      stream = false,
      reasoningEffort,
      siteUrl,
      siteName
    } = options;

    // Update headers if site info provided in this request
    if (siteUrl || siteName) {
      this.siteUrl = siteUrl || this.siteUrl;
      this.siteName = siteName || this.siteName;
    }

    const requestData: any = {
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream
    };

    // Add reasoning effort for Grok-3-mini models (improves performance)
    if (model.includes('mini') && reasoningEffort) {
      requestData.reasoning = { effort: reasoningEffort };
    }

    try {
      const response = await this.axiosInstance.post(
        '/chat/completions',
        requestData,
        {
          headers: this.getHeaders(stream),
          responseType: stream ? 'stream' : 'json'
        }
      );

      return response.data;
    } catch (error) {
      console.error('OpenRouter API error:', error);
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

    return this.chatCompletion(messages, options);
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
      maxTokens = 1000,
      reasoningEffort
    } = options;

    const requestData: any = {
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: true
    };

    if (model.includes('mini') && reasoningEffort) {
      requestData.reasoning = { effort: reasoningEffort };
    }

    try {
      const response = await this.axiosInstance.post(
        '/chat/completions',
        requestData,
        {
          headers: this.getHeaders(true),
          responseType: 'stream'
        }
      );

      yield* this.processStream(response.data);
    } catch (error) {
      console.error('OpenRouter stream error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Process streaming response from OpenRouter
   */
  private async *processStream(stream: any): AsyncGenerator<string, void, unknown> {
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
            
            // Check for stream end
            if (data === '[DONE]') {
              return;
            }

            try {
              const parsed = JSON.parse(data);
              
              // OpenRouter format
              if (parsed.choices?.[0]?.delta?.content) {
                yield parsed.choices[0].delta.content;
              }
              // Alternative format for some models
              else if (parsed.choices?.[0]?.text) {
                yield parsed.choices[0].text;
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
   * Check account balance and credits remaining
   */
  async checkCredits(): Promise<any> {
    try {
      const response = await this.axiosInstance.get('/auth/key');
      return response.data;
    } catch (error) {
      console.error('Failed to check credits:', error);
      throw this.handleError(error);
    }
  }

  /**
   * List available models (including Grok variants)
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
   * Handle API errors with useful messages
   */
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      
      if (status === 401) {
        return new Error('Invalid OpenRouter API key. Get a free key at https://openrouter.ai/keys');
      }
      if (status === 402) {
        return new Error('Insufficient credits. Your free $5 credits may have expired. Sign up for a new account at https://openrouter.ai');
      }
      if (status === 429) {
        return new Error('Rate limit exceeded. Please try again later.');
      }
      
      return new Error(`OpenRouter API error (${status}): ${JSON.stringify(data)}`);
    }
    
    return error instanceof Error ? error : new Error(String(error));
  }
}

// ==============================================
// SINGLETON EXPORT - Ready to use instantly
// ==============================================

// Create a pre-configured client with your API key
export const grokClient = new GrokClient(
  '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',
  'http://localhost:3000', // Replace with your actual site URL
  'MyGrokApp'              // Replace with your app name
);

// Set to most cost-effective model by default
grokClient.setDefaultModel(GrokModels.GROK_3_MINI);

// ==============================================
// USAGE EXAMPLES (commented out)
// ==============================================

/*
// EXAMPLE 1: Basic chat
async function basicExample() {
  const response = await grokClient.chat(
    'What is the capital of France?',
    'You are a helpful geography assistant.'
  );
  console.log(response.choices[0].message.content);
}

// EXAMPLE 2: Multi-turn conversation
async function conversationExample() {
  const messages = [
    { role: 'system', content: 'You are a helpful coding assistant.' },
    { role: 'user', content: 'Write a React component that displays a counter.' }
  ];
  
  const response = await grokClient.chatCompletion(messages, {
    temperature: 0.3,
    maxTokens: 2000
  });
  
  console.log(response.choices[0].message.content);
}

// EXAMPLE 3: Streaming
async function streamExample() {
  const stream = grokClient.streamChat([
    { role: 'user', content: 'Tell me a short joke.' }
  ]);
  
  for await (const token of stream) {
    process.stdout.write(token);
  }
}

// EXAMPLE 4: Check your free credits
async function checkBalance() {
  const credits = await grokClient.checkCredits();
  console.log('Remaining credits:', credits.credits);
}
*/

export default grokClient;