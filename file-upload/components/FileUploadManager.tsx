'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Upload,
  X,
  File,
  Image,
  Video,
  Music,
  FileText,
  Plus,
  Check,
  AlertCircle,
  FolderOpen,
} from 'lucide-react'

interface FileUploadManagerProps {
  userId: string
  buckets: any[]
  courses: any[]
  onUploadComplete?: () => void
}

interface UploadFile {
  id: string
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
  url?: string
  bucket?: string
  course?: string
}

const fileTypeIcons = {
  'image/*': Image,
  'video/*': Video,
  'audio/*': Music,
  'application/pdf': FileText,
  'text/*': FileText,
  default: File,
}

export function FileUploadManager({
  userId,
  buckets,
  courses,
  onUploadComplete,
}: FileUploadManagerProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [selectedBucket, setSelectedBucket] = useState('course-assets')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  // Debug: Log buckets to see what we're working with
  console.log('Available buckets:', buckets)

  const getFileType = (mimeType: string): 'image' | 'video' | 'audio' | 'document' | 'other' => {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text'))
      return 'document'
    return 'other'
  }

  const getFileIcon = (mimeType: string) => {
    for (const [type, Icon] of Object.entries(fileTypeIcons)) {
      if (type === 'default') continue
      if (mimeType.includes(type.replace('/*', ''))) {
        return Icon
      }
    }
    return fileTypeIcons.default
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newFiles: UploadFile[] = Array.from(files).map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
      file,
      progress: 0,
      status: 'pending',
    }))

    setUploadFiles(prev => [...prev, ...newFiles])
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const updateFileProgress = (
    fileId: string,
    progress: number,
    status?: UploadFile['status'],
    error?: string,
    url?: string
  ) => {
    setUploadFiles(prev =>
      prev.map(f =>
        f.id === fileId ? { ...f, progress, status: status || f.status, error, url } : f
      )
    )
  }

  const uploadSingleFile = async (uploadFile: UploadFile) => {
    const { file } = uploadFile
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `course-media/${fileName}`

    try {
      updateFileProgress(uploadFile.id, 0, 'uploading')

      // Upload to Supabase Storage
      // Simulate progress updates since Supabase doesn't support onUploadProgress
      const progressInterval = setInterval(() => {
        const currentProgress = uploadFile.progress + Math.random() * 20
        if (currentProgress < 90) {
          updateFileProgress(uploadFile.id, currentProgress)
        }
      }, 200)

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(selectedBucket)
        .upload(filePath, file)

      clearInterval(progressInterval)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage.from(selectedBucket).getPublicUrl(filePath)

      // Save file metadata to database
      const { data: fileData, error: dbError } = await supabase
        .from('media_files')
        .insert({
          name: fileName,
          original_name: file.name,
          file_type: getFileType(file.type),
          mime_type: file.type,
          file_size: file.size,
          storage_path: filePath,
          public_url: urlData.publicUrl || null,
          uploaded_by: userId || null,
          course_id: selectedCourse || null,
        })
        .select()
        .single()

      if (dbError) {
        console.error('Database error:', dbError)
        // Clean up uploaded file if database insert fails
        await supabase.storage.from(selectedBucket).remove([filePath])
        throw new Error(`Database error: ${dbError.message}`)
      }

      console.log('File uploaded successfully:', fileData)

      updateFileProgress(uploadFile.id, 100, 'completed', undefined, urlData.publicUrl)
      return true
    } catch (error) {
      console.error('Upload error:', error)
      updateFileProgress(
        uploadFile.id,
        0,
        'error',
        error instanceof Error ? error.message : 'Upload failed'
      )
      return false
    }
  }

  const handleUploadAll = async () => {
    if (uploadFiles.length === 0) {
      toast.error('No files to upload')
      return
    }

    if (!selectedBucket) {
      toast.error('Please select a storage bucket')
      return
    }

    setIsUploading(true)
    let successCount = 0
    let errorCount = 0

    try {
      // Upload files sequentially to avoid overwhelming the server
      for (const uploadFile of uploadFiles.filter(f => f.status === 'pending')) {
        const success = await uploadSingleFile(uploadFile)
        if (success) {
          successCount++
        } else {
          errorCount++
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} file(s)`)
        // Trigger refresh of file list
        if (onUploadComplete) {
          onUploadComplete()
        }
      }
      if (errorCount > 0) {
        toast.error(`Failed to upload ${errorCount} file(s)`)
      }
    } catch (error) {
      console.error('Batch upload error:', error)
      toast.error('Failed to upload files')
    } finally {
      setIsUploading(false)
    }
  }

  const clearCompleted = () => {
    setUploadFiles(prev => prev.filter(f => f.status !== 'completed'))
  }

  const clearAll = () => {
    setUploadFiles([])
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const totalSize = uploadFiles.reduce((sum, f) => sum + f.file.size, 0)
  const completedFiles = uploadFiles.filter(f => f.status === 'completed').length
  const errorFiles = uploadFiles.filter(f => f.status === 'error').length
  const pendingFiles = uploadFiles.filter(f => f.status === 'pending').length

  // Test function to verify database connection
  const testDatabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('media_files').select('count')
      console.log('Database test result:', { data, error })
      if (error) {
        toast.error(`Database error: ${error.message}`)
      } else {
        toast.success('Database connection working!')
      }
    } catch (error) {
      console.error('Database test failed:', error)
      toast.error('Database connection failed')
    }
  }

  return (
    <div className="space-y-6">
      {/* Debug Section */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
          <CardDescription>Debug tools and information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Available Buckets:</strong> {buckets?.length || 0}
            </p>
            <p>
              <strong>Available Courses:</strong> {courses?.length || 0}
            </p>
            <p>
              <strong>Selected Bucket:</strong> {selectedBucket}
            </p>
            <Button onClick={testDatabaseConnection} variant="outline" size="sm">
              Test Database Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Configuration</CardTitle>
          <CardDescription>Configure upload settings and destination</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bucket-select">Storage Bucket</Label>
              <select
                id="bucket-select"
                value={selectedBucket}
                onChange={e => setSelectedBucket(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {buckets && buckets.length > 0 ? (
                  buckets.map(bucket => (
                    <option key={bucket.id || bucket.name} value={bucket.name}>
                      {bucket.name} {bucket.public ? '(Public)' : '(Private)'}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="course-assets">course-assets (Public)</option>
                    <option value="avatars">avatars (Public)</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <Label htmlFor="course-select">Assign to Course (Optional)</Label>
              <select
                id="course-select"
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No Course Assignment</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Drop Zone */}
      <Card>
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to upload
            </h3>
            <p className="text-gray-600 mb-4">
              Supports images, videos, audio, and documents up to 50MB each
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Plus className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.md"
              onChange={e => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Upload Queue */}
      {uploadFiles.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upload Queue</CardTitle>
                <CardDescription>
                  {uploadFiles.length} files • {formatBytes(totalSize)} total
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{pendingFiles} pending</Badge>
                <Badge variant="default">{completedFiles} completed</Badge>
                {errorFiles > 0 && <Badge variant="destructive">{errorFiles} errors</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Queue Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button onClick={handleUploadAll} disabled={isUploading || pendingFiles === 0}>
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? 'Uploading...' : `Upload ${pendingFiles} Files`}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={clearCompleted}
                    disabled={completedFiles === 0}
                  >
                    Clear Completed
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    Clear All
                  </Button>
                </div>
              </div>

              {/* File List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {uploadFiles.map(uploadFile => {
                  const Icon = getFileIcon(uploadFile.file.type)

                  return (
                    <div key={uploadFile.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="font-medium">{uploadFile.file.name}</p>
                            <p className="text-sm text-gray-600">
                              {formatBytes(uploadFile.file.size)} • {uploadFile.file.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {uploadFile.status === 'completed' && (
                            <Check className="h-5 w-5 text-green-600" />
                          )}
                          {uploadFile.status === 'error' && (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(uploadFile.id)}
                            disabled={uploadFile.status === 'uploading'}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {uploadFile.status === 'uploading' && (
                        <div className="space-y-1">
                          <Progress value={uploadFile.progress} className="h-2" />
                          <p className="text-xs text-gray-600">
                            {uploadFile.progress.toFixed(1)}% uploaded
                          </p>
                        </div>
                      )}

                      {uploadFile.status === 'error' && uploadFile.error && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                          Error: {uploadFile.error}
                        </div>
                      )}

                      {uploadFile.status === 'completed' && uploadFile.url && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                          <p className="text-sm text-green-700">Upload completed successfully!</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(uploadFile.url, '_blank')}
                            className="mt-1"
                          >
                            <FolderOpen className="h-4 w-4 mr-2" />
                            View File
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
