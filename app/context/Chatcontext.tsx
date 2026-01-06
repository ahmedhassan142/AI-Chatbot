// app/contexts/ChatContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChatMessage, ChatSession } from '@/types';
import { sendChatMessage } from '@/lib/api';

interface ChatContextType {
  messages: ChatMessage[];
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  isGenerating: boolean;
  addMessage: (content: string, role: ChatMessage['role']) => Promise<void>;
  createNewSession: () => void;
  selectSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'First Conversation',
      messages: [
        {
          id: '1',
          role: 'assistant',
          content: 'Hello! I\'m your AI assistant. How can I help you today?',
          timestamp: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const addMessage = async (content: string, role: ChatMessage['role'] = 'user') => {
    if (!activeSession) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    };

    // Update session with new message
    const updatedSession: ChatSession = {
      ...activeSession,
      messages: [...activeSession.messages, newMessage],
      updatedAt: new Date()
    };

    setActiveSession(updatedSession);
    setSessions(prev => 
      prev.map(s => s.id === updatedSession.id ? updatedSession : s)
    );

    // If user message, get AI response
    if (role === 'user') {
      setIsGenerating(true);
      try {
        const response = await sendChatMessage([...updatedSession.messages]);
        
        if (response.error) {
          throw new Error(response.error);
        }

        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.content,
          timestamp: new Date()
        };

        const finalSession: ChatSession = {
          ...updatedSession,
          messages: [...updatedSession.messages, aiMessage],
          updatedAt: new Date()
        };

        setActiveSession(finalSession);
        setSessions(prev => 
          prev.map(s => s.id === finalSession.id ? finalSession : s)
        );
      } catch (error) {
        console.error('Error getting AI response:', error);
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date()
        };
        
        const errorSession: ChatSession = {
          ...updatedSession,
          messages: [...updatedSession.messages, errorMessage],
          updatedAt: new Date()
        };
        
        setActiveSession(errorSession);
        setSessions(prev => 
          prev.map(s => s.id === errorSession.id ? errorSession : s)
        );
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `Conversation ${sessions.length + 1}`,
      messages: [
        {
          id: '1',
          role: 'assistant',
          content: 'Hello! I\'m your AI assistant. How can I help you today?',
          timestamp: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setSessions(prev => [newSession, ...prev]);
    setActiveSession(newSession);
  };

  const selectSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSession(session);
    }
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSession?.id === sessionId) {
      setActiveSession(sessions.length > 1 ? sessions.find(s => s.id !== sessionId) || null : null);
    }
  };

  // Set first session as active on initial load
  React.useEffect(() => {
    if (sessions.length > 0 && !activeSession) {
      setActiveSession(sessions[0]);
    }
  }, [sessions, activeSession]);

  return (
    <ChatContext.Provider value={{
      messages: activeSession?.messages || [],
      sessions,
      activeSession,
      isGenerating,
      addMessage,
      createNewSession,
      selectSession,
      deleteSession
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}