'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LoadingLink } from '@/components/ui/LoadingLink'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Clock, PlayCircle } from 'lucide-react'

interface Chapter {
  id: string
  title: string
  description?: string
  order_index: number
  estimated_duration?: number
  is_published: boolean
}

interface UserProgress {
  chapter_id: string
  progress_percentage: number
  status: 'not_started' | 'in_progress' | 'completed'
}

interface ChapterNavigationProps {
  courseSlug: string
  chapters: Chapter[]
  currentChapterId: string
  userProgress: UserProgress[]
}

export function ChapterNavigation({
  courseSlug,
  chapters,
  currentChapterId,
  userProgress,
}: ChapterNavigationProps) {
  const sortedChapters = chapters
    .filter(chapter => chapter.is_published)
    .sort((a, b) => a.order_index - b.order_index)

  const getChapterProgress = (chapterId: string) => {
    return userProgress.find(p => p.chapter_id === chapterId)
  }

  const getProgressIcon = (chapterId: string, index: number) => {
    const progress = getChapterProgress(chapterId)

    if (progress?.status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    } else if (progress?.status === 'in_progress') {
      return <PlayCircle className="h-5 w-5 text-blue-600" />
    } else {
      return (
        <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-600">{index + 1}</span>
        </div>
      )
    }
  }

  const getProgressPercentage = (chapterId: string) => {
    const progress = getChapterProgress(chapterId)
    return progress?.progress_percentage || 0
  }

  const completedChapters = userProgress.filter(p => p.status === 'completed').length
  const overallProgress = (completedChapters / sortedChapters.length) * 100

  return (
    <div className="bg-white border-r h-full">
      <div className="p-6">
        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-gray-900">Course Progress</h2>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(overallProgress)}%
            </span>
          </div>
          <Progress value={overallProgress} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">
            {completedChapters} of {sortedChapters.length} chapters completed
          </p>
        </div>

        {/* Chapter List */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 text-sm uppercase tracking-wide">Chapters</h3>

          {sortedChapters.map((chapter, index) => {
            const progress = getChapterProgress(chapter.id)
            const isCurrent = chapter.id === currentChapterId
            const isCompleted = progress?.status === 'completed'
            const progressPercentage = getProgressPercentage(chapter.id)

            return (
              <Link
                key={chapter.id}
                href={`/courses/${courseSlug}/learn/${chapter.id}`}
                className={`block p-4 rounded-lg border transition-all duration-200 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-[#ff3968]/10 to-[#ff6b47]/10 border-[#ff3968]/30 shadow-sm'
                    : 'hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Progress Icon */}
                  <div className="flex-shrink-0 mt-1">{getProgressIcon(chapter.id, index)}</div>

                  {/* Chapter Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4
                        className={`text-sm font-medium truncate ${
                          isCurrent ? 'text-blue-900' : 'text-gray-900'
                        }`}
                      >
                        {chapter.title}
                      </h4>
                      {isCurrent && (
                        <Badge variant="secondary" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>

                    {chapter.description && (
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {chapter.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{chapter.estimated_duration || 0} min</span>
                      </div>

                      {progress && progressPercentage > 0 && progressPercentage < 100 && (
                        <span className="text-xs text-blue-600 font-medium">
                          {progressPercentage}%
                        </span>
                      )}
                    </div>

                    {/* Progress Bar for In-Progress Chapters */}
                    {progress && progressPercentage > 0 && progressPercentage < 100 && (
                      <div className="mt-2">
                        <Progress value={progressPercentage} className="h-1" />
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Course Actions */}
        <div className="mt-8 pt-6 border-t">
          <div className="space-y-3">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <LoadingLink href={`/courses/${courseSlug}`}>Course Overview</LoadingLink>
            </Button>

            <Button variant="ghost" size="sm" className="w-full" asChild>
              <LoadingLink href="/dashboard">Back to Dashboard</LoadingLink>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
