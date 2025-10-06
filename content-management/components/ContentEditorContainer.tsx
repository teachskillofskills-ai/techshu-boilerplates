'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContentBrowser } from './ContentBrowser'
import { BulkEditor } from './BulkEditor'
import { ContentTemplates } from './ContentTemplates'
import { ContentAnalytics } from './ContentAnalytics'
import { MediaLibrary } from './MediaLibrary'
import { cn } from '@/lib/utils'
import {
  Search,
  FileText,
  Edit3,
  BarChart3,
  Image,
  Filter,
  BookOpen,
  Clock,
  Eye,
  EyeOff,
  Layout,
} from 'lucide-react'

interface ContentEditorContainerProps {
  courses: any[]
  stats: {
    totalCourses: number
    totalChapters: number
    publishedChapters: number
    draftChapters: number
  }
  userId: string
}

type ContentTab = 'browser' | 'bulk' | 'templates' | 'analytics' | 'media'

const contentTabs = [
  {
    id: 'browser' as ContentTab,
    name: 'Content Browser',
    icon: FileText,
    description: 'Browse and edit individual chapters',
  },
  {
    id: 'bulk' as ContentTab,
    name: 'Bulk Editor',
    icon: Edit3,
    description: 'Edit multiple chapters simultaneously',
  },
  {
    id: 'templates' as ContentTab,
    name: 'Templates',
    icon: Layout,
    description: 'Manage content templates',
  },
  {
    id: 'analytics' as ContentTab,
    name: 'Analytics',
    icon: BarChart3,
    description: 'Content performance insights',
  },
  {
    id: 'media' as ContentTab,
    name: 'Media Library',
    icon: Image,
    description: 'Manage course assets',
  },
]

export function ContentEditorContainer({ courses, stats, userId }: ContentEditorContainerProps) {
  const [activeTab, setActiveTab] = useState<ContentTab>('browser')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Flatten all chapters from all courses
  const allChapters = useMemo(() => {
    return courses.flatMap(
      course =>
        course.chapters?.map((chapter: any) => ({
          ...chapter,
          course_title: course.title,
          course_id: course.id,
          course_slug: course.slug,
        })) || []
    )
  }, [courses])

  // Filter chapters based on search and filters
  const filteredChapters = useMemo(() => {
    return allChapters.filter(chapter => {
      const matchesSearch =
        searchQuery === '' ||
        chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.course_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCourse = selectedCourse === 'all' || chapter.course_id === selectedCourse

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && chapter.is_published) ||
        (statusFilter === 'draft' && !chapter.is_published)

      return matchesSearch && matchesCourse && matchesStatus
    })
  }, [allChapters, searchQuery, selectedCourse, statusFilter])

  const activeTabData = contentTabs.find(tab => tab.id === activeTab)

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Content Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search chapters, courses, or content..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Course Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Courses</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="lg:w-48">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <span>
              Showing {filteredChapters.length} of {allChapters.length} chapters
            </span>
            {searchQuery && <Badge variant="secondary">Search: &quot;{searchQuery}&quot;</Badge>}
            {selectedCourse !== 'all' && (
              <Badge variant="secondary">
                Course: {courses.find(c => c.id === selectedCourse)?.title}
              </Badge>
            )}
            {statusFilter !== 'all' && <Badge variant="secondary">Status: {statusFilter}</Badge>}
          </div>
        </CardContent>
      </Card>

      {/* Content Management Tabs */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3">
                {activeTabData && (
                  <>
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                      <activeTabData.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    {activeTabData.name}
                  </>
                )}
              </CardTitle>
              <CardDescription>{activeTabData?.description}</CardDescription>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <div className="font-semibold text-blue-600">{stats.totalCourses}</div>
                <div className="text-gray-500">Courses</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600">{stats.publishedChapters}</div>
                <div className="text-gray-500">Published</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-orange-600">{stats.draftChapters}</div>
                <div className="text-gray-500">Drafts</div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={value => setActiveTab(value as ContentTab)}>
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              {contentTabs.map(tab => {
                const Icon = tab.icon
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-6 py-4"
                  >
                    <Icon className="h-4 w-4" />
                    {tab.name}
                  </TabsTrigger>
                )
              })}
            </TabsList>

            <div className="p-6">
              <TabsContent value="browser" className="mt-0">
                <ContentBrowser chapters={filteredChapters} courses={courses} userId={userId} />
              </TabsContent>

              <TabsContent value="bulk" className="mt-0">
                <BulkEditor chapters={filteredChapters} courses={courses} userId={userId} />
              </TabsContent>

              <TabsContent value="templates" className="mt-0">
                <ContentTemplates userId={userId} />
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <ContentAnalytics chapters={allChapters} courses={courses} />
              </TabsContent>

              <TabsContent value="media" className="mt-0">
                <MediaLibrary courses={courses} userId={userId} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
