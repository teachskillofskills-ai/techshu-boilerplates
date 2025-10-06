/**
 * AI Chat Session Hook - Optimized session management
 * Provides session-based chat with minimal cookie usage
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  aiChatStorage,
  ChatMessage,
  ChatSession,
  ChatSessionSummary,
} from '@/lib/storage/ai-chat-storage'

interface UseAIChatSessionProps {
  courseId: string
  chapterId: string
  chapterTitle: string
  courseTitle?: string
  chapterContent?: string
  allChapters?: any[]
}

interface UseAIChatSessionReturn {
  // Session state
  session: ChatSession | null
  messages: ChatMessage[]
  isLoading: boolean
  loadingMessage: string
  isSaved: boolean
  hasUnsavedChanges: boolean

  // Actions
  sendMessage: (content: string, attachments?: any[]) => Promise<void>
  clearChat: () => void
  saveSession: () => boolean

  // Session management
  sessionSummaries: ChatSessionSummary[]
  switchToSession: (sessionId: string) => void
  deleteSession: (sessionId: string) => void
  clearAllSessions: () => void

  // Storage stats
  storageStats: {
    totalSessions: number
    totalMessages: number
    storageUsed: number
    storageLimit: number
    usagePercentage: number
  }

  // Utilities
  scrollToBottom: () => void
  exportSession: () => string
}

export function useAIChatSession({
  courseId,
  chapterId,
  chapterTitle,
  courseTitle,
  chapterContent,
  allChapters = [],
}: UseAIChatSessionProps): UseAIChatSessionReturn {
  const [session, setSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [sessionSummaries, setSessionSummaries] = useState<ChatSessionSummary[]>([])
  const [isSaved, setIsSaved] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [initialMessageCount, setInitialMessageCount] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const loadingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Initialize session
  useEffect(() => {
    if (courseId && chapterId && chapterTitle) {
      const currentSession = aiChatStorage.getOrCreateSession(courseId, chapterId, chapterTitle)
      setSession(currentSession)
      setMessages(currentSession.messages)
      setInitialMessageCount(currentSession.messages.length)

      // Check if this is a saved session or temporary
      const savedSession = aiChatStorage.getSession(currentSession.id)
      setIsSaved(!!savedSession)
      setHasUnsavedChanges(false)

      loadSessionSummaries()
    }
  }, [courseId, chapterId, chapterTitle])

  // Track unsaved changes
  useEffect(() => {
    if (session && messages.length > initialMessageCount) {
      setHasUnsavedChanges(true)
      setIsSaved(false)
    }
  }, [messages.length, initialMessageCount, session])

  // Load session summaries
  const loadSessionSummaries = useCallback(() => {
    const summaries = aiChatStorage.getAllSessionSummaries()
    setSessionSummaries(summaries)
  }, [])

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Auto-scroll when messages change
  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timer)
  }, [messages, scrollToBottom])

  // Send message to AI
  const sendMessage = useCallback(
    async (content: string, attachments: any[] = []) => {
      if (!session || !content.trim()) {
        console.warn('Cannot send message: session not initialized or content empty', {
          session: !!session,
          content: content?.trim(),
        })
        return
      }

      // Ensure session exists in storage
      if (!aiChatStorage.getSession(session.id)) {
        console.warn('Session not found in storage, reinitializing...')
        if (courseId && chapterId && chapterTitle) {
          const newSession = aiChatStorage.getOrCreateSession(courseId, chapterId, chapterTitle)
          setSession(newSession)
          setMessages(newSession.messages)
        } else {
          console.error('Cannot reinitialize session: missing course/chapter info')
          return
        }
      }

      try {
        // Add user message
        const userMessage = aiChatStorage.addMessage(session.id, {
          role: 'user',
          content: content.trim(),
          attachments,
        })

        // Update local state
        setMessages(prev => [...prev, userMessage])
        setIsLoading(true)

        // Show loading messages
        const loadingMessages = [
          '🔍 Analyzing your question...',
          '📚 Reviewing chapter content...',
          '🧠 Processing information...',
          '💡 Generating response...',
          '✨ Finalizing answer...',
        ]

        let messageIndex = 0
        setLoadingMessage(loadingMessages[0])

        loadingIntervalRef.current = setInterval(() => {
          messageIndex = (messageIndex + 1) % loadingMessages.length
          setLoadingMessage(loadingMessages[messageIndex])
        }, 2000)

        // Call AI API
        const response = await fetch('/api/ai/tutor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: content,
            chapterTitle,
            chapterContent,
            courseId,
            chapterId,
            courseTitle,
            allChapters,
            attachments: attachments.map(att => ({
              name: att.name,
              type: att.type,
              size: att.size,
            })),
            conversationHistory: messages.slice(-10), // Last 10 messages for context
          }),
        })

        if (!response.ok) {
          let errorData
          try {
            errorData = await response.json()
          } catch {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.success && data.content) {
          // Add AI response
          const aiMessage = aiChatStorage.addMessage(session.id, {
            role: 'assistant',
            content: data.content,
          })

          setMessages(prev => [...prev, aiMessage])
          loadSessionSummaries() // Update summaries
        } else {
          throw new Error(data.error || 'No content received from AI')
        }
      } catch (error) {
        console.error('❌ Error sending message:', error)

        // Determine error type for better user messaging
        let errorContent = 'I encountered an unexpected error. Please try again.'

        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          errorContent = `I'm having trouble connecting to the server. Please check:

• Make sure you're connected to the internet
• Try refreshing the page
• If the problem persists, the server might be temporarily unavailable

You can try asking your question again in a moment.`
        } else if (error instanceof Error) {
          if (error.message.includes('HTTP 500')) {
            errorContent = `I'm experiencing some technical difficulties right now. Please try again in a few moments.`
          } else if (error.message.includes('HTTP 401') || error.message.includes('Unauthorized')) {
            errorContent = `It looks like your session might have expired. Please try refreshing the page.`
          } else {
            errorContent = `I encountered an error: **${error.message}**

Please try asking your question again. If this keeps happening, try refreshing the page.`
          }
        }

        // Add error message to session
        const errorMessage = aiChatStorage.addMessage(session.id, {
          role: 'assistant',
          content: errorContent,
        })

        setMessages(prev => [...prev, errorMessage])
      } finally {
        if (loadingIntervalRef.current) {
          clearInterval(loadingIntervalRef.current)
          loadingIntervalRef.current = null
        }
        setIsLoading(false)
        setLoadingMessage('')
      }
    },
    [
      session,
      messages,
      chapterTitle,
      chapterContent,
      courseId,
      chapterId,
      courseTitle,
      allChapters,
      loadSessionSummaries,
    ]
  )

  // Manually save the current session
  const saveSession = useCallback(() => {
    if (!session) return false

    const success = aiChatStorage.saveCurrentSession(session.id)
    if (success) {
      setIsSaved(true)
      setHasUnsavedChanges(false)
      setInitialMessageCount(messages.length)
      loadSessionSummaries()
    }
    return success
  }, [session, messages.length, loadSessionSummaries])

  // Clear current chat (keep welcome message)
  const clearChat = useCallback(() => {
    if (!session) return

    aiChatStorage.clearSession(session.id)
    const updatedSession = aiChatStorage.getSession(session.id)

    if (updatedSession) {
      setSession(updatedSession)
      setMessages(updatedSession.messages)
      setInitialMessageCount(updatedSession.messages.length)
      setHasUnsavedChanges(false)
      loadSessionSummaries()
    }
  }, [session, loadSessionSummaries])

  // Switch to different session
  const switchToSession = useCallback((sessionId: string) => {
    const targetSession = aiChatStorage.getSession(sessionId)
    if (targetSession) {
      setSession(targetSession)
      setMessages(targetSession.messages)
    }
  }, [])

  // Delete a session
  const deleteSession = useCallback(
    (sessionId: string) => {
      aiChatStorage.deleteSession(sessionId)
      loadSessionSummaries()

      // If we deleted the current session, create a new one
      if (session?.id === sessionId) {
        const newSession = aiChatStorage.getOrCreateSession(courseId, chapterId, chapterTitle)
        setSession(newSession)
        setMessages(newSession.messages)
      }
    },
    [session, courseId, chapterId, chapterTitle, loadSessionSummaries]
  )

  // Clear all sessions
  const clearAllSessions = useCallback(() => {
    aiChatStorage.clearAllSessions()
    loadSessionSummaries()

    // Create new session
    const newSession = aiChatStorage.getOrCreateSession(courseId, chapterId, chapterTitle)
    setSession(newSession)
    setMessages(newSession.messages)
  }, [courseId, chapterId, chapterTitle, loadSessionSummaries])

  // Get storage statistics
  const storageStats = useCallback(() => {
    const stats = aiChatStorage.getStorageStats()
    return {
      ...stats,
      usagePercentage: (stats.storageUsed / stats.storageLimit) * 100,
    }
  }, [])

  // Export session as text
  const exportSession = useCallback(() => {
    if (!session) return ''

    const exportData = {
      chapterTitle: session.chapterTitle,
      exportDate: new Date().toISOString(),
      messages: session.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
      })),
    }

    return JSON.stringify(exportData, null, 2)
  }, [session])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current)
      }
    }
  }, [])

  return {
    // Session state
    session,
    messages,
    isLoading,
    loadingMessage,
    isSaved,
    hasUnsavedChanges,

    // Actions
    sendMessage,
    clearChat,
    saveSession,

    // Session management
    sessionSummaries,
    switchToSession,
    deleteSession,
    clearAllSessions,

    // Storage stats
    storageStats: storageStats(),

    // Utilities
    scrollToBottom,
    exportSession,
  }
}
