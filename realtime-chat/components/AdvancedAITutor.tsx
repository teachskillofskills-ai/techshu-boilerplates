'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ChatMessageFormatter, cleanMarkdownArtifacts } from '@/components/ui/ChatMessageFormatter'
import { useAIChatSession } from '@/hooks/useAIChatSession'
import {
  Bot,
  Send,
  Upload,
  FileText,
  Image,
  FileSpreadsheet,
  Presentation,
  Loader2,
  X,
  Download,
  Sparkles,
  User,
  Clock,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Paperclip,
  Zap,
  Trash2,
  Copy,
  ExternalLink,
  Save,
} from 'lucide-react'

// Import types from the session storage
import type { ChatMessage as Message, FileAttachment } from '@/lib/storage/ai-chat-storage'

interface AdvancedAITutorProps {
  chapterTitle: string
  chapterContent: string
  courseId: string
  chapterId: string
  courseTitle: string
  allChapters?: Array<{
    id: string
    title: string
    content_md?: string
  }>
  hideHeader?: boolean
  maxHeight?: string
}

const ALLOWED_FILE_TYPES = {
  'application/pdf': { icon: FileText, label: 'PDF' },
  'application/vnd.ms-powerpoint': { icon: Presentation, label: 'PPT' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
    icon: Presentation,
    label: 'PPTX',
  },
  'application/vnd.ms-excel': { icon: FileSpreadsheet, label: 'Excel' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
    icon: FileSpreadsheet,
    label: 'Excel',
  },
  'image/jpeg': { icon: Image, label: 'JPEG' },
  'image/png': { icon: Image, label: 'PNG' },
  'text/plain': { icon: FileText, label: 'Text' },
  'text/markdown': { icon: FileText, label: 'Markdown' },
}

export function AdvancedAITutor({
  chapterTitle,
  chapterContent,
  courseId,
  chapterId,
  courseTitle,
  allChapters = [],
  hideHeader = false,
  maxHeight = '600px',
}: AdvancedAITutorProps) {
  // Use the new session-based chat hook
  const {
    session,
    messages,
    isLoading,
    loadingMessage,
    isSaved,
    hasUnsavedChanges,
    sendMessage: sendChatMessage,
    clearChat,
    saveSession,
    sessionSummaries,
    storageStats,
    scrollToBottom: hookScrollToBottom,
  } = useAIChatSession({
    courseId,
    chapterId,
    chapterTitle,
    courseTitle,
    chapterContent,
    allChapters,
  })

  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set())
  const [showSessionManager, setShowSessionManager] = useState(false)
  const [showSaveAsNoteDialog, setShowSaveAsNoteDialog] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom within the AI tutor container only
  const scrollToBottom = () => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      // Scroll within the container, not the entire page
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  // Session storage is now handled by the useAIChatSession hook

  // Auto-scroll when messages change or loading state changes
  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newAttachments: FileAttachment[] = []

    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert(`File ${file.name} is too large. Maximum size is 10MB.`)
        continue
      }

      if (!Object.keys(ALLOWED_FILE_TYPES).includes(file.type)) {
        alert(`File type ${file.type} is not supported.`)
        continue
      }

      // Create a temporary URL for the file
      const url = URL.createObjectURL(file)

      newAttachments.push({
        name: file.name,
        type: file.type,
        size: file.size,
        url,
      })
    }

    setAttachments(prev => [...prev, ...newAttachments])
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => {
      const newAttachments = [...prev]
      if (newAttachments[index].url) {
        URL.revokeObjectURL(newAttachments[index].url!)
      }
      newAttachments.splice(index, 1)
      return newAttachments
    })
  }

  // Clear chat history using the new session system
  const clearChatHistory = () => {
    clearChat()
  }

  // Save chat conversation as a note (manual user action)
  const saveConversationAsNote = async () => {
    if (messages.length <= 1) return // Don't save if only welcome message

    try {
      // Format conversation for note
      const conversationText = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => {
          const role = msg.role === 'user' ? '👤 You' : '🤖 AI Assistant'
          const timestamp = new Date(msg.timestamp).toLocaleTimeString()
          return `**${role}** (${timestamp}):\n${msg.content}\n`
        })
        .join('\n---\n\n')

      const noteContent = `# AI Chat Session - ${chapterTitle}

*Saved on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}*

${conversationText}

---
*This conversation was manually saved from the AI Learning Assistant.*`

      // Save as note using the notes API
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          chapterId,
          title: `AI Chat: ${chapterTitle}`,
          content: noteContent,
          noteType: 'ai_tutor_chat',
        }),
      })

      if (response.ok) {
        console.log('✅ Conversation saved as note successfully!')
        // Could add a toast notification here
      } else {
        console.error('❌ Failed to save conversation as note')
      }
    } catch (error) {
      console.error('Error saving conversation as note:', error)
    }
  }

  // Connectivity testing is now handled by the useAIChatSession hook

  const sendMessage = async () => {
    if (!input.trim() && attachments.length === 0) return

    // Check if session is properly initialized
    if (!session) {
      console.warn('AI Chat session not initialized yet, please wait...')
      return
    }

    // Use the session-based sendMessage from the hook
    await sendChatMessage(input, attachments)

    // Clear input and attachments
    setInput('')
    setAttachments([])
  }

  const getFileIcon = (type: string) => {
    const fileType = ALLOWED_FILE_TYPES[type as keyof typeof ALLOWED_FILE_TYPES]
    return fileType ? fileType.icon : FileText
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="flex flex-col h-full">
      {/* Modern Chat Header */}
      {!hideHeader && (
        <div className="p-4 border-b border-gray-200 bg-white">
          {/* Top Row: Title and Status */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">AI Learning Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">Online & Ready</span>
                </div>
              </div>
            </div>

            {/* Expert Mode Badge */}
            <div className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full">
              <span className="text-xs font-medium text-blue-700">Expert Mode</span>
            </div>
          </div>

          {/* Bottom Row: Controls and Status */}
          <div className="flex items-center justify-between">
            {/* Left: Save Status */}
            <div className="flex items-center gap-3">
              {/* Save Status Indicator */}
              <div className="flex items-center gap-1.5">
                {hasUnsavedChanges ? (
                  <>
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-orange-600 font-medium">Unsaved</span>
                  </>
                ) : isSaved ? (
                  <>
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600 font-medium">Saved</span>
                  </>
                ) : (
                  <>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    <span className="text-xs text-gray-500 font-medium">Temporary</span>
                  </>
                )}
              </div>

              {/* Message Count */}
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {storageStats.totalMessages} msgs
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-1">
              {/* Save Session Button */}
              {hasUnsavedChanges && (
                <Button
                  onClick={() => {
                    const success = saveSession()
                    if (success) {
                      console.log('✅ Session saved successfully!')
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs text-green-700 border-green-200 hover:bg-green-50"
                  title="Save conversation session"
                >
                  <Save className="h-3 w-3 mr-1" />
                  Save
                </Button>
              )}

              {/* Save as Note Button */}
              {messages.length > 1 && (
                <Button
                  onClick={saveConversationAsNote}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-500 hover:text-purple-600 hover:bg-purple-50"
                  title="Save conversation as note"
                >
                  <FileText className="h-3 w-3" />
                </Button>
              )}

              {/* Session Manager */}
              <Button
                onClick={() => setShowSessionManager(!showSessionManager)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                title="Session manager"
              >
                <MessageSquare className="h-3 w-3" />
              </Button>

              {/* Clear Chat */}
              <Button
                onClick={clearChatHistory}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                title="Clear chat history"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Chat Messages - Expanded for better space utilization */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/30 to-white/50 min-h-0"
      >
        {messages.map(message => {
          const isUser = message.role === 'user'

          return (
            <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-2 max-w-[90%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {isUser ? (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
                      <User className="h-3 w-3 text-white" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 flex items-center justify-center shadow-md">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Message Bubble with Rich Content */}
                <div className="flex flex-col gap-1 flex-1">
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md ${
                      isUser
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md'
                        : 'bg-white border border-gray-200/60 text-gray-800 rounded-bl-md'
                    }`}
                  >
                    {/* Enhanced Chat Content Rendering */}
                    <div
                      className={`text-sm leading-relaxed ${isUser ? 'text-white' : 'text-gray-800'}`}
                    >
                      {(() => {
                        const isExpanded = expandedMessages.has(message.id)
                        const isLongMessage = message.content.length > 500

                        // Clean up any markdown artifacts for better chat display
                        const cleanContent = isUser
                          ? message.content
                          : cleanMarkdownArtifacts(message.content)

                        if (!isLongMessage) {
                          return (
                            <ChatMessageFormatter
                              content={cleanContent}
                              isUser={isUser}
                              className={isUser ? 'text-white' : 'text-gray-800'}
                            />
                          )
                        }

                        // For long messages, show expandable content
                        const displayContent = isExpanded
                          ? cleanContent
                          : `${cleanContent.substring(0, 500)}...`

                        return (
                          <div>
                            <ChatMessageFormatter
                              content={displayContent}
                              isUser={isUser}
                              className={isUser ? 'text-white' : 'text-gray-800'}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newExpanded = new Set(expandedMessages)
                                if (isExpanded) {
                                  newExpanded.delete(message.id)
                                } else {
                                  newExpanded.add(message.id)
                                }
                                setExpandedMessages(newExpanded)
                              }}
                              className={`mt-2 text-xs underline hover:no-underline transition-colors ${
                                isUser
                                  ? 'text-white/80 hover:text-white'
                                  : 'text-blue-600 hover:text-blue-800'
                              }`}
                            >
                              {isExpanded ? 'Show less' : 'Show more'}
                            </button>
                          </div>
                        )
                      })()}
                    </div>

                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/20">
                        <div className="flex flex-wrap gap-2">
                          {message.attachments.map((attachment, idx) => {
                            const IconComponent = getFileIcon(attachment.type)
                            return (
                              <div
                                key={idx}
                                className={`flex items-center gap-2 rounded-lg p-2 text-xs ${
                                  isUser ? 'bg-white/20' : 'bg-gray-100'
                                }`}
                              >
                                <IconComponent
                                  className={`h-3 w-3 ${isUser ? 'text-white' : 'text-gray-500'}`}
                                />
                                <span className="truncate max-w-[120px]">{attachment.name}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div
                    className={`text-xs text-gray-400 px-2 ${isUser ? 'text-right' : 'text-left'}`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff3968] via-[#ff6b47] to-[#8b5cf6] flex items-center justify-center shadow-md">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200/60 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {loadingMessage || 'AI is thinking...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Sticky Footer */}
      <div className="mt-auto border-t border-gray-200/50 bg-white/95 backdrop-blur-sm shadow-lg">
        {/* Attachments Display */}
        {attachments.length > 0 && (
          <div className="px-4 pt-3 pb-2">
            <div className="flex flex-wrap gap-1">
              {attachments.map((attachment, index) => {
                const IconComponent = getFileIcon(attachment.type)
                return (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-xs"
                  >
                    <IconComponent className="h-3 w-3 text-gray-500" />
                    <span className="truncate max-w-[80px]">{attachment.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-gray-400 hover:text-red-500"
                      title="Remove attachment"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Input Row */}
        <div className="p-4">
          <div className="flex items-center gap-2">
            {/* File Upload Button */}
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 rounded-full border-gray-200/60 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 flex-shrink-0"
              title="Upload files (PDF, PPT, Excel, Images)"
            >
              <Paperclip className="h-4 w-4 text-gray-600" />
            </Button>

            {/* Compact Input Field */}
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={
                  session
                    ? 'Ask me anything about the course...'
                    : 'Initializing AI chat session...'
                }
                disabled={!session}
                className="min-h-[36px] max-h-[120px] resize-none rounded-xl border-gray-200/60 bg-gray-50/50 focus:bg-white focus:border-orange-300 transition-all duration-200 text-sm leading-relaxed p-2 pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    if (session) {
                      sendMessage()
                    }
                  }
                }}
                rows={1}
              />
              {/* Character count - smaller */}
              <div className="absolute bottom-1 right-1 text-xs text-gray-400 bg-white/80 px-1 py-0.5 rounded text-[10px]">
                {input.length}/1000
              </div>
            </div>

            {/* Send Button */}
            <Button
              onClick={sendMessage}
              disabled={!session || isLoading || (!input.trim() && attachments.length === 0)}
              size="sm"
              variant="ghost"
              className="h-9 w-9 p-0 rounded-full !bg-gradient-to-r !from-pink-500 !via-orange-500 !to-yellow-500 hover:!from-pink-700 hover:!via-orange-700 hover:!to-yellow-600 hover:scale-105 shadow-lg hover:shadow-xl !transition-all !duration-300 disabled:opacity-50 disabled:hover:scale-100 flex-shrink-0 border border-white/20 !text-white hover:!text-white will-change-transform"
              title={session ? 'Send message' : 'Initializing chat session...'}
              style={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transformOrigin: 'center',
                color: 'white !important',
              }}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 text-white animate-spin" />
              ) : (
                <Send className="h-4 w-4 text-white" />
              )}
            </Button>
          </div>

          {/* File support info */}
          <p className="text-xs text-gray-500 mt-2 text-center">
            Supported files: PDF, PPT, Excel, Images (JPG/PNG), Text, Markdown • Max 10MB each
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.txt,.md"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  )
}
