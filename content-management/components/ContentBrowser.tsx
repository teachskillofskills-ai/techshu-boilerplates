'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichContentEditor } from '@/components/editor/RichContentEditor'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import {
  Edit,
  Eye,
  EyeOff,
  Save,
  X,
  Clock,
  BookOpen,
  FileText,
  Calendar,
  User,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'

interface ContentBrowserProps {
  chapters: any[]
  courses: any[]
  userId: string
}

interface EditingChapter {
  id: string
  title: string
  description: string
  content_md: string
  estimated_duration: number
  is_published: boolean
}

export function ContentBrowser({ chapters, courses, userId }: ContentBrowserProps) {
  const [editingChapter, setEditingChapter] = useState<EditingChapter | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null)

  const supabase = createClient()

  const handleEditChapter = (chapter: any) => {
    setEditingChapter({
      id: chapter.id,
      title: chapter.title,
      description: chapter.description || '',
      content_md: chapter.content_md || '',
      estimated_duration: chapter.estimated_duration || 10,
      is_published: chapter.is_published,
    })
  }

  const handleSaveChapter = async () => {
    if (!editingChapter) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('chapters')
        .update({
          title: editingChapter.title,
          description: editingChapter.description,
          content_md: editingChapter.content_md,
          estimated_duration: editingChapter.estimated_duration,
          is_published: editingChapter.is_published,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingChapter.id)

      if (error) throw error

      toast.success('Chapter updated successfully!')
      setEditingChapter(null)
      // Refresh the page to show updated content
      window.location.reload()
    } catch (error) {
      console.error('Error updating chapter:', error)
      toast.error('Failed to update chapter. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const togglePublishStatus = async (chapterId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('chapters')
        .update({
          is_published: !currentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', chapterId)

      if (error) throw error

      toast.success(`Chapter ${!currentStatus ? 'published' : 'unpublished'} successfully!`)
      // Refresh the page to show updated status
      window.location.reload()
    } catch (error) {
      console.error('Error updating publish status:', error)
      toast.error('Failed to update publish status. Please try again.')
    }
  }

  const getContentPreview = (content: string) => {
    // Strip HTML tags and get first 150 characters
    const textContent = content.replace(/<[^>]*>/g, '').trim()
    return textContent.length > 150 ? textContent.substring(0, 150) + '...' : textContent
  }

  if (editingChapter) {
    return (
      <div className="space-y-6">
        {/* Edit Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Editing Chapter</h3>
            <p className="text-sm text-gray-600">
              Make changes to the chapter content and settings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setEditingChapter(null)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveChapter} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Edit Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chapter Settings */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Chapter Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingChapter.title}
                    onChange={e =>
                      setEditingChapter(prev => (prev ? { ...prev, title: e.target.value } : null))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingChapter.description}
                    onChange={e =>
                      setEditingChapter(prev =>
                        prev ? { ...prev, description: e.target.value } : null
                      )
                    }
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={editingChapter.estimated_duration}
                    onChange={e =>
                      setEditingChapter(prev =>
                        prev
                          ? { ...prev, estimated_duration: parseInt(e.target.value) || 10 }
                          : null
                      )
                    }
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={editingChapter.is_published}
                    onChange={e =>
                      setEditingChapter(prev =>
                        prev ? { ...prev, is_published: e.target.checked } : null
                      )
                    }
                    className="rounded"
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Editor */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Chapter Content</CardTitle>
                <CardDescription>
                  Edit the chapter content using the rich text editor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RichContentEditor
                  content={editingChapter.content_md}
                  onChange={content =>
                    setEditingChapter(prev => (prev ? { ...prev, content_md: content } : null))
                  }
                  placeholder="Write your chapter content here..."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {chapters.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No chapters found</h3>
              <p className="text-gray-600">
                No chapters match your current search and filter criteria.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {chapters.map(chapter => (
            <Card key={chapter.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Chapter Header */}
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{chapter.title}</h3>
                      <Badge variant={chapter.is_published ? 'default' : 'secondary'}>
                        {chapter.is_published ? (
                          <>
                            <Eye className="h-3 w-3 mr-1" /> Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" /> Draft
                          </>
                        )}
                      </Badge>
                    </div>

                    {/* Course and Metadata */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {chapter.course_title}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {chapter.estimated_duration} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDistanceToNow(new Date(chapter.updated_at), { addSuffix: true })}
                      </div>
                    </div>

                    {/* Description */}
                    {chapter.description && (
                      <p className="text-sm text-gray-600 mb-3">{chapter.description}</p>
                    )}

                    {/* Content Preview */}
                    {expandedChapter === chapter.id ? (
                      <div className="bg-gray-50 rounded-lg p-4 mb-3">
                        <div className="prose prose-sm max-w-none">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: chapter.content_md || '<p>No content</p>',
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      chapter.content_md && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-700">
                            {getContentPreview(chapter.content_md)}
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)
                      }
                    >
                      {expandedChapter === chapter.id ? 'Collapse' : 'Preview'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublishStatus(chapter.id, chapter.is_published)}
                    >
                      {chapter.is_published ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" /> Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" /> Publish
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditChapter(chapter)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
