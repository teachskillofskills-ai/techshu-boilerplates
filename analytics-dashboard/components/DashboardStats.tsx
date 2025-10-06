'use client'

import { Database } from '@/lib/supabase/supabase-types'
import { BookOpen, Target, Award, Clock } from 'lucide-react'

type Enrollment = Database['public']['Tables']['enrollments']['Row'] & {
  courses: Database['public']['Tables']['courses']['Row'] | null
}

type Progress = Database['public']['Tables']['progress']['Row'] & {
  chapters:
    | (Database['public']['Tables']['chapters']['Row'] & {
        courses: Database['public']['Tables']['courses']['Row'] | null
      })
    | null
}

interface DashboardStatsProps {
  enrollments: Enrollment[]
  progress: Progress[]
}

export function DashboardStats({ enrollments, progress }: DashboardStatsProps) {
  // Calculate stats
  const totalCourses = enrollments.length
  const completedCourses = enrollments.filter(e => e.completed_at).length
  const inProgressCourses = totalCourses - completedCourses

  const totalChapters = progress.length
  const completedChapters = progress.filter(p => p.status === 'completed').length
  const completionRate =
    totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0

  const stats = [
    {
      name: 'Enrolled Courses',
      value: totalCourses,
      icon: BookOpen,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      name: 'In Progress',
      value: inProgressCourses,
      icon: Clock,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      name: 'Completed',
      value: completedCourses,
      icon: Award,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      name: 'Completion Rate',
      value: `${completionRate}%`,
      icon: Target,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map(stat => (
        <div key={stat.name} className="bg-card rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
              <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
