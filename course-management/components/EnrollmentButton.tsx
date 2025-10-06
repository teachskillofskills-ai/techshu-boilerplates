'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LoadingButton } from '@/components/ui/LoadingButton'
import { createClient } from '@/lib/supabase/client'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface EnrollmentButtonProps {
  courseSlug: string
  courseTitle: string
  isEnrolled: boolean
  canEnroll: boolean
  user: any
}

export function EnrollmentButton({
  courseSlug,
  courseTitle,
  isEnrolled,
  canEnroll,
  user,
}: EnrollmentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [enrollmentStatus, setEnrollmentStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const router = useRouter()
  const supabase = createClient()

  const handleEnrollment = async () => {
    if (!user) {
      router.push('/auth/signin')
      return
    }

    if (!canEnroll) {
      toast.error('Account approval required', {
        description: 'Your account needs admin approval to enroll in courses.',
      })
      return
    }

    setIsLoading(true)
    setEnrollmentStatus('idle')

    try {
      const response = await fetch(`/api/courses/${courseSlug}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enroll')
      }

      // Success!
      setEnrollmentStatus('success')
      toast.success('Enrollment successful!', {
        description: `You've been enrolled in ${courseTitle}. Redirecting to course...`,
        icon: <CheckCircle className="h-4 w-4" />,
      })

      // Wait a moment for the toast, then redirect
      setTimeout(() => {
        router.push(`/courses/${courseSlug}/learn`)
        router.refresh() // Refresh to update enrollment status
      }, 1500)
    } catch (error: any) {
      console.error('Enrollment error:', error)
      setEnrollmentStatus('error')

      // Show user-friendly error messages
      const errorMessage = error.message || 'Failed to enroll in course'
      toast.error('Enrollment failed', {
        description: errorMessage,
        icon: <AlertCircle className="h-4 w-4" />,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // If already enrolled, show continue learning button
  if (isEnrolled) {
    return (
      <div className="space-y-3">
        <Button variant="learning" className="w-full" size="lg" asChild>
          <a href={`/courses/${courseSlug}/learn`}>Continue Learning</a>
        </Button>
        <p className="text-sm text-green-600 text-center flex items-center justify-center gap-1">
          <CheckCircle className="h-4 w-4" />
          You&apos;re enrolled in this course
        </p>
      </div>
    )
  }

  // If user can't enroll (not approved)
  if (user && !canEnroll) {
    return (
      <div className="text-center">
        <Button disabled className="w-full" size="lg">
          <AlertCircle className="h-4 w-4 mr-2" />
          Enrollment Pending Approval
        </Button>
        <p className="text-sm text-gray-600 mt-2">Your account needs admin approval to enroll</p>
      </div>
    )
  }

  // If not logged in
  if (!user) {
    return (
      <div className="space-y-3">
        <Button variant="learning" className="w-full" size="lg" asChild>
          <a href="/auth/signin">Sign In to Enroll</a>
        </Button>
        <p className="text-sm text-gray-600 text-center">Create an account to access this course</p>
      </div>
    )
  }

  // Main enrollment button
  return (
    <div className="space-y-3">
      <LoadingButton
        variant="learning"
        onClick={handleEnrollment}
        disabled={enrollmentStatus === 'success'}
        className="w-full"
        size="lg"
        loadingKey="enrollment"
        loadingText="Enrolling..."
      >
        {enrollmentStatus === 'success' ? (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Enrolled! Redirecting...
          </>
        ) : (
          'Enroll Now - Free'
        )}
      </LoadingButton>

      {enrollmentStatus === 'success' && (
        <p className="text-sm text-green-600 text-center">
          ✓ Successfully enrolled! Taking you to the course...
        </p>
      )}

      {enrollmentStatus === 'error' && (
        <p className="text-sm text-red-600 text-center">Something went wrong. Please try again.</p>
      )}
    </div>
  )
}
