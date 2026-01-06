// app/components/TypingIndicator.tsx
import React from 'react';
import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <div className="flex gap-4 mb-8">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center">
          <div className="h-6 w-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-50" />
        </div>
      </div>

      {/* Typing Bubble */}
      <div className="flex-1">
        <div className="rounded-3xl p-6 bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-white/10 rounded-bl-none max-w-[140px]">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Label */}
        <div className="mt-2 text-xs font-medium text-purple-400">
          NeuroChat AI is typing...
        </div>
      </div>
    </div>
  );
}