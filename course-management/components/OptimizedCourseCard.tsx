'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { OptimizedImage, CourseImage } from '@/components/ui/OptimizedImage'
import { CourseCardSkeleton } from '@/components/ui/LoadingSkeleton'
import { Clock, Users, BookOpen, Star, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Course {
  id: string
  title: string
  description: string | null
  slug: string
  thumbnail_url?: string | null
  estimated_duration?: number | null
  difficulty_level?: string | number | null | undefined
  is_featured?: boolean
  status: string
  created_at: string
}

interface OptimizedCourseCardProps {
  course: Course
  className?: string
  showDescription?: boolean
  priority?: boolean
  lazy?: boolean
}

export function OptimizedCourseCard({
  course,
  className,
  showDescription = true,
  priority = false,
  lazy = true,
}: OptimizedCourseCardProps) {
  const [isVisible, setIsVisible] = useState(!lazy || priority)
  const [imageLoaded, setImageLoaded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [lazy, priority])

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getDifficultyColor = (level: string | number | null | undefined) => {
    const levelStr = String(level).toLowerCase()
    switch (levelStr) {
      case 'beginner':
      case '1':
        return 'bg-accent/10 text-accent'
      case 'intermediate':
      case '2':
        return 'bg-secondary/10 text-secondary'
      case 'advanced':
      case '3':
        return 'bg-destructive/10 text-destructive'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getDifficultyLabel = (level: string | number | null | undefined) => {
    const levelStr = String(level).toLowerCase()
    switch (levelStr) {
      case 'beginner':
      case '1':
        return 'Beginner'
      case 'intermediate':
      case '2':
        return 'Intermediate'
      case 'advanced':
      case '3':
        return 'Advanced'
      default:
        return 'All Levels'
    }
  }

  // Show skeleton while not visible (for lazy loading)
  if (!isVisible) {
    return (
      <div ref={cardRef} className={className}>
        <CourseCardSkeleton />
      </div>
    )
  }

  return (
    <Card
      ref={cardRef}
      className={cn(
        'group hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden',
        'hover:scale-[1.02] hover:-translate-y-1',
        className
      )}
    >
      {/* Course Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {course.thumbnail_url ? (
          <CourseImage
            src={course.thumbnail_url}
            alt={`${course.title} course thumbnail`}
            fill
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#ff3968]/10 to-[#ff6b47]/10">
            <div className="text-center">
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-2 mx-auto shadow-sm">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground font-medium">Course Preview</span>
            </div>
          </div>
        )}

        {/* Featured Badge */}
        {course.is_featured && (
          <Badge className="absolute top-3 left-3 bg-yellow-500 text-yellow-900 shadow-sm">
            Featured
          </Badge>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
            <Play className="h-6 w-6 text-gray-800 ml-1" />
          </div>
        </div>
      </div>

      {/* Course Content */}
      <CardHeader className="flex-1 pb-2">
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </CardTitle>
          {course.difficulty_level && (
            <Badge
              variant="secondary"
              className={cn('text-xs shrink-0', getDifficultyColor(course.difficulty_level))}
            >
              {getDifficultyLabel(course.difficulty_level)}
            </Badge>
          )}
        </div>

        {showDescription && course.description && (
          <CardDescription className="line-clamp-3 text-sm leading-relaxed">
            {course.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Course Meta */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          {course.estimated_duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(course.estimated_duration)}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Level: {getDifficultyLabel(course.difficulty_level)}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/courses/${course.slug}`} className="block">
          <Button variant="learning" className="w-full" size="sm">
            View Course
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

// Optimized Course Grid Component
interface OptimizedCourseGridProps {
  courses: Course[]
  loading?: boolean
  className?: string
  showDescription?: boolean
  priorityCount?: number
}

export function OptimizedCourseGrid({
  courses,
  loading = false,
  className,
  showDescription = true,
  priorityCount = 3,
}: OptimizedCourseGridProps) {
  if (loading) {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!courses.length) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
        <p className="text-gray-600">Check back later for new courses.</p>
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {courses.map((course, index) => (
        <OptimizedCourseCard
          key={course.id}
          course={course}
          showDescription={showDescription}
          priority={index < priorityCount}
          lazy={index >= priorityCount}
        />
      ))}
    </div>
  )
}

// Compact Course Card for sidebars
export function CompactCourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.slug}`}>
      <Card className="hover:shadow-md transition-shadow p-3">
        <div className="flex gap-3">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br from-[#ff3968]/10 to-[#ff6b47]/10">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm line-clamp-2 mb-1">{course.title}</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {course.estimated_duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(course.estimated_duration)}
                </span>
              )}
              {course.difficulty_level && (
                <Badge variant="outline" className="text-xs">
                  {course.difficulty_level}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

// Helper function for formatting duration
function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}
