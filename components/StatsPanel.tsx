// app/components/StatsPanel.tsx
'use client';

import { motion } from 'framer-motion';
import { useChat } from '@/app/context/Chatcontext';
import { MessageSquare, Clock, Users, Brain } from 'lucide-react';

export function StatsPanel() {
  const { sessions, messages } = useChat();
  
  const stats = [
    {
      label: 'Active Chats',
      value: sessions.length,
      icon: MessageSquare,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Total Messages',
      value: messages.length,
      icon: Brain,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Response Time',
      value: '< 2s',
      icon: Clock,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      label: 'AI Models',
      value: '3',
      icon: Users,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card border rounded-xl p-4 lg:p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-2xl lg:text-3xl font-bold text-foreground">
              {stat.value}
            </div>
            <p className="text-sm text-muted-foreground">
              {stat.label}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}