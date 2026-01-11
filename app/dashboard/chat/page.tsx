// app/dashboard/chat/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Pin,
  AtSign,
  Image as ImageIcon,
  File,
  Mic,
  Check,
  CheckCheck,
  Clock,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
}

interface Conversation {
  id: string;
  name: string;
  type: 'direct' | 'group';
  participants: User[];
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  avatar?: string;
  online: boolean;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  online: boolean;
}

export default function ChatPage() {
  const [currentConversation, setCurrentConversation] = useState<string>('1');
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Engineering Team',
      type: 'group',
      participants: [
        { id: '1', name: 'John Doe', role: 'Lead Developer', online: true },
        { id: '2', name: 'Jane Smith', role: 'Frontend Dev', online: true },
        { id: '3', name: 'Bob Johnson', role: 'Backend Dev', online: false },
      ],
      lastMessage: 'Let me check the API documentation',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
      unreadCount: 3,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Engineering',
      online: true,
    },
    {
      id: '2',
      name: 'Alex Johnson',
      type: 'direct',
      participants: [
        { id: '4', name: 'Alex Johnson', role: 'Project Manager', online: true },
      ],
      lastMessage: 'Can we schedule a meeting tomorrow?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
      unreadCount: 0,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      online: true,
    },
    {
      id: '3',
      name: 'Design Team',
      type: 'group',
      participants: [
        { id: '5', name: 'Sarah Miller', role: 'UI Designer', online: true },
        { id: '6', name: 'Mike Wilson', role: 'UX Designer', online: false },
      ],
      lastMessage: 'The new mockups are ready for review',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
      unreadCount: 5,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Design',
      online: true,
    },
    {
      id: '4',
      name: 'Marketing Team',
      type: 'group',
      participants: [
        { id: '7', name: 'Lisa Brown', role: 'Marketing Head', online: false },
        { id: '8', name: 'Tom Davis', role: 'Content Writer', online: true },
      ],
      lastMessage: 'Campaign performance report attached',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
      unreadCount: 0,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marketing',
      online: false,
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey team! How is the progress on the new feature?',
      senderId: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      status: 'read',
      type: 'text',
    },
    {
      id: '2',
      text: 'Going well! I have completed the UI components.',
      senderId: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      status: 'read',
      type: 'text',
    },
    {
      id: '3',
      text: 'I\'m working on the backend API integration.',
      senderId: '3',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: 'read',
      type: 'text',
    },
    {
      id: '4',
      text: 'Great! Let me check the API documentation.',
      senderId: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: 'delivered',
      type: 'text',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        senderId: 'current-user',
        timestamp: new Date(),
        status: 'sent',
        type: 'text',
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const currentConv = conversations.find(c => c.id === currentConversation);

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chat</h1>
          <p className="text-muted-foreground">
            Communicate with your team in real-time
          </p>
        </div>
        <Button className="gap-2">
          <Users className="h-4 w-4" />
          New Group
        </Button>
      </div>

      <div className="flex-1 flex border rounded-lg overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-80 border-r">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-3 p-4 pt-0">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="flex-1 m-0">
              <ScrollArea className="h-full">
                <div className="p-2">
                  {conversations.map(conv => (
                    <div
                      key={conv.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${currentConversation === conv.id ? 'bg-muted' : 'hover:bg-muted/50'}`}
                      onClick={() => setCurrentConversation(conv.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={conv.avatar} />
                            <AvatarFallback>
                              {conv.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {conv.online && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{conv.name}</p>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(conv.lastMessageTime, { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conv.lastMessage}
                          </p>
                          {conv.type === 'group' && (
                            <div className="flex items-center gap-1 mt-1">
                              <Hash className="h-3 w-3" />
                              <span className="text-xs text-muted-foreground">
                                {conv.participants.length} members
                              </span>
                            </div>
                          )}
                        </div>
                        {conv.unreadCount > 0 && (
                          <Badge className="ml-2">{conv.unreadCount}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={currentConv?.avatar} />
                <AvatarFallback>
                  {currentConv?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{currentConv?.name}</h3>
                <div className="flex items-center gap-2">
                  {currentConv?.type === 'group' ? (
                    <>
                      <Badge variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {currentConv.participants.length} members
                      </Badge>
                      {currentConv.online && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          Online
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {currentConv?.participants[0]?.role}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map(msg => {
                const isCurrentUser = msg.senderId === 'current-user';
                const sender = isCurrentUser 
                  ? { name: 'You', avatar: '' }
                  : currentConv?.participants.find(p => p.id === msg.senderId);

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                      {!isCurrentUser && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback>
                            {sender?.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`rounded-lg px-4 py-2 ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-sm">{msg.text}</p>
                        <div className={`flex items-center gap-1 mt-1 text-xs ${isCurrentUser ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                          <span>{formatDistanceToNow(msg.timestamp, { addSuffix: true })}</span>
                          {isCurrentUser && (
                            <span className="ml-2">
                              {getStatusIcon(msg.status)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <File className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button variant="ghost" size="icon">
                <Smile className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Mic className="h-4 w-4" />
              </Button>
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}