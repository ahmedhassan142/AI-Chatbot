'use client'

import { useState, useCallback } from 'react'
import { Message, Conversation } from '@/types'
import { StorageService } from '../lib/storage'
import { generateId } from '../lib/utils'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)

  const startNewConversation = useCallback(() => {
    const conversation: Conversation = {
      id: generateId(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setCurrentConversation(conversation)
    setMessages([])
    StorageService.addConversation(conversation)

    return conversation
  }, [])

  const loadConversation = useCallback((conversationId: string) => {
    const conversations = StorageService.getConversations()
    const conversation = conversations.find(c => c.id === conversationId)
    
    if (conversation) {
      setCurrentConversation(conversation)
      setMessages(conversation.messages)
    }
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: generateId(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    
    if (currentConversation) {
      StorageService.addMessage(currentConversation.id, userMessage)
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) throw new Error('Network response was not ok')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      const assistantMessageId = generateId()

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              setIsLoading(false)
              return
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed.choices?.[0]?.delta?.content) {
                assistantMessage += parsed.choices[0].delta.content
                
                setMessages(prev => {
                  const existing = prev.find(m => m.id === assistantMessageId)
                  if (existing) {
                    return prev.map(m => 
                      m.id === assistantMessageId 
                        ? { ...m, content: assistantMessage }
                        : m
                    )
                  } else {
                    const newMessage: Message = {
                      id: assistantMessageId,
                      content: assistantMessage,
                      role: 'assistant',
                      timestamp: new Date(),
                    }
                    return [...prev, newMessage]
                  }
                })
              }
            } catch (e) {
              // Continue processing
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
      
      const errorMessage: Message = {
        id: generateId(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [messages, currentConversation, isLoading])

  const clearConversation = useCallback(() => {
    setMessages([])
    setCurrentConversation(null)
  }, [])

  return {
    messages,
    isLoading,
    currentConversation,
    startNewConversation,
    loadConversation,
    sendMessage,
    clearConversation,
    setMessages,
  }
}