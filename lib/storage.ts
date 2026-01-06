import { Conversation, Message } from '@/types';

const STORAGE_KEYS = {
  CONVERSATIONS: 'grok_conversations',
  SETTINGS: 'grok_settings',
  USER: 'grok_user',
} as const;

export class StorageService {
  // Conversations
  static getConversations(): Conversation[] {
    if (typeof window === 'undefined') return [];
    
    const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return data ? JSON.parse(data) : [];
  }

  static saveConversations(conversations: Conversation[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }

  static addConversation(conversation: Conversation): void {
    const conversations = this.getConversations();
    conversations.unshift(conversation);
    this.saveConversations(conversations);
  }

  static updateConversation(id: string, updates: Partial<Conversation>): void {
    const conversations = this.getConversations();
    const index = conversations.findIndex(c => c.id === id);
    if (index !== -1) {
      conversations[index] = { ...conversations[index], ...updates };
      this.saveConversations(conversations);
    }
  }

  static deleteConversation(id: string): void {
    const conversations = this.getConversations();
    const filtered = conversations.filter(c => c.id !== id);
    this.saveConversations(filtered);
  }

  // Messages
  static getMessages(conversationId: string): Message[] {
    const conversations = this.getConversations();
    const conversation = conversations.find(c => c.id === conversationId);
    return conversation?.messages || [];
  }

  static addMessage(conversationId: string, message: Message): void {
    const conversations = this.getConversations();
    const conversation = conversations.find(c => c.id === conversationId);
    
    if (conversation) {
      conversation.messages.push(message);
      conversation.updatedAt = new Date();
      this.saveConversations(conversations);
    }
  }

  // Settings
  static getSettings() {
    if (typeof window === 'undefined') return {};
    
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {};
  }

  static saveSettings(settings: any): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // Clear all data
  static clearAll(): void {
    if (typeof window === 'undefined') return;
    
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}