'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Phone,
  PhoneOff,
  Loader2,
  Headphones,
  Mic,
  MicOff
} from 'lucide-react'
import Vapi from '@vapi-ai/web'

interface CourseVoiceAITutorProps {
  courseTitle: string
  courseDescription: string
  courseId: string
  instructorName?: string
  instructorGender?: 'male' | 'female'
  variant?: 'button' | 'card'
}

export function CourseVoiceAITutor({
  courseTitle,
  courseDescription,
  courseId,
  instructorName = 'Aji Issac Mathew',
  instructorGender = 'male',
  variant = 'button'
}: CourseVoiceAITutorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isUserSpeaking, setIsUserSpeaking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const vapiRef = useRef<Vapi | null>(null)

  // Initialize Vapi instance
  useEffect(() => {
    try {
      const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '867c3d17-9f0c-4337-a4d5-966b362e1844'

      if (!publicKey || publicKey === 'your-vapi-public-key') {
        console.error('Vapi public key not configured properly')
        setError('Voice AI service not configured. Please contact support.')
        return
      }

      vapiRef.current = new Vapi(publicKey)

      // Set up event listeners
      vapiRef.current.on('call-start', () => {
        console.log('Course Voice AI: Call started')
        setIsConnected(true)
        setIsLoading(false)
      })

      vapiRef.current.on('call-end', () => {
        console.log('Course Voice AI: Call ended')
        setIsConnected(false)
        setIsLoading(false)
      })

      vapiRef.current.on('speech-start', () => {
        setIsSpeaking(true)
      })

      vapiRef.current.on('speech-end', () => {
        setIsSpeaking(false)
      })

      vapiRef.current.on('error', (error: any) => {
        console.error('Course Voice AI error:', error)
        setError(error?.message || 'Voice AI connection error. Please try again.')
        setIsLoading(false)
        setIsConnected(false)
      })

    } catch (err) {
      console.error('Failed to initialize Course Voice AI:', err)
      setError('Failed to initialize voice AI')
    }
  }, [])

  const startVoiceChat = async () => {
    if (!vapiRef.current) {
      setError('Voice AI not initialized. Please refresh the page and try again.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID

      if (!assistantId) {
        throw new Error('Assistant ID not configured.')
      }

      // Start the call with course overview context
      await vapiRef.current.start(assistantId, {
        metadata: {
          courseTitle,
          chapterTitle: 'Course Overview',
          chapterContent: `Course: ${courseTitle}\n\nDescription: ${courseDescription}\n\nThis is a course overview session where students can ask general questions about the course content, structure, and learning objectives.`,
          instructorName,
          instructorGender
        }
      })

    } catch (err: any) {
      console.error('Failed to start course voice chat:', err)
      setError('Failed to start voice chat. Please try again.')
      setIsLoading(false)
    }
  }

  const endVoiceChat = async () => {
    if (vapiRef.current) {
      try {
        await vapiRef.current.stop()
      } catch (err) {
        console.error('Error stopping course voice chat:', err)
      }
    }
    setIsConnected(false)
    setIsLoading(false)
  }

  if (variant === 'card') {
    return (
      <div className="bg-gradient-to-r from-[#8b5cf6]/10 to-[#ff3968]/10 rounded-lg p-6 border border-[#8b5cf6]/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#ff3968] flex items-center justify-center">
            <Headphones className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Voice Learning Session</h3>
            <p className="text-sm text-gray-600">Ask questions about this course</p>
          </div>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#ff3968] hover:from-[#8b5cf6]/90 hover:to-[#ff3968]/90 text-white">
              <Headphones className="h-4 w-4 mr-2" />
              Start Voice Chat with {instructorName}
            </Button>
          </DialogTrigger>
          <VoiceDialog 
            isConnected={isConnected}
            isLoading={isLoading}
            isSpeaking={isSpeaking}
            isUserSpeaking={isUserSpeaking}
            error={error}
            courseTitle={courseTitle}
            instructorName={instructorName}
            onStart={startVoiceChat}
            onEnd={endVoiceChat}
          />
        </Dialog>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-sm hover:bg-[#8b5cf6]/10 hover:border-[#8b5cf6]/30 hover:text-[#8b5cf6]"
        >
          <Headphones className="h-4 w-4" />
          <span>Ask AI About Course</span>
        </Button>
      </DialogTrigger>
      <VoiceDialog 
        isConnected={isConnected}
        isLoading={isLoading}
        isSpeaking={isSpeaking}
        isUserSpeaking={isUserSpeaking}
        error={error}
        courseTitle={courseTitle}
        instructorName={instructorName}
        onStart={startVoiceChat}
        onEnd={endVoiceChat}
      />
    </Dialog>
  )
}

// Shared dialog component
function VoiceDialog({
  isConnected,
  isLoading,
  isSpeaking,
  isUserSpeaking,
  error,
  courseTitle,
  instructorName,
  onStart,
  onEnd
}: {
  isConnected: boolean
  isLoading: boolean
  isSpeaking: boolean
  isUserSpeaking: boolean
  error: string | null
  courseTitle: string
  instructorName: string
  onStart: () => void
  onEnd: () => void
}) {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#ff3968] flex items-center justify-center">
            <Headphones className="h-4 w-4 text-white" />
          </div>
          Course Voice Chat
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {/* Course Info */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm font-medium text-gray-900">{courseTitle}</p>
          <p className="text-xs text-gray-600">Course Overview Session</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Status Display */}
        {isConnected && (
          <div className="bg-gradient-to-r from-[#8b5cf6]/10 to-[#ff3968]/10 rounded-lg p-4 border border-[#8b5cf6]/20">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">
                {isSpeaking && `🎤 ${instructorName} is speaking...`}
                {isUserSpeaking && '👤 You are speaking...'}
                {!isSpeaking && !isUserSpeaking && '🎧 Listening...'}
              </p>
            </div>
          </div>
        )}

        {/* Voice Controls */}
        <div className="flex flex-col items-center gap-3">
          {!isConnected ? (
            <Button
              onClick={onStart}
              disabled={isLoading}
              className="bg-gradient-to-r from-[#8b5cf6] to-[#ff3968] hover:from-[#8b5cf6]/90 hover:to-[#ff3968]/90 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Phone className="h-4 w-4 mr-2" />
                  Start Voice Chat
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={onEnd}
              variant="destructive"
              className="bg-red-500 hover:bg-red-600"
            >
              <PhoneOff className="h-4 w-4 mr-2" />
              End Chat
            </Button>
          )}
        </div>

        {/* Instructions */}
        {!isConnected && (
          <div className="text-center text-sm text-gray-600 bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Headphones className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Course Q&A Session</span>
            </div>
            <p>Ask {instructorName} about course content, structure, and learning objectives</p>
          </div>
        )}
      </div>
    </DialogContent>
  )
}
