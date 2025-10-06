'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ModernBookmarkButtonProps {
  userId: string
  courseId: string
  chapterId: string
  className?: string
}

export function ModernBookmarkButton({
  userId,
  courseId,
  chapterId,
  className = '',
}: ModernBookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    checkBookmarkStatus()
  }, [userId, courseId, chapterId])

  const checkBookmarkStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('chapter_id', chapterId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking bookmark status:', error)
      } else {
        setIsBookmarked(!!data)
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error)
    }
  }

  const toggleBookmark = async () => {
    setIsLoading(true)

    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', userId)
          .eq('course_id', courseId)
          .eq('chapter_id', chapterId)

        if (error) {
          console.error('Error removing bookmark:', error)
        } else {
          setIsBookmarked(false)
        }
      } else {
        const { error } = await supabase.from('bookmarks').insert({
          user_id: userId,
          course_id: courseId,
          chapter_id: chapterId,
        })

        if (error) {
          console.error('Error adding bookmark:', error)
        } else {
          setIsBookmarked(true)
        }
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
      className={`${
        isBookmarked
          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
          : 'bg-white/50 border-slate-200/60 hover:bg-white/80 text-slate-700'
      } ${className}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : isBookmarked ? (
        <BookmarkCheck className="h-4 w-4 mr-2" />
      ) : (
        <Bookmark className="h-4 w-4 mr-2" />
      )}
      {isBookmarked ? 'Bookmarked' : 'Bookmark'}
    </Button>
  )
}
