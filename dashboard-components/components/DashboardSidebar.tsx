'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useUserRoles } from '@/lib/auth/client'
import { useDashboard } from './DashboardContext'
import { LoadingLink } from '@/components/ui/LoadingLink'
import {
  BookOpen,
  BarChart3,
  FileText,
  Settings,
  Users,
  GraduationCap,
  Target,
  Award,
  PlusCircle,
  Notebook,
  Trophy,
  ChevronLeft,
  Menu,
  X,
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    roles: ['student', 'instructor', 'admin', 'super_admin'],
  },
  {
    name: 'My Courses',
    href: '/courses',
    icon: BookOpen,
    roles: ['student', 'instructor', 'admin', 'super_admin'],
  },
  {
    name: 'Progress',
    href: '/dashboard/progress',
    icon: Target,
    roles: ['student', 'instructor', 'admin', 'super_admin'],
  },
  {
    name: 'Achievements',
    href: '/dashboard/achievements',
    icon: Trophy,
    roles: ['student', 'instructor', 'admin', 'super_admin'],
  },
  {
    name: 'My Notes',
    href: '/dashboard/notes',
    icon: Notebook,
    roles: ['student', 'instructor', 'admin', 'super_admin'],
  },
  {
    name: 'Create Course',
    href: '/teaching/courses/new',
    icon: PlusCircle,
    roles: ['instructor', 'admin', 'super_admin'],
  },
  {
    name: 'Teaching',
    href: '/teaching',
    icon: GraduationCap,
    roles: ['instructor', 'admin', 'super_admin'],
  },
  {
    name: 'My Students',
    href: '/teaching/students',
    icon: Users,
    roles: ['instructor', 'admin', 'super_admin'],
  },
  {
    name: 'Admin Panel',
    href: '/admin',
    icon: Users,
    roles: ['admin', 'super_admin'],
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['student', 'instructor', 'admin', 'super_admin'],
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { userRoles } = useUserRoles()
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed } = useDashboard()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredNavigation = navigation.filter(item => {
    if (!userRoles) return false
    return item.roles.some(role => userRoles.roles.includes(role))
  })

  if (!mounted) {
    return null
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2.5 rounded-xl bg-background shadow-lg hover:bg-muted transition-all duration-200 hover:scale-105 border"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Fixed Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed left-0 top-16 bottom-0 z-40 ${
          sidebarCollapsed ? 'w-16' : 'w-72'
        } bg-background/95 backdrop-blur-xl border-r transition-all duration-300 ease-out shadow-2xl lg:shadow-none overflow-hidden`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b lg:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff3968] to-[#ff6b47] flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col h-full">
          {/* Sidebar Header with Collapse Button */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-[#ff3968]/5 to-[#ff6b47]/5 dark:from-[#ff3968]/10 dark:to-[#ff6b47]/10">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-foreground">Navigation</h2>
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4 text-[#ff3968]" />
                  <span className="text-xs font-medium text-muted-foreground">Dashboard</span>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronLeft
                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${sidebarCollapsed ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex flex-col flex-grow">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {filteredNavigation.map(item => {
                const isActive = pathname === item.href
                return (
                  <LoadingLink
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center transition-all duration-200 hover:scale-[1.02]',
                      sidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-3',
                      'mx-1 rounded-xl',
                      isActive
                        ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 shadow-sm text-primary'
                        : 'hover:bg-primary/10 hover:shadow-sm text-muted-foreground hover:text-primary'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        'flex-shrink-0 w-5 h-5 transition-colors',
                        isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                      )}
                    />
                    {!sidebarCollapsed && (
                      <>
                        <span className="text-sm font-medium">{item.name}</span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </>
                    )}
                    {sidebarCollapsed && isActive && (
                      <div className="absolute right-1 w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </LoadingLink>
                )
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t bg-muted/50">
              {!sidebarCollapsed ? (
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-foreground">Keep Learning!</p>
                      <p className="text-xs text-muted-foreground">Track your progress</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Trophy className="h-5 w-5 text-primary" />
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay fixed inset-0 z-30 lg:hidden bg-black/20 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  )
}
