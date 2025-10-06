'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Clock, FileText, CheckCircle, AlertCircle, Upload, Save, Send, Timer } from 'lucide-react'

interface Question {
  id: string
  question_text: string
  question_type: 'mcq' | 'descriptive' | 'file_upload'
  options?: { [key: string]: string }
  points: number
  explanation?: string
}

interface AssignmentTemplate {
  id: string
  title: string
  description: string
  assignment_type: string
  max_score: number
  max_attempts: number
  time_limit: number | null
  due_date: string | null
  instructions: string
  questions: Question[]
}

interface AssignmentSubmissionProps {
  assignment: AssignmentTemplate
  chapterTitle: string
  courseTitle: string
}

export function AssignmentSubmission({
  assignment,
  chapterTitle,
  courseTitle,
}: AssignmentSubmissionProps) {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraft, setIsDraft] = useState(false)
  const [startTime] = useState(Date.now())
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase.auth])

  // Define handleSubmit FIRST since handleAutoSubmit depends on it
  const handleSubmit = useCallback(
    async (isAutoSubmit = false) => {
      // Check if all required questions are answered
      const unansweredQuestions = assignment.questions.filter(q => !answers[q.id])

      if (unansweredQuestions.length > 0 && !isAutoSubmit) {
        const proceed = confirm(
          `You have ${unansweredQuestions.length} unanswered question(s). Do you want to submit anyway?`
        )
        if (!proceed) return
      }

      setIsSubmitting(true)
      try {
        const timeSpent = Math.floor((Date.now() - startTime) / 60000) // Convert to minutes

        // Calculate AI score for MCQ questions
        let aiScore = 0
        assignment.questions.forEach(question => {
          if (question.question_type === 'mcq' && answers[question.id]) {
            // This would be replaced with actual correct answer checking
            // For now, we'll just give points if answered
            if (answers[question.id]) {
              aiScore += question.points
            }
          }
        })

        if (!user) {
          toast.error('You must be logged in to submit assignment')
          return
        }

        const { error } = await supabase.from('assignment_attempts').upsert({
          template_id: assignment.id,
          user_id: user.id,
          answers: answers,
          submitted_at: new Date().toISOString(),
          status: 'submitted',
          ai_score: aiScore,
          time_spent: timeSpent,
          attempt_number: 1,
        })

        if (error) throw error

        toast.success('Assignment submitted successfully!')

        // Redirect to results page or back to course
        window.location.href = `/courses/${assignment.id}/results`
      } catch (error) {
        console.error('Error submitting assignment:', error)
        toast.error('Failed to submit assignment')
      } finally {
        setIsSubmitting(false)
      }
    },
    [assignment, answers, startTime, user, supabase]
  )

  // Now define handleAutoSubmit that depends on handleSubmit
  const handleAutoSubmit = useCallback(async () => {
    toast.warning('Time limit reached! Auto-submitting your answers...')
    await handleSubmit(true)
  }, [handleSubmit])

  // Timer effect that uses handleAutoSubmit
  useEffect(() => {
    // Initialize timer if assignment has time limit
    if (assignment.time_limit) {
      setTimeLeft(assignment.time_limit * 60) // Convert minutes to seconds

      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timer)
            handleAutoSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [assignment.time_limit, handleAutoSubmit])

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleSaveDraft = async () => {
    setIsDraft(true)
    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 60000) // Convert to minutes

      if (!user) {
        toast.error('You must be logged in to save progress')
        return
      }

      const { error } = await supabase.from('assignment_attempts').upsert({
        template_id: assignment.id,
        user_id: user.id,
        answers: answers,
        status: 'in_progress',
        time_spent: timeSpent,
        attempt_number: 1,
      })

      if (error) throw error

      toast.success('Draft saved successfully!')
    } catch (error) {
      console.error('Error saving draft:', error)
      toast.error('Failed to save draft')
    } finally {
      setIsDraft(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((currentQuestion + 1) / assignment.questions.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
          <p className="text-gray-600">
            {courseTitle} • {chapterTitle}
          </p>
        </div>

        {timeLeft !== null && (
          <div className="flex items-center gap-2">
            <Timer className={`h-5 w-5 ${timeLeft < 300 ? 'text-red-500' : 'text-blue-500'}`} />
            <span
              className={`text-lg font-mono ${timeLeft < 300 ? 'text-red-500' : 'text-blue-500'}`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>

      {/* Assignment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assignment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>{assignment.questions.length} Questions</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <span>{assignment.max_score} Total Points</span>
            </div>
            {assignment.time_limit && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-orange-600" />
                <span>{assignment.time_limit} Minutes</span>
              </div>
            )}
          </div>

          {assignment.description && <p className="text-gray-700 mb-4">{assignment.description}</p>}

          {assignment.instructions && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
              <p className="text-blue-800 text-sm">{assignment.instructions}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Progress</span>
          <span>
            {currentQuestion + 1} of {assignment.questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {assignment.questions.map((question, index) => (
          <Card
            key={question.id}
            className={`${index === currentQuestion ? 'ring-2 ring-blue-500' : ''}`}
          >
            <CardHeader>
              <CardTitle className="text-lg">
                Question {index + 1} ({question.points} points)
              </CardTitle>
              <CardDescription>{question.question_text}</CardDescription>
            </CardHeader>
            <CardContent>
              {question.question_type === 'mcq' && question.options && (
                <RadioGroup
                  value={answers[question.id] || ''}
                  onValueChange={value => handleAnswerChange(question.id, value)}
                >
                  {Object.entries(question.options).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <RadioGroupItem value={key} id={`${question.id}_${key}`} />
                      <Label htmlFor={`${question.id}_${key}`} className="flex-1 cursor-pointer">
                        <span className="font-medium mr-2">{key.toUpperCase()}.</span>
                        {value}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.question_type === 'descriptive' && (
                <Textarea
                  value={answers[question.id] || ''}
                  onChange={e => handleAnswerChange(question.id, e.target.value)}
                  placeholder="Enter your answer here..."
                  rows={6}
                  className="mt-2"
                />
              )}

              {question.question_type === 'file_upload' && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload your file here (PDF, DOC, DOCX, TXT)
                  </p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentQuestion(Math.min(assignment.questions.length - 1, currentQuestion + 1))
            }
            disabled={currentQuestion === assignment.questions.length - 1}
          >
            Next
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isDraft || isSubmitting}>
            {isDraft ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </>
            )}
          </Button>

          <Button
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Assignment
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
