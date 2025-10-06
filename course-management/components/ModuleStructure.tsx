'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  GripVertical,
  Eye,
  EyeOff,
  BookOpen,
  Clock,
  Users,
} from 'lucide-react'

interface Module {
  id: string
  title: string
  slug: string
  description: string
  order_index: number
  is_published: boolean
  estimated_duration: number
  created_at: string
  updated_at: string
  chapter_count?: number
}

interface ModuleStructureProps {
  courseId: string
  modules: Module[]
  onModuleUpdate: () => void
}

export function ModuleStructure({ courseId, modules, onModuleUpdate }: ModuleStructureProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [editingModule, setEditingModule] = useState<string | null>(null)
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

      setNewModule({ title: '', description: '' })
      setIsCreating(false)
      onModuleUpdate()
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

      setEditingModule(null)
      onModuleUpdate()
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
        'Are you sure you want to delete this module? This will also unassign all chapters from this module.'
      )
    ) {
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.from('modules').delete().eq('id', moduleId)

      if (error) throw error

      onModuleUpdate()
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

      onModuleUpdate()
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

      onModuleUpdate()
      toast.success('Module order updated')
    } catch (error) {
      console.error('Error updating module order:', error)
      toast.error('Failed to update module order')
    }
  }

  const startEditing = (module: Module) => {
    setEditModule({
      title: module.title,
      description: module.description,
    })
    setEditingModule(module.id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Structure</h2>
          <p className="text-gray-600 mt-1">
            Organize your course into logical modules. Each module groups related chapters together.
          </p>
        </div>

        <Button onClick={() => setIsCreating(true)} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          Add Module
        </Button>
      </div>

      {/* Create New Module Form */}
      {isCreating && (
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
          <CardHeader>
            <CardTitle>Create New Module</CardTitle>
            <CardDescription>Add a new module to organize your course content</CardDescription>
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

      {/* Modules List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="modules">
          {provided => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {modules.map((module, index) => (
                <Draggable key={module.id} draggableId={module.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${snapshot.isDragging ? 'shadow-lg' : ''} ${
                        editingModule === module.id
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <CardContent className="p-6">
                        {editingModule === module.id ? (
                          /* Edit Form */
                          <div className="space-y-4">
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
                              <Button onClick={() => updateModule(module.id)} disabled={isLoading}>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                              </Button>
                              <Button variant="outline" onClick={() => setEditingModule(null)}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          /* Display Mode */
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div {...provided.dragHandleProps} className="mt-1">
                                <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-xl font-semibold text-gray-900">
                                    {index + 1}. {module.title}
                                  </h3>
                                  <Badge variant={module.is_published ? 'default' : 'secondary'}>
                                    {module.is_published ? 'Published' : 'Draft'}
                                  </Badge>
                                </div>

                                {module.description && (
                                  <p className="text-gray-600 mb-4">{module.description}</p>
                                )}

                                <div className="flex items-center gap-6 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <BookOpen className="h-4 w-4" />
                                    {module.chapter_count || 0} chapters
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {module.estimated_duration || 0} min
                                  </span>
                                  <span className="text-xs">
                                    Updated {new Date(module.updated_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  toggleModulePublished(module.id, module.is_published)
                                }
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
                                onClick={() => startEditing(module)}
                              >
                                <Edit className="h-4 w-4" />
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
                        )}
                      </CardContent>
                    </Card>
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
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
            <p className="text-gray-600 mb-4">
              Start by creating your first module to organize your course content.
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Module
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
