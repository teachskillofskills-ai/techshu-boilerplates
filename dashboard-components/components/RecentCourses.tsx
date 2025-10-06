'use client'

import { Database } from '@/lib/supabase/supabase-types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Clock, BookOpen, ArrowRight } from 'lucide-react'

type Enrollment = Database['public']['Tables']['enrollments']['Row'] & {
  courses: Database['public']['Tables']['courses']['Row'] | null
}

interface RecentCoursesProps {
  enrollments: Enrollment[]
}

export function RecentCourses({ enrollments }: RecentCoursesProps) {
  // Sort by enrollment date and take the 3 most recent
  const recentEnrollments = enrollments
    .sort((a, b) => new Date(b.enrolled_at).getTime() - new Date(a.enrolled_at).getTime())
    .slice(0, 3)

  if (recentEnrollments.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Courses</h2>
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            You haven&apos;t enrolled in any courses yet.
          </p>
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Courses</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/courses">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {recentEnrollments.map(enrollment => {
          const course = enrollment.courses
          if (!course) return null

          return (
            <div
              key={enrollment.id}
              className="flex items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              {/* Course thumbnail placeholder */}
              <div className="w-16 h-16 bg-gradient-to-br from-[#ff3968] to-[#ff6b47] rounded-lg flex items-center justify-center text-white font-semibold text-lg">
                {course.title.charAt(0)}
              </div>

              <div className="ml-4 flex-1">
                <h3 className="font-medium text-foreground">{course.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {course.estimated_duration ? `${course.estimated_duration} min` : 'Self-paced'}
                  <span className="mx-2">•</span>
                  <span className="capitalize">Level {course.difficulty_level}</span>
                </div>
              </div>

              <div className="ml-4">
                <Button size="sm" asChild>
                  <Link href={`/courses/${course.slug}`}>
                    {enrollment.completed_at ? 'Review' : 'Continue'}
                  </Link>
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
