'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Badge } from '../components/ui/badge';
import {
  Send,
  Bot,
  User,
  Paperclip,
  Mic,
  Sparkles,
  Zap,
  Archive,
  Filter,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  department?: string;
  attachments?: string[];
}

export default function ERPChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your ERP AI assistant. I can help with sales data, customer support, task management, and more. How can I assist you today?',
      role: 'assistant',
      timestamp: new Date(),
      department: 'support',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [department, setDepartment] = useState('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  const departments = [
    { value: 'all', label: 'All', color: 'bg-muted' },
    { value: 'sales', label: 'Sales', color: 'bg-blue-500/20 text-blue-700' },
    { value: 'support', label: 'Support', color: 'bg-green-500/20 text-green-700' },
    { value: 'engineering', label: 'Engineering', color: 'bg-purple-500/20 text-purple-700' },
  ];

  const quickActions = [
    { label: 'Generate sales report', icon: Zap, prompt: 'Generate Q3 sales report summary' },
    { label: 'Customer issues', icon: Sparkles, prompt: 'List unresolved customer issues' },
    { label: 'Team tasks', icon: Archive, prompt: 'Show team tasks for this week' },
    { label: 'Data analysis', icon: Filter, prompt: 'Analyze customer satisfaction data' },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
      department: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get auth token from session storage
      const token = sessionStorage.getItem('accessToken');
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      // 🔥 FIX: Handle JSON response instead of stream
      const data = await response.json();
      
      // Get the assistant's response from the JSON
      const assistantContent = data.choices?.[0]?.message?.content || 
                              data.choices?.[0]?.text || 
                              'No response generated';
      
      // Add assistant message to chat
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: assistantContent,
          role: 'assistant',
          timestamp: new Date(),
          department: 'assistant',
        }
      ]);
      
      // Save conversation to database
      await saveConversation();

    } catch (error:any) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          content: error.message || 'Sorry, I encountered an error. Please try again.',
          role: 'assistant',
          timestamp: new Date(),
          department: 'system',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConversation = async () => {
    try {
      const token = sessionStorage.getItem('accessToken');
      await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: messages[messages.length - 1]?.content.substring(0, 50) || 'New Conversation',
          messages: messages,
        }),
      });
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  };

  const filteredMessages = department === 'all' 
    ? messages 
    : messages.filter(m => m.department === department || !m.department);

  return (
    <div className="space-y-6">
      {/* Header with Filters - KEEP EXACTLY AS IS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            AI Assistant
          </h1>
          <p className="text-muted-foreground">Enterprise-grade AI support for your business</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {departments.map((dept) => (
              <Button
                key={dept.value}
                variant={department === dept.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDepartment(dept.value)}
                className={cn(
                  'rounded-full',
                  department === dept.value && dept.color
                )}
              >
                {dept.label}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Quick Actions Panel - KEEP EXACTLY AS IS */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-2 border-dashed border-muted bg-gradient-to-b from-card to-card/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="w-full justify-start h-auto py-3 px-4 rounded-lg hover:bg-primary/5 transition-all"
                  onClick={() => handleQuickAction(action.prompt)}
                >
                  <action.icon className="mr-3 h-4 w-4 text-primary" />
                  <span className="text-left">{action.label}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Stats - KEEP EXACTLY AS IS */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Today's Conversations</span>
                  <span className="font-bold text-lg">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Response Time</span>
                  <span className="font-bold text-lg text-green-600">0.8s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">User Satisfaction</span>
                  <span className="font-bold text-lg text-blue-600">94%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area - KEEP EXACTLY AS IS except the message rendering */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col border-2 shadow-xl">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-primary to-primary/60 rounded-lg">
                    <Sparkles className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>Enterprise AI Assistant</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Powered by Grok • Real-time • Department-aware
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {filteredMessages.length} messages
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-[400px] p-6" ref={scrollRef}>
                <div className="space-y-6">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex gap-3 animate-in fade-in',
                        message.role === 'user' ? 'flex-row-reverse' : ''
                      )}
                    >
                      <div
                        className={cn(
                          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md',
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                            : 'bg-gradient-to-br from-primary to-primary/70'
                        )}
                      >
                        {message.role === 'user' ? (
                          <User className="h-5 w-5 text-white" />
                        ) : (
                          <Bot className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div
                        className={cn(
                          'max-w-[75%] rounded-2xl px-4 py-3 shadow-sm',
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                            : 'bg-gradient-to-r from-muted to-muted/80 rounded-bl-none'
                        )}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div
                          className={cn(
                            'text-xs mt-2 flex items-center gap-2',
                            message.role === 'user'
                              ? 'text-blue-200'
                              : 'text-muted-foreground'
                          )}
                        >
                          <span>
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {message.department && message.department !== 'user' && (
                            <Badge
                              variant="outline"
                              className="text-xs px-1.5 py-0"
                            >
                              {message.department}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="bg-gradient-to-r from-muted to-muted/80 rounded-2xl rounded-bl-none px-4 py-3">
                        <div className="flex gap-2">
                          <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="h-2 w-2 bg-current rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area - KEEP EXACTLY AS IS */}
              <form onSubmit={handleSubmit} className="p-6 border-t">
                <div className="relative">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about sales data, customer issues, team tasks, or any business query..."
                    className="min-h-[100px] pr-24 resize-none rounded-xl border-2 focus:border-primary/50 transition-all"
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 bottom-3 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isLoading || !input.trim()}
                      className="h-9 px-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Enterprise data is encrypted and processed securely. All conversations are logged for compliance.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}