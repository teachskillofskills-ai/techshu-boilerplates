'use client'

import { cn } from '@/lib/utils'

interface SkipNavigationProps {
  className?: string
}

export function SkipNavigation({ className }: SkipNavigationProps) {
  return (
    <div className={cn('sr-only focus-within:not-sr-only', className)}>
      <a
        href="#main-content"
        className={cn(
          'absolute top-4 left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-md',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'transition-all duration-200 transform -translate-y-full focus:translate-y-0'
        )}
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className={cn(
          'absolute top-4 left-32 z-50 px-4 py-2 bg-blue-600 text-white rounded-md',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'transition-all duration-200 transform -translate-y-full focus:translate-y-0'
        )}
      >
        Skip to navigation
      </a>
    </div>
  )
}

// Screen reader only text component
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>
}

// Accessible heading component with proper hierarchy
interface AccessibleHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
  id?: string
}

export function AccessibleHeading({ level, children, className, id }: AccessibleHeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  return React.createElement(Tag, { id, className }, children)
}

// Focus trap for modals and dialogs
export function FocusTrap({
  children,
  active = true,
}: {
  children: React.ReactNode
  active?: boolean
}) {
  const trapRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!active) return

    const trap = trapRef.current
    if (!trap) return

    const focusableElements = trap.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Let parent handle escape
        e.stopPropagation()
      }
    }

    document.addEventListener('keydown', handleTabKey)
    document.addEventListener('keydown', handleEscapeKey)
    firstElement?.focus()

    return () => {
      document.removeEventListener('keydown', handleTabKey)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [active])

  return (
    <div ref={trapRef} className="focus-trap">
      {children}
    </div>
  )
}

// Accessible button with proper ARIA attributes
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export function AccessibleButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: AccessibleButtonProps) {
  const baseClasses = cn(
    'inline-flex items-center justify-center rounded-md font-medium transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
    {
      'px-3 py-1.5 text-sm': size === 'sm',
      'px-4 py-2 text-base': size === 'md',
      'px-6 py-3 text-lg': size === 'lg',
    },
    {
      'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary':
        variant === 'primary',
      'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary':
        variant === 'secondary',
      'bg-transparent text-foreground hover:bg-accent focus:ring-accent': variant === 'ghost',
    },
    className
  )

  return (
    <button
      className={baseClasses}
      disabled={disabled || loading}
      aria-disabled={disabled || loading ? 'true' : 'false'}
      {...props}
    >
      {loading && (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <ScreenReaderOnly>Loading...</ScreenReaderOnly>
        </>
      )}
      {children}
    </button>
  )
}

// Accessible form field with proper labeling
interface AccessibleFieldProps {
  label: string
  id: string
  required?: boolean
  error?: string
  description?: string
  children: React.ReactNode
}

export function AccessibleField({
  label,
  id,
  required = false,
  error,
  description,
  children,
}: AccessibleFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {description && (
        <p id={descriptionId} className="text-sm text-gray-600">
          {description}
        </p>
      )}

      <div className="relative">
        {React.cloneElement(
          children as React.ReactElement,
          {
            id,
            'aria-required': required,
            'aria-describedby': [descriptionId, errorId].filter(Boolean).join(' ') || undefined,
            'aria-invalid': !!error,
          } as any
        )}
      </div>

      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// Accessible modal/dialog
interface AccessibleModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: AccessibleModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <FocusTrap active={isOpen}>
        <div
          className={cn('relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4', className)}
        >
          <div className="p-6">
            <h2 id="modal-title" className="text-lg font-semibold mb-4">
              {title}
            </h2>
            {children}
          </div>
        </div>
      </FocusTrap>
    </div>
  )
}

// Add React import
import React from 'react'
