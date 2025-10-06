'use client'

import { Database } from '@/lib/supabase/supabase-types'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Circle, Clock } from 'lucide-react'

type ProgressData = Database['public']['Tables']['progress']['Row'] & {
  chapters:
    | (Database['public']['Tables']['chapters']['Row'] & {
        courses: Database['public']['Tables']['courses']['Row'] | null
      })
    | null
}

interface ProgressOverviewProps {
  progress: ProgressData[]
}

export function ProgressOverview({ progress }: ProgressOverviewProps) {
  // Group progress by course
  const progressByCourse = progress.reduce(
    (acc, p) => {
      if (!p.chapters?.courses) return acc

      const courseId = p.chapters.courses.id
      const courseTitle = p.chapters.courses.title

      if (!acc[courseId]) {
        acc[courseId] = {
          courseTitle,
          chapters: [],
        }
      }

      acc[courseId].chapters.push(p)
      return acc
    },
    {} as Record<string, { courseTitle: string; chapters: ProgressData[] }>
  )

  if (Object.keys(progressByCourse).length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Progress Overview</h2>
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No progress data available yet.</p>
          <p className="text-sm text-muted-foreground/70 mt-2">
            Start learning to see your progress here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Progress Overview</h2>

      <div className="space-y-6">
        {Object.entries(progressByCourse).map(([courseId, courseData]) => {
          const totalChapters = courseData.chapters.length
          const completedChapters = courseData.chapters.filter(c => c.status === 'completed').length
          const inProgressChapters = courseData.chapters.filter(
            c => c.status === 'in_progress'
          ).length
          const progressPercentage =
            totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0

          return (
            <div key={courseId} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-foreground">{courseData.courseTitle}</h3>
                <span className="text-sm text-muted-foreground">
                  {completedChapters}/{totalChapters} chapters
                </span>
              </div>

              <Progress value={progressPercentage} className="mb-3" />

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-1" />
                    {completedChapters} completed
                  </div>
                  {inProgressChapters > 0 && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-secondary mr-1" />
                      {inProgressChapters} in progress
                    </div>
                  )}
                  {totalChapters - completedChapters - inProgressChapters > 0 && (
                    <div className="flex items-center">
                      <Circle className="h-4 w-4 text-muted-foreground mr-1" />
                      {totalChapters - completedChapters - inProgressChapters} not started
                    </div>
                  )}
                </div>
                <span className="font-medium">{Math.round(progressPercentage)}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
