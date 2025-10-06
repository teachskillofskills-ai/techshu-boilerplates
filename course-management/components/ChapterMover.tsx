'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ArrowRight, BookOpen, FolderOpen, Move } from 'lucide-react'

interface Chapter {
  id: string
  title: string
  description?: string
  module_id?: string
  order_index: number
  is_published: boolean
}

interface Module {
  id: string
  title: string
  description: string | null
}

interface ChapterMoverProps {
  chapters: Chapter[]
  modules: Module[]
  onChapterMoved: (chapterId: string, newModuleId: string | null) => void
}

export function ChapterMover({ chapters, modules, onChapterMoved }: ChapterMoverProps) {
  const [selectedChapter, setSelectedChapter] = useState<string>('')
  const [targetModule, setTargetModule] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()

  const unassignedChapters = chapters.filter(ch => !ch.module_id)
  const assignedChapters = chapters.filter(ch => ch.module_id)

  const moveChapter = async () => {
    if (!selectedChapter) {
      toast.error('Please select a chapter to move')
      return
    }

    setIsLoading(true)
    try {
      const moduleId = targetModule === 'unassigned' ? null : targetModule || null

      const { error } = await supabase
        .from('chapters')
        .update({ module_id: moduleId })
        .eq('id', selectedChapter)

      if (error) throw error

      onChapterMoved(selectedChapter, moduleId)
      setSelectedChapter('')
      setTargetModule('')
      toast.success('Chapter moved successfully')
    } catch (error) {
      console.error('Error moving chapter:', error)
      toast.error('Failed to move chapter')
    } finally {
      setIsLoading(false)
    }
  }

  const getChapterCurrentModule = (chapterId: string) => {
    const chapter = chapters.find(ch => ch.id === chapterId)
    if (!chapter?.module_id) return 'Unassigned'
    const moduleItem = modules.find(m => m.id === chapter.module_id)
    return moduleItem?.title || 'Unknown Module'
  }

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Move className="h-5 w-5" />
          Move Chapters Between Modules
        </CardTitle>
        <CardDescription className="text-blue-700">
          Organize your existing chapters by moving them to appropriate modules.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-orange-600">{unassignedChapters.length}</div>
            <div className="text-sm text-gray-600">Unassigned</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-green-600">{assignedChapters.length}</div>
            <div className="text-sm text-gray-600">In Modules</div>
          </div>
        </div>

        {/* Chapter Mover */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Move Chapter</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Select Chapter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Chapter</label>
              <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose chapter..." />
                </SelectTrigger>
                <SelectContent>
                  {chapters.map(chapter => (
                    <SelectItem key={chapter.id} value={chapter.id}>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{chapter.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {getChapterCurrentModule(chapter.id)}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select Target Module */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Move to Module</label>
              <Select value={targetModule} onValueChange={setTargetModule}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose destination..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-orange-500" />
                      <span>Unassigned</span>
                    </div>
                  </SelectItem>
                  {modules.map(module => (
                    <SelectItem key={module.id} value={module.id}>
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4 text-blue-500" />
                        <span>{module.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Move Button */}
            <div className="flex items-end">
              <Button
                onClick={moveChapter}
                disabled={!selectedChapter || isLoading}
                className="w-full"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Move Chapter
              </Button>
            </div>
          </div>

          {/* Current Selection Info */}
          {selectedChapter && (
            <div className="p-3 bg-white border rounded-lg">
              <div className="text-sm text-gray-600">
                Moving:{' '}
                <span className="font-medium">
                  {chapters.find(ch => ch.id === selectedChapter)?.title}
                </span>
                <br />
                From:{' '}
                <span className="font-medium">{getChapterCurrentModule(selectedChapter)}</span>
                {targetModule && (
                  <>
                    <br />
                    To:{' '}
                    <span className="font-medium">
                      {targetModule === 'unassigned'
                        ? 'Unassigned'
                        : modules.find(m => m.id === targetModule)?.title}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions for Unassigned Chapters */}
        {unassignedChapters.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Quick Assign Unassigned Chapters</h4>
            <div className="space-y-2">
              {unassignedChapters.slice(0, 5).map(chapter => (
                <div
                  key={chapter.id}
                  className="flex items-center justify-between p-2 bg-white border rounded"
                >
                  <span className="text-sm font-medium">{chapter.title}</span>
                  <Select
                    onValueChange={moduleId => {
                      if (moduleId) {
                        onChapterMoved(chapter.id, moduleId === 'unassigned' ? null : moduleId)
                      }
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Assign..." />
                    </SelectTrigger>
                    <SelectContent>
                      {modules.map(module => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
              {unassignedChapters.length > 5 && (
                <div className="text-sm text-gray-500 text-center">
                  +{unassignedChapters.length - 5} more unassigned chapters
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
