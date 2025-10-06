'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useAdmin } from './AdminContext'
import { LoadingLink } from '@/components/ui/LoadingLink'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Shield,
  BarChart3,
  Settings,
  FileText,
  Upload,
  UserCheck,
  Database,
  ChevronLeft,
  Menu,
  X,
  AlertTriangle,
  Activity,
} from 'lucide-react'

interface AdminSidebarProps {
  isSuperAdmin?: boolean
}

const navigationItems = [
  {
    title: 'Overview',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'System overview and stats',
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: Users,
    description: 'Manage users and approvals',
  },
  {
    title: 'Course Management',
    href: '/admin/courses',
    icon: BookOpen,
    description: 'Create and manage courses',
  },
  {
    title: 'Content Editor',
    href: '/admin/content',
    icon: FileText,
    description: 'Edit course content',
  },
  {
    title: 'File Manager',
    href: '/admin/files',
    icon: Upload,
    description: 'Manage course assets',
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'Learning analytics',
  },
]

const superAdminItems = [
  {
    title: 'Role Management',
    href: '/admin/roles',
    icon: Shield,
    description: 'Manage roles and permissions',
    superAdminOnly: true,
  },
  {
    title: 'System Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'System configuration',
    superAdminOnly: true,
  },
  {
    title: 'Database',
    href: '/admin/database',
    icon: Database,
    description: 'Database management',
    superAdminOnly: true,
  },
]

export function AdminSidebar({ isSuperAdmin = false }: AdminSidebarProps) {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed } = useAdmin()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const allItems = [...navigationItems, ...(isSuperAdmin ? superAdminItems : [])]

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
          className="p-2.5 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-gray-600"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Fixed Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed left-0 top-16 bottom-0 z-40 ${
          sidebarCollapsed ? 'w-16' : 'w-72'
        } bg-card/95 backdrop-blur-xl border-r border-border transition-all duration-300 ease-out shadow-2xl lg:shadow-none overflow-hidden`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-border lg:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ef4444] to-[#f97316] flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">TechShu SkillHub Admin</h2>
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
        <div className="flex flex-col h-full overflow-hidden">
          {/* Sidebar Header with Collapse Button */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-[#ef4444]/10 to-[#f97316]/10 flex-shrink-0">
            {!sidebarCollapsed && (
              <div className="flex flex-col gap-1">
                <h2 className="text-sm font-semibold text-foreground">TechShu SkillHub</h2>
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-[#ef4444]" />
                  <span className="text-xs font-medium text-[#ef4444]">
                    {isSuperAdmin ? 'Super Admin' : 'Admin'}
                  </span>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronLeft
                className={`h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform duration-200 ${sidebarCollapsed ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex flex-col flex-grow overflow-hidden">
            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {allItems.map(item => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <LoadingLink
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group flex items-center transition-all duration-200 hover:scale-[1.02]',
                      sidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-3',
                      'mx-1 rounded-xl',
                      isActive
                        ? 'bg-gradient-to-r from-[#ff3968]/10 to-[#ff6b47]/10 border border-[#ff3968]/20 shadow-sm text-[#ff3968]'
                        : 'hover:bg-muted/50 hover:shadow-sm text-muted-foreground hover:text-foreground'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon
                      className={cn(
                        'flex-shrink-0 w-5 h-5 transition-colors',
                        isActive
                          ? 'text-[#ef4444]'
                          : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    {!sidebarCollapsed && (
                      <>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{item.title}</div>
                          <div
                            className={cn(
                              'text-xs',
                              isActive ? 'text-[#ef4444]' : 'text-muted-foreground'
                            )}
                          >
                            {item.description}
                          </div>
                        </div>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-[#ef4444] rounded-full"></div>
                        )}
                      </>
                    )}
                    {sidebarCollapsed && isActive && (
                      <div className="absolute right-1 w-2 h-2 bg-[#ef4444] rounded-full"></div>
                    )}
                  </LoadingLink>
                )
              })}
            </nav>

            {/* Quick Actions & System Status - Fixed Footer */}
            <div className="flex-shrink-0 p-4 border-t border-border bg-muted/50">
              {!sidebarCollapsed ? (
                <div className="space-y-4">
                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Quick Actions
                    </h3>
                    <div className="space-y-1">
                      <LoadingLink
                        href="/admin/users?filter=pending"
                        className="group flex items-center space-x-2 px-2 py-1.5 text-xs text-foreground hover:bg-[#ff3968] hover:text-white rounded-md transition-colors"
                      >
                        <UserCheck className="h-3 w-3 text-[#f97316] group-hover:text-white" />
                        <span>Pending Approvals</span>
                      </LoadingLink>
                      <LoadingLink
                        href="/teaching/courses/new"
                        className="group flex items-center space-x-2 px-2 py-1.5 text-xs text-foreground hover:bg-[#ff3968] hover:text-white rounded-md transition-colors"
                      >
                        <BookOpen className="h-3 w-3 text-[#ff3968] group-hover:text-white" />
                        <span>Create Course</span>
                      </LoadingLink>
                    </div>
                  </div>

                  {/* System Status */}
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      System Status
                    </h3>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Database</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></div>
                          <span className="text-[#10b981] text-xs">Online</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Storage</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></div>
                          <span className="text-[#10b981] text-xs">Online</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Auth</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></div>
                          <span className="text-[#10b981] text-xs">Online</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-[#f97316]" />
                  <Activity className="h-4 w-4 text-[#10b981]" />
                  <div className="w-1 h-1 bg-[#ef4444] rounded-full"></div>
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
