// app/components/WelcomeBanner.tsx
'use client';

import { motion } from 'framer-motion';
import { X, Sparkles, MessageSquare, Zap } from 'lucide-react';

interface WelcomeBannerProps {
  onClose: () => void;
}

export function WelcomeBanner({ onClose }: WelcomeBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-4 lg:px-6 mt-6"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/10 rounded-full translate-y-32 -translate-x-32" />
        
        <div className="relative p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl lg:text-2xl font-bold text-foreground">
                    Welcome to NeuroChat AI
                  </h2>
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-muted-foreground max-w-2xl">
                  Your intelligent assistant powered by cutting-edge language models. 
                  Ask questions, get help with tasks, or have a conversation about any topic.
                </p>
                
                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Fast Responses</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Smart Context</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 dark:hover:bg-black/20 rounded-lg transition-colors self-start lg:self-center"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}