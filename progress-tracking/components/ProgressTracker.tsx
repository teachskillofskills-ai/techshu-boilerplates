'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, Circle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ProgressTrackerProps {
  userId: string
  courseId: string
  chapterId: string
  currentProgress: number
}

export function ProgressTracker({
  userId,
  courseId,
  chapterId,
  currentProgress,
}: ProgressTrackerProps) {
  const [progress, setProgress] = useState(currentProgress)
  const [isUpdating, setIsUpdating] = useState(false)
  const supabase = createClient()

  const updateProgress = async (
    newProgress: number,
    status: 'not_started' | 'in_progress' | 'completed'
  ) => {
    setIsUpdating(true)

    try {
      const { error } = await supabase.from('progress').upsert(
        {
          user_id: userId,
          course_id: courseId,
          chapter_id: chapterId,
          progress_percentage: newProgress,
          status: status,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,course_id,chapter_id',
        }
      )

      if (error) {
        console.error('Error updating progress:', error)
      } else {
        setProgress(newProgress)
      }
    } catch (error) {
      console.error('Error updating progress:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const markAsComplete = () => {
    updateProgress(100, 'completed')
  }

  const markAsIncomplete = () => {
    updateProgress(0, 'not_started')
  }

  const isCompleted = progress >= 100

  return (
    <div className="flex items-center space-x-2">
      {isCompleted ? (
        <Button
          variant="outline"
          size="sm"
          onClick={markAsIncomplete}
          disabled={isUpdating}
          className="text-[#10b981] border-[#10b981] hover:bg-gradient-to-r hover:from-[#10b981]/5 hover:to-[#059669]/5"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Completed
        </Button>
      ) : (
        <Button variant="learning" size="sm" onClick={markAsComplete} disabled={isUpdating}>
          <Circle className="h-4 w-4 mr-2" />
          Mark Complete
        </Button>
      )}
    </div>
  )
}
