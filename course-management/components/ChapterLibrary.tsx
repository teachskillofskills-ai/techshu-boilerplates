'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Link from 'next/link'
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  BookOpen,
  Clock,
  FolderOpen,
  MoreHorizontal,
  CheckSquare,
  Square,
} from 'lucide-react'

// Generate slug from title (matches database function)
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

interface Chapter {
  id: string
  title: string
  slug?: string
  description?: string
  module_id?: string
  order_index: number
  is_published: boolean
  estimated_duration: number
  created_at: string
  updated_at: string
}

interface Module {
  id: string
  title: string
  description: string
}

interface ChapterLibraryProps {
  courseId: string
  courseSlug: string
  chapters: Chapter[]
  modules: Module[]
  onChapterUpdate: () => void
}

export function ChapterLibrary({
  courseId,
  courseSlug,
  chapters,
  modules,
  onChapterUpdate,
}: ChapterLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [moduleFilter, setModuleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'module-order'>('table')

  const supabase = createClient()

  // Filter chapters
  const filteredChapters = chapters.filter(chapter => {
    const matchesSearch =
      chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chapter.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesModule =
      moduleFilter === 'all' ||
      (moduleFilter === 'unassigned' && !chapter.module_id) ||
      chapter.module_id === moduleFilter

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && chapter.is_published) ||
      (statusFilter === 'draft' && !chapter.is_published)

    return matchesSearch && matchesModule && matchesStatus
  })

  const getModuleName = (moduleId?: string) => {
    if (!moduleId) return 'Unassigned'
    const moduleItem = modules.find(m => m.id === moduleId)
    return moduleItem?.title || 'Unknown Module'
  }

  const toggleChapterSelection = (chapterId: string) => {
    setSelectedChapters(prev => {
      const newSet = new Set(prev)
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId)
      } else {
        newSet.add(chapterId)
      }
      return newSet
    })
  }

  const selectAllVisible = () => {
    setSelectedChapters(new Set(filteredChapters.map(ch => ch.id)))
  }

  const clearSelection = () => {
    setSelectedChapters(new Set())
  }

  const bulkAssignToModule = async (moduleId: string | null) => {
    if (selectedChapters.size === 0) {
      toast.error('No chapters selected')
      return
    }

    setIsLoading(true)
    try {
      // Get the highest order_index for the target module
      let nextOrderIndex = 0
      if (moduleId) {
        const { data: existingChapters } = await supabase
          .from('chapters')
          .select('order_index')
          .eq('module_id', moduleId)
          .order('order_index', { ascending: false })
          .limit(1)

        if (existingChapters && existingChapters.length > 0) {
          nextOrderIndex = existingChapters[0].order_index + 1
        }
      }

      // Update chapters with module assignment and proper ordering
      const updates = Array.from(selectedChapters).map((chapterId, index) => ({
        id: chapterId,
        module_id: moduleId,
        order_index: moduleId ? nextOrderIndex + index : 0,
      }))

      for (const update of updates) {
        const { error } = await supabase
          .from('chapters')
          .update({
            module_id: update.module_id,
            order_index: update.order_index,
          })
          .eq('id', update.id)

        if (error) throw error
      }

      toast.success(`${selectedChapters.size} chapters assigned successfully`)
      setSelectedChapters(new Set())
      onChapterUpdate()
    } catch (error) {
      console.error('Error assigning chapters:', error)
      toast.error('Failed to assign chapters')
    } finally {
      setIsLoading(false)
    }
  }

  const updateChapterOrder = async (chapterId: string, newOrderIndex: number, moduleId: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('chapters')
        .update({ order_index: newOrderIndex })
        .eq('id', chapterId)

      if (error) throw error

      toast.success('Chapter order updated')
      onChapterUpdate()
    } catch (error) {
      console.error('Error updating chapter order:', error)
      toast.error('Failed to update chapter order')
    } finally {
      setIsLoading(false)
    }
  }

  const bulkPublishToggle = async (publish: boolean) => {
    if (selectedChapters.size === 0) {
      toast.error('No chapters selected')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('chapters')
        .update({ is_published: publish })
        .in('id', Array.from(selectedChapters))

      if (error) throw error

      toast.success(
        `${selectedChapters.size} chapters ${publish ? 'published' : 'unpublished'} successfully`
      )
      setSelectedChapters(new Set())
      onChapterUpdate()
    } catch (error) {
      console.error('Error updating chapters:', error)
      toast.error('Failed to update chapters')
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

      toast.success('Chapter deleted successfully')
      onChapterUpdate()
    } catch (error) {
      console.error('Error deleting chapter:', error)
      toast.error('Failed to delete chapter')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chapter Library</h2>
          <p className="text-gray-600 mt-1">
            Manage all course chapters in one place. Create, edit, and organize your content.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              📋 Table View
            </Button>
            <Button
              variant={viewMode === 'module-order' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('module-order')}
            >
              📚 Module Order
            </Button>
          </div>

          <Link href={`/teaching/courses/${courseSlug}/chapters/new`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Chapter
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search chapters..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Module Filter */}
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {modules.map(module => (
                  <SelectItem key={module.id} value={module.id}>
                    {module.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              Showing {filteredChapters.length} of {chapters.length} chapters
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedChapters.size > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {selectedChapters.size} chapters selected
                </span>
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Clear Selection
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Select
                  onValueChange={moduleId =>
                    bulkAssignToModule(moduleId === 'unassigned' ? null : moduleId)
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Assign to..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {modules.map(module => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm" onClick={() => bulkPublishToggle(true)}>
                  <Eye className="h-4 w-4 mr-1" />
                  Publish
                </Button>

                <Button variant="outline" size="sm" onClick={() => bulkPublishToggle(false)}>
                  <EyeOff className="h-4 w-4 mr-1" />
                  Unpublish
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content based on view mode */}
      {viewMode === 'table' ? (
        /* Chapter Table */
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Chapters</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={selectAllVisible}>
                  <CheckSquare className="h-4 w-4 mr-1" />
                  Select All Visible
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 w-12">
                      <Checkbox
                        checked={
                          selectedChapters.size === filteredChapters.length &&
                          filteredChapters.length > 0
                        }
                        onCheckedChange={checked => {
                          if (checked) {
                            selectAllVisible()
                          } else {
                            clearSelection()
                          }
                        }}
                      />
                    </th>
                    <th className="text-left py-3 px-4">Chapter</th>
                    <th className="text-left py-3 px-4">Module</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Duration</th>
                    <th className="text-left py-3 px-4">Updated</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChapters.map(chapter => (
                    <tr key={chapter.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <Checkbox
                          checked={selectedChapters.has(chapter.id)}
                          onCheckedChange={() => toggleChapterSelection(chapter.id)}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{chapter.title}</div>
                          {chapter.description && (
                            <div className="text-sm text-gray-600 mt-1">{chapter.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FolderOpen className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{getModuleName(chapter.module_id)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={chapter.is_published ? 'default' : 'secondary'}>
                          {chapter.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          {chapter.estimated_duration || 0} min
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(chapter.updated_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/teaching/courses/${courseSlug}/chapters/${chapter.slug || generateSlug(chapter.title)}/edit`}
                          >
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteChapter(chapter.id)}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredChapters.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No chapters found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || moduleFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Create your first chapter to get started'}
                </p>
                {!searchTerm && moduleFilter === 'all' && statusFilter === 'all' && (
                  <Link href={`/teaching/courses/${courseSlug}/chapters/new`}>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Chapter
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Module Order View */
        <div className="space-y-6">
          {modules.map(module => {
            const moduleChapters = chapters
              .filter(ch => ch.module_id === module.id)
              .sort((a, b) => a.order_index - b.order_index)

            return (
              <Card key={module.id} className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <FolderOpen className="h-5 w-5 text-blue-600" />
                    {module.title}
                    <Badge variant="outline">{moduleChapters.length} chapters</Badge>
                  </CardTitle>
                  <CardDescription>
                    {module.description || 'No description provided'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {moduleChapters.length > 0 ? (
                    <div className="space-y-3">
                      {moduleChapters.map((chapter, index) => (
                        <div
                          key={chapter.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </span>
                              <div>
                                <h4 className="font-medium text-gray-900">{chapter.title}</h4>
                                {chapter.description && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {chapter.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant={chapter.is_published ? 'default' : 'secondary'}>
                              {chapter.is_published ? 'Published' : 'Draft'}
                            </Badge>

                            {/* Order Controls */}
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateChapterOrder(
                                    chapter.id,
                                    Math.max(0, chapter.order_index - 1),
                                    module.id
                                  )
                                }
                                disabled={index === 0 || isLoading}
                                title="Move Up"
                              >
                                ↑
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateChapterOrder(chapter.id, chapter.order_index + 1, module.id)
                                }
                                disabled={index === moduleChapters.length - 1 || isLoading}
                                title="Move Down"
                              >
                                ↓
                              </Button>
                            </div>

                            <Link
                              href={`/teaching/courses/${courseSlug}/chapters/${chapter.slug || generateSlug(chapter.title)}/edit`}
                            >
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No chapters assigned to this module yet.</p>
                      <p className="text-sm mt-1">
                        Use the Table View to assign chapters to this module.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}

          {/* Unassigned Chapters */}
          {chapters.filter(ch => !ch.module_id).length > 0 && (
            <Card className="border-2 border-dashed border-orange-300 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-orange-800">
                  <BookOpen className="h-5 w-5" />
                  Unassigned Chapters
                  <Badge variant="outline" className="border-orange-300">
                    {chapters.filter(ch => !ch.module_id).length} chapters
                  </Badge>
                </CardTitle>
                <CardDescription className="text-orange-700">
                  These chapters are not assigned to any module. Use Table View to organize them.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {chapters
                    .filter(ch => !ch.module_id)
                    .map(chapter => (
                      <div
                        key={chapter.id}
                        className="flex items-center justify-between p-3 bg-white rounded border border-orange-200"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">{chapter.title}</h4>
                          {chapter.description && (
                            <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
                          )}
                        </div>
                        <Link
                          href={`/teaching/courses/${courseSlug}/chapters/${chapter.slug || generateSlug(chapter.title)}/edit`}
                        >
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
