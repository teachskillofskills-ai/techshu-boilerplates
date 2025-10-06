'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Trash2,
  Search,
  AlertTriangle,
  FileX,
  Calendar,
  HardDrive,
  RefreshCw,
  CheckCircle,
  XCircle,
} from 'lucide-react'

interface MediaFile {
  id: string
  name: string
  original_name: string
  file_type: string
  mime_type: string
  file_size: number
  storage_path: string
  public_url?: string
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
  status: string
}

interface StorageCleanupProps {
  buckets: StorageBucket[]
  mediaFiles: MediaFile[]
  courses: Course[]
  userId: string
}

interface CleanupItem {
  id: string
  type: 'orphaned' | 'unused' | 'large' | 'old' | 'duplicate'
  file: MediaFile
  reason: string
  size: number
  risk: 'low' | 'medium' | 'high'
}

export function StorageCleanup({ buckets, mediaFiles, courses, userId }: StorageCleanupProps) {
  const [cleanupItems, setCleanupItems] = useState<CleanupItem[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const supabase = createClient()

  // Helper functions
  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    )
  }

  const handleSelectAll = (type?: string) => {
    if (type) {
      const typeItems = cleanupItems.filter(item => item.type === type).map(item => item.id)
      setSelectedItems(prev => [...new Set([...prev, ...typeItems])])
    } else {
      setSelectedItems(cleanupItems.map(item => item.id))
    }
  }

  const handleDeselectAll = () => {
    setSelectedItems([])
  }

  const scanForCleanupItems = async () => {
    setIsScanning(true)
    const items: CleanupItem[] = []

    try {
      // Find orphaned files (files without course assignment)
      const orphanedFiles = mediaFiles.filter(file => !file.course_id)
      orphanedFiles.forEach(file => {
        items.push({
          id: `orphaned-${file.id}`,
          type: 'orphaned',
          file,
          reason: 'File not assigned to any course',
          size: file.file_size || 0,
          risk: 'low',
        })
      })

      // Find old files (older than 6 months)
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      const oldFiles = mediaFiles.filter(file => new Date(file.created_at) < sixMonthsAgo)
      oldFiles.forEach(file => {
        items.push({
          id: `old-${file.id}`,
          type: 'old',
          file,
          reason: `File older than 6 months (${new Date(file.created_at).toLocaleDateString()})`,
          size: file.file_size || 0,
          risk: 'low',
        })
      })

      // Find large files (>10MB)
      const largeFiles = mediaFiles.filter(file => (file.file_size || 0) > 10 * 1024 * 1024)
      largeFiles.forEach(file => {
        items.push({
          id: `large-${file.id}`,
          type: 'large',
          file,
          reason: `Large file (${formatBytes(file.file_size)})`,
          size: file.file_size || 0,
          risk: 'medium',
        })
      })

      // Find potential duplicates (same name and size)
      const duplicateGroups = mediaFiles.reduce(
        (groups, file) => {
          const key = `${file.original_name}-${file.file_size}`
          if (!groups[key]) groups[key] = []
          groups[key].push(file)
          return groups
        },
        {} as Record<string, any[]>
      )

      Object.values(duplicateGroups).forEach((group: any) => {
        if (Array.isArray(group) && group.length > 1) {
          // Mark all but the newest as duplicates
          const sorted = group.sort(
            (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          sorted.slice(1).forEach(file => {
            items.push({
              id: `duplicate-${file.id}`,
              type: 'duplicate',
              file,
              reason: `Potential duplicate of ${sorted[0].original_name}`,
              size: file.file_size || 0,
              risk: 'medium',
            })
          })
        }
      })

      // Find files from deleted courses
      const activeCourseIds = courses.map(c => c.id)
      const filesFromDeletedCourses = mediaFiles.filter(
        file => file.course_id && !activeCourseIds.includes(file.course_id)
      )
      filesFromDeletedCourses.forEach(file => {
        items.push({
          id: `unused-${file.id}`,
          type: 'unused',
          file,
          reason: 'File belongs to deleted or inactive course',
          size: file.file_size || 0,
          risk: 'high',
        })
      })

      setCleanupItems(items)
    } catch (error) {
      console.error('Error scanning for cleanup items:', error)
      toast.error('Failed to scan for cleanup items')
    } finally {
      setIsScanning(false)
    }
  }

  useEffect(() => {
    scanForCleanupItems()
  }, [mediaFiles, courses])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-accent bg-accent/10 border-accent/20'
      case 'medium':
        return 'text-secondary bg-secondary/10 border-secondary/20'
      case 'high':
        return 'text-destructive bg-destructive/10 border-destructive/20'
      default:
        return 'text-muted-foreground bg-muted border'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'orphaned':
        return FileX
      case 'unused':
        return XCircle
      case 'large':
        return HardDrive
      case 'old':
        return Calendar
      case 'duplicate':
        return Trash2
      default:
        return AlertTriangle
    }
  }

  const handleCleanupSelected = async () => {
    if (selectedItems.length === 0) {
      toast.error('No items selected for cleanup')
      return
    }

    if (
      !confirm(
        `Are you sure you want to delete ${selectedItems.length} files? This action cannot be undone.`
      )
    ) {
      return
    }

    setIsProcessing(true)
    let successCount = 0
    let errorCount = 0

    try {
      for (const itemId of selectedItems) {
        const item = cleanupItems.find(i => i.id === itemId)
        if (!item) continue

        try {
          // Delete from storage first
          if (item.file.storage_path) {
            const bucketName = item.file.storage_path.split('/')[0] || 'course-assets'
            const filePath = item.file.storage_path.replace(`${bucketName}/`, '')

            const { error: storageError } = await supabase.storage
              .from(bucketName)
              .remove([filePath])

            if (storageError) {
              console.warn(`Storage deletion warning for ${item.file.name}:`, storageError.message)
              // Continue with database deletion even if storage fails
            }
          }

          // Delete from database
          const { error: dbError } = await supabase
            .from('media_files')
            .delete()
            .eq('id', item.file.id)

          if (dbError) throw dbError
          successCount++
        } catch (error: any) {
          console.error(`Error deleting file ${item.file.id}:`, error)
          errorCount++
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully cleaned up ${successCount} files`)
        setSelectedItems([])
        // Refresh the scan and page to show updated data
        await scanForCleanupItems()
        setTimeout(() => window.location.reload(), 1000)
      }
      if (errorCount > 0) {
        toast.error(`Failed to clean up ${errorCount} files`)
      }
    } catch (error) {
      console.error('Cleanup error:', error)
      toast.error('Failed to clean up files')
    } finally {
      setIsProcessing(false)
    }
  }

  const totalSize = cleanupItems.reduce((sum, item) => sum + item.size, 0)
  const selectedSize = cleanupItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.size, 0)

  const typeStats = cleanupItems.reduce(
    (stats, item) => {
      stats[item.type] = (stats[item.type] || 0) + 1
      return stats
    },
    {} as Record<string, number>
  )

  return (
    <div className="space-y-6">
      {/* Cleanup Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Items Found</p>
                <p className="text-2xl font-bold text-secondary">{cleanupItems.length}</p>
              </div>
              <Search className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Potential Savings</p>
                <p className="text-2xl font-bold text-accent">{formatBytes(totalSize)}</p>
              </div>
              <HardDrive className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Selected</p>
                <p className="text-2xl font-bold text-primary">{selectedItems.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selected Size</p>
                <p className="text-2xl font-bold text-purple-600">{formatBytes(selectedSize)}</p>
              </div>
              <Trash2 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cleanup Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Storage Cleanup
          </CardTitle>
          <CardDescription>
            Identify and remove unnecessary files to free up storage space
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button onClick={scanForCleanupItems} disabled={isScanning} variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
                {isScanning ? 'Scanning...' : 'Refresh Scan'}
              </Button>
              <Button onClick={() => handleSelectAll()} variant="outline">
                Select All
              </Button>
              <Button onClick={handleDeselectAll} variant="outline">
                Deselect All
              </Button>
            </div>
            <Button
              onClick={handleCleanupSelected}
              disabled={selectedItems.length === 0 || isProcessing}
              variant="destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isProcessing ? 'Cleaning...' : `Clean Up ${selectedItems.length} Items`}
            </Button>
          </div>

          {/* Type Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
            {Object.entries(typeStats).map(([type, count]) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => handleSelectAll(type)}
                className="justify-between"
              >
                <span className="capitalize">{type}</span>
                <Badge variant="secondary">{count}</Badge>
              </Button>
            ))}
          </div>

          {/* Cleanup Items */}
          {cleanupItems.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Storage is Clean!</h3>
              <p className="text-muted-foreground">
                No cleanup items found. Your storage is well organized.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {cleanupItems.map(item => {
                const Icon = getTypeIcon(item.type)
                const isSelected = selectedItems.includes(item.id)

                return (
                  <div
                    key={item.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleSelectItem(item.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectItem(item.id)}
                          className="rounded"
                          aria-label={`Select ${item.file.original_name} for cleanup`}
                        />
                        <Icon className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium">{item.file.original_name}</p>
                          <p className="text-sm text-gray-600">{item.reason}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {item.type}
                        </Badge>
                        <Badge className={getRiskColor(item.risk)}>{item.risk} risk</Badge>
                        <span className="text-sm font-medium">{formatBytes(item.size)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cleanup Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Cleanup Recommendations
          </CardTitle>
          <CardDescription>Best practices for maintaining clean storage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-primary">Regular Cleanup</p>
                <p className="text-sm text-primary/80">
                  Schedule monthly cleanup scans to maintain optimal storage usage
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <FileX className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium text-accent">File Organization</p>
                <p className="text-sm text-accent/80">
                  Assign files to courses immediately after upload to avoid orphaned files
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
              <HardDrive className="h-5 w-5 text-secondary mt-0.5" />
              <div>
                <p className="font-medium text-secondary">File Size Management</p>
                <p className="text-sm text-secondary/80">
                  Compress large files before upload and consider using optimized formats
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
