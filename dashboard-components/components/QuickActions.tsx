'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useUserRoles } from '@/lib/auth/client'
import { BookOpen, FileText, Users, Settings, PlusCircle, Search } from 'lucide-react'

export function QuickActions() {
  const { userRoles } = useUserRoles()

  const studentActions = [
    {
      name: 'Browse Courses',
      description: 'Discover new courses to learn',
      href: '/courses',
      icon: BookOpen,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      name: 'My Notes',
      description: 'Review your learning notes',
      href: '/notes',
      icon: FileText,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      name: 'Search Content',
      description: 'Find specific topics',
      href: '/search',
      icon: Search,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      name: 'Settings',
      description: 'Manage your account preferences',
      href: '/dashboard/settings',
      icon: Settings,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
  ]

  const instructorActions = [
    {
      name: 'Create Course',
      description: 'Start building a new course',
      href: '/teaching/courses/new',
      icon: PlusCircle,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      name: 'Manage Students',
      description: 'View student progress',
      href: '/teaching/students',
      icon: Users,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
  ]

  const adminActions = [
    {
      name: 'Admin Panel',
      description: 'Manage users and system',
      href: '/admin',
      icon: Settings,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ]

  let actions = [...studentActions]

  if (userRoles?.isInstructor) {
    actions = [...actions, ...instructorActions]
  }

  if (userRoles?.isAdmin) {
    actions = [...actions, ...adminActions]
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>

      <div className="space-y-3">
        {actions.map(action => (
          <Button
            key={action.name}
            variant="ghost"
            className="w-full justify-start h-auto p-4 hover:bg-primary/10 hover:text-foreground group"
            asChild
          >
            <Link href={action.href}>
              <div
                className={`p-2 rounded-lg ${action.bgColor} mr-3 group-hover:bg-primary/20 transition-colors`}
              >
                <action.icon
                  className={`h-5 w-5 ${action.color} group-hover:text-primary transition-colors`}
                />
              </div>
              <div className="text-left">
                <div className="font-medium text-foreground group-hover:text-foreground">
                  {action.name}
                </div>
                <div className="text-sm text-muted-foreground group-hover:text-foreground/80">
                  {action.description}
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
