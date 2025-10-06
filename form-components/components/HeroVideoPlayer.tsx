'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroVideoPlayerProps {
  videoId: string
  startTime?: number
  className?: string
  autoplay?: boolean
  muted?: boolean
}

export function HeroVideoPlayer({
  videoId,
  startTime = 0,
  className = '',
  autoplay = true,
  muted = true,
}: HeroVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [isMuted, setIsMuted] = useState(muted)
  const [isLoading, setIsLoading] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [embedUrl, setEmbedUrl] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerRef = useRef<any>(null)
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Generate embed URL on client side to avoid hydration mismatch
  useEffect(() => {
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      mute: muted ? '1' : '0',
      start: startTime.toString(),
      controls: '0', // Hide YouTube controls
      showinfo: '0', // Hide video info
      rel: '0', // Don't show related videos
      modestbranding: '1', // Minimal YouTube branding
      iv_load_policy: '3', // Hide annotations
      cc_load_policy: '0', // Hide captions by default
      fs: '0', // Disable fullscreen button
      disablekb: '1', // Disable keyboard controls
      playsinline: '1', // Play inline on mobile
      enablejsapi: '1', // Enable JavaScript API
      loop: '1', // Enable looping
      playlist: videoId, // Required for looping to work
      origin: window.location.origin,
    })

    setEmbedUrl(`https://www.youtube.com/embed/${videoId}?${params.toString()}`)
  }, [videoId, startTime, autoplay, muted])

  // Load YouTube iframe API
  useEffect(() => {
    if (typeof window === 'undefined' || !embedUrl) return

    // Load YouTube iframe API
    if (!(window as any).YT) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      document.body.appendChild(script)
      ;(window as any).onYouTubeIframeAPIReady = () => {
        initializePlayer()
      }
    } else if ((window as any).YT.Player) {
      initializePlayer()
    } else {
      ;(window as any).onYouTubeIframeAPIReady = () => {
        initializePlayer()
      }
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [embedUrl])

  const initializePlayer = () => {
    if (!iframeRef.current) return

    playerRef.current = new (window as any).YT.Player(iframeRef.current, {
      events: {
        onReady: (event: any) => {
          setIsLoading(false)
          if (autoplay) {
            event.target.playVideo()
          }
        },
        onStateChange: (event: any) => {
          const state = event.data
          setIsPlaying(state === (window as any).YT.PlayerState.PLAYING)

          // Ensure smooth looping - restart video when it ends
          if (state === (window as any).YT.PlayerState.ENDED) {
            event.target.seekTo(startTime)
            event.target.playVideo()
          }
        },
      },
    })
  }

  const togglePlayPause = () => {
    if (!playerRef.current) return

    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
    showControlsTemporarily()
  }

  const toggleMute = () => {
    if (!playerRef.current) return

    if (isMuted) {
      playerRef.current.unMute()
      setIsMuted(false)
    } else {
      playerRef.current.mute()
      setIsMuted(true)
    }
    showControlsTemporarily()
  }

  const restartVideo = () => {
    if (!playerRef.current) return

    playerRef.current.seekTo(startTime)
    playerRef.current.playVideo()
    showControlsTemporarily()
  }

  const openFullscreen = () => {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}&t=${startTime}s`
    window.open(videoUrl, '_blank')
  }

  const showControlsTemporarily = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (!isHovered) {
        setShowControls(false)
      }
    }, 3000)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 1000)
  }

  return (
    <div
      className={`relative group rounded-2xl overflow-hidden bg-black/20 backdrop-blur-sm border border-white/20 transition-all duration-500 ease-out hover:scale-105 hover:rotate-2 hover:shadow-2xl hover:shadow-purple-500/25 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={showControlsTemporarily}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {/* Video Container */}
      <div className="relative aspect-video">
        {embedUrl ? (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Course Preview Video"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4 mx-auto"></div>
              <p className="text-white/80 text-sm">Loading video...</p>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && embedUrl && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}

        {/* Custom Controls Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
            showControls || isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Center Play/Pause Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="lg"
              onClick={togglePlayPause}
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-200 hover:scale-110"
            >
              {isPlaying ? (
                <Pause className="h-8 w-8 text-white" />
              ) : (
                <Play className="h-8 w-8 text-white ml-1" />
              )}
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Mute/Unmute */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 text-white" />
                ) : (
                  <Volume2 className="h-4 w-4 text-white" />
                )}
              </Button>

              {/* Restart */}
              <Button
                variant="ghost"
                size="sm"
                onClick={restartVideo}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30"
                title="Restart"
              >
                <RotateCcw className="h-4 w-4 text-white" />
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="sm"
                onClick={openFullscreen}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30"
                title="Watch on YouTube"
              >
                <Maximize2 className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>

          {/* Top Right Indicator */}
          <div className="absolute top-4 right-4">
            <div className="px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-white text-xs font-medium">Course Preview</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info Section */}
      <div className="p-6 bg-white/10 backdrop-blur-sm border-t border-white/20">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/90 text-sm">Live Preview</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-white/90 text-sm">Full Course Access</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-white/90 text-sm">Lifetime Updates</span>
          </div>
        </div>
      </div>
    </div>
  )
}
