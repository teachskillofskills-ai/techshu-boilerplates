'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string | null
  status: 'draft' | 'review' | 'approved' | 'published' | 'archived'
  development_status: 'coming_soon' | 'in_development' | 'ready' | 'published'
  is_featured: boolean
  created_at: string
  updated_at: string
  instructor: {
    id: string
    full_name: string | null
  }
  enrollments: any[]
  chapters: any[]
}

interface CourseManagementTableProps {
  courses: Course[]
  onStatusChange?: (courseId: string, newStatus: string) => void
  onDevelopmentStatusChange?: (courseId: string, newStatus: string) => void
  onDelete?: (courseId: string) => void
}

export function CourseManagementTable({
  courses,
  onStatusChange,
  onDevelopmentStatusChange,
  onDelete,
}: CourseManagementTableProps) {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-accent/10 text-accent'
      case 'approved':
        return 'bg-primary/10 text-primary'
      case 'review':
        return 'bg-secondary/10 text-secondary'
      case 'draft':
        return 'bg-muted text-muted-foreground'
      case 'archived':
        return 'bg-destructive/10 text-destructive'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getDevelopmentStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
      case 'published':
        return 'bg-accent/10 text-accent'
      case 'in_development':
        return 'bg-primary/10 text-primary'
      case 'coming_soon':
        return 'bg-secondary/10 text-secondary'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getDevelopmentStatusLabel = (status: string) => {
    switch (status) {
      case 'ready':
        return 'Ready'
      case 'published':
        return 'Published'
      case 'in_development':
        return 'In Development'
      case 'coming_soon':
        return 'Coming Soon'
      default:
        return 'Unknown'
    }
  }

  const handleStatusChange = (courseId: string, newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(courseId, newStatus)
    }
  }

  const handleDevelopmentStatusChange = (courseId: string, newStatus: string) => {
    if (onDevelopmentStatusChange) {
      onDevelopmentStatusChange(courseId, newStatus)
    }
  }

  const handleDelete = (courseId: string) => {
    if (onDelete) {
      onDelete(courseId)
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Development</TableHead>
            <TableHead>Enrollments</TableHead>
            <TableHead>Chapters</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map(course => (
            <TableRow key={course.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{course.title}</div>
                  {course.description && (
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {course.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>{course.instructor?.full_name || 'Unknown'}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(course.status)}>{course.status}</Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Badge
                        className={getDevelopmentStatusColor(
                          course.development_status || 'coming_soon'
                        )}
                      >
                        {getDevelopmentStatusLabel(course.development_status || 'coming_soon')}
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => handleDevelopmentStatusChange(course.id, 'coming_soon')}
                    >
                      Coming Soon
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDevelopmentStatusChange(course.id, 'in_development')}
                    >
                      In Development
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDevelopmentStatusChange(course.id, 'ready')}
                    >
                      Ready
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDevelopmentStatusChange(course.id, 'published')}
                    >
                      Published
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>{course.enrollments?.length || 0}</TableCell>
              <TableCell>{course.chapters?.length || 0}</TableCell>
              <TableCell>
                {course.is_featured ? (
                  <Badge variant="secondary">Featured</Badge>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>{new Date(course.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(course.id, 'published')}>
                      Publish
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(course.id, 'archived')}>
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(course.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
