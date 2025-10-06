'use client'

import { useState } from 'react'
import { Button, ButtonProps } from '@/components/ui/button'
import { useLoading } from '@/components/providers/LoadingProvider'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingButtonProps extends ButtonProps {
  loadingKey?: string
  loadingText?: string
  showSpinner?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>
}

export function LoadingButton({
  children,
  loadingKey,
  loadingText,
  showSpinner = true,
  onClick,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  const [isLocalLoading, setIsLocalLoading] = useState(false)
  const { isLoading, setLoading } = useLoading()

  const isButtonLoading = loadingKey ? isLoading(loadingKey) : isLocalLoading

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onClick) return

    try {
      if (loadingKey) {
        setLoading(loadingKey, true)
      } else {
        setIsLocalLoading(true)
      }

      await onClick(e)
    } catch (error) {
      console.error('Button action error:', error)
    } finally {
      if (loadingKey) {
        setLoading(loadingKey, false)
      } else {
        setIsLocalLoading(false)
      }
    }
  }

  return (
    <Button
      {...props}
      disabled={disabled || isButtonLoading}
      onClick={handleClick}
      className={cn('relative', isButtonLoading && 'opacity-80', className)}
    >
      {isButtonLoading && showSpinner && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      {isButtonLoading && loadingText ? loadingText : children}
    </Button>
  )
}
