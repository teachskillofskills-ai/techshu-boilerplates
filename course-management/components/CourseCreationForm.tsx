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
import { ModuleStructure } from '@/components/course/ModuleStructure'
import { ChapterLibrary } from '@/components/course/ChapterLibrary'
import {
  Save,
  Eye,
  Upload,
  Plus,
  X,
  BookOpen,
  Clock,
  Users,
  Star,
  Image as ImageIcon,
  FileText,
  Settings,
  List,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface CourseCreationFormProps {
  initialData?: any
  mode?: 'create' | 'edit'
}

export function CourseCreationForm({ initialData, mode = 'create' }: CourseCreationFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    long_description: initialData?.long_description || '',
    difficulty_level: initialData?.difficulty_level || 1,
    estimated_duration: initialData?.estimated_duration || 60,
    price: initialData?.price || 0,
    status: initialData?.status || 'draft',
    is_featured: initialData?.is_featured || false,
    category: initialData?.category || '',
    tags: initialData?.tags || [],
    thumbnail_url: initialData?.thumbnail_url || '',
    preview_video_url: initialData?.preview_video_url || '',
    learning_objectives: initialData?.learning_objectives || [''],
    prerequisites: initialData?.prerequisites || [''],
    target_audience: initialData?.target_audience || '',
  })

  const [newTag, setNewTag] = useState('')

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))

    // Auto-generate slug from title
    if (field === 'title' && mode === 'create') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((tag: string) => tag !== tagToRemove),
    }))
  }

  const addLearningObjective = () => {
    setFormData(prev => ({
      ...prev,
      learning_objectives: [...prev.learning_objectives, ''],
    }))
  }

  const updateLearningObjective = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      learning_objectives: prev.learning_objectives.map((obj: string, i: number) =>
        i === index ? value : obj
      ),
    }))
  }

  const removeLearningObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      learning_objectives: prev.learning_objectives.filter((_: string, i: number) => i !== index),
    }))
  }

  const addPrerequisite = () => {
    setFormData(prev => ({
      ...prev,
      prerequisites: [...prev.prerequisites, ''],
    }))
  }

  const updatePrerequisite = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.map((req: string, i: number) =>
        i === index ? value : req
      ),
    }))
  }

  const removePrerequisite = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_: string, i: number) => i !== index),
    }))
  }

  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.title?.trim()) {
        toast.error('Course title is required')
        return
      }

      if (!formData.description?.trim()) {
        toast.error('Course description is required')
        return
      }

      console.log('Saving course with data:', formData)

      const courseData: any = {
        ...formData,
        status,
        learning_objectives: formData.learning_objectives.filter((obj: string) => obj.trim()),
        prerequisites: formData.prerequisites.filter((req: string) => req.trim()),
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        updated_at: new Date().toISOString(),
      }

      if (mode === 'create') {
        courseData.created_at = new Date().toISOString()
        // Get current user for created_by field
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          courseData.created_by = user.id
        }
      }

      console.log('Final course data:', courseData)

      const { data, error } =
        mode === 'create'
          ? await supabase.from('courses').insert(courseData).select().single()
          : await supabase
              .from('courses')
              .update(courseData)
              .eq('id', initialData?.id)
              .select()
              .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Course saved successfully:', data)

      toast.success(
        mode === 'create'
          ? `Course ${status === 'published' ? 'created and published' : 'saved as draft'}!`
          : `Course ${status === 'published' ? 'published' : 'updated'}!`
      )

      if (mode === 'create' && data?.slug) {
        router.push(`/teaching/courses/${data.slug}/edit`)
      } else {
        router.refresh()
      }
    } catch (error: any) {
      console.error('Error saving course:', error)
      console.error('Error details:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
      })

      // Provide more specific error messages
      if (error?.message?.includes('duplicate')) {
        toast.error('A course with this title or slug already exists')
      } else if (error?.message?.includes('permission')) {
        toast.error('Permission denied. Please check your access rights.')
      } else if (error?.code === 'PGRST116') {
        toast.error('Course not found. Please refresh the page.')
      } else {
        toast.error(`Failed to save course: ${error?.message || 'Unknown error'}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: BookOpen },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'structure', label: 'Course Structure', icon: List },
    { id: 'chapters', label: 'Chapter Library', icon: FileText },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === 'create' ? 'Create New Course' : 'Edit Course'}
          </h1>
          <p className="text-gray-600 mt-2">
            {mode === 'create'
              ? 'Build an engaging course with our powerful content editor'
              : 'Update your course content and settings'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => handleSave('draft')} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => handleSave('published')} disabled={isLoading}>
            <Eye className="h-4 w-4 mr-2" />
            {formData.status === 'published' ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
                <CardDescription>Basic information about your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={e => handleInputChange('title', e.target.value)}
                    placeholder="Enter course title"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={e => handleInputChange('slug', e.target.value)}
                    placeholder="course-url-slug"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">This will be used in the course URL</p>
                </div>

                <div>
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of your course"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={value => handleInputChange('category', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="programming">Programming</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="data-science">Data Science</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
                <CardDescription>Configure difficulty, duration, and pricing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={formData.difficulty_level.toString()}
                    onValueChange={value => handleInputChange('difficulty_level', parseInt(value))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Beginner</SelectItem>
                      <SelectItem value="2">Intermediate</SelectItem>
                      <SelectItem value="3">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.estimated_duration}
                    onChange={e =>
                      handleInputChange('estimated_duration', parseInt(e.target.value) || 0)
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={e => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Set to 0 for free courses</p>
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="ml-1">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Description</CardTitle>
                <CardDescription>
                  Provide a comprehensive description of your course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RichContentEditor
                  content={formData.long_description}
                  onChange={content => handleInputChange('long_description', content)}
                  placeholder="Write a detailed description of your course, including what students will learn, the structure, and any important details..."
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Objectives</CardTitle>
                  <CardDescription>
                    What will students achieve after completing this course?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.learning_objectives.map((objective: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={objective}
                        onChange={e => updateLearningObjective(index, e.target.value)}
                        placeholder="Students will be able to..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeLearningObjective(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addLearningObjective}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Objective
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Prerequisites</CardTitle>
                  <CardDescription>
                    What should students know before taking this course?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.prerequisites.map((prerequisite: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={prerequisite}
                        onChange={e => updatePrerequisite(index, e.target.value)}
                        placeholder="Basic knowledge of..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePrerequisite(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addPrerequisite}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Prerequisite
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Course Structure Tab */}
        {activeTab === 'structure' && (
          <div className="space-y-6">
            {mode === 'edit' && initialData?.id ? (
              <ModuleStructure
                courseId={initialData.id}
                modules={
                  initialData.modules?.map((m: any) => ({
                    ...m,
                    chapter_count: m.chapters?.length || 0,
                  })) || []
                }
                onModuleUpdate={() => window.location.reload()}
              />
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <List className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Course Structure</h3>
                <p className="text-gray-600 mb-4">
                  Save the course first to start organizing modules.
                </p>
                <Button
                  onClick={() => handleSave('draft')}
                  disabled={isLoading}
                  className="mx-auto"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Course Draft
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Chapter Library Tab */}
        {activeTab === 'chapters' && (
          <div className="space-y-6">
            {mode === 'edit' && initialData?.id ? (
              <ChapterLibrary
                courseId={initialData.id}
                courseSlug={initialData.slug}
                chapters={(() => {
                  // Get all chapters from modules
                  const moduleChapters =
                    initialData.modules?.flatMap((m: any) => m.chapters || []) || []
                  // Get unassigned chapters (not in any module)
                  const unassignedChapters =
                    initialData.chapters?.filter((ch: any) => !ch.module_id) || []
                  // Combine and deduplicate by ID
                  const allChapters = [...moduleChapters, ...unassignedChapters]
                  const uniqueChapters = allChapters.filter(
                    (chapter, index, self) => index === self.findIndex(c => c.id === chapter.id)
                  )
                  return uniqueChapters
                })()}
                modules={initialData.modules || []}
                onChapterUpdate={() => window.location.reload()}
              />
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chapter Library</h3>
                <p className="text-gray-600 mb-4">
                  Save the course first to start creating chapters.
                </p>
                <Button
                  onClick={() => handleSave('draft')}
                  disabled={isLoading}
                  className="mx-auto"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Course Draft
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Thumbnail</CardTitle>
                <CardDescription>Upload an attractive thumbnail for your course</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                  <Input
                    type="url"
                    placeholder="Or enter image URL"
                    value={formData.thumbnail_url}
                    onChange={e => handleInputChange('thumbnail_url', e.target.value)}
                    className="mt-4"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview Video</CardTitle>
                <CardDescription>Add a preview video to showcase your course</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    type="url"
                    placeholder="Video URL (YouTube, Vimeo, Loom, Wistia, Twitch, Dailymotion)"
                    value={formData.preview_video_url}
                    onChange={e => handleInputChange('preview_video_url', e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Paste a video URL from YouTube, Vimeo, Loom, Wistia, Twitch, or Dailymotion for
                    your course preview
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-400">
                    <span>• YouTube</span>
                    <span>• Vimeo</span>
                    <span>• Loom</span>
                    <span>• Wistia</span>
                    <span>• Twitch</span>
                    <span>• Dailymotion</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure additional course settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="target_audience">Target Audience</Label>
                <Textarea
                  id="target_audience"
                  value={formData.target_audience}
                  onChange={e => handleInputChange('target_audience', e.target.value)}
                  placeholder="Describe who this course is for..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={e => handleInputChange('is_featured', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="is_featured">Feature this course on the homepage</Label>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
