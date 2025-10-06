'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
  Loader2,
  MessageSquare,
  Headphones,
  Zap
} from 'lucide-react'
import Vapi from '@vapi-ai/web'
import './voice-waves.css'

interface VoiceAITutorProps {
  chapterTitle: string
  chapterContent: string
  courseTitle: string
  courseId: string
  chapterId: string
  instructorName?: string
  instructorGender?: 'male' | 'female'
  allChapters?: Array<{
    id: string
    title: string
    content_md?: string
  }>
}

// Vapi types from the official SDK
interface VapiMessage {
  type: string
  role?: string
  transcript?: string
}

// Voice Wave Animation Component
function VoiceWaveAnimation({ isActive, isSpeaking }: { isActive: boolean; isSpeaking: boolean }) {
  if (!isActive) return null

  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-1.5 bg-gradient-to-t from-[#8b5cf6] to-[#ff3968] rounded-full transition-all duration-300 ${
            isSpeaking
              ? 'voice-wave-bar active'
              : 'voice-wave-bar opacity-50'
          }`}
        />
      ))}
    </div>
  )
}

export function VoiceAITutor({
  chapterTitle,
  chapterContent,
  courseTitle,
  courseId,
  chapterId,
  instructorName = 'Aji',
  instructorGender = 'male',
  allChapters = []
}: VoiceAITutorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isUserSpeaking, setIsUserSpeaking] = useState(false)
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected' | 'ended'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [fullCourseContext, setFullCourseContext] = useState<string>('')

  const vapiRef = useRef<Vapi | null>(null)

  // Build full course context from provided chapters (no API call needed)
  useEffect(() => {
    if (allChapters && allChapters.length > 0) {
      const fullContext = allChapters
        ?.sort((a: any, b: any) => a.order_index - b.order_index)
        ?.map((ch: any) => `Chapter: ${ch.title}\n${ch.content_md || ''}`)
        ?.join('\n\n') || ''
      setFullCourseContext(fullContext)
      console.log(`Voice AI Tutor: Loaded context for ${allChapters.length} chapters`)
    }
  }, [allChapters])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only trigger if spacebar is pressed and not in an input field
      if (event.code === 'Space' &&
          event.target instanceof HTMLElement &&
          !['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName) &&
          !event.target.isContentEditable) {

        event.preventDefault()

        if (isOpen) {
          if (!isConnected && !isLoading) {
            startVoiceChat()
          } else if (isConnected) {
            endVoiceChat()
          }
        }
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [isOpen, isConnected, isLoading])

  // Initialize Vapi instance
  useEffect(() => {
    try {
      const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '867c3d17-9f0c-4337-a4d5-966b362e1844'

      if (!publicKey || publicKey === 'your-vapi-public-key') {
        console.error('Vapi public key not configured properly')
        setError('Voice AI service not configured. Please contact support.')
        return
      }

      console.log('Initializing Vapi with public key:', publicKey ? 'Key present' : 'No key')
      vapiRef.current = new Vapi(publicKey)

      // Set up event listeners
      vapiRef.current.on('call-start', () => {
        console.log('Call started')
        setCallStatus('connected')
        setIsConnected(true)
        setIsLoading(false)
      })

      vapiRef.current.on('call-end', () => {
        console.log('Call ended')
        setCallStatus('ended')
        setIsConnected(false)
        setIsLoading(false)
      })

      vapiRef.current.on('speech-start', () => {
        console.log('User started speaking')
        setIsUserSpeaking(true)
        setIsSpeaking(false) // User speaking, assistant not
      })

      vapiRef.current.on('speech-end', () => {
        console.log('User stopped speaking')
        setIsUserSpeaking(false)
      })

      vapiRef.current.on('speech-start', () => {
        console.log('Assistant started speaking')
        setIsSpeaking(true)
        setIsUserSpeaking(false)
      })

      vapiRef.current.on('speech-end', () => {
        console.log('Assistant stopped speaking')
        setIsSpeaking(false)
      })

      vapiRef.current.on('message', (message: VapiMessage) => {
        console.log('Vapi message:', message)
        // We're not displaying transcripts, just logging for debugging
      })

      vapiRef.current.on('error', (error: any) => {
        console.error('Vapi error details:', {
          error,
          message: error?.message,
          type: error?.type,
          code: error?.code,
          details: error?.details
        })
        setError(error?.message || error?.type || 'Voice AI connection error. Please check your microphone and try again.')
        setIsLoading(false)
        setIsConnected(false)
        setCallStatus('idle')
      })

    } catch (err) {
      console.error('Failed to initialize Vapi:', err)
      setError('Failed to initialize voice AI')
    }
  }, [])



  const startVoiceChat = async () => {
    if (!vapiRef.current) {
      setError('Voice AI not initialized. Please refresh the page and try again.')
      return
    }

    // Check if browser supports microphone
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Your browser does not support microphone access. Please use a modern browser.')
      return
    }

    setIsLoading(true)
    setError(null)
    setCallStatus('connecting')

    try {
      console.log('🎯 NEW CODE: Starting voice chat with universal TechShu assistant - UPDATED VERSION 2025!')

      // Use the universal assistant ID from environment
      const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID

      if (!assistantId) {
        throw new Error('Universal assistant ID not configured. Please set NEXT_PUBLIC_VAPI_ASSISTANT_ID in environment variables.')
      }

      console.log('Starting Vapi call with universal assistant:', assistantId)

      // Start the call with universal assistant and pass context metadata
      await vapiRef.current.start(assistantId, {
        metadata: {
          courseTitle,
          chapterTitle,
          chapterContent,
          instructorName,
          instructorGender
        }
      })

    } catch (err: any) {
      console.error('Failed to start voice chat:', {
        error: err,
        message: err?.message,
        stack: err?.stack
      })

      let errorMessage = 'Failed to start voice chat. '
      if (err?.message?.includes('microphone')) {
        errorMessage += 'Please allow microphone access and try again.'
      } else if (err?.message?.includes('network')) {
        errorMessage += 'Please check your internet connection.'
      } else {
        errorMessage += 'Please try again or refresh the page.'
      }

      setError(errorMessage)
      setIsLoading(false)
      setCallStatus('idle')
    }
  }

  const endVoiceChat = async () => {
    if (vapiRef.current) {
      try {
        await vapiRef.current.stop()
      } catch (err) {
        console.error('Error stopping Vapi:', err)
      }
    }

    setIsConnected(false)
    setIsLoading(false)
    setCallStatus('idle')
  }

  const toggleMute = () => {
    if (vapiRef.current) {
      try {
        const newMutedState = !isMuted
        vapiRef.current.setMuted(newMutedState)
        setIsMuted(newMutedState)
      } catch (err) {
        console.error('Error toggling mute:', err)
      }
    }
  }

  const handleDialogClose = () => {
    if (isConnected) {
      endVoiceChat()
    }
    setIsOpen(false)
    setError(null)
    setIsSpeaking(false)
    setIsUserSpeaking(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#8b5cf6] hover:bg-[#8b5cf6]/10 transition-all duration-200 px-3 py-2 rounded-lg border border-transparent hover:border-[#8b5cf6]/20"
        >
          <Headphones className="h-4 w-4" />
          <span>Talk to AI Tutor</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#ff3968] flex items-center justify-center">
              <Headphones className="h-4 w-4 text-white" />
            </div>
            Voice AI Tutor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Chapter Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900">{chapterTitle}</p>
            <p className="text-xs text-gray-600">{courseTitle}</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
              <p className="text-xs text-red-500 mt-1">
                If this persists, please check your microphone permissions or try refreshing the page.
              </p>
            </div>
          )}

          {/* Voice Wave Animation */}
          {isConnected && (
            <div className="bg-gradient-to-r from-[#8b5cf6]/10 to-[#ff3968]/10 rounded-lg p-4 border border-[#8b5cf6]/20">
              <div className="text-center mb-3">
                <p className={`text-sm font-medium text-gray-900 ${(isSpeaking || isUserSpeaking) ? 'speaking-indicator' : ''}`}>
                  {isSpeaking && '🎤 ' + instructorName + ' is speaking...'}
                  {isUserSpeaking && '👤 You are speaking...'}
                  {!isSpeaking && !isUserSpeaking && '🎧 Listening...'}
                </p>
              </div>
              <VoiceWaveAnimation
                isActive={isConnected}
                isSpeaking={isSpeaking || isUserSpeaking}
              />
              {/* Audio Level Indicator */}
              <div className="mt-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isUserSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
                  }`} />
                  <span className="text-xs text-gray-600">You</span>
                  <div className="w-8 border-t border-gray-300" />
                  <span className="text-xs text-gray-600">{instructorName}</span>
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isSpeaking ? 'bg-[#8b5cf6] animate-pulse' : 'bg-gray-300'
                  }`} />
                </div>
              </div>
            </div>
          )}

          {/* Call Status */}
          <div className="flex items-center justify-center gap-3">
            <Badge
              variant={callStatus === 'connected' ? 'default' : 'secondary'}
              className={callStatus === 'connected' ? 'bg-green-100 text-green-800' : ''}
            >
              {callStatus === 'idle' && 'Ready to start'}
              {callStatus === 'connecting' && 'Connecting...'}
              {callStatus === 'connected' && `Connected with ${instructorName}`}
              {callStatus === 'ended' && 'Session ended'}
            </Badge>
          </div>

          {/* Voice Controls */}
          <div className="flex flex-col items-center gap-3">
            {!isConnected ? (
              <>
                <Button
                  onClick={startVoiceChat}
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
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <span>or press</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-700 font-mono text-xs">Space</kbd>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={toggleMute}
                    variant="outline"
                    size="sm"
                  >
                    {isMuted ? (
                      <>
                        <MicOff className="h-4 w-4 mr-2" />
                        Unmute
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        Mute
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={endVoiceChat}
                    variant="destructive"
                    size="sm"
                  >
                    <PhoneOff className="h-4 w-4 mr-2" />
                    End Call
                  </Button>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <span>or press</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-700 font-mono text-xs">Space</kbd>
                  <span>to end</span>
                </div>
              </>
            )}
          </div>



          {/* Instructions */}
          {!isConnected && (
            <div className="text-center text-sm text-gray-600 bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Headphones className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Voice Learning Session</span>
              </div>
              <p>🎤 Make sure your microphone is enabled</p>
              <p className="mt-2 text-xs font-medium text-blue-800">⌨️ Press <kbd className="px-1 py-0.5 bg-blue-200 rounded text-blue-900">Spacebar</kbd> to start/stop</p>
            </div>
          )}

          {/* Connected Instructions */}
          {isConnected && (
            <div className="text-center text-sm text-gray-600 bg-green-50 rounded-lg p-3 border border-green-200">
              <p className="text-green-800">🎙️ Voice session active</p>
              <p className="mt-1 text-xs">Press <kbd className="px-1 py-0.5 bg-green-200 rounded text-green-900">Spacebar</kbd> to end</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
