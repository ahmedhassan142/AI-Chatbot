// app/dashboard/chat/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { ScrollArea } from '../../../components/ui/scroll-area';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Users,
  Hash,
  Image as ImageIcon,
  File,
  Mic,
  Check,
  CheckCheck,
  Clock,
  Loader2,
  MessageSquare,
  Trash2,
  Archive,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../context/Authcontext';
// import { toast } from '../../../components/ui/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
  department?: string;
}

interface Conversation {
  _id: string;
  title: string;
  messages: Message[];
  department: string;
  tags: string[];
  isArchived: boolean;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function ChatPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/conversations', {
        credentials: 'include',
      });

      const data = await response.json();
      setConversations(data.conversations || []);
      
      if (data.conversations?.length > 0) {
        setSelectedConversation(data.conversations[0]);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      // toast({
      //   title: 'Error',
      //   description: 'Failed to load conversations',
      //   variant: 'destructive',
      // });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConversation || sending) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...selectedConversation.messages, newMessage];
    
    // Optimistic update
    setSelectedConversation({
      ...selectedConversation,
      messages: updatedMessages,
    });
    setMessage('');
    setSending(true);

    try {
      // Get AI response
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          authType: 'authenticated',
        }),
      });

      if (!chatResponse.ok) {
        throw new Error('Failed to get response');
      }

      const chatData = await chatResponse.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: chatData.choices?.[0]?.message?.content || 'No response',
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };

      // Update conversation with assistant's response
      const finalMessages = [...updatedMessages, assistantMessage];
      
      setSelectedConversation({
        ...selectedConversation,
        messages: finalMessages,
      });

      // Save to database
      await fetch(`/api/conversations/${selectedConversation._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          messages: finalMessages,
        }),
      });

      // Refresh conversations list
      fetchConversations();

    } catch (error) {
      console.error('Failed to send message:', error);
      // toast({
      //   title: 'Error',
      //   description: 'Failed to send message',
      //   variant: 'destructive',
      // });
      
      // Revert optimistic update
      setSelectedConversation({
        ...selectedConversation,
        messages: selectedConversation.messages.slice(0, -1),
      });
    } finally {
      setSending(false);
    }
  };

  const handleNewConversation = async () => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: 'New Conversation',
          messages: [],
          //@ts-ignore
          department: user?.department || 'general',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create conversation');
      }

      const data = await response.json();
      setConversations([data.conversation, ...conversations]);
      setSelectedConversation(data.conversation);
    } catch (error) {
      // toast({
      //   title: 'Error',
      //   description: 'Failed to create conversation',
      //   variant: 'destructive',
      // });
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete conversation');
      }

      setConversations(conversations.filter(c => c._id !== conversationId));
      if (selectedConversation?._id === conversationId) {
        setSelectedConversation(conversations[0] || null);
      }

      // toast({
      //   title: 'Success',
      //   description: 'Conversation deleted',
      // });
    } catch (error) {
      // toast({
      //   title: 'Error',
      //   description: 'Failed to delete conversation',
      //   variant: 'destructive',
      // });
    }
  };

  const handleArchiveConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isArchived: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to archive conversation');
      }

      setConversations(conversations.filter(c => c._id !== conversationId));
      if (selectedConversation?._id === conversationId) {
        setSelectedConversation(conversations[0] || null);
      }

      // toast({
      //   title: 'Success',
      //   description: 'Conversation archived',
      // });
    } catch (error) {
    //   toast({
    //     title: 'Error',
    //     description: 'Failed to archive conversation',
    //     variant: 'destructive',
    //   });
     }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'unread' ? false : // Implement unread logic if needed
       activeTab === 'archived' ? conv.isArchived : !conv.isArchived);
    return matchesSearch && matchesTab;
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getStatusIcon = (role: string) => {
    if (role === 'assistant') {
      return <CheckCheck className="h-3 w-3" />;
    }
    return <Check className="h-3 w-3" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chat History</h1>
          <p className="text-muted-foreground">
            View and continue your AI conversations
          </p>
        </div>
        <Button onClick={handleNewConversation} className="gap-2">
          <MessageSquare className="h-4 w-4" />
          New Conversation
        </Button>
      </div>

      <div className="flex-1 flex border rounded-lg overflow-hidden bg-card">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-80 border-r">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-3 p-4 pt-0">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="flex-1 m-0">
              <ScrollArea className="h-full">
                <div className="p-2">
                  {filteredConversations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No conversations found</p>
                    </div>
                  ) : (
                    filteredConversations.map(conv => (
                      <div
                        key={conv._id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                          selectedConversation?._id === conv._id ? 'bg-muted' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedConversation(conv)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>
                              {conv.title.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{conv.title}</p>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(conv.lastMessageAt || conv.updatedAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.messages[conv.messages.length - 1]?.content || 'No messages'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {conv.department}
                              </Badge>
                              {conv.tags?.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            {!conv.isArchived && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleArchiveConversation(conv._id);
                                }}
                              >
                                <Archive className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-600 hover:text-red-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteConversation(conv._id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {selectedConversation.title.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedConversation.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {selectedConversation.department}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {selectedConversation.messages.length} messages
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedConversation.messages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback>
                          {msg.role === 'user' ? 'U' : 'AI'}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`rounded-lg px-4 py-2 ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <div className={`flex items-center gap-1 mt-1 text-xs ${
                          msg.role === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground'
                        }`}>
                          <span>{formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}</span>
                          <span className="ml-2">
                            {getStatusIcon(msg.role)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex justify-start">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <div className="flex gap-1">
                          <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="h-2 w-2 bg-current rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                    className="w-full min-h-[40px] max-h-[200px] px-3 py-2 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={1}
                    disabled={sending}
                  />
                </div>
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!message.trim() || sending}
                  className="h-10 px-3"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No conversation selected</h3>
              <p className="text-muted-foreground mt-2">
                Select a conversation from the sidebar or start a new one
              </p>
              <Button onClick={handleNewConversation} className="mt-4">
                New Conversation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}