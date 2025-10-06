'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, Circle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ModernProgressTrackerProps {
  userId: string
  courseId: string
  chapterId: string
  currentProgress: number
}

export function ModernProgressTracker({
  userId,
  courseId,
  chapterId,
  currentProgress,
}: ModernProgressTrackerProps) {
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
    <div className="text-center space-y-4">
      <div className="flex items-center gap-2 justify-center">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"></div>
        <h3 className="text-lg font-semibold text-slate-900">Chapter Progress</h3>
      </div>

      <div className="flex justify-center">
        {isCompleted ? (
          <Button
            variant="outline"
            size="lg"
            onClick={markAsIncomplete}
            disabled={isUpdating}
            className="bg-gradient-to-r from-accent/10 to-accent/20 border-accent/20 text-accent hover:bg-gradient-to-r hover:from-accent/20 hover:to-accent/30"
          >
            {isUpdating ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-5 w-5 mr-2" />
            )}
            Completed
          </Button>
        ) : (
          <Button variant="learning" size="lg" onClick={markAsComplete} disabled={isUpdating}>
            {isUpdating ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Circle className="h-5 w-5 mr-2" />
            )}
            Mark Complete
          </Button>
        )}
      </div>

      <p className="text-sm text-slate-600">
        {isCompleted
          ? "Great job! You've completed this chapter."
          : "Mark as complete when you're ready to move on."}
      </p>
    </div>
  )
}
