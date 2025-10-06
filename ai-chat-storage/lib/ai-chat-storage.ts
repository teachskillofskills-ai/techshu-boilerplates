/**
 * AI Chat Session Storage - Optimized for minimal cookie usage
 * Stores chat sessions in sessionStorage with intelligent cleanup
 */

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  attachments?: FileAttachment[]
}

export interface FileAttachment {
  name: string
  type: string
  size: number
  url?: string
}

export interface ChatSession {
  id: string
  courseId: string
  chapterId: string
  chapterTitle: string
  messages: ChatMessage[]
  createdAt: Date
  lastActivity: Date
  isActive: boolean
}

export interface ChatSessionSummary {
  id: string
  courseId: string
  chapterId: string
  chapterTitle: string
  messageCount: number
  lastActivity: Date
  preview: string // First few words of last message
}

class AIChatStorage {
  private readonly SESSION_KEY_PREFIX = 'ai_chat_session_'
  private readonly ACTIVE_SESSION_KEY = 'ai_chat_active_session'
  private readonly SESSION_INDEX_KEY = 'ai_chat_session_index'
  private readonly TEMP_SESSION_KEY = 'ai_chat_temp_session'
  private readonly MAX_SESSIONS = 10 // Limit to prevent storage bloat
  private readonly MAX_MESSAGES_PER_SESSION = 50 // Limit message history
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000 // 24 hours

  // In-memory temporary session (not persisted until user saves)
  private tempSession: ChatSession | null = null

  /**
   * Get or create a chat session for a specific chapter (temporary until saved)
   */
  getOrCreateSession(courseId: string, chapterId: string, chapterTitle: string): ChatSession {
    const sessionId = this.generateSessionId(courseId, chapterId)

    // Check if we have a temporary session for this chapter
    if (this.tempSession && this.tempSession.id === sessionId) {
      this.tempSession.lastActivity = new Date()
      return this.tempSession
    }

    // Check for existing saved session
    let session = this.getSession(sessionId)

    if (!session) {
      // Create new temporary session (not saved until user chooses to save)
      session = this.createTempSession(sessionId, courseId, chapterId, chapterTitle)
    } else {
      // Update last activity for existing session
      session.lastActivity = new Date()
      session.isActive = true
    }

    this.tempSession = session
    this.setActiveSession(sessionId)
    return session
  }

  /**
   * Create a new temporary chat session (not persisted until saved)
   */
  private createTempSession(
    sessionId: string,
    courseId: string,
    chapterId: string,
    chapterTitle: string
  ): ChatSession {
    const welcomeMessage: ChatMessage = {
      id: 'welcome_' + Date.now(),
      role: 'assistant',
      content: `👋 Hi there! I'm your AI learning assistant for **${chapterTitle}**.

I'm here to help you understand the concepts, answer questions, and guide you through the material. Feel free to ask me anything about this chapter!

💡 **Tip**: Your conversation is temporary until you choose to save it. Use the save button to keep important discussions!

What would you like to explore first?`,
      timestamp: new Date(),
    }

    const session: ChatSession = {
      id: sessionId,
      courseId,
      chapterId,
      chapterTitle,
      messages: [welcomeMessage],
      createdAt: new Date(),
      lastActivity: new Date(),
      isActive: true,
    }

    return session
  }

  /**
   * Create a new saved chat session with welcome message
   */
  private createNewSession(
    sessionId: string,
    courseId: string,
    chapterId: string,
    chapterTitle: string
  ): ChatSession {
    const welcomeMessage: ChatMessage = {
      id: 'welcome_' + Date.now(),
      role: 'assistant',
      content: `👋 Hi there! I'm your AI learning assistant for **${chapterTitle}**.

I'm here to help you understand the concepts, answer questions, and guide you through the material. Feel free to ask me anything about this chapter!

What would you like to explore first?`,
      timestamp: new Date(),
    }

    const session: ChatSession = {
      id: sessionId,
      courseId,
      chapterId,
      chapterTitle,
      messages: [welcomeMessage],
      createdAt: new Date(),
      lastActivity: new Date(),
      isActive: true,
    }

    this.saveSession(session)
    this.updateSessionIndex(session)
    this.cleanupOldSessions()

    return session
  }

  /**
   * Add a message to the current session (in memory only - not auto-saved)
   */
  addMessage(sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
    let session = this.getSession(sessionId)

    // If session doesn't exist, try to create it with minimal info
    if (!session) {
      console.warn(`Session ${sessionId} not found, attempting to create it`)
      // Extract course and chapter info from sessionId if possible
      const parts = sessionId.split('-')
      if (parts.length >= 2) {
        const courseId = parts[0]
        const chapterId = parts[1]
        session = this.getOrCreateSession(courseId, chapterId, 'Unknown Chapter')
      } else {
        throw new Error(`Session not found and cannot be created: ${sessionId}`)
      }
    }

    const newMessage: ChatMessage = {
      ...message,
      id: this.generateMessageId(),
      timestamp: new Date(),
    }

    session.messages.push(newMessage)
    session.lastActivity = new Date()

    // Limit message history to prevent storage bloat
    if (session.messages.length > this.MAX_MESSAGES_PER_SESSION) {
      // Keep welcome message and recent messages
      const welcomeMsg = session.messages[0]
      const recentMessages = session.messages.slice(-this.MAX_MESSAGES_PER_SESSION + 1)
      session.messages = [welcomeMsg, ...recentMessages]
    }

    // Don't auto-save - let user decide when to save
    return newMessage
  }

  /**
   * Manually save the current session
   */
  saveCurrentSession(sessionId: string): boolean {
    const session = this.getSession(sessionId)
    if (!session) {
      return false
    }

    try {
      this.saveSession(session)
      this.updateSessionIndex(session)
      return true
    } catch (error) {
      console.error('Failed to save session:', error)
      return false
    }
  }

  /**
   * Clear all messages except welcome message
   */
  clearSession(sessionId: string): void {
    const session = this.getSession(sessionId)
    if (!session) return

    // Keep only the welcome message
    const welcomeMessage = session.messages.find(msg => msg.id.startsWith('welcome_'))
    session.messages = welcomeMessage ? [welcomeMessage] : []
    session.lastActivity = new Date()

    this.saveSession(session)
  }

  /**
   * Get current active session
   */
  getActiveSession(): ChatSession | null {
    const activeSessionId = sessionStorage.getItem(this.ACTIVE_SESSION_KEY)
    return activeSessionId ? this.getSession(activeSessionId) : null
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): ChatSession | null {
    try {
      const sessionData = sessionStorage.getItem(this.SESSION_KEY_PREFIX + sessionId)
      if (!sessionData) return null

      const session = JSON.parse(sessionData) as ChatSession

      // Convert date strings back to Date objects
      session.createdAt = new Date(session.createdAt)
      session.lastActivity = new Date(session.lastActivity)
      session.messages.forEach(msg => {
        msg.timestamp = new Date(msg.timestamp)
      })

      // Check if session is expired
      if (this.isSessionExpired(session)) {
        this.deleteSession(sessionId)
        return null
      }

      return session
    } catch (error) {
      console.error('Error loading chat session:', error)
      return null
    }
  }

  /**
   * Get all session summaries
   */
  getAllSessionSummaries(): ChatSessionSummary[] {
    try {
      const indexData = sessionStorage.getItem(this.SESSION_INDEX_KEY)
      if (!indexData) return []

      const summaries = JSON.parse(indexData) as ChatSessionSummary[]

      // Filter out expired sessions and convert dates
      return summaries
        .map(summary => ({
          ...summary,
          lastActivity: new Date(summary.lastActivity),
        }))
        .filter(
          summary => !this.isSessionExpired({ lastActivity: summary.lastActivity } as ChatSession)
        )
        .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
    } catch (error) {
      console.error('Error loading session summaries:', error)
      return []
    }
  }

  /**
   * Delete a specific session
   */
  deleteSession(sessionId: string): void {
    sessionStorage.removeItem(this.SESSION_KEY_PREFIX + sessionId)
    this.removeFromSessionIndex(sessionId)
  }

  /**
   * Clear all chat sessions
   */
  clearAllSessions(): void {
    const summaries = this.getAllSessionSummaries()
    summaries.forEach(summary => {
      sessionStorage.removeItem(this.SESSION_KEY_PREFIX + summary.id)
    })
    sessionStorage.removeItem(this.SESSION_INDEX_KEY)
    sessionStorage.removeItem(this.ACTIVE_SESSION_KEY)
  }

  /**
   * Get storage usage statistics
   */
  getStorageStats(): {
    totalSessions: number
    totalMessages: number
    storageUsed: number
    storageLimit: number
  } {
    const summaries = this.getAllSessionSummaries()
    const totalMessages = summaries.reduce((sum, s) => sum + s.messageCount, 0)

    // Estimate storage usage
    let storageUsed = 0
    summaries.forEach(summary => {
      const sessionData = sessionStorage.getItem(this.SESSION_KEY_PREFIX + summary.id)
      if (sessionData) {
        storageUsed += sessionData.length
      }
    })

    return {
      totalSessions: summaries.length,
      totalMessages,
      storageUsed,
      storageLimit: 5 * 1024 * 1024, // 5MB typical sessionStorage limit
    }
  }

  // Private helper methods
  private generateSessionId(courseId: string, chapterId: string): string {
    return `${courseId}_${chapterId}`
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private saveSession(session: ChatSession): void {
    try {
      sessionStorage.setItem(this.SESSION_KEY_PREFIX + session.id, JSON.stringify(session))
    } catch (error) {
      console.error('Error saving chat session:', error)
      // If storage is full, cleanup and try again
      this.cleanupOldSessions()
      try {
        sessionStorage.setItem(this.SESSION_KEY_PREFIX + session.id, JSON.stringify(session))
      } catch (retryError) {
        console.error('Failed to save session after cleanup:', retryError)
      }
    }
  }

  private setActiveSession(sessionId: string): void {
    sessionStorage.setItem(this.ACTIVE_SESSION_KEY, sessionId)
  }

  private updateSessionIndex(session: ChatSession): void {
    const summaries = this.getAllSessionSummaries()
    const existingIndex = summaries.findIndex(s => s.id === session.id)

    const summary: ChatSessionSummary = {
      id: session.id,
      courseId: session.courseId,
      chapterId: session.chapterId,
      chapterTitle: session.chapterTitle,
      messageCount: session.messages.length,
      lastActivity: session.lastActivity,
      preview: this.getSessionPreview(session),
    }

    if (existingIndex >= 0) {
      summaries[existingIndex] = summary
    } else {
      summaries.push(summary)
    }

    sessionStorage.setItem(this.SESSION_INDEX_KEY, JSON.stringify(summaries))
  }

  private removeFromSessionIndex(sessionId: string): void {
    const summaries = this.getAllSessionSummaries()
    const filtered = summaries.filter(s => s.id !== sessionId)
    sessionStorage.setItem(this.SESSION_INDEX_KEY, JSON.stringify(filtered))
  }

  private getSessionPreview(session: ChatSession): string {
    const lastUserMessage = session.messages.filter(msg => msg.role === 'user').pop()

    if (lastUserMessage) {
      return lastUserMessage.content.substring(0, 50) + '...'
    }

    return 'New conversation'
  }

  private isSessionExpired(session: ChatSession): boolean {
    const now = Date.now()
    const lastActivity = session.lastActivity.getTime()
    return now - lastActivity > this.SESSION_TIMEOUT
  }

  private cleanupOldSessions(): void {
    const summaries = this.getAllSessionSummaries()

    // Remove expired sessions
    summaries.forEach(summary => {
      if (this.isSessionExpired({ lastActivity: summary.lastActivity } as ChatSession)) {
        this.deleteSession(summary.id)
      }
    })

    // If still too many sessions, remove oldest ones
    const activeSummaries = this.getAllSessionSummaries()
    if (activeSummaries.length > this.MAX_SESSIONS) {
      const toRemove = activeSummaries
        .sort((a, b) => a.lastActivity.getTime() - b.lastActivity.getTime())
        .slice(0, activeSummaries.length - this.MAX_SESSIONS)

      toRemove.forEach(summary => {
        this.deleteSession(summary.id)
      })
    }
  }
}

// Export singleton instance
export const aiChatStorage = new AIChatStorage()
