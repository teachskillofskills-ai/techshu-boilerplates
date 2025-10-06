'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckSquare, Clock, FileText, AlertCircle, Play, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

interface AssignmentTemplate {
  id: string
  title: string
  description: string
  assignment_type: 'file_submission' | 'mcq' | 'descriptive' | 'mixed'
  max_score: number
  max_attempts: number
  time_limit: number | null
  due_date: string | null
  status: 'draft' | 'published' | 'archived'
  is_required: boolean
}

interface AssignmentAttempt {
  id: string
  attempt_number: number
  status: 'in_progress' | 'submitted' | 'graded' | 'returned'
  final_score: number | null
  submitted_at: string | null
}

interface AssignmentCardProps {
  assignment: AssignmentTemplate
  attempt?: AssignmentAttempt
  chapterSlug: string
  courseSlug: string
  isStudent?: boolean
}

export function AssignmentCard({
  assignment,
  attempt,
  chapterSlug,
  courseSlug,
  isStudent = false,
}: AssignmentCardProps) {
  const getAssignmentTypeIcon = () => {
    switch (assignment.assignment_type) {
      case 'mcq':
        return <CheckSquare className="h-4 w-4" />
      case 'descriptive':
        return <FileText className="h-4 w-4" />
      case 'file_submission':
        return <FileText className="h-4 w-4" />
      case 'mixed':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusBadge = () => {
    if (!attempt) {
      return (
        <Badge variant="outline" className="text-gray-600">
          Not Started
        </Badge>
      )
    }

    switch (attempt.status) {
      case 'in_progress':
        return (
          <Badge variant="outline" className="text-blue-600">
            In Progress
          </Badge>
        )
      case 'submitted':
        return (
          <Badge variant="outline" className="text-orange-600">
            Submitted
          </Badge>
        )
      case 'graded':
        return (
          <Badge variant="default" className="text-green-600">
            Graded
          </Badge>
        )
      case 'returned':
        return (
          <Badge variant="outline" className="text-purple-600">
            Returned
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getActionButton = () => {
    if (!isStudent) {
      return (
        <Link href={`/teaching/courses/${courseSlug}/chapters/${chapterSlug}/edit?tab=assignments`}>
          <Button variant="outline" size="sm">
            <CheckSquare className="h-4 w-4 mr-2" />
            Manage
          </Button>
        </Link>
      )
    }

    if (!attempt) {
      return (
        <Link href={`/courses/${courseSlug}/chapters/${chapterSlug}/assignments/${assignment.id}`}>
          <Button size="sm">
            <Play className="h-4 w-4 mr-2" />
            Start Assignment
          </Button>
        </Link>
      )
    }

    if (attempt.status === 'in_progress') {
      return (
        <Link href={`/courses/${courseSlug}/chapters/${chapterSlug}/assignments/${assignment.id}`}>
          <Button size="sm" variant="outline">
            <Play className="h-4 w-4 mr-2" />
            Continue
          </Button>
        </Link>
      )
    }

    if (attempt.status === 'graded') {
      return (
        <Link
          href={`/courses/${courseSlug}/chapters/${chapterSlug}/assignments/${assignment.id}/results`}
        >
          <Button size="sm" variant="outline">
            <CheckCircle className="h-4 w-4 mr-2" />
            View Results
          </Button>
        </Link>
      )
    }

    return (
      <Button size="sm" variant="outline" disabled>
        <Clock className="h-4 w-4 mr-2" />
        Pending Review
      </Button>
    )
  }

  const getDueDate = () => {
    if (!assignment.due_date) return null

    const dueDate = new Date(assignment.due_date)
    const now = new Date()
    const isOverdue = dueDate < now

    return (
      <div
        className={`flex items-center gap-1 text-sm ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}
      >
        <Clock className="h-3 w-3" />
        <span>
          Due: {dueDate.toLocaleDateString()} at{' '}
          {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        {isOverdue && <span className="text-red-600 font-medium">(Overdue)</span>}
      </div>
    )
  }

  const getScoreDisplay = () => {
    if (!attempt || !attempt.final_score) return null

    const percentage = (attempt.final_score / assignment.max_score) * 100

    return (
      <div className="flex items-center gap-2">
        <Progress value={percentage} className="flex-1 h-2" />
        <span className="text-sm font-medium">
          {attempt.final_score}/{assignment.max_score} ({percentage.toFixed(0)}%)
        </span>
      </div>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getAssignmentTypeIcon()}
            <CardTitle className="text-lg">{assignment.title}</CardTitle>
            {assignment.is_required && (
              <Badge variant="destructive" className="text-xs">
                Required
              </Badge>
            )}
          </div>
          {getStatusBadge()}
        </div>
        {assignment.description && (
          <CardDescription className="mt-2">{assignment.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Assignment Details */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <CheckSquare className="h-3 w-3" />
            <span>{assignment.max_score} points</span>
          </div>
          {assignment.time_limit && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{assignment.time_limit} minutes</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>
              {assignment.max_attempts} attempt{assignment.max_attempts !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Due Date */}
        {getDueDate()}

        {/* Score Display */}
        {getScoreDisplay()}

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-gray-500">
            {assignment.assignment_type === 'mcq' && 'Multiple Choice'}
            {assignment.assignment_type === 'descriptive' && 'Written Response'}
            {assignment.assignment_type === 'file_submission' && 'File Upload'}
            {assignment.assignment_type === 'mixed' && 'Mixed Format'}
          </div>
          {getActionButton()}
        </div>
      </CardContent>
    </Card>
  )
}
