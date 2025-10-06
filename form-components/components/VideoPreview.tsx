'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Video platform configurations (same as VideoEmbed)
const VIDEO_PLATFORMS = {
  youtube: {
    name: 'YouTube',
    embedUrl: (id: string) => `https://www.youtube.com/embed/${id}`,
    thumbnailUrl: (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
    extractId: (url: string) => {
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
      ]
      for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
      }
      return null
    },
  },
  vimeo: {
    name: 'Vimeo',
    embedUrl: (id: string) => `https://player.vimeo.com/video/${id}`,
    thumbnailUrl: (id: string) => `https://vumbnail.com/${id}.jpg`,
    extractId: (url: string) => {
      const patterns = [/vimeo\.com\/(\d+)/, /player\.vimeo\.com\/video\/(\d+)/]
      for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
      }
      return null
    },
  },
  loom: {
    name: 'Loom',
    embedUrl: (id: string) => `https://www.loom.com/embed/${id}`,
    thumbnailUrl: (id: string) => `https://cdn.loom.com/sessions/thumbnails/${id}-00001.gif`,
    extractId: (url: string) => {
      const patterns = [/loom\.com\/share\/([a-zA-Z0-9]+)/, /loom\.com\/embed\/([a-zA-Z0-9]+)/]
      for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
      }
      return null
    },
  },
  wistia: {
    name: 'Wistia',
    embedUrl: (id: string) => `https://fast.wistia.net/embed/iframe/${id}`,
    thumbnailUrl: (id: string) => `https://embed-fastly.wistia.com/deliveries/${id}.jpg`,
    extractId: (url: string) => {
      const patterns = [
        /wistia\.net\/medias\/([a-zA-Z0-9]+)/,
        /wistia\.com\/medias\/([a-zA-Z0-9]+)/,
        /fast\.wistia\.net\/embed\/iframe\/([a-zA-Z0-9]+)/,
      ]
      for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
      }
      return null
    },
  },
  twitch: {
    name: 'Twitch',
    embedUrl: (id: string) =>
      `https://player.twitch.tv/?video=${id}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}`,
    thumbnailUrl: (id: string) =>
      `https://static-cdn.jtvnw.net/cf_vods/d2nvs31859zcd8/twitchvod/${id}/thumb/thumb0-320x240.jpg`,
    extractId: (url: string) => {
      const patterns = [/twitch\.tv\/videos\/(\d+)/, /player\.twitch\.tv\/\?video=(\d+)/]
      for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
      }
      return null
    },
  },
  dailymotion: {
    name: 'Dailymotion',
    embedUrl: (id: string) => `https://www.dailymotion.com/embed/video/${id}`,
    thumbnailUrl: (id: string) => `https://www.dailymotion.com/thumbnail/video/${id}`,
    extractId: (url: string) => {
      const patterns = [
        /dailymotion\.com\/video\/([a-zA-Z0-9]+)/,
        /dailymotion\.com\/embed\/video\/([a-zA-Z0-9]+)/,
      ]
      for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
      }
      return null
    },
  },
}

// Detect platform from URL
const detectPlatform = (url: string): string | null => {
  for (const [platform, config] of Object.entries(VIDEO_PLATFORMS)) {
    if (config.extractId(url)) {
      return platform
    }
  }
  return null
}

// Extract video ID from URL
const extractVideoId = (url: string, platform: string): string | null => {
  const config = VIDEO_PLATFORMS[platform as keyof typeof VIDEO_PLATFORMS]
  return config ? config.extractId(url) : null
}

interface VideoPreviewProps {
  url: string
  className?: string
  showPlayButton?: boolean
  autoplay?: boolean
  width?: number
  height?: number
}

export function VideoPreview({
  url,
  className = '',
  showPlayButton = true,
  autoplay = false,
  width = 640,
  height = 360,
}: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [thumbnailError, setThumbnailError] = useState(false)

  if (!url) {
    return (
      <div
        className={`aspect-video rounded-lg flex items-center justify-center ${className}`}
        style={{
          background: 'linear-gradient(to bottom right, #dbeafe, #e0e7ff)',
        }}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 mx-auto">
            <Play className="h-8 w-8 text-blue-600" />
          </div>
          <span className="text-sm text-gray-600">Video Preview</span>
        </div>
      </div>
    )
  }

  const platform = detectPlatform(url)
  if (!platform) {
    return (
      <div
        className={`aspect-video bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2 mx-auto">
            <ExternalLink className="h-8 w-8 text-gray-400" />
          </div>
          <span className="text-sm text-gray-500">Unsupported Video URL</span>
        </div>
      </div>
    )
  }

  const videoId = extractVideoId(url, platform)
  if (!videoId) {
    return (
      <div
        className={`aspect-video bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2 mx-auto">
            <ExternalLink className="h-8 w-8 text-gray-400" />
          </div>
          <span className="text-sm text-gray-500">Invalid Video URL</span>
        </div>
      </div>
    )
  }

  const config = VIDEO_PLATFORMS[platform as keyof typeof VIDEO_PLATFORMS]
  const embedUrl = config.embedUrl(videoId)
  const thumbnailUrl = config.thumbnailUrl(videoId)

  if (isPlaying) {
    return (
      <div className={`relative ${className}`}>
        <iframe
          src={embedUrl}
          width={width}
          height={height}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full aspect-video rounded-lg"
          title={`${config.name} Video`}
        />
        <div className="absolute top-2 right-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => window.open(url, '_blank')}
            title="Open in new tab"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative group cursor-pointer ${className}`}
      onClick={() => setIsPlaying(true)}
    >
      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
        {!thumbnailError ? (
          <Image
            src={thumbnailUrl}
            alt={`${config.name} video thumbnail`}
            width={640}
            height={360}
            className="w-full h-full object-cover"
            onError={() => setThumbnailError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(to bottom right, #dbeafe, #e0e7ff)',
            }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 mx-auto">
                <Play className="h-8 w-8 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">{config.name} Video</span>
            </div>
          </div>
        )}
      </div>

      {showPlayButton && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-black/70 rounded-full flex items-center justify-center group-hover:bg-black/80 transition-colors">
            <Play className="h-8 w-8 text-white ml-1" />
          </div>
        </div>
      )}

      <div className="absolute bottom-2 left-2">
        <span className="px-2 py-1 bg-black/70 text-white text-xs rounded">{config.name}</span>
      </div>
    </div>
  )
}

export { VIDEO_PLATFORMS, detectPlatform, extractVideoId }
