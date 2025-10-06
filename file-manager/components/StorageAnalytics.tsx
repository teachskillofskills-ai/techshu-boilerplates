'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BarChart3,
  TrendingUp,
  HardDrive,
  Files,
  Users,
  Calendar,
  PieChart,
  Database,
  Upload,
  Download,
} from 'lucide-react'

interface StorageAnalyticsProps {
  buckets: any[]
  mediaFiles: any[]
  users: any[]
  courses: any[]
}

export function StorageAnalytics({ buckets, mediaFiles, users, courses }: StorageAnalyticsProps) {
  const analytics = useMemo(() => {
    const totalFiles = mediaFiles.length
    const totalSize = mediaFiles.reduce((sum, file) => sum + (file.file_size || 0), 0)

    // File type distribution
    const fileTypeStats = mediaFiles.reduce(
      (stats, file) => {
        stats[file.file_type] = (stats[file.file_type] || 0) + 1
        return stats
      },
      {} as Record<string, number>
    )

    // Size distribution by file type
    const sizeByType = mediaFiles.reduce(
      (stats, file) => {
        stats[file.file_type] = (stats[file.file_type] || 0) + (file.file_size || 0)
        return stats
      },
      {} as Record<string, number>
    )

    // User upload statistics
    const userStats = users
      .map(user => {
        const userFiles = mediaFiles.filter(file => file.uploaded_by === user.id)
        const userSize = userFiles.reduce((sum, file) => sum + (file.file_size || 0), 0)
        return {
          id: user.id,
          name: user.full_name || user.email,
          fileCount: userFiles.length,
          totalSize: userSize,
          percentage: totalFiles > 0 ? (userFiles.length / totalFiles) * 100 : 0,
        }
      })
      .sort((a, b) => b.fileCount - a.fileCount)
      .slice(0, 10)

    // Course file distribution
    const courseStats = courses
      .map(course => {
        const courseFiles = mediaFiles.filter(file => file.course_id === course.id)
        const courseSize = courseFiles.reduce((sum, file) => sum + (file.file_size || 0), 0)
        return {
          id: course.id,
          title: course.title,
          fileCount: courseFiles.length,
          totalSize: courseSize,
        }
      })
      .sort((a, b) => b.fileCount - a.fileCount)

    // Unassigned files
    const unassignedFiles = mediaFiles.filter(file => !file.course_id)
    const unassignedSize = unassignedFiles.reduce((sum, file) => sum + (file.file_size || 0), 0)

    // Upload trends (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentUploads = mediaFiles.filter(file => new Date(file.created_at) > thirtyDaysAgo)

    // Daily upload stats for the last 7 days
    const dailyStats = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))

      const dayUploads = mediaFiles.filter(file => {
        const fileDate = new Date(file.created_at)
        return fileDate >= dayStart && fileDate <= dayEnd
      })

      dailyStats.push({
        date: dayStart.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        uploads: dayUploads.length,
        size: dayUploads.reduce((sum, file) => sum + (file.file_size || 0), 0),
      })
    }

    // Storage efficiency metrics
    const avgFileSize = totalFiles > 0 ? totalSize / totalFiles : 0
    const largestFile = mediaFiles.reduce(
      (largest, file) => ((file.file_size || 0) > (largest?.file_size || 0) ? file : largest),
      null
    )
    const smallestFile = mediaFiles.reduce(
      (smallest, file) =>
        (file.file_size || 0) < (smallest?.file_size || Infinity) ? file : smallest,
      null
    )

    return {
      totalFiles,
      totalSize,
      fileTypeStats,
      sizeByType,
      userStats,
      courseStats,
      unassignedFiles: unassignedFiles.length,
      unassignedSize,
      recentUploads: recentUploads.length,
      dailyStats,
      avgFileSize,
      largestFile,
      smallestFile,
    }
  }, [mediaFiles, users, courses])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getFileTypeColor = (type: string) => {
    const colors = {
      image: 'bg-accent',
      video: 'bg-primary',
      audio: 'bg-secondary',
      document: 'bg-destructive',
      other: 'bg-muted-foreground',
    }
    return colors[type as keyof typeof colors] || 'bg-muted-foreground'
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Storage Used</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatBytes(analytics.totalSize)}
                </p>
                <p className="text-xs text-gray-500">Across {buckets.length} buckets</p>
              </div>
              <HardDrive className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average File Size</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatBytes(analytics.avgFileSize)}
                </p>
                <p className="text-xs text-gray-500">Per file average</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recent Uploads</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.recentUploads}</p>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </div>
              <Upload className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unassigned Files</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.unassignedFiles}</p>
                <p className="text-xs text-gray-500">{formatBytes(analytics.unassignedSize)}</p>
              </div>
              <Files className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              File Type Distribution
            </CardTitle>
            <CardDescription>Breakdown of files by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.fileTypeStats).map(([type, count]) => {
                const countNum = typeof count === 'number' ? count : 0
                const percentage =
                  analytics.totalFiles > 0 ? (countNum / analytics.totalFiles) * 100 : 0
                const size = analytics.sizeByType[type] || 0

                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getFileTypeColor(type)}`}></div>
                        <span className="font-medium capitalize">{type}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">{countNum} files</span>
                        <p className="text-sm text-muted-foreground">{formatBytes(size)}</p>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground/80">
                      {percentage.toFixed(1)}% of total files
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Upload Activity (Last 7 Days)
            </CardTitle>
            <CardDescription>Daily upload statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.dailyStats.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{day.date}</span>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold">{day.uploads} files</p>
                      <p className="text-xs text-gray-600">{formatBytes(day.size)}</p>
                    </div>
                    <div className="w-20">
                      <Progress
                        value={
                          analytics.dailyStats.length > 0
                            ? (day.uploads /
                                Math.max(...analytics.dailyStats.map(d => d.uploads))) *
                              100
                            : 0
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Users and Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Uploaders
            </CardTitle>
            <CardDescription>Users with the most uploaded files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.userStats.slice(0, 8).map((user, index) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.fileCount} files</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatBytes(user.totalSize)}</p>
                    <p className="text-xs text-gray-500">{user.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Storage by Course
            </CardTitle>
            <CardDescription>File distribution across courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Unassigned files first */}
              {analytics.unassignedFiles > 0 && (
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-orange-900">Unassigned Files</p>
                    <p className="text-sm text-orange-700">{analytics.unassignedFiles} files</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-900">
                      {formatBytes(analytics.unassignedSize)}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      Needs Assignment
                    </Badge>
                  </div>
                </div>
              )}

              {/* Course files */}
              {analytics.courseStats.slice(0, 6).map(course => (
                <div key={course.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-gray-600">{course.fileCount} files</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatBytes(course.totalSize)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Storage Insights
          </CardTitle>
          <CardDescription>Key metrics and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <HardDrive className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-900">Largest File</h4>
              {analytics.largestFile ? (
                <div>
                  <p className="text-sm text-blue-700">{analytics.largestFile.original_name}</p>
                  <p className="font-bold text-blue-900">
                    {formatBytes(analytics.largestFile.file_size)}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-blue-700">No files</p>
              )}
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Files className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-900">Most Common Type</h4>
              {Object.keys(analytics.fileTypeStats).length > 0 ? (
                <div>
                  {(() => {
                    const sortedStats = Object.entries(analytics.fileTypeStats).sort(
                      ([, a], [, b]) =>
                        (typeof b === 'number' ? b : 0) - (typeof a === 'number' ? a : 0)
                    )
                    const topType = sortedStats[0]?.[0] || 'none'
                    const topCount = typeof sortedStats[0]?.[1] === 'number' ? sortedStats[0][1] : 0
                    return (
                      <>
                        <p className="text-sm text-green-700 capitalize">{topType}</p>
                        <p className="font-bold text-green-900">{topCount} files</p>
                      </>
                    )
                  })()}
                </div>
              ) : (
                <p className="text-sm text-green-700">No files</p>
              )}
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-900">Upload Rate</h4>
              <p className="text-sm text-purple-700">Last 7 days</p>
              <p className="font-bold text-purple-900">
                {analytics.dailyStats.reduce((sum, day) => sum + day.uploads, 0)} files
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold text-gray-900">Recommendations</h4>
            <div className="space-y-2">
              {analytics.unassignedFiles > 0 && (
                <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <Files className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-900">Unassigned Files</p>
                    <p className="text-sm text-orange-700">
                      You have {analytics.unassignedFiles} files not assigned to any course.
                      Consider organizing them.
                    </p>
                  </div>
                </div>
              )}

              {analytics.avgFileSize > 10 * 1024 * 1024 && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <HardDrive className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Large Average File Size</p>
                    <p className="text-sm text-blue-700">
                      Your average file size is {formatBytes(analytics.avgFileSize)}. Consider
                      optimizing large files.
                    </p>
                  </div>
                </div>
              )}

              {analytics.recentUploads === 0 && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <Upload className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Low Upload Activity</p>
                    <p className="text-sm text-gray-700">
                      No files uploaded in the last 30 days. Consider adding fresh content.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
