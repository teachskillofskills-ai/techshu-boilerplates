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
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RichContentEditor } from '@/components/editor/RichContentEditor'
import { AssignmentManager } from '@/components/assignments/AssignmentManager'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  Clock,
  FolderOpen,
  BookOpen,
  FileText,
  CheckSquare,
} from 'lucide-react'
import Link from 'next/link'

interface Chapter {
  id: string
  title: string
  description?: string
  content_md?: string
  order_index: number
  is_published: boolean
  estimated_duration: number
  module_id?: string
  module?: {
    id: string
    title: string
  }
}

interface Course {
  id: string
  title: string
  slug: string
  created_by: string
}

interface Module {
  id: string
  title: string
  order_index: number
}

interface ChapterEditPageProps {
  course: Course
  chapter: Chapter
  modules: Module[]
}

export function ChapterEditPage({ course, chapter, modules }: ChapterEditPageProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Check URL for tab parameter
  const searchParams = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  )
  const initialTab = searchParams.get('tab') === 'assignments' ? 'assignments' : 'content'
  const [activeTab, setActiveTab] = useState(initialTab)

  const [formData, setFormData] = useState({
    title: chapter.title,
    description: chapter.description || '',
    content_md: chapter.content_md || '',
    estimated_duration: chapter.estimated_duration || 10,
    module_id: chapter.module_id || 'unassigned',
    is_published: chapter.is_published,
  })

  const router = useRouter()
  const supabase = createClient()

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Chapter title is required')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('chapters')
        .update({
          title: formData.title,
          description: formData.description,
          content_md: formData.content_md,
          estimated_duration: formData.estimated_duration,
          module_id: formData.module_id === 'unassigned' ? null : formData.module_id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', chapter.id)

      if (error) throw error

      toast.success('Chapter updated successfully')
      router.refresh()
    } catch (error) {
      console.error('Error updating chapter:', error)
      toast.error('Failed to update chapter')
    } finally {
      setIsLoading(false)
    }
  }

  const togglePublished = async () => {
    setIsLoading(true)
    try {
      const newPublishedState = !formData.is_published

      const { error } = await supabase
        .from('chapters')
        .update({ is_published: newPublishedState })
        .eq('id', chapter.id)

      if (error) throw error

      setFormData(prev => ({ ...prev, is_published: newPublishedState }))
      toast.success(`Chapter ${newPublishedState ? 'published' : 'unpublished'} successfully`)
    } catch (error) {
      console.error('Error updating chapter status:', error)
      toast.error('Failed to update chapter status')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/teaching/courses/${course.slug}/edit?tab=chapters`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chapters
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Badge variant={formData.is_published ? 'default' : 'secondary'}>
              {formData.is_published ? 'Published' : 'Draft'}
            </Badge>
            {chapter.module && (
              <Badge variant="outline">
                <FolderOpen className="h-3 w-3 mr-1" />
                {chapter.module.title}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={togglePublished} disabled={isLoading}>
            {formData.is_published ? (
              <EyeOff className="h-4 w-4 mr-2" />
            ) : (
              <Eye className="h-4 w-4 mr-2" />
            )}
            {formData.is_published ? 'Unpublish' : 'Publish'}
          </Button>

          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Assignments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          {/* Chapter Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Chapter Details
              </CardTitle>
              <CardDescription>Course: {course.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Chapter Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter chapter title"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.estimated_duration}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        estimated_duration: parseInt(e.target.value) || 10,
                      }))
                    }
                    className="mt-1"
                    min="1"
                  />
                </div>
              </div>

              {/* Module Assignment */}
              <div>
                <Label htmlFor="module">Assign to Module</Label>
                <Select
                  value={formData.module_id}
                  onValueChange={value => setFormData(prev => ({ ...prev, module_id: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a module (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">No Module (Unassigned)</SelectItem>
                    {modules.map(module => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this chapter"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Chapter Content - THE MAIN RICH TEXT EDITOR */}
          <Card>
            <CardHeader>
              <CardTitle>Chapter Content</CardTitle>
              <CardDescription>
                Edit your chapter content using the rich text editor below. All existing content
                will be loaded for editing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RichContentEditor
                content={formData.content_md}
                onChange={content => setFormData(prev => ({ ...prev, content_md: content }))}
                placeholder="Start writing your chapter content here..."
              />
            </CardContent>
          </Card>

          {/* Save Actions */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Estimated reading time: {formData.estimated_duration} minutes</span>
            </div>

            <div className="flex items-center gap-3">
              <Link href={`/teaching/courses/${course.slug}/edit?tab=chapters`}>
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Chapter'}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="assignments">
          <AssignmentManager
            chapter={{
              id: chapter.id,
              title: chapter.title,
            }}
            course={{
              id: course.id,
              title: course.title,
              slug: course.slug,
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
