'use client'

import { useState, useEffect } from 'react'
import NextImage from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import {
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  Copy,
  ExternalLink,
  File,
  Image,
  Video,
  Music,
  FileText,
  Folder,
  MoreHorizontal,
  RefreshCw,
} from 'lucide-react'

interface FileBrowserProps {
  userId: string
  userRole: string
  buckets: any[]
  mediaFiles: any[]
  users: any[]
  courses: any[]
  selectedFiles: string[]
  onSelectionChange: (files: string[]) => void
}

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

export function FileBrowser({
  userId,
  userRole,
  buckets,
  mediaFiles: initialMediaFiles,
  users,
  courses,
  selectedFiles,
  onSelectionChange,
}: FileBrowserProps) {
  const [mediaFiles, setMediaFiles] = useState(initialMediaFiles)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBucket, setSelectedBucket] = useState<string>('all')
  const [selectedFileType, setSelectedFileType] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const supabase = createClient()

  useEffect(() => {
    setMediaFiles(initialMediaFiles)
  }, [initialMediaFiles])

  const refreshFiles = async () => {
    setIsLoading(true)
    try {
      console.log('Refreshing files...')
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .order(sortBy, { ascending: sortOrder === 'asc' })

      if (error) {
        console.error('Error fetching files:', error)
        throw error
      }

      console.log('Fetched files:', data)
      setMediaFiles(data || [])
      toast.success('Files refreshed successfully')
    } catch (error: any) {
      console.error('Error refreshing files:', error)
      toast.error(`Failed to refresh files: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch =
      searchQuery === '' ||
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.original_name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesBucket = selectedBucket === 'all' || file.storage_path?.startsWith(selectedBucket)

    const matchesFileType = selectedFileType === 'all' || file.file_type === selectedFileType

    const matchesUser = selectedUser === 'all' || file.uploaded_by === selectedUser

    return matchesSearch && matchesBucket && matchesFileType && matchesUser
  })

  const handleSelectFile = (fileId: string) => {
    const newSelection = selectedFiles.includes(fileId)
      ? selectedFiles.filter(id => id !== fileId)
      : [...selectedFiles, fileId]
    onSelectionChange(newSelection)
  }

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(filteredFiles.map(file => file.id))
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      const file = mediaFiles.find(f => f.id === fileId)
      if (!file) return

      // Delete from storage
      if (file.storage_path) {
        const bucketName = file.storage_path.split('/')[0]
        const { error: storageError } = await supabase.storage
          .from(bucketName)
          .remove([file.storage_path])

        if (storageError) {
          console.error('Storage deletion error:', storageError)
        }
      }

      // Delete from database
      const { error: dbError } = await supabase.from('media_files').delete().eq('id', fileId)

      if (dbError) throw dbError

      toast.success('File deleted successfully!')
      refreshFiles()
    } catch (error) {
      console.error('Error deleting file:', error)
      toast.error('Failed to delete file')
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('File URL copied to clipboard!')
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId)
    return user?.full_name || user?.email || 'Unknown User'
  }

  const getCourseName = (courseId: string) => {
    const course = courses.find(c => c.id === courseId)
    return course?.title || 'Unassigned'
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search files by name..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={selectedBucket}
                onChange={e => setSelectedBucket(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Buckets</option>
                {buckets.map(bucket => (
                  <option key={bucket.id} value={bucket.name}>
                    {bucket.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedFileType}
                onChange={e => setSelectedFileType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
                <option value="document">Documents</option>
                <option value="other">Other</option>
              </select>

              <select
                value={selectedUser}
                onChange={e => setSelectedUser(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Users</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.full_name || user.email}
                  </option>
                ))}
              </select>

              <Button variant="outline" onClick={refreshFiles} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Results Summary and Actions */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Showing {filteredFiles.length} of {mediaFiles.length} files
              </span>
              {selectedFiles.length > 0 && (
                <Badge variant="secondary">{selectedFiles.length} selected</Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedFiles.length === filteredFiles.length ? 'Deselect All' : 'Select All'}
              </Button>

              <div className="flex items-center gap-1 border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map(file => {
            const Icon = fileTypeIcons[file.file_type as keyof typeof fileTypeIcons] || File
            const colorClass =
              fileTypeColors[file.file_type as keyof typeof fileTypeColors] ||
              'text-muted-foreground'
            const isSelected = selectedFiles.includes(file.id)

            return (
              <Card
                key={file.id}
                className={`hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Selection Checkbox */}
                    <div className="flex items-center justify-between">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleSelectFile(file.id)}
                      />
                      <Badge variant="outline" className="text-xs">
                        {file.file_type}
                      </Badge>
                    </div>

                    {/* File Preview */}
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      {file.file_type === 'image' && file.public_url ? (
                        <NextImage
                          src={file.public_url}
                          alt={file.original_name}
                          width={200}
                          height={200}
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
                      <h4 className="font-medium text-gray-900 truncate" title={file.original_name}>
                        {file.original_name}
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{formatBytes(file.file_size)}</p>
                        <p>By: {getUserName(file.uploaded_by)}</p>
                        <p>{formatDistanceToNow(new Date(file.created_at))} ago</p>
                        {file.course_id && <p>Course: {getCourseName(file.course_id)}</p>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyUrl(file.public_url)}
                          title="Copy URL"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(file.public_url, '_blank')}
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
      ) : (
        // List View
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <Checkbox
                        checked={
                          selectedFiles.length === filteredFiles.length && filteredFiles.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Size</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Uploaded By
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Created
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredFiles.map(file => {
                    const Icon = fileTypeIcons[file.file_type as keyof typeof fileTypeIcons] || File
                    const colorClass =
                      fileTypeColors[file.file_type as keyof typeof fileTypeColors] ||
                      'text-muted-foreground'
                    const isSelected = selectedFiles.includes(file.id)

                    return (
                      <tr
                        key={file.id}
                        className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleSelectFile(file.id)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Icon className={`h-5 w-5 ${colorClass}`} />
                            <div>
                              <p className="font-medium text-gray-900">{file.original_name}</p>
                              <p className="text-sm text-gray-600">{file.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{file.file_type}</Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatBytes(file.file_size)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {getUserName(file.uploaded_by)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDistanceToNow(new Date(file.created_at))} ago
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyUrl(file.public_url)}
                              title="Copy URL"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(file.public_url, '_blank')}
                              title="Open file"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFile(file.id)}
                              title="Delete file"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredFiles.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
              <p className="text-gray-600">
                {searchQuery ||
                selectedBucket !== 'all' ||
                selectedFileType !== 'all' ||
                selectedUser !== 'all'
                  ? 'No files match your current filters.'
                  : 'No files have been uploaded yet.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
