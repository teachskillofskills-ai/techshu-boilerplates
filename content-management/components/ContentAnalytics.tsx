'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BarChart3,
  TrendingUp,
  Clock,
  Eye,
  EyeOff,
  FileText,
  BookOpen,
  Users,
  Calendar,
  Target,
} from 'lucide-react'

interface ContentAnalyticsProps {
  chapters: any[]
  courses: any[]
}

export function ContentAnalytics({ chapters, courses }: ContentAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  const loadAnalyticsData = useCallback(async () => {
    setIsLoading(true)
    try {
      // Get content analytics from database
      const { data: contentAnalytics, error } = await supabase
        .from('content_analytics')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading analytics:', error)
      }

      // Calculate analytics with real data
      setAnalyticsData(contentAnalytics || [])
    } catch (error) {
      console.error('Error loading analytics data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [chapters, supabase])

  useEffect(() => {
    loadAnalyticsData()
  }, [loadAnalyticsData])

  const analytics = useMemo(() => {
    const totalChapters = chapters.length
    const publishedChapters = chapters.filter(c => c.is_published).length
    const draftChapters = totalChapters - publishedChapters
    const publishRate = totalChapters > 0 ? (publishedChapters / totalChapters) * 100 : 0

    // Content length analysis
    const chaptersWithContent = chapters.filter(c => c.content_md && c.content_md.length > 0)
    const avgContentLength =
      chaptersWithContent.length > 0
        ? chaptersWithContent.reduce((sum, c) => sum + (c.content_md?.length || 0), 0) /
          chaptersWithContent.length
        : 0

    // Duration analysis
    const totalDuration = chapters.reduce((sum, c) => sum + (c.estimated_duration || 0), 0)
    const avgDuration = totalChapters > 0 ? totalDuration / totalChapters : 0

    // Course distribution
    const courseStats = courses
      .map(course => {
        const courseChapters = chapters.filter(c => c.course_id === course.id)
        const publishedCount = courseChapters.filter(c => c.is_published).length
        return {
          id: course.id,
          title: course.title,
          totalChapters: courseChapters.length,
          publishedChapters: publishedCount,
          draftChapters: courseChapters.length - publishedCount,
          totalDuration: courseChapters.reduce((sum, c) => sum + (c.estimated_duration || 0), 0),
          publishRate:
            courseChapters.length > 0 ? (publishedCount / courseChapters.length) * 100 : 0,
        }
      })
      .sort((a, b) => b.totalChapters - a.totalChapters)

    // Content quality metrics
    const chaptersWithDescription = chapters.filter(
      c => c.description && c.description.length > 10
    ).length
    const qualityScore =
      totalChapters > 0
        ? ((chaptersWithContent.length + chaptersWithDescription) / (totalChapters * 2)) * 100
        : 0

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentlyUpdated = chapters.filter(c => new Date(c.updated_at) > thirtyDaysAgo).length

    return {
      totalChapters,
      publishedChapters,
      draftChapters,
      publishRate,
      avgContentLength,
      totalDuration,
      avgDuration,
      courseStats,
      qualityScore,
      recentlyUpdated,
    }
  }, [chapters, courses])

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Chapters</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalChapters}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600">{analytics.publishedChapters}</p>
                <p className="text-xs text-gray-500">
                  {analytics.publishRate.toFixed(1)}% of total
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.draftChapters}</p>
                <p className="text-xs text-gray-500">
                  {(100 - analytics.publishRate).toFixed(1)}% of total
                </p>
              </div>
              <EyeOff className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Duration</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatDuration(analytics.totalDuration)}
                </p>
                <p className="text-xs text-gray-500">
                  Avg: {formatDuration(Math.round(analytics.avgDuration))}
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Quality Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Content Quality Score
            </CardTitle>
            <CardDescription>Based on content completeness and descriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Quality</span>
                  <span className="text-sm text-gray-600">
                    {analytics.qualityScore.toFixed(1)}%
                  </span>
                </div>
                <Progress value={analytics.qualityScore} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">With Content</p>
                  <p className="font-semibold">
                    {chapters.filter(c => c.content_md).length} / {analytics.totalChapters}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">With Descriptions</p>
                  <p className="font-semibold">
                    {chapters.filter(c => c.description).length} / {analytics.totalChapters}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Content updates in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Recently Updated</span>
                <Badge variant="secondary">{analytics.recentlyUpdated} chapters</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Avg Content Length</span>
                  <span>{formatBytes(analytics.avgContentLength)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Publish Rate</span>
                  <span>{analytics.publishRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Course Content Breakdown
          </CardTitle>
          <CardDescription>Content statistics by course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.courseStats.map(course => (
              <div key={course.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{course.title}</h4>
                  <Badge variant="outline">{course.totalChapters} chapters</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Published</p>
                    <p className="font-semibold text-green-600">{course.publishedChapters}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Drafts</p>
                    <p className="font-semibold text-orange-600">{course.draftChapters}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-semibold">{formatDuration(course.totalDuration)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Publish Rate</p>
                    <p className="font-semibold">{course.publishRate.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Completion</span>
                    <span className="text-xs text-gray-600">{course.publishRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={course.publishRate} className="h-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Content Insights
          </CardTitle>
          <CardDescription>Recommendations for improving your content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.draftChapters > 0 && (
              <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <EyeOff className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-900">Unpublished Content</p>
                  <p className="text-sm text-orange-700">
                    You have {analytics.draftChapters} chapters in draft. Consider reviewing and
                    publishing them.
                  </p>
                </div>
              </div>
            )}

            {analytics.qualityScore < 80 && (
              <div className="flex items-start gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <Target className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-primary">Content Quality</p>
                  <p className="text-sm text-primary/80">
                    Consider adding descriptions and content to improve your quality score.
                  </p>
                </div>
              </div>
            )}

            {analytics.recentlyUpdated === 0 && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Content Freshness</p>
                  <p className="text-sm text-gray-700">
                    No content has been updated recently. Consider reviewing and updating older
                    chapters.
                  </p>
                </div>
              </div>
            )}

            {analytics.publishRate === 100 && analytics.qualityScore >= 80 && (
              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Excellent Content!</p>
                  <p className="text-sm text-green-700">
                    Your content is well-organized with high quality and publish rates. Keep up the
                    great work!
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
