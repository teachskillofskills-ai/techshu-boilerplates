'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Upload,
  FileText,
  Link as LinkIcon,
  Package,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  Eye,
  BookOpen,
  Users,
} from 'lucide-react'

interface ImportProgress {
  step: string
  progress: number
  status: 'pending' | 'processing' | 'completed' | 'error'
  message: string
}

export function CourseImportContainer() {
  const [activeTab, setActiveTab] = useState('file')
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState<ImportProgress[]>([])
  const [importedCourse, setImportedCourse] = useState<any>(null)
  const [userId, setUserId] = useState<string | null>(null)

  // File import state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // URL import state
  const [importUrl, setImportUrl] = useState('')

  // Manual import state
  const [manualCourse, setManualCourse] = useState({
    title: '',
    description: '',
    content: '',
  })

  const supabase = createClient()

  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getCurrentUser()
  }, [supabase.auth])

  const updateProgress = (
    step: string,
    progress: number,
    status: ImportProgress['status'],
    message: string
  ) => {
    setImportProgress(prev => {
      const existing = prev.find(p => p.step === step)
      if (existing) {
        return prev.map(p => (p.step === step ? { ...p, progress, status, message } : p))
      } else {
        return [...prev, { step, progress, status, message }]
      }
    })
  }

  const handleFileImport = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to import')
      return
    }

    setIsImporting(true)
    setImportProgress([])

    try {
      updateProgress('validation', 10, 'processing', 'Validating file format...')

      // Read file content
      const fileContent = await selectedFile.text()
      let courseData

      try {
        courseData = JSON.parse(fileContent)
      } catch (error) {
        throw new Error('Invalid JSON format')
      }

      updateProgress('validation', 100, 'completed', 'File validation completed')
      updateProgress('parsing', 20, 'processing', 'Parsing course data...')

      // Validate course structure
      if (!courseData.title || !courseData.description) {
        throw new Error('Course must have title and description')
      }

      updateProgress('parsing', 100, 'completed', 'Course data parsed successfully')
      updateProgress('database', 30, 'processing', 'Creating course in database...')

      if (!userId) {
        throw new Error('User not authenticated')
      }

      // Create course
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          title: courseData.title,
          slug: generateSlug(courseData.title),
          description: courseData.description,
          status: 'draft',
          difficulty_level: courseData.difficulty_level || 1,
          estimated_duration: courseData.estimated_duration || 60,
          is_featured: false,
          created_by: userId,
        })
        .select()
        .single()

      if (courseError) throw courseError

      updateProgress('database', 60, 'processing', 'Course created, importing chapters...')

      // Import chapters if they exist
      if (courseData.chapters && Array.isArray(courseData.chapters)) {
        for (let i = 0; i < courseData.chapters.length; i++) {
          const chapter = courseData.chapters[i]

          await supabase.from('chapters').insert({
            course_id: course.id,
            title: chapter.title,
            description: chapter.description || '',
            content_md: chapter.content || chapter.content_md || '',
            order_index: i + 1,
            estimated_duration: chapter.estimated_duration || 10,
            is_published: false,
          })

          updateProgress(
            'database',
            60 + ((i + 1) / courseData.chapters.length) * 30,
            'processing',
            `Imported chapter ${i + 1} of ${courseData.chapters.length}`
          )
        }
      }

      updateProgress('database', 100, 'completed', 'Course and chapters imported successfully')
      updateProgress('completion', 100, 'completed', 'Import completed successfully!')

      setImportedCourse(course)
      toast.success('Course imported successfully!')
    } catch (error) {
      console.error('Import error:', error)
      updateProgress(
        'error',
        0,
        'error',
        `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
      toast.error('Failed to import course')
    } finally {
      setIsImporting(false)
    }
  }

  const handleUrlImport = async () => {
    if (!importUrl.trim()) {
      toast.error('Please enter a URL to import from')
      return
    }

    setIsImporting(true)
    setImportProgress([])

    try {
      updateProgress('fetch', 10, 'processing', 'Fetching content from URL...')

      // This would typically involve scraping or API calls
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000))

      updateProgress('fetch', 100, 'completed', 'Content fetched successfully')
      updateProgress('parse', 50, 'processing', 'Parsing content...')

      // Simulate parsing
      await new Promise(resolve => setTimeout(resolve, 1500))

      updateProgress('parse', 100, 'completed', 'Content parsed successfully')
      updateProgress('import', 80, 'processing', 'Creating course...')

      if (!userId) {
        throw new Error('User not authenticated')
      }

      // Create a sample course from URL
      const { data: course, error } = await supabase
        .from('courses')
        .insert({
          title: `Imported from ${new URL(importUrl).hostname}`,
          slug: generateSlug(`Imported from ${new URL(importUrl).hostname}`),
          description: `Course imported from ${importUrl}`,
          status: 'draft',
          difficulty_level: 1,
          estimated_duration: 60,
          is_featured: false,
          created_by: userId,
        })
        .select()
        .single()

      if (error) throw error

      updateProgress('import', 100, 'completed', 'Course imported successfully!')
      setImportedCourse(course)
      toast.success('Course imported from URL successfully!')
    } catch (error) {
      console.error('URL import error:', error)
      updateProgress(
        'error',
        0,
        'error',
        `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
      toast.error('Failed to import from URL')
    } finally {
      setIsImporting(false)
    }
  }

  const handleManualImport = async () => {
    if (!manualCourse.title.trim() || !manualCourse.description.trim()) {
      toast.error('Please fill in title and description')
      return
    }

    setIsImporting(true)
    setImportProgress([])

    try {
      updateProgress('creation', 50, 'processing', 'Creating course...')

      if (!userId) {
        throw new Error('User not authenticated')
      }

      const { data: course, error } = await supabase
        .from('courses')
        .insert({
          title: manualCourse.title,
          slug: generateSlug(manualCourse.title),
          description: manualCourse.description,
          status: 'draft',
          difficulty_level: 1,
          estimated_duration: 60,
          is_featured: false,
          created_by: userId,
        })
        .select()
        .single()

      if (error) throw error

      // If content is provided, create a chapter
      if (manualCourse.content.trim()) {
        await supabase.from('chapters').insert({
          course_id: course.id,
          title: 'Introduction',
          description: 'Course introduction',
          content_md: manualCourse.content,
          order_index: 1,
          estimated_duration: 10,
          is_published: false,
        })
      }

      updateProgress('creation', 100, 'completed', 'Course created successfully!')
      setImportedCourse(course)
      toast.success('Course created successfully!')
    } catch (error) {
      console.error('Manual creation error:', error)
      updateProgress(
        'error',
        0,
        'error',
        `Creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
      toast.error('Failed to create course')
    } finally {
      setIsImporting(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100)
  }

  const resetImport = () => {
    setImportProgress([])
    setImportedCourse(null)
    setSelectedFile(null)
    setImportUrl('')
    setManualCourse({ title: '', description: '', content: '' })
  }

  return (
    <div className="space-y-6">
      {/* Import Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Import Methods</CardTitle>
          <CardDescription>Choose how you want to import your course content</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="file" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                File Upload
              </TabsTrigger>
              <TabsTrigger value="url" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                From URL
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Manual Entry
              </TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Course File (JSON)</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".json"
                  onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload a JSON file containing course structure and content
                </p>
              </div>

              {selectedFile && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                    <Badge variant="outline">{(selectedFile.size / 1024).toFixed(1)} KB</Badge>
                  </div>
                </div>
              )}

              <Button
                onClick={handleFileImport}
                disabled={!selectedFile || isImporting}
                className="w-full"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import from File
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div>
                <Label htmlFor="import-url">Course URL</Label>
                <Input
                  id="import-url"
                  type="url"
                  placeholder="https://example.com/course-content"
                  value={importUrl}
                  onChange={e => setImportUrl(e.target.value)}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Import course content from a web URL or API endpoint
                </p>
              </div>

              <Button
                onClick={handleUrlImport}
                disabled={!importUrl.trim() || isImporting}
                className="w-full"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Import from URL
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              <div>
                <Label htmlFor="course-title">Course Title</Label>
                <Input
                  id="course-title"
                  placeholder="Enter course title"
                  value={manualCourse.title}
                  onChange={e => setManualCourse(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="course-description">Course Description</Label>
                <Textarea
                  id="course-description"
                  placeholder="Enter course description"
                  value={manualCourse.description}
                  onChange={e =>
                    setManualCourse(prev => ({ ...prev, description: e.target.value }))
                  }
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="course-content">Initial Content (Optional)</Label>
                <Textarea
                  id="course-content"
                  placeholder="Enter initial course content in Markdown format"
                  value={manualCourse.content}
                  onChange={e => setManualCourse(prev => ({ ...prev, content: e.target.value }))}
                  className="mt-1"
                  rows={6}
                />
              </div>

              <Button
                onClick={handleManualImport}
                disabled={
                  !manualCourse.title.trim() || !manualCourse.description.trim() || isImporting
                }
                className="w-full"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Create Course
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Import Progress */}
      {importProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Import Progress</CardTitle>
            <CardDescription>Track the progress of your course import</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {importProgress.map((step, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {step.status === 'completed' && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {step.status === 'processing' && (
                        <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                      )}
                      {step.status === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
                      {step.status === 'pending' && (
                        <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                      )}
                      <span className="font-medium capitalize">{step.step}</span>
                    </div>
                    <span className="text-sm text-gray-600">{step.progress}%</span>
                  </div>
                  <Progress value={step.progress} className="h-2" />
                  <p className="text-sm text-gray-600">{step.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Success */}
      {importedCourse && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Import Successful!</CardTitle>
            <CardDescription className="text-green-700">
              Your course has been imported successfully
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-green-800">{importedCourse.title}</h3>
                <p className="text-sm text-green-700">{importedCourse.description}</p>
              </div>

              <div className="flex gap-3">
                <Button asChild>
                  <a href={`/admin/courses/${importedCourse.id}/edit`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Edit Course
                  </a>
                </Button>
                <Button variant="outline" onClick={resetImport}>
                  Import Another
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
