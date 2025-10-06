'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Brain,
  User,
  Hash,
} from 'lucide-react'
import Link from 'next/link'

interface AssignmentTemplate {
  id: string
  title: string
  description: string | null
  assignment_type: 'file_submission' | 'mcq' | 'descriptive' | 'mixed'
  is_required: boolean
  max_score: number
  time_limit: number | null
  due_date: string | null
  max_attempts: number
  ai_checking_enabled: boolean
  human_review_required: boolean
  status: 'draft' | 'published' | 'archived'
  visibility: 'all_students' | 'specific_students' | 'specific_groups'
  assigned_to: string[] | null
  group_ids: string[] | null
  order_index: number
  tags: string[]
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  estimated_time: number | null
  created_at: string
  _count?: {
    attempts: number
    questions: number
    assignments: number
  }
}

interface Chapter {
  id: string
  title: string
  slug?: string
}

interface Course {
  id: string
  title: string
  slug: string
}

interface AssignmentManagerProps {
  chapter: Chapter
  course: Course
}

export function AssignmentManager({ chapter, course }: AssignmentManagerProps) {
  const [assignments, setAssignments] = useState<AssignmentTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [sortBy, setSortBy] = useState<'order' | 'created' | 'due_date'>('order')

  const supabase = createClient()

  useEffect(() => {
    fetchAssignments()
  }, [chapter.id, sortBy])

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('assignment_templates')
        .select(
          `
          *,
          questions:assignment_questions(count),
          attempts:assignment_attempts(count)
        `
        )
        .eq('chapter_id', chapter.id)
        .order(
          sortBy === 'order' ? 'order_index' : sortBy === 'due_date' ? 'due_date' : 'created_at',
          {
            ascending: sortBy === 'order' ? true : false,
          }
        )

      if (error) throw error
      setAssignments(data || [])
    } catch (error) {
      console.error('Error fetching assignment templates:', error)
      toast.error('Failed to load assignments')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAssignment = async (assignmentId: string) => {
    if (
      !confirm('Are you sure you want to delete this assignment? This action cannot be undone.')
    ) {
      return
    }

    try {
      const { error } = await supabase.from('assignment_templates').delete().eq('id', assignmentId)

      if (error) throw error

      toast.success('Assignment deleted successfully')
      fetchAssignments()
    } catch (error) {
      console.error('Error deleting assignment:', error)
      toast.error('Failed to delete assignment')
    }
  }

  const toggleAssignmentStatus = async (assignmentId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'

    try {
      const { error } = await supabase
        .from('assignment_templates')
        .update({ status: newStatus })
        .eq('id', assignmentId)

      if (error) throw error

      toast.success(
        `Assignment ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`
      )
      fetchAssignments()
    } catch (error) {
      console.error('Error updating assignment status:', error)
      toast.error('Failed to update assignment status')
    }
  }

  const getAssignmentTypeIcon = (type: string) => {
    switch (type) {
      case 'mcq':
        return <CheckCircle className="h-4 w-4" />
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <Badge variant="default" className="bg-accent/10 text-accent">
            Published
          </Badge>
        )
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>
      case 'archived':
        return <Badge variant="outline">Archived</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredAssignments = assignments.filter(assignment => {
    if (activeTab === 'all') return true
    if (activeTab === 'published') return assignment.status === 'published'
    if (activeTab === 'draft') return assignment.status === 'draft'
    if (activeTab === 'general') return assignment.visibility === 'all_students'
    if (activeTab === 'specific') return assignment.visibility === 'specific_students'
    if (activeTab === 'groups') return assignment.visibility === 'specific_groups'
    return assignment.status === activeTab
  })

  const getVisibilityBadge = (assignment: AssignmentTemplate) => {
    switch (assignment.visibility) {
      case 'all_students':
        return (
          <Badge variant="default" className="text-xs">
            All Students
          </Badge>
        )
      case 'specific_students':
        return (
          <Badge variant="secondary" className="text-xs">
            Specific Students ({assignment.assigned_to?.length || 0})
          </Badge>
        )
      case 'specific_groups':
        return (
          <Badge variant="outline" className="text-xs">
            Groups ({assignment.group_ids?.length || 0})
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Unknown
          </Badge>
        )
    }
  }

  const getDifficultyBadge = (level: string) => {
    const colors = {
      beginner: 'bg-accent/10 text-accent',
      intermediate: 'bg-secondary/10 text-secondary',
      advanced: 'bg-destructive/10 text-destructive',
    }
    return (
      <Badge
        className={`text-xs ${colors[level as keyof typeof colors] || 'bg-muted text-muted-foreground'}`}
      >
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Chapter Assignments</h2>
            <p className="text-gray-600">Chapter: {chapter.title}</p>
          </div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chapter Assignments</h2>
          <p className="text-gray-600">
            Course: {course.title} • Chapter: {chapter.title}
          </p>
        </div>
        <Link href={`/teaching/courses/${course.slug}/chapters/${chapter.slug}/assignments/new`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        </Link>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="order">Order Index</SelectItem>
              <SelectItem value="created">Created Date</SelectItem>
              <SelectItem value="due_date">Due Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All ({assignments.length})</TabsTrigger>
          <TabsTrigger value="published">
            Published ({assignments.filter(a => a.status === 'published').length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Draft ({assignments.filter(a => a.status === 'draft').length})
          </TabsTrigger>
          <TabsTrigger value="general">
            General ({assignments.filter(a => a.visibility === 'all_students').length})
          </TabsTrigger>
          <TabsTrigger value="specific">
            Individual ({assignments.filter(a => a.visibility === 'specific_students').length})
          </TabsTrigger>
          <TabsTrigger value="groups">
            Groups ({assignments.filter(a => a.visibility === 'specific_groups').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
                <p className="text-gray-600 mb-4">
                  {activeTab === 'all'
                    ? 'Create your first assignment for this chapter'
                    : `No ${activeTab} assignments found`}
                </p>
                <Link
                  href={`/teaching/courses/${course.slug}/chapters/${chapter.slug}/assignments/new`}
                >
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Assignment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredAssignments.map(assignment => (
                <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getAssignmentTypeIcon(assignment.assignment_type)}
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          {assignment.is_required && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="line-clamp-2">
                          {assignment.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusBadge(assignment.status)}
                        {getVisibilityBadge(assignment)}
                        {getDifficultyBadge(assignment.difficulty_level)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Hash className="h-4 w-4" />
                        <span>Order: {assignment.order_index}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BarChart3 className="h-4 w-4" />
                        <span>{assignment.max_score} points</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{assignment._count?.attempts || 0} attempts</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span>{assignment._count?.questions || 0} questions</span>
                      </div>
                      {assignment.estimated_time ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>~{assignment.estimated_time} min</span>
                        </div>
                      ) : assignment.time_limit ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{assignment.time_limit} min limit</span>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      {assignment.ai_checking_enabled && (
                        <Badge variant="outline" className="text-xs">
                          <Brain className="h-3 w-3 mr-1" />
                          AI Checking
                        </Badge>
                      )}
                      {assignment.human_review_required && (
                        <Badge variant="outline" className="text-xs">
                          <User className="h-3 w-3 mr-1" />
                          Human Review
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Created {new Date(assignment.created_at).toLocaleDateString()}
                        {assignment.due_date && (
                          <span className="ml-2">
                            • Due {new Date(assignment.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/teaching/courses/${course.slug}/chapters/${chapter.slug}/assignments/${assignment.id}/submissions`}
                        >
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Link
                          href={`/teaching/courses/${course.slug}/chapters/${chapter.slug}/assignments/${assignment.id}/edit`}
                        >
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleAssignmentStatus(assignment.id, assignment.status)}
                        >
                          {assignment.status === 'published' ? 'Unpublish' : 'Publish'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteAssignment(assignment.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
