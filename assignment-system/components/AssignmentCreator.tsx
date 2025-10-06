'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Brain,
  User,
  Clock,
  Calendar,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

interface Question {
  id: string
  question_text: string
  question_type: 'mcq' | 'descriptive' | 'file_upload'
  options?: { [key: string]: string }
  correct_answer?: string
  points: number
  explanation?: string
}

interface Chapter {
  id: string
  title: string
  slug: string
}

interface Course {
  id: string
  title: string
  slug: string
}

interface AssignmentCreatorProps {
  chapter: Chapter
  course: Course
}

export function AssignmentCreator({ chapter, course }: AssignmentCreatorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignment_type: 'mixed' as 'file_submission' | 'mcq' | 'descriptive' | 'mixed',
    is_required: false,
    max_score: 100,
    max_attempts: 1,
    time_limit: null as number | null,
    due_date: '',
    ai_checking_enabled: false,
    human_review_required: true,
    instructions: '',
    visibility: 'all_students' as 'all_students' | 'specific_students' | 'specific_groups',
    assigned_to: [] as string[],
    group_ids: [] as string[],
    order_index: 0,
    tags: [] as string[],
    difficulty_level: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    estimated_time: null as number | null,
  })

  const [questions, setQuestions] = useState<Question[]>([])
  const router = useRouter()
  const supabase = createClient()

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `temp_${Date.now()}`,
      question_text: '',
      question_type: 'mcq',
      options: { a: '', b: '', c: '', d: '' },
      correct_answer: '',
      points: 10,
      explanation: '',
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index] = { ...updatedQuestions[index], ...updates }
    setQuestions(updatedQuestions)
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    if (!formData.title.trim()) {
      toast.error('Assignment title is required')
      return
    }

    if (questions.length === 0) {
      toast.error('At least one question is required')
      return
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      if (!question.question_text.trim()) {
        toast.error(`Question ${i + 1} text is required`)
        return
      }
      if (question.question_type === 'mcq' && !question.correct_answer) {
        toast.error(`Question ${i + 1} must have a correct answer selected`)
        return
      }
    }

    setIsLoading(true)
    try {
      // Create assignment template
      const { data: assignment, error: assignmentError } = await supabase
        .from('assignment_templates' as any)
        .insert({
          chapter_id: chapter.id,
          title: formData.title,
          description: formData.description,
          assignment_type: formData.assignment_type,
          is_required: formData.is_required,
          max_score: formData.max_score,
          max_attempts: formData.max_attempts,
          time_limit: formData.time_limit,
          due_date: formData.due_date || null,
          ai_checking_enabled: formData.ai_checking_enabled,
          human_review_required: formData.human_review_required,
          instructions: formData.instructions,
          visibility: formData.visibility,
          assigned_to: formData.assigned_to.length > 0 ? formData.assigned_to : null,
          group_ids: formData.group_ids.length > 0 ? formData.group_ids : null,
          order_index: formData.order_index,
          tags: formData.tags,
          difficulty_level: formData.difficulty_level,
          estimated_time: formData.estimated_time,
          status: status,
        })
        .select()
        .single()

      if (assignmentError || !assignment)
        throw assignmentError || new Error('Failed to create assignment')

      // Create questions
      const questionsToInsert = questions.map((question, index) => ({
        template_id: (assignment as any).id,
        question_text: question.question_text,
        question_type: question.question_type,
        options: question.options || null,
        correct_answer: question.correct_answer || null,
        points: question.points,
        explanation: question.explanation || null,
        order_index: index,
      }))

      const { error: questionsError } = await supabase
        .from('assignment_questions')
        .insert(questionsToInsert)

      if (questionsError) throw questionsError

      toast.success(
        `Assignment ${status === 'published' ? 'created and published' : 'saved as draft'} successfully!`
      )
      router.push(`/teaching/courses/${course.slug}/chapters/${chapter.slug}/assignments`)
    } catch (error) {
      console.error('Error creating assignment:', error)
      toast.error('Failed to create assignment')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/teaching/courses/${course.slug}/chapters/${chapter.slug}/assignments`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assignments
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Assignment</h1>
            <p className="text-gray-600">
              Course: {course.title} • Chapter: {chapter.title}
            </p>
          </div>
        </div>
      </div>

      {/* Assignment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
          <CardDescription>Configure the basic settings for your assignment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title and Description */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Assignment Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter assignment title"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the assignment"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          {/* Assignment Type and Settings */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="type">Assignment Type</Label>
              <Select
                value={formData.assignment_type}
                onValueChange={(value: any) =>
                  setFormData(prev => ({ ...prev, assignment_type: value }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcq">Multiple Choice Only</SelectItem>
                  <SelectItem value="descriptive">Descriptive Only</SelectItem>
                  <SelectItem value="file_submission">File Submission Only</SelectItem>
                  <SelectItem value="mixed">Mixed (MCQ + Descriptive)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="max_score">Maximum Score</Label>
              <Input
                id="max_score"
                type="number"
                value={formData.max_score}
                onChange={e =>
                  setFormData(prev => ({ ...prev, max_score: parseInt(e.target.value) || 100 }))
                }
                min="1"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="max_attempts">Max Attempts</Label>
              <Input
                id="max_attempts"
                type="number"
                value={formData.max_attempts}
                onChange={e =>
                  setFormData(prev => ({ ...prev, max_attempts: parseInt(e.target.value) || 1 }))
                }
                min="1"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="time_limit">Time Limit (minutes)</Label>
              <Input
                id="time_limit"
                type="number"
                value={formData.time_limit || ''}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    time_limit: e.target.value ? parseInt(e.target.value) : null,
                  }))
                }
                placeholder="No limit"
                className="mt-1"
              />
            </div>
          </div>

          {/* Due Date */}
          <div>
            <Label htmlFor="due_date">Due Date (Optional)</Label>
            <Input
              id="due_date"
              type="datetime-local"
              value={formData.due_date}
              onChange={e => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
              className="mt-1"
            />
          </div>

          {/* Instructions */}
          <div>
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={e => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Detailed instructions for students"
              className="mt-1"
              rows={4}
            />
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Required Assignment</Label>
                <p className="text-sm text-gray-600">Students must complete this assignment</p>
              </div>
              <Checkbox
                checked={formData.is_required}
                onCheckedChange={checked =>
                  setFormData(prev => ({ ...prev, is_required: !!checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI-Assisted Checking
                </Label>
                <p className="text-sm text-gray-600">Enable AI to help grade descriptive answers</p>
              </div>
              <Checkbox
                checked={formData.ai_checking_enabled}
                onCheckedChange={checked =>
                  setFormData(prev => ({ ...prev, ai_checking_enabled: !!checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Human Review Required
                </Label>
                <p className="text-sm text-gray-600">Require manual review before final grading</p>
              </div>
              <Checkbox
                checked={formData.human_review_required}
                onCheckedChange={checked =>
                  setFormData(prev => ({ ...prev, human_review_required: !!checked }))
                }
              />
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-6 pt-6 border-t">
            <h3 className="text-lg font-medium">Advanced Settings</h3>

            {/* Visibility and Targeting */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="visibility">Assignment Visibility</Label>
                <Select
                  value={formData.visibility}
                  onValueChange={(value: any) =>
                    setFormData(prev => ({ ...prev, visibility: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_students">All Students</SelectItem>
                    <SelectItem value="specific_students">Specific Students</SelectItem>
                    <SelectItem value="specific_groups">Student Groups</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select
                  value={formData.difficulty_level}
                  onValueChange={(value: any) =>
                    setFormData(prev => ({ ...prev, difficulty_level: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="order_index">Order Index</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))
                  }
                  min="0"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Estimated Time */}
            <div>
              <Label htmlFor="estimated_time">Estimated Completion Time (minutes)</Label>
              <Input
                id="estimated_time"
                type="number"
                value={formData.estimated_time || ''}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    estimated_time: e.target.value ? parseInt(e.target.value) : null,
                  }))
                }
                placeholder="Optional estimated time"
                className="mt-1"
              />
            </div>

            {/* Conditional Fields for Specific Students */}
            {formData.visibility === 'specific_students' && (
              <div>
                <Label>Assign to Specific Students</Label>
                <p className="text-sm text-gray-600 mb-2">
                  This assignment will only be visible to selected students
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Student selection will be available after creating the assignment template. You
                    can then assign it to specific students from the assignment management page.
                  </p>
                </div>
              </div>
            )}

            {/* Conditional Fields for Groups */}
            {formData.visibility === 'specific_groups' && (
              <div>
                <Label>Assign to Student Groups</Label>
                <p className="text-sm text-gray-600 mb-2">
                  This assignment will only be visible to students in selected groups
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Group selection will be available after creating the assignment template. You
                    can create and manage student groups from the course management page.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Questions Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Questions</CardTitle>
              <CardDescription>Add questions for your assignment</CardDescription>
            </div>
            <Button onClick={addQuestion} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions added</h3>
              <p className="text-gray-600 mb-4">Add your first question to get started</p>
              <Button onClick={addQuestion}>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((question, index) => (
                <Card key={question.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeQuestion(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Question Text */}
                    <div>
                      <Label>Question Text *</Label>
                      <Textarea
                        value={question.question_text}
                        onChange={e => updateQuestion(index, { question_text: e.target.value })}
                        placeholder="Enter your question"
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    {/* Question Type and Points */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Question Type</Label>
                        <Select
                          value={question.question_type}
                          onValueChange={(value: any) =>
                            updateQuestion(index, { question_type: value })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mcq">Multiple Choice</SelectItem>
                            <SelectItem value="descriptive">Descriptive</SelectItem>
                            <SelectItem value="file_upload">File Upload</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Points</Label>
                        <Input
                          type="number"
                          value={question.points}
                          onChange={e =>
                            updateQuestion(index, { points: parseInt(e.target.value) || 10 })
                          }
                          min="1"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* MCQ Options */}
                    {question.question_type === 'mcq' && (
                      <div className="space-y-3">
                        <Label>Answer Options</Label>
                        {Object.entries(question.options || {}).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`correct_${question.id}`}
                              checked={question.correct_answer === key}
                              onChange={() => updateQuestion(index, { correct_answer: key })}
                              className="mt-1"
                            />
                            <Label className="w-8">{key.toUpperCase()}.</Label>
                            <Input
                              value={value}
                              onChange={e =>
                                updateQuestion(index, {
                                  options: { ...question.options, [key]: e.target.value },
                                })
                              }
                              placeholder={`Option ${key.toUpperCase()}`}
                              className="flex-1"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Explanation */}
                    <div>
                      <Label>Explanation (Optional)</Label>
                      <Textarea
                        value={question.explanation || ''}
                        onChange={e => updateQuestion(index, { explanation: e.target.value })}
                        placeholder="Explain the correct answer"
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="flex items-center justify-between py-4 border-t">
        <div className="text-sm text-gray-600">
          {questions.length} question{questions.length !== 1 ? 's' : ''} • Total points:{' '}
          {questions.reduce((sum, q) => sum + q.points, 0)}
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/teaching/courses/${course.slug}/chapters/${chapter.slug}/assignments`}>
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button onClick={() => handleSave('draft')} disabled={isLoading} variant="outline">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </>
            )}
          </Button>
          <Button onClick={() => handleSave('published')} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Publishing...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create & Publish
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
