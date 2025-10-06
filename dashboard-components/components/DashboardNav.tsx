'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/supabase-types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LoadingLink } from '@/components/ui/LoadingLink'
import { useUserRoles } from '@/lib/auth/client'
import SignOutButton from '@/components/auth/SignOutButton'
import { Bell, Search, Settings } from 'lucide-react'
import { NotificationCenter } from '@/components/notifications/NotificationCenter'
import { GlobalSearch } from '@/components/search/GlobalSearch'
import { ThemeToggle } from '@/components/ui/theme-toggle'

type Profile = Database['public']['Tables']['profiles']['Row']

interface DashboardNavProps {
  user: User
  profile: Profile | null
}

export function DashboardNav({ user, profile }: DashboardNavProps) {
  const [mounted, setMounted] = useState(false)
  const { userRoles } = useUserRoles()
  const isAdmin = userRoles?.isAdmin || userRoles?.isSuperAdmin
  const isApproved = profile?.approval_status === 'approved'

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="bg-background shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and main nav */}
          <div className="flex items-center space-x-8">
            <LoadingLink href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#ff3968] to-[#ff6b47] rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">TS</span>
              </div>
              <span className="text-xl brand-title">TechShu SkillHub</span>
            </LoadingLink>

            <div className="hidden md:flex md:space-x-6">
              <LoadingLink
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                Dashboard
              </LoadingLink>
              <LoadingLink
                href="/courses"
                className="text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                Courses
              </LoadingLink>
              {(mounted ? isApproved || isAdmin : true) && (
                <LoadingLink
                  href="/dashboard/progress"
                  className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  Progress
                </LoadingLink>
              )}
              {(mounted ? isAdmin : true) && (
                <LoadingLink
                  href="/admin"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Admin
                </LoadingLink>
              )}
            </div>
          </div>

          {/* Right side - Search, notifications, profile */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="hidden lg:block w-56">
              <GlobalSearch placeholder="Search courses..." />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <NotificationCenter userId={user.id} />

            {/* User info */}
            <div className="flex items-center space-x-2">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-foreground truncate max-w-32">
                  {profile?.full_name || user.email}
                </div>
                <div className="text-xs text-muted-foreground">
                  {mounted
                    ? isAdmin
                      ? userRoles?.isSuperAdmin
                        ? 'Super Admin'
                        : 'Admin'
                      : isApproved
                        ? 'Student'
                        : 'Pending Approval'
                    : 'Loading...'}
                </div>
              </div>

              {/* Profile Avatar */}
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {(profile?.full_name || user.email || '').charAt(0).toUpperCase()}
                </span>
              </div>

              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
