'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useLoading } from '@/components/providers/LoadingProvider'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  replace?: boolean
  scroll?: boolean
}

export function LoadingLink({
  href,
  children,
  className,
  onClick,
  replace = false,
  scroll = true,
}: LoadingLinkProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isNavigating, startNavigation, stopNavigation } = useLoading()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // Call custom onClick if provided
    if (onClick) {
      onClick()
    }

    // Check if we're navigating to the same page
    const targetPath = href.split('?')[0] // Remove query params for comparison
    const currentPath = pathname.split('?')[0]

    if (targetPath === currentPath) {
      // Same page - don't show loading, just scroll if needed
      if (scroll) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }

    // Different page - start loading state and navigate
    startNavigation()

    // Add a timeout to prevent infinite loading in case navigation fails
    const timeoutId = setTimeout(() => {
      stopNavigation()
    }, 10000) // 10 second timeout

    // Navigate
    try {
      if (replace) {
        router.replace(href, { scroll })
      } else {
        router.push(href, { scroll })
      }
    } catch (error) {
      console.error('Navigation error:', error)
      clearTimeout(timeoutId)
      stopNavigation()
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-2 transition-opacity',
        isNavigating && 'opacity-50 pointer-events-none',
        className
      )}
    >
      {isNavigating && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </a>
  )
}
