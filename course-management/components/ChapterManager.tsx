'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RichContentEditor } from '@/components/editor/RichContentEditor'
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  EyeOff,
  GripVertical,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronRight,
  CheckSquare,
  FileText,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import Link from 'next/link'

interface Chapter {
  id: string
  title: string
  description?: string | null
  content_md?: string | null
  order_index: number
  is_published: boolean
  estimated_duration?: number | null
}

interface ChapterManagerProps {
  courseId: string
  courseSlug?: string
  moduleId?: string
  initialChapters?: Chapter[]
}

export function ChapterManager({
  courseId,
  courseSlug,
  moduleId,
  initialChapters = [],
}: ChapterManagerProps) {
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters)
  const [editingChapter, setEditingChapter] = useState<string | null>(null)
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [newChapter, setNewChapter] = useState({
    title: '',
    description: '',
    content_md: '',
    estimated_duration: 10,
  })

  const supabase = createClient()

  useEffect(() => {
    loadChapters()
  }, [courseId])

  const loadChapters = async () => {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })

      if (error) throw error
      setChapters(data || [])
    } catch (error) {
      console.error('Error loading chapters:', error)
      toast.error('Failed to load chapters')
    }
  }

  const createChapter = async () => {
    if (!newChapter.title.trim()) {
      toast.error('Chapter title is required')
      return
    }

    setIsLoading(true)
    try {
      const maxOrder = Math.max(...chapters.map(c => c.order_index), 0)

      const { data, error } = await supabase
        .from('chapters')
        .insert({
          course_id: courseId,
          module_id: moduleId || null,
          title: newChapter.title,
          description: newChapter.description,
          content_md: newChapter.content_md,
          estimated_duration: newChapter.estimated_duration,
          order_index: maxOrder + 1,
          is_published: false,
        })
        .select()
        .single()

      if (error) throw error

      setChapters(prev => [...prev, data])
      setNewChapter({
        title: '',
        description: '',
        content_md: '',
        estimated_duration: 10,
      })
      toast.success('Chapter created successfully')
    } catch (error) {
      console.error('Error creating chapter:', error)
      toast.error('Failed to create chapter')
    } finally {
      setIsLoading(false)
    }
  }

  const updateChapter = async (chapterId: string, updates: Partial<Chapter>) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from('chapters').update(updates).eq('id', chapterId)

      if (error) throw error

      setChapters(prev =>
        prev.map(chapter => (chapter.id === chapterId ? { ...chapter, ...updates } : chapter))
      )

      toast.success('Chapter updated successfully')
    } catch (error) {
      console.error('Error updating chapter:', error)
      toast.error('Failed to update chapter')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteChapter = async (chapterId: string) => {
    if (!confirm('Are you sure you want to delete this chapter?')) return

    setIsLoading(true)
    try {
      const { error } = await supabase.from('chapters').delete().eq('id', chapterId)

      if (error) throw error

      setChapters(prev => prev.filter(chapter => chapter.id !== chapterId))
      toast.success('Chapter deleted successfully')
    } catch (error) {
      console.error('Error deleting chapter:', error)
      toast.error('Failed to delete chapter')
    } finally {
      setIsLoading(false)
    }
  }

  const togglePublished = async (chapterId: string, isPublished: boolean) => {
    await updateChapter(chapterId, { is_published: !isPublished })
  }

  const toggleExpanded = (chapterId: string) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev)
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId)
      } else {
        newSet.add(chapterId)
      }
      return newSet
    })
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const items = Array.from(chapters)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order_index for all chapters
    const updatedChapters = items.map((chapter, index) => ({
      ...chapter,
      order_index: index + 1,
    }))

    setChapters(updatedChapters)

    // Update in database
    try {
      const updates = updatedChapters.map(chapter => ({
        id: chapter.id,
        order_index: chapter.order_index,
      }))

      for (const update of updates) {
        await supabase
          .from('chapters')
          .update({ order_index: update.order_index })
          .eq('id', update.id)
      }

      toast.success('Chapter order updated')
    } catch (error) {
      console.error('Error updating chapter order:', error)
      toast.error('Failed to update chapter order')
      // Revert on error
      loadChapters()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Chapters</h2>
          <p className="text-gray-600 mt-1">
            Organize your course content into chapters and lessons. Click the edit button to modify
            existing chapters.
          </p>
        </div>
        <Badge variant="secondary">{chapters.length} chapters</Badge>
      </div>

      {/* New Chapter Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Chapter
          </CardTitle>
          <CardDescription>Create a new chapter for your course</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-title">Chapter Title *</Label>
              <Input
                id="new-title"
                value={newChapter.title}
                onChange={e => setNewChapter(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter chapter title"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-duration">Duration (minutes)</Label>
              <Input
                id="new-duration"
                type="number"
                value={newChapter.estimated_duration}
                onChange={e =>
                  setNewChapter(prev => ({
                    ...prev,
                    estimated_duration: parseInt(e.target.value) || 10,
                  }))
                }
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="new-description">Description</Label>
            <Textarea
              id="new-description"
              value={newChapter.description}
              onChange={e => setNewChapter(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this chapter"
              className="mt-1"
              rows={2}
            />
          </div>

          <div>
            <Label>Chapter Content</Label>
            <div className="mt-1">
              <RichContentEditor
                content={newChapter.content_md}
                onChange={content => setNewChapter(prev => ({ ...prev, content_md: content }))}
                placeholder="Write your chapter content here..."
              />
            </div>
          </div>

          <Button onClick={createChapter} disabled={isLoading || !newChapter.title.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Create Chapter
          </Button>
        </CardContent>
      </Card>

      {/* Chapters List */}
      <Card>
        <CardHeader>
          <CardTitle>Course Chapters</CardTitle>
          <CardDescription>Drag and drop to reorder chapters</CardDescription>
        </CardHeader>
        <CardContent>
          {chapters.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No chapters yet</h3>
              <p className="text-gray-600">
                Create your first chapter to start building your course content
              </p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="chapters">
                {provided => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {chapters.map((chapter, index) => (
                      <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`border rounded-lg p-4 ${
                              snapshot.isDragging ? 'shadow-lg' : ''
                            } ${
                              editingChapter === chapter.id
                                ? 'bg-blue-50 border-blue-300'
                                : 'bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="h-5 w-5 text-gray-400" />
                                </div>

                                <button
                                  onClick={() => toggleExpanded(chapter.id)}
                                  className="flex items-center gap-2 flex-1 text-left"
                                >
                                  {expandedChapters.has(chapter.id) ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}

                                  <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                      <h3 className="font-semibold text-gray-900">
                                        {index + 1}. {chapter.title}
                                      </h3>
                                      <Badge
                                        variant={chapter.is_published ? 'default' : 'secondary'}
                                      >
                                        {chapter.is_published ? 'Published' : 'Draft'}
                                      </Badge>
                                      {editingChapter === chapter.id && (
                                        <Badge
                                          variant="outline"
                                          className="bg-blue-100 text-blue-700 border-blue-300"
                                        >
                                          Editing
                                        </Badge>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {chapter.estimated_duration || 10}m
                                      </span>
                                      {chapter.description && (
                                        <span className="truncate max-w-md">
                                          {chapter.description}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => togglePublished(chapter.id, chapter.is_published)}
                                >
                                  {chapter.is_published ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    if (editingChapter === chapter.id) {
                                      setEditingChapter(null)
                                    } else {
                                      // Auto-expand the chapter when editing
                                      setExpandedChapters(prev => new Set([...prev, chapter.id]))
                                      setEditingChapter(chapter.id)
                                    }
                                  }}
                                  className={
                                    editingChapter === chapter.id ? 'bg-blue-100 text-blue-700' : ''
                                  }
                                >
                                  <Edit className="h-4 w-4" />
                                  {editingChapter === chapter.id && (
                                    <span className="ml-1 text-xs">Editing</span>
                                  )}
                                </Button>

                                {courseSlug && (
                                  <Link
                                    href={`/teaching/courses/${courseSlug}/chapters/${chapter.id}/edit?tab=assignments`}
                                  >
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-blue-600 hover:text-blue-700"
                                      title="Manage Assignments"
                                    >
                                      <CheckSquare className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                )}

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteChapter(chapter.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Expanded Content */}
                            {expandedChapters.has(chapter.id) && (
                              <div className="mt-4 pt-4 border-t">
                                {editingChapter === chapter.id ? (
                                  <ChapterEditForm
                                    chapter={chapter}
                                    onSave={updates => {
                                      updateChapter(chapter.id, updates)
                                      setEditingChapter(null)
                                    }}
                                    onCancel={() => setEditingChapter(null)}
                                  />
                                ) : (
                                  <div className="prose prose-sm max-w-none">
                                    {chapter.content_md ? (
                                      <div
                                        dangerouslySetInnerHTML={{ __html: chapter.content_md }}
                                      />
                                    ) : (
                                      <p className="text-gray-500 italic">No content yet</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Chapter Edit Form Component
function ChapterEditForm({
  chapter,
  onSave,
  onCancel,
}: {
  chapter: Chapter
  onSave: (updates: Partial<Chapter>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: chapter.title,
    description: chapter.description || '',
    content_md: chapter.content_md || '',
    estimated_duration: chapter.estimated_duration || 10,
  })

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-title">Chapter Title</Label>
          <Input
            id="edit-title"
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="edit-duration">Duration (minutes)</Label>
          <Input
            id="edit-duration"
            type="number"
            value={formData.estimated_duration}
            onChange={e =>
              setFormData(prev => ({ ...prev, estimated_duration: parseInt(e.target.value) || 10 }))
            }
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="mt-1"
          rows={2}
        />
      </div>

      <div>
        <Label>Chapter Content</Label>
        <div className="mt-1">
          <RichContentEditor
            content={formData.content_md}
            onChange={content => setFormData(prev => ({ ...prev, content_md: content }))}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
