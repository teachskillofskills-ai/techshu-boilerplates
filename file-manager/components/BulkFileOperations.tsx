'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Trash2,
  Download,
  Move,
  Tag,
  Archive,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'

interface MediaFile {
  id: string
  name: string
  original_name: string
  file_type: string
  mime_type: string
  file_size: number
  storage_path: string
  public_url: string
  course_id?: string
  uploaded_by: string
  created_at: string
  updated_at: string
}

interface StorageBucket {
  id: string
  name: string
  public: boolean
}

interface Course {
  id: string
  title: string
  slug: string
}

interface BulkFileOperationsProps {
  selectedFiles: string[]
  mediaFiles: MediaFile[]
  buckets: StorageBucket[]
  courses?: Course[]
  onSelectionChange: (files: string[]) => void
}

export function BulkFileOperations({
  selectedFiles,
  mediaFiles,
  buckets,
  courses = [],
  onSelectionChange,
}: BulkFileOperationsProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [targetBucket, setTargetBucket] = useState('')
  const [targetCourse, setTargetCourse] = useState('')

  const supabase = createClient()

  const selectedFileObjects = mediaFiles.filter(file => selectedFiles.includes(file.id))
  const totalSize = selectedFileObjects.reduce((sum, file) => sum + (file.file_size || 0), 0)

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) {
      toast.error('No files selected')
      return
    }

    if (
      !confirm(
        `Are you sure you want to delete ${selectedFiles.length} files? This action cannot be undone.`
      )
    ) {
      return
    }

    setIsProcessing(true)
    let successCount = 0
    let errorCount = 0

    try {
      for (const fileId of selectedFiles) {
        const file = mediaFiles.find(f => f.id === fileId)
        if (!file) continue

        try {
          // Delete from storage first
          if (file.storage_path) {
            const bucketName = file.storage_path.split('/')[0] || 'course-assets'
            const filePath = file.storage_path.replace(`${bucketName}/`, '')

            const { error: storageError } = await supabase.storage
              .from(bucketName)
              .remove([filePath])

            if (storageError) {
              console.warn(`Storage deletion warning for ${file.name}:`, storageError.message)
              // Continue with database deletion even if storage fails
            }
          }

          // Delete from database
          const { error: dbError } = await supabase.from('media_files').delete().eq('id', fileId)

          if (dbError) throw dbError
          successCount++
        } catch (error: any) {
          console.error(`Error deleting file ${fileId}:`, error)
          errorCount++
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} files`)
        onSelectionChange([])
        // Refresh the page to show updated file list
        setTimeout(() => window.location.reload(), 1000)
      }
      if (errorCount > 0) {
        toast.error(`Failed to delete ${errorCount} files`)
      }
    } catch (error) {
      console.error('Bulk delete error:', error)
      toast.error('Failed to delete files')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBulkMove = async () => {
    if (selectedFiles.length === 0) {
      toast.error('No files selected')
      return
    }

    if (!targetBucket) {
      toast.error('Please select a target bucket')
      return
    }

    if (
      !confirm(
        `Are you sure you want to move ${selectedFiles.length} files to ${targetBucket}? This will update the storage path in the database.`
      )
    ) {
      return
    }

    setIsProcessing(true)
    let successCount = 0
    let errorCount = 0

    try {
      for (const fileId of selectedFiles) {
        const file = mediaFiles.find(f => f.id === fileId)
        if (!file) continue

        try {
          // Extract current bucket from storage path
          const currentBucket = file.storage_path.split('/')[0]

          if (currentBucket === targetBucket) {
            console.log(`File ${file.name} is already in ${targetBucket}`)
            successCount++
            continue
          }

          // Update database with new storage path
          // Note: This is a logical move - actual file copying would require additional storage operations
          const newStoragePath = file.storage_path.replace(currentBucket, targetBucket)
          const { error } = await supabase
            .from('media_files')
            .update({
              storage_path: newStoragePath,
              public_url: file.public_url?.replace(currentBucket, targetBucket),
              updated_at: new Date().toISOString(),
            })
            .eq('id', fileId)

          if (error) throw error
          successCount++
        } catch (error: any) {
          console.error(`Error moving file ${fileId}:`, error)
          errorCount++
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully updated ${successCount} file locations`)
        onSelectionChange([])
        // Refresh the page to show updated data
        setTimeout(() => window.location.reload(), 1000)
      }
      if (errorCount > 0) {
        toast.error(`Failed to move ${errorCount} files`)
      }
    } catch (error) {
      console.error('Bulk move error:', error)
      toast.error('Failed to move files')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBulkAssignCourse = async () => {
    if (selectedFiles.length === 0) {
      toast.error('No files selected')
      return
    }

    setIsProcessing(true)
    let successCount = 0
    let errorCount = 0

    try {
      for (const fileId of selectedFiles) {
        try {
          const { error } = await supabase
            .from('media_files')
            .update({
              course_id: targetCourse || null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', fileId)

          if (error) throw error
          successCount++
        } catch (error) {
          console.error(`Error updating file ${fileId}:`, error)
          errorCount++
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully updated ${successCount} files`)
        onSelectionChange([])
      }
      if (errorCount > 0) {
        toast.error(`Failed to update ${errorCount} files`)
      }
    } catch (error) {
      console.error('Bulk assign error:', error)
      toast.error('Failed to assign files to course')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBulkDownload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('No files selected')
      return
    }

    toast.info('Preparing download links...')

    try {
      for (const fileId of selectedFiles) {
        const file = mediaFiles.find(f => f.id === fileId)
        if (file?.public_url) {
          // Open each file in a new tab for download
          window.open(file.public_url, '_blank')
        }
      }
      toast.success('Download links opened in new tabs')
    } catch (error) {
      console.error('Bulk download error:', error)
      toast.error('Failed to prepare downloads')
    }
  }

  return (
    <div className="space-y-6">
      {/* Selection Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Operations</CardTitle>
          <CardDescription>Perform operations on multiple files at once</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium text-blue-900">{selectedFiles.length} files selected</p>
              <p className="text-sm text-blue-700">Total size: {formatBytes(totalSize)}</p>
            </div>
            <Badge variant="secondary">{selectedFiles.length} selected</Badge>
          </div>
        </CardContent>
      </Card>

      {selectedFiles.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files selected</h3>
              <p className="text-gray-600">
                Select files from the File Browser to perform bulk operations
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File Management Operations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Move className="h-5 w-5" />
                File Management
              </CardTitle>
              <CardDescription>Move, organize, and manage selected files</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Move Files */}
              <div className="space-y-2">
                <Label htmlFor="target-bucket">Move to Bucket</Label>
                <div className="flex gap-2">
                  <select
                    id="target-bucket"
                    value={targetBucket}
                    onChange={e => setTargetBucket(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Select target bucket"
                  >
                    <option value="">Select bucket...</option>
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
                  <Button onClick={handleBulkMove} disabled={!targetBucket || isProcessing}>
                    <Move className="h-4 w-4 mr-2" />
                    Move
                  </Button>
                </div>
              </div>

              {/* Assign to Course */}
              <div className="space-y-2">
                <Label htmlFor="target-course">Assign to Course</Label>
                <div className="flex gap-2">
                  <select
                    id="target-course"
                    value={targetCourse}
                    onChange={e => setTargetCourse(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Select target course"
                  >
                    <option value="">Unassign from course</option>
                    {courses && courses.length > 0 ? (
                      courses.map(course => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))
                    ) : (
                      <option disabled>No courses available</option>
                    )}
                  </select>
                  <Button onClick={handleBulkAssignCourse} disabled={isProcessing}>
                    <Tag className="h-4 w-4 mr-2" />
                    Assign
                  </Button>
                </div>
              </div>

              {/* Download Files */}
              <Button
                onClick={handleBulkDownload}
                variant="outline"
                className="w-full"
                disabled={isProcessing}
              >
                <Download className="h-4 w-4 mr-2" />
                Download All Selected
              </Button>
            </CardContent>
          </Card>

          {/* Destructive Operations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Destructive Operations
              </CardTitle>
              <CardDescription>Dangerous operations that cannot be undone</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <h4 className="font-medium text-destructive">Delete Files</h4>
                    <p className="text-sm text-destructive/80 mt-1">
                      This will permanently delete {selectedFiles.length} files from both storage
                      and database. This action cannot be undone.
                    </p>
                    <Button
                      onClick={handleBulkDelete}
                      variant="destructive"
                      className="mt-3"
                      disabled={isProcessing}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isProcessing ? 'Deleting...' : `Delete ${selectedFiles.length} Files`}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Files Preview</CardTitle>
            <CardDescription>Files that will be affected by bulk operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {selectedFileObjects.map(file => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{file.original_name}</p>
                    <p className="text-sm text-gray-600">
                      {formatBytes(file.file_size)} • {file.file_type}
                    </p>
                  </div>
                  <Badge variant="outline">{file.file_type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
