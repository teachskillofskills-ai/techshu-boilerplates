'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useOptimizedCache } from '@/hooks/useOptimizedStorage'

interface BookmarkButtonProps {
  userId: string
  courseId: string
  chapterId: string
  className?: string
}

export function BookmarkButton({
  userId,
  courseId,
  chapterId,
  className = '',
}: BookmarkButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  // Use optimized cache for bookmark storage (24 hours TTL)
  const bookmarkKey = `bookmark_${userId}_${courseId}_${chapterId}`
  const [isBookmarked, setIsBookmarked] = useOptimizedCache<boolean>(
    bookmarkKey,
    24 * 60 * 60 * 1000, // 24 hours
    false
  )

  const toggleBookmark = async () => {
    setIsLoading(true)

    try {
      if (isBookmarked) {
        // Remove bookmark
        await setIsBookmarked(null)
      } else {
        // Add bookmark
        await setIsBookmarked(true)
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={isBookmarked ? 'default' : 'outline'}
      size="sm"
      onClick={toggleBookmark}
      disabled={isLoading}
      className={className}
    >
      {isBookmarked ? (
        <BookmarkCheck className="h-4 w-4 mr-2" />
      ) : (
        <Bookmark className="h-4 w-4 mr-2" />
      )}
      {isBookmarked ? 'Bookmarked' : 'Bookmark'}
    </Button>
  )
}
