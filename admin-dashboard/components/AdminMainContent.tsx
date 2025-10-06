'use client'

import { useAdmin } from './AdminContext'

interface AdminMainContentProps {
  children: React.ReactNode
}

export function AdminMainContent({ children }: AdminMainContentProps) {
  const { sidebarCollapsed } = useAdmin()

  return (
    <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'}`}>
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </div>
    </main>
  )
}
