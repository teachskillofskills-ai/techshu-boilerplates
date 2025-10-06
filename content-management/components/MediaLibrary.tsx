'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Image,
  Upload,
  File,
  Video,
  Music,
  FileText,
  Download,
  Trash2,
  Search,
  Filter,
  FolderOpen,
  Plus,
  Copy,
  ExternalLink,
} from 'lucide-react'

interface MediaLibraryProps {
  courses: any[]
  userId: string
}

interface MediaFile {
  id: string
  name: string
  original_name: string
  file_type: 'image' | 'video' | 'audio' | 'document' | 'other'
  mime_type: string
  file_size: number
  storage_path: string
  public_url: string | null
  course_id: string | null
  uploaded_by: string | null
  created_at: string
  updated_at: string
}

// Mock data for demonstration
const mockMediaFiles: MediaFile[] = [
  {
    id: '1',
    name: 'course-intro-banner.jpg',
    original_name: 'course-intro-banner.jpg',
    file_type: 'image',
    file_size: 245760,
    storage_path: 'media/course-intro-banner.jpg',
    public_url: '/placeholder-image.jpg',
    course_id: 'course-1',
    uploaded_by: 'user-1',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    mime_type: 'image/jpeg',
  },
  {
    id: '2',
    name: 'lesson-1-demo.mp4',
    original_name: 'lesson-1-demo.mp4',
    file_type: 'video',
    file_size: 15728640,
    storage_path: 'media/lesson-1-demo.mp4',
    public_url: '/placeholder-video.mp4',
    course_id: 'course-1',
    uploaded_by: 'user-1',
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-14T14:20:00Z',
    mime_type: 'video/mp4',
  },
  {
    id: '3',
    name: 'background-music.mp3',
    original_name: 'background-music.mp3',
    file_type: 'audio',
    file_size: 5242880,
    storage_path: 'media/background-music.mp3',
    public_url: '/placeholder-audio.mp3',
    course_id: null,
    uploaded_by: 'user-1',
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
    mime_type: 'audio/mpeg',
  },
  {
    id: '4',
    name: 'course-syllabus.pdf',
    original_name: 'course-syllabus.pdf',
    file_type: 'document',
    file_size: 1048576,
    storage_path: 'media/course-syllabus.pdf',
    public_url: '/placeholder-document.pdf',
    course_id: 'course-2',
    uploaded_by: 'user-1',
    created_at: '2024-01-12T16:45:00Z',
    updated_at: '2024-01-12T16:45:00Z',
    mime_type: 'application/pdf',
  },
]

const fileTypeIcons = {
  image: Image,
  video: Video,
  audio: Music,
  document: FileText,
  other: File,
}

const fileTypeColors = {
  image: 'text-accent',
  video: 'text-primary',
  audio: 'text-secondary',
  document: 'text-destructive',
  other: 'text-muted-foreground',
}

export function MediaLibrary({ courses, userId }: MediaLibraryProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedCourse, setSelectedCourse] = useState<string>('all')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  useEffect(() => {
    loadMediaFiles()
  }, [])

  const loadMediaFiles = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setMediaFiles(data || [])
    } catch (error) {
      console.error('Error loading media files:', error)
      toast.error('Failed to load media files')
      // Fallback to mock data if database fails
      setMediaFiles(mockMediaFiles)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch =
      searchQuery === '' || file.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = selectedType === 'all' || file.file_type === selectedType

    const matchesCourse =
      selectedCourse === 'all' ||
      (selectedCourse === 'unassigned' && !file.course_id) ||
      file.course_id === selectedCourse

    return matchesSearch && matchesType && matchesCourse
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getFileType = (mimeType: string): MediaFile['file_type'] => {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text'))
      return 'document'
    return 'other'
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const uploadedFiles = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `course-media/${fileName}`

        // Update progress
        setUploadProgress(Math.round(((i + 0.5) / files.length) * 100))

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('course-assets')
          .upload(filePath, file)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          continue // Skip this file and continue with others
        }

        // Get public URL
        const { data: urlData } = supabase.storage.from('course-assets').getPublicUrl(filePath)

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
            public_url: urlData.publicUrl,
            uploaded_by: userId,
          })
          .select()
          .single()

        if (dbError) {
          console.error('Database error:', dbError)
          // Clean up uploaded file if database insert fails
          await supabase.storage.from('course-assets').remove([filePath])
          continue
        }

        uploadedFiles.push(fileData)
        setUploadProgress(Math.round(((i + 1) / files.length) * 100))
      }

      if (uploadedFiles.length > 0) {
        toast.success(`Uploaded ${uploadedFiles.length} file(s) successfully!`)
        loadMediaFiles() // Reload files from database
      } else {
        toast.error('No files were uploaded successfully.')
      }
    } catch (error) {
      console.error('Error uploading files:', error)
      toast.error('Failed to upload files. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      // Get file info first
      const file = mediaFiles.find(f => f.id === fileId)
      if (!file) {
        toast.error('File not found')
        return
      }

      // Delete from storage if it's a real uploaded file
      if (file.storage_path && !file.id.startsWith('mock-')) {
        const { error: storageError } = await supabase.storage
          .from('course-assets')
          .remove([file.storage_path])

        if (storageError) {
          console.error('Storage deletion error:', storageError)
        }
      }

      // Delete from database
      const { error: dbError } = await supabase.from('media_files').delete().eq('id', fileId)

      if (dbError) throw dbError

      toast.success('File deleted successfully!')
      loadMediaFiles() // Reload files from database
    } catch (error) {
      console.error('Error deleting file:', error)
      toast.error('Failed to delete file. Please try again.')
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('File URL copied to clipboard!')
  }

  const totalSize = mediaFiles.reduce((sum, file) => sum + file.file_size, 0)
  const typeStats = mediaFiles.reduce(
    (stats, file) => {
      stats[file.file_type] = (stats[file.file_type] || 0) + 1
      return stats
    },
    {} as Record<string, number>
  )

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Media Files
          </CardTitle>
          <CardDescription>
            Upload images, videos, audio files, and documents for your courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Supports images, videos, audio, and documents up to 50MB each
              </p>
              <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                <Plus className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Library Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Files</p>
                <p className="text-2xl font-bold text-gray-900">{mediaFiles.length}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Size</p>
                <p className="text-2xl font-bold text-gray-900">{formatFileSize(totalSize)}</p>
              </div>
              <File className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Images</p>
                <p className="text-2xl font-bold text-green-600">{typeStats.image || 0}</p>
              </div>
              <Image className="h-8 w-8 text-green-600" aria-label="Images icon" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Videos</p>
                <p className="text-2xl font-bold text-blue-600">{typeStats.video || 0}</p>
              </div>
              <Video className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="lg:w-48">
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
                <option value="document">Documents</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="lg:w-64">
              <select
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Courses</option>
                <option value="unassigned">Unassigned</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <span>
              Showing {filteredFiles.length} of {mediaFiles.length} files
            </span>
            {searchQuery && <Badge variant="secondary">Search: &quot;{searchQuery}&quot;</Badge>}
            {selectedType !== 'all' && <Badge variant="secondary">Type: {selectedType}</Badge>}
            {selectedCourse !== 'all' && (
              <Badge variant="secondary">
                Course:{' '}
                {selectedCourse === 'unassigned'
                  ? 'Unassigned'
                  : courses.find(c => c.id === selectedCourse)?.title}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredFiles.map(file => {
          const Icon = fileTypeIcons[file.file_type]
          const colorClass = fileTypeColors[file.file_type]

          return (
            <Card key={file.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* File Preview */}
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    {file.file_type === 'image' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={file.public_url || ''}
                        alt={file.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={e => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                    ) : null}
                    <Icon
                      className={`h-12 w-12 ${colorClass} ${file.file_type === 'image' ? 'hidden' : ''}`}
                    />
                  </div>

                  {/* File Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 truncate" title={file.name}>
                      {file.name}
                    </h4>
                    <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {file.file_type}
                      </Badge>
                      <span>{formatFileSize(file.file_size)}</span>
                    </div>
                    {file.course_id && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {courses.find(c => c.id === file.course_id)?.title || 'Unknown Course'}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyUrl(file.public_url || '')}
                        title="Copy URL"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(file.public_url || '', '_blank')}
                        title="Open file"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFile(file.id)}
                      title="Delete file"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredFiles.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || selectedType !== 'all' || selectedCourse !== 'all'
                  ? 'No files match your current filters.'
                  : 'Upload your first media file to get started.'}
              </p>
              {!searchQuery && selectedType === 'all' && selectedCourse === 'all' && (
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
