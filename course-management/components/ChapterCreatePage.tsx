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
import { RichContentEditor } from '@/components/editor/RichContentEditor'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Link from 'next/link'
import { Save, ArrowLeft, Eye, EyeOff, Clock, FolderOpen, BookOpen, Plus } from 'lucide-react'

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

interface ChapterCreatePageProps {
  course: Course
  modules: Module[]
}

// Generate slug from title (matches database function)
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function ChapterCreatePage({ course, modules }: ChapterCreatePageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_md: '',
    estimated_duration: 10,
    module_id: 'unassigned',
    is_published: false,
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
      // Get the highest order_index for chapters in this course
      const { data: existingChapters } = await supabase
        .from('chapters')
        .select('order_index')
        .eq('course_id', course.id)
        .order('order_index', { ascending: false })
        .limit(1)

      const nextOrderIndex =
        existingChapters && existingChapters.length > 0 ? existingChapters[0].order_index + 1 : 0

      // Generate slug from title
      const slug = generateSlug(formData.title)

      const { data, error } = await supabase
        .from('chapters')
        .insert({
          course_id: course.id,
          title: formData.title,
          slug: slug,
          description: formData.description || null,
          content_md: formData.content_md || null,
          estimated_duration: formData.estimated_duration,
          module_id: formData.module_id === 'unassigned' ? null : formData.module_id,
          is_published: formData.is_published,
          order_index: nextOrderIndex,
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Chapter created successfully!')

      // Redirect to the new chapter's edit page
      router.push(`/teaching/courses/${course.slug}/chapters/${slug}/edit`)
    } catch (error) {
      console.error('Error creating chapter:', error)
      toast.error('Failed to create chapter')
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Chapter</h1>
            <p className="text-gray-600">Course: {course.title}</p>
          </div>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Chapter
        </Badge>
      </div>

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
              <Label htmlFor="title">Chapter Title *</Label>
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
                min="1"
                className="mt-1"
              />
            </div>
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

          {/* Module Assignment */}
          <div>
            <Label htmlFor="module">Module Assignment</Label>
            <Select
              value={formData.module_id}
              onValueChange={value => setFormData(prev => ({ ...prev, module_id: value }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a module" />
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

          {/* Publishing Status */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={e => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <Label htmlFor="is_published" className="flex items-center gap-2">
              {formData.is_published ? (
                <Eye className="h-4 w-4 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
              Publish chapter (make visible to students)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Content Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Chapter Content</CardTitle>
          <CardDescription>
            Write your chapter content using the rich text editor below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RichContentEditor
            content={formData.content_md}
            onChange={content => setFormData(prev => ({ ...prev, content_md: content }))}
            placeholder="Start writing your chapter content..."
          />
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="flex items-center justify-between py-4 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>Estimated reading time: {formData.estimated_duration} minutes</span>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/teaching/courses/${course.slug}/edit?tab=chapters`}>
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Chapter
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
