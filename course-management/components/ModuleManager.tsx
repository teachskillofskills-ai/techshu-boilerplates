'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  BookOpen,
  Clock,
  List,
} from 'lucide-react'
import { ChapterManager } from './ChapterManager'
import { ChapterMover } from './ChapterMover'

interface Module {
  id: string
  title: string
  slug: string
  description: string | null
  order_index: number
  is_published: boolean
  estimated_duration: number | null
  created_at: string
  updated_at: string
  chapters?: Chapter[]
}

interface Chapter {
  id: string
  module_id: string
  title: string
  description: string
  content_md: string
  order_index: number
  is_published: boolean
  estimated_duration: number
}

interface ModuleManagerProps {
  courseId: string
  initialModules: Module[]
  unassignedChapters?: Chapter[]
}

export function ModuleManager({
  courseId,
  initialModules,
  unassignedChapters = [],
}: ModuleManagerProps) {
  const [modules, setModules] = useState<Module[]>(initialModules)
  const [unassigned, setUnassigned] = useState<Chapter[]>(unassignedChapters)
  const [isCreating, setIsCreating] = useState(false)
  const [editingModule, setEditingModule] = useState<string | null>(null)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()

  // New module form state
  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
  })

  // Edit module form state
  const [editModule, setEditModule] = useState({
    title: '',
    description: '',
  })

  const createModule = async () => {
    if (!newModule.title.trim()) {
      toast.error('Module title is required')
      return
    }

    setIsLoading(true)
    try {
      const slug = newModule.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()

      const { data, error } = await supabase
        .from('modules')
        .insert({
          course_id: courseId,
          title: newModule.title,
          slug,
          description: newModule.description,
          order_index: modules.length,
          is_published: false,
        })
        .select()
        .single()

      if (error) throw error

      setModules(prev => [...prev, { ...data, chapters: [] }])
      setNewModule({ title: '', description: '' })
      setIsCreating(false)
      toast.success('Module created successfully')
    } catch (error) {
      console.error('Error creating module:', error)
      toast.error('Failed to create module')
    } finally {
      setIsLoading(false)
    }
  }

  const updateModule = async (moduleId: string) => {
    if (!editModule.title.trim()) {
      toast.error('Module title is required')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('modules')
        .update({
          title: editModule.title,
          description: editModule.description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', moduleId)

      if (error) throw error

      setModules(prev =>
        prev.map(module =>
          module.id === moduleId
            ? { ...module, title: editModule.title, description: editModule.description }
            : module
        )
      )
      setEditingModule(null)
      toast.success('Module updated successfully')
    } catch (error) {
      console.error('Error updating module:', error)
      toast.error('Failed to update module')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteModule = async (moduleId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this module? This will also delete all chapters in this module.'
      )
    ) {
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.from('modules').delete().eq('id', moduleId)

      if (error) throw error

      setModules(prev => prev.filter(module => module.id !== moduleId))
      toast.success('Module deleted successfully')
    } catch (error) {
      console.error('Error deleting module:', error)
      toast.error('Failed to delete module')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleModulePublished = async (moduleId: string, isPublished: boolean) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('modules')
        .update({ is_published: !isPublished })
        .eq('id', moduleId)

      if (error) throw error

      setModules(prev =>
        prev.map(module =>
          module.id === moduleId ? { ...module, is_published: !isPublished } : module
        )
      )
      toast.success(`Module ${!isPublished ? 'published' : 'unpublished'} successfully`)
    } catch (error) {
      console.error('Error updating module:', error)
      toast.error('Failed to update module')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const items = Array.from(modules)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order_index for all modules
    const updatedModules = items.map((module, index) => ({
      ...module,
      order_index: index,
    }))

    setModules(updatedModules)

    // Update in database
    try {
      const updates = updatedModules.map(module => ({
        id: module.id,
        order_index: module.order_index,
      }))

      for (const update of updates) {
        await supabase
          .from('modules')
          .update({ order_index: update.order_index })
          .eq('id', update.id)
      }

      toast.success('Module order updated')
    } catch (error) {
      console.error('Error updating module order:', error)
      toast.error('Failed to update module order')
    }
  }

  const toggleExpanded = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId)
      } else {
        newSet.add(moduleId)
      }
      return newSet
    })
  }

  const startEditing = (module: Module) => {
    setEditModule({
      title: module.title,
      description: module.description || '',
    })
    setEditingModule(module.id)
    // Auto-expand when editing
    setExpandedModules(prev => new Set([...prev, module.id]))
  }

  const moveChapterToModule = async (chapterId: string, targetModuleId: string | null) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('chapters')
        .update({ module_id: targetModuleId })
        .eq('id', chapterId)

      if (error) throw error

      // Update local state
      if (targetModuleId === null) {
        // Moving to unassigned
        const chapter =
          modules.flatMap(m => m.chapters || []).find(c => c.id === chapterId) ||
          unassigned.find(c => c.id === chapterId)
        if (chapter) {
          setUnassigned(prev => [...prev, { ...chapter, module_id: '' }])
          setModules(prev =>
            prev.map(module => ({
              ...module,
              chapters: module.chapters?.filter(c => c.id !== chapterId) || [],
            }))
          )
        }
      } else {
        // Moving to a module
        const chapter =
          unassigned.find(c => c.id === chapterId) ||
          modules.flatMap(m => m.chapters || []).find(c => c.id === chapterId)
        if (chapter) {
          setUnassigned(prev => prev.filter(c => c.id !== chapterId))
          setModules(prev =>
            prev.map(module => {
              if (module.id === targetModuleId) {
                return {
                  ...module,
                  chapters: [...(module.chapters || []), { ...chapter, module_id: targetModuleId }],
                }
              } else {
                return {
                  ...module,
                  chapters: module.chapters?.filter(c => c.id !== chapterId) || [],
                }
              }
            })
          )
        }
      }

      toast.success('Chapter moved successfully')
    } catch (error) {
      console.error('Error moving chapter:', error)
      toast.error('Failed to move chapter')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Modules</h2>
          <p className="text-gray-600 mt-1">
            Organize your course into modules, then add chapters to each module. Drag and drop to
            reorder.
          </p>
        </div>

        <Button variant="learning" onClick={() => setIsCreating(true)} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          Add Module
        </Button>
      </div>

      {/* Create New Module Form */}
      {isCreating && (
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
          <CardHeader>
            <CardTitle>Create New Module</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Module title (e.g., 'Digital Marketing Summary')"
              value={newModule.title}
              onChange={e => setNewModule(prev => ({ ...prev, title: e.target.value }))}
            />
            <Textarea
              placeholder="Module description (optional)"
              value={newModule.description}
              onChange={e => setNewModule(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
            <div className="flex items-center gap-3">
              <Button onClick={createModule} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                Create Module
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chapter Mover - for organizing existing chapters */}
      {(unassigned.length > 0 || modules.some(m => m.chapters && m.chapters.length > 0)) && (
        <ChapterMover
          chapters={[...unassigned, ...modules.flatMap(m => m.chapters || [])]}
          modules={modules}
          onChapterMoved={(chapterId, newModuleId) => {
            moveChapterToModule(chapterId, newModuleId)
          }}
        />
      )}

      {/* Unassigned Chapters Section */}
      {unassigned.length > 0 && (
        <Card className="border-2 border-dashed border-orange-300 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <BookOpen className="h-5 w-5" />
              Unassigned Chapters
            </CardTitle>
            <CardDescription className="text-orange-700">
              These chapters are not assigned to any module. Drag them to modules or assign them
              below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unassigned.map(chapter => (
                <div
                  key={chapter.id}
                  className="flex items-center justify-between p-3 bg-white border border-orange-200 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{chapter.title}</h4>
                    {chapter.description && (
                      <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      onChange={e => {
                        if (e.target.value) {
                          moveChapterToModule(chapter.id, e.target.value)
                        }
                      }}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                      disabled={isLoading}
                    >
                      <option value="">Assign to module...</option>
                      {modules.map(module => (
                        <option key={module.id} value={module.id}>
                          {module.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modules List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="modules">
          {provided => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {modules.map((module, index) => (
                <Draggable key={module.id} draggableId={module.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`border rounded-lg bg-white ${
                        snapshot.isDragging ? 'shadow-lg' : ''
                      } ${
                        editingModule === module.id
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      {/* Module Header */}
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
                            </div>

                            <button
                              onClick={() => toggleExpanded(module.id)}
                              className="flex items-center gap-2 text-left flex-1"
                            >
                              {expandedModules.has(module.id) ? (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-500" />
                              )}

                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <h3 className="font-semibold text-gray-900">
                                    {index + 1}. {module.title}
                                  </h3>
                                  <Badge variant={module.is_published ? 'default' : 'secondary'}>
                                    {module.is_published ? 'Published' : 'Draft'}
                                  </Badge>
                                  {editingModule === module.id && (
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-100 text-blue-700 border-blue-300"
                                    >
                                      Editing
                                    </Badge>
                                  )}
                                </div>
                                {module.description && (
                                  <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                                )}
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" />
                                    {module.chapters?.length || 0} chapters
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {module.estimated_duration || 0} min
                                  </span>
                                </div>
                              </div>
                            </button>
                          </div>

                          {/* Module Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleModulePublished(module.id, module.is_published)}
                              disabled={isLoading}
                            >
                              {module.is_published ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (editingModule === module.id) {
                                  setEditingModule(null)
                                } else {
                                  startEditing(module)
                                }
                              }}
                              className={
                                editingModule === module.id ? 'bg-blue-100 text-blue-700' : ''
                              }
                            >
                              <Edit className="h-4 w-4" />
                              {editingModule === module.id && (
                                <span className="ml-1 text-xs">Editing</span>
                              )}
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteModule(module.id)}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {expandedModules.has(module.id) && (
                        <div className="border-t bg-gray-50 p-4">
                          {/* Edit Form */}
                          {editingModule === module.id && (
                            <div className="space-y-4 mb-6">
                              <h4 className="font-medium text-gray-900">Edit Module</h4>
                              <Input
                                placeholder="Module title"
                                value={editModule.title}
                                onChange={e =>
                                  setEditModule(prev => ({ ...prev, title: e.target.value }))
                                }
                              />
                              <Textarea
                                placeholder="Module description"
                                value={editModule.description}
                                onChange={e =>
                                  setEditModule(prev => ({ ...prev, description: e.target.value }))
                                }
                                rows={3}
                              />
                              <div className="flex items-center gap-3">
                                <Button
                                  onClick={() => updateModule(module.id)}
                                  disabled={isLoading}
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  Save Changes
                                </Button>
                                <Button variant="outline" onClick={() => setEditingModule(null)}>
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel
                                </Button>
                              </div>
                              <Separator />
                            </div>
                          )}

                          {/* Chapter Manager for this Module */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                              <List className="h-4 w-4" />
                              Chapters in this Module
                            </h4>
                            <ChapterManager
                              courseId={courseId}
                              moduleId={module.id}
                              initialChapters={module.chapters || []}
                            />
                          </div>
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

      {/* Empty State */}
      {modules.length === 0 && !isCreating && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
          <p className="text-gray-600 mb-4">
            Start by creating your first module to organize your course content.
          </p>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Module
          </Button>
        </div>
      )}
    </div>
  )
}
