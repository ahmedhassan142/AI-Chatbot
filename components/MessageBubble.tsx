import { cn } from '../lib/utils';
import { Message } from '../types';
import { Bot, User, Check, Clock } from 'lucide-react';

interface MessageBubbleProps extends Message {
  className?: string;
}

export function MessageBubble({ content, role, timestamp, className }: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={cn(
      'flex gap-3 animate-in',
      isUser ? 'flex-row-reverse' : '',
      className
    )}>
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        isUser
          ? 'bg-blue-500'
          : 'bg-gradient-to-br from-purple-500 to-pink-500'
      )}>
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>
      
      <div className="flex flex-col gap-1 max-w-[80%]">
        <div className={cn(
          'rounded-2xl px-4 py-3',
          isUser
            ? 'bg-blue-500 text-white rounded-tr-none'
            : 'bg-muted rounded-tl-none'
        )}>
          <div className="whitespace-pre-wrap">{content}</div>
        </div>
        
        <div className={cn(
          'flex items-center gap-2 text-xs',
          isUser ? 'flex-row-reverse' : ''
        )}>
          <time className="text-muted-foreground">
            {timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </time>
          {isUser && (
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3 text-blue-500" />
              <span className="text-muted-foreground">Delivered</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}