'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Volume2, VolumeX } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface OptimizedHeroVideoPlayerProps {
  videoId: string
  startTime?: number
  className?: string
  autoplay?: boolean
  muted?: boolean
  placeholder?: string
  title?: string
}

export function OptimizedHeroVideoPlayer({
  videoId,
  startTime = 0,
  className = '',
  autoplay = true,
  muted = true,
  placeholder,
  title = 'Video Player',
}: OptimizedHeroVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(muted)
  const [isLoading, setIsLoading] = useState(false)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [embedUrl, setEmbedUrl] = useState('')

  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerRef = useRef<any>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!containerRef.current) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          // Load video when 50% visible
          setShouldLoadVideo(true)
        }
      },
      {
        threshold: [0.1, 0.5],
        rootMargin: '50px',
      }
    )

    observerRef.current.observe(containerRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  // Generate embed URL only when needed
  useEffect(() => {
    if (!shouldLoadVideo) return

    const params = new URLSearchParams({
      autoplay: autoplay && userInteracted ? '1' : '0',
      mute: muted ? '1' : '0',
      start: startTime.toString(),
      controls: '0',
      showinfo: '0',
      rel: '0',
      modestbranding: '1',
      iv_load_policy: '3',
      cc_load_policy: '0',
      fs: '0',
      disablekb: '1',
      playsinline: '1',
      enablejsapi: '1',
      loop: '1',
      playlist: videoId,
      origin: typeof window !== 'undefined' ? window.location.origin : '',
    })

    setEmbedUrl(`https://www.youtube.com/embed/${videoId}?${params.toString()}`)
  }, [shouldLoadVideo, videoId, autoplay, muted, startTime, userInteracted])

  // Handle user interaction to enable autoplay
  const handleUserInteraction = useCallback(() => {
    if (!userInteracted) {
      setUserInteracted(true)
      setShouldLoadVideo(true)
      setIsLoading(true)
    }
  }, [userInteracted])

  // Handle play/pause
  const handlePlayPause = useCallback(() => {
    handleUserInteraction()
    setIsPlaying(!isPlaying)

    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
      }
    }
  }, [isPlaying, handleUserInteraction])

  // Handle mute/unmute
  const handleMuteToggle = useCallback(() => {
    setIsMuted(!isMuted)

    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute()
      } else {
        playerRef.current.mute()
      }
    }
  }, [isMuted])

  // YouTube API ready handler
  const onYouTubeIframeAPIReady = useCallback(() => {
    if (!window.YT || !iframeRef.current) return

    playerRef.current = new window.YT.Player(iframeRef.current, {
      events: {
        onReady: () => {
          setIsLoading(false)
          if (autoplay && userInteracted) {
            setIsPlaying(true)
          }
        },
        onStateChange: (event: any) => {
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING)
        },
      },
    })
  }, [autoplay, userInteracted])

  // Load YouTube API when video should be loaded
  useEffect(() => {
    if (!shouldLoadVideo) return

    // Load YouTube API if not already loaded
    if (!window.YT) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      document.head.appendChild(script)

      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady
    } else {
      onYouTubeIframeAPIReady()
    }
  }, [shouldLoadVideo, onYouTubeIframeAPIReady])

  // Generate thumbnail URL
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  return (
    <div
      ref={containerRef}
      className={`relative aspect-video bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg overflow-hidden group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={handleUserInteraction}
    >
      {/* Placeholder/Thumbnail */}
      {!shouldLoadVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          {placeholder ? (
            <Image
              src={placeholder}
              alt={title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => {
                // Fallback to a default gradient if thumbnail fails
                const img = document.querySelector(`img[alt="${title}"]`) as HTMLImageElement
                if (img) {
                  img.style.display = 'none'
                }
              }}
            />
          )}

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
            <Button
              size="lg"
              className="rounded-full bg-white/90 hover:bg-white text-black hover:text-black shadow-lg"
              onClick={handlePlayPause}
            >
              <Play className="h-8 w-8 ml-1" />
            </Button>
          </div>

          {/* Loading indicator when in view */}
          {isInView && (
            <div className="absolute top-4 left-4 text-white/80 text-sm">Loading video...</div>
          )}
        </div>
      )}

      {/* YouTube Video */}
      {shouldLoadVideo && embedUrl && (
        <>
          <iframe
            ref={iframeRef}
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
            onLoad={() => setIsLoading(false)}
          />

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-white text-center">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mb-2 mx-auto"></div>
                <p className="text-sm">Loading video...</p>
              </div>
            </div>
          )}

          {/* Custom Controls */}
          {showControls && !isLoading && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-black/50 hover:bg-black/70 text-white border-0"
                onClick={handlePlayPause}
              >
                <Play className={`h-4 w-4 ${isPlaying ? 'hidden' : 'block'}`} />
                <span className={`h-4 w-4 ${isPlaying ? 'block' : 'hidden'}`}>⏸</span>
              </Button>

              <Button
                size="sm"
                variant="secondary"
                className="bg-black/50 hover:bg-black/70 text-white border-0"
                onClick={handleMuteToggle}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Extend window type for YouTube API
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}
