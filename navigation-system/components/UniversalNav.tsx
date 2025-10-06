'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useUserRoles } from '@/lib/auth/client'
import { LoadingLink } from '@/components/ui/LoadingLink'
import SignOutButton from '@/components/auth/SignOutButton'
import { Bell, Search, Settings, Menu } from 'lucide-react'
import { NotificationCenter } from '@/components/notifications/NotificationCenter'
import { SearchBar } from '@/components/search/SearchBar'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface UniversalNavProps {
  variant?: 'public' | 'dashboard' | 'course'
  currentPage?: string
}

export function UniversalNav({ variant = 'public', currentPage }: UniversalNavProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { userRoles } = useUserRoles()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(profile)
      }
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      if (!session?.user) {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const isAdmin = userRoles?.isAdmin || userRoles?.isSuperAdmin
  const isApproved = profile?.approval_status === 'approved'

  if (loading) {
    return (
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#ff3968] to-[#ff6b47] rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">TS</span>
              </div>
              <span className="text-xl brand-title">TechShu SkillHub</span>
            </div>
            <div className="w-32 h-8 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </header>
    )
  }

  // If user is logged in, show dashboard navigation
  if (user && variant !== 'public') {
    return (
      <nav className="bg-background shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo and main nav */}
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#ff3968] to-[#ff6b47] rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">TS</span>
                </div>
                <span className="text-xl brand-title">TechShu SkillHub</span>
              </Link>

              <div className="hidden md:flex md:space-x-6">
                <LoadingLink
                  href="/dashboard"
                  className={`font-medium transition-colors ${
                    currentPage === 'dashboard'
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </LoadingLink>
                <LoadingLink
                  href="/courses"
                  className={`font-medium transition-colors ${
                    currentPage === 'courses'
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Courses
                </LoadingLink>
                {(isApproved || isAdmin) && (
                  <LoadingLink
                    href="/dashboard/progress"
                    className={`font-medium transition-colors ${
                      currentPage === 'progress'
                        ? 'text-blue-600'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    Progress
                  </LoadingLink>
                )}
                {isAdmin && (
                  <LoadingLink
                    href="/admin"
                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Admin
                  </LoadingLink>
                )}
              </div>
            </div>

            {/* Right side - Search, notifications, user menu */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="hidden lg:block w-56">
                <SearchBar placeholder="Search courses..." />
              </div>

              {/* Notifications */}
              <NotificationCenter userId={user.id} />

              {/* User info */}
              <div className="flex items-center space-x-2">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                    {profile?.full_name || user.email}
                  </div>
                  <div className="text-xs text-gray-500">
                    {isAdmin
                      ? userRoles?.isSuperAdmin
                        ? 'Super Admin'
                        : 'Admin'
                      : isApproved
                        ? 'Student'
                        : 'Pending Approval'}
                  </div>
                </div>

                {/* Profile Avatar */}
                <div className="w-8 h-8 bg-gradient-to-br from-[#eab308]/20 to-[#f59e0b]/20 rounded-full flex items-center justify-center border border-[#eab308]/30">
                  <span className="text-sm font-medium text-[#eab308]">
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

  // Public navigation for non-logged-in users or public variant
  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#ff3968] to-[#ff6b47] rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">TS</span>
              </div>
              <span className="text-xl brand-title">TechShu SkillHub</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <LoadingLink
              href="/courses"
              className={`transition-colors ${
                currentPage === 'courses'
                  ? 'text-[#eab308] font-medium'
                  : 'text-muted-foreground hover:text-[#eab308]'
              }`}
            >
              Courses
            </LoadingLink>
            <LoadingLink
              href="/instructors"
              className={`transition-colors ${
                currentPage === 'instructors'
                  ? 'text-[#eab308] font-medium'
                  : 'text-muted-foreground hover:text-[#eab308]'
              }`}
            >
              Instructors
            </LoadingLink>

            <LoadingLink
              href="/about"
              className={`transition-colors ${
                currentPage === 'about'
                  ? 'text-[#eab308] font-medium'
                  : 'text-muted-foreground hover:text-[#eab308]'
              }`}
            >
              About
            </LoadingLink>
            <LoadingLink
              href="/contact"
              className={`transition-colors ${
                currentPage === 'contact'
                  ? 'text-[#eab308] font-medium'
                  : 'text-muted-foreground hover:text-[#eab308]'
              }`}
            >
              Contact
            </LoadingLink>
          </nav>

          <div className="flex items-center space-x-3">
            <div className="hidden lg:block w-64">
              <SearchBar placeholder="Search courses..." />
            </div>

            <ThemeToggle />

            {user ? (
              // Show user menu if logged in
              <div className="flex items-center space-x-3">
                <Button variant="outline" asChild>
                  <LoadingLink href="/dashboard">Dashboard</LoadingLink>
                </Button>
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {(profile?.full_name || user.email || '').charAt(0).toUpperCase()}
                  </span>
                </div>
                <SignOutButton />
              </div>
            ) : (
              // Show sign in/up buttons if not logged in
              <>
                <Button variant="ghost" asChild>
                  <LoadingLink href="/auth/signin">Sign In</LoadingLink>
                </Button>
                <Button variant="learning" asChild>
                  <LoadingLink href="/auth/signup">Get Started</LoadingLink>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
