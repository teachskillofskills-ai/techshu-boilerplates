'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Edit3,
  Save,
  Eye,
  EyeOff,
  Search,
  Replace,
  CheckSquare,
  Square,
  AlertTriangle,
  Zap,
} from 'lucide-react'

interface BulkEditorProps {
  chapters: any[]
  courses: any[]
  userId: string
}

interface BulkOperation {
  type: 'find-replace' | 'publish' | 'unpublish' | 'update-duration' | 'add-prefix' | 'add-suffix'
  label: string
  description: string
  icon: any
}

const bulkOperations: BulkOperation[] = [
  {
    type: 'find-replace',
    label: 'Find & Replace',
    description: 'Replace text across selected chapters',
    icon: Replace,
  },
  {
    type: 'publish',
    label: 'Bulk Publish',
    description: 'Publish all selected chapters',
    icon: Eye,
  },
  {
    type: 'unpublish',
    label: 'Bulk Unpublish',
    description: 'Unpublish all selected chapters',
    icon: EyeOff,
  },
  {
    type: 'update-duration',
    label: 'Update Duration',
    description: 'Set estimated duration for selected chapters',
    icon: Edit3,
  },
  {
    type: 'add-prefix',
    label: 'Add Title Prefix',
    description: 'Add prefix to chapter titles',
    icon: Zap,
  },
  {
    type: 'add-suffix',
    label: 'Add Title Suffix',
    description: 'Add suffix to chapter titles',
    icon: Zap,
  },
]

export function BulkEditor({ chapters, courses, userId }: BulkEditorProps) {
  const [selectedChapters, setSelectedChapters] = useState<string[]>([])
  const [selectedOperation, setSelectedOperation] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Operation-specific states
  const [findText, setFindText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [newDuration, setNewDuration] = useState(10)
  const [titlePrefix, setTitlePrefix] = useState('')
  const [titleSuffix, setTitleSuffix] = useState('')

  const supabase = createClient()

  const toggleChapterSelection = (chapterId: string) => {
    setSelectedChapters(prev =>
      prev.includes(chapterId) ? prev.filter(id => id !== chapterId) : [...prev, chapterId]
    )
  }

  const selectAllChapters = () => {
    setSelectedChapters(chapters.map(chapter => chapter.id))
  }

  const deselectAllChapters = () => {
    setSelectedChapters([])
  }

  const executeBulkOperation = async () => {
    if (selectedChapters.length === 0) {
      toast.error('Please select at least one chapter')
      return
    }

    if (!selectedOperation) {
      toast.error('Please select an operation')
      return
    }

    setIsProcessing(true)

    try {
      let updates: any = {}
      let successMessage = ''

      switch (selectedOperation) {
        case 'publish':
          updates = { is_published: true }
          successMessage = `Published ${selectedChapters.length} chapters`
          break

        case 'unpublish':
          updates = { is_published: false }
          successMessage = `Unpublished ${selectedChapters.length} chapters`
          break

        case 'update-duration':
          updates = { estimated_duration: newDuration }
          successMessage = `Updated duration for ${selectedChapters.length} chapters`
          break

        case 'find-replace':
          if (!findText) {
            toast.error('Please enter text to find')
            return
          }
          // Handle find-replace separately as it requires content modification
          await handleFindReplace()
          return

        case 'add-prefix':
          if (!titlePrefix) {
            toast.error('Please enter a prefix')
            return
          }
          await handleTitlePrefix()
          return

        case 'add-suffix':
          if (!titleSuffix) {
            toast.error('Please enter a suffix')
            return
          }
          await handleTitleSuffix()
          return

        default:
          toast.error('Invalid operation selected')
          return
      }

      // Execute bulk update for simple operations
      const { error } = await supabase
        .from('chapters')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .in('id', selectedChapters)

      if (error) throw error

      toast.success(successMessage)
      setSelectedChapters([])
      setSelectedOperation('')
      // Refresh the page to show updates
      window.location.reload()
    } catch (error) {
      console.error('Error executing bulk operation:', error)
      toast.error('Failed to execute bulk operation. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFindReplace = async () => {
    let updatedCount = 0

    for (const chapterId of selectedChapters) {
      const chapter = chapters.find(c => c.id === chapterId)
      if (!chapter) continue

      const updatedContent =
        chapter.content_md?.replace(new RegExp(findText, 'g'), replaceText) || ''
      const updatedTitle = chapter.title.replace(new RegExp(findText, 'g'), replaceText)
      const updatedDescription =
        chapter.description?.replace(new RegExp(findText, 'g'), replaceText) || ''

      if (
        updatedContent !== chapter.content_md ||
        updatedTitle !== chapter.title ||
        updatedDescription !== chapter.description
      ) {
        const { error } = await supabase
          .from('chapters')
          .update({
            title: updatedTitle,
            description: updatedDescription,
            content_md: updatedContent,
            updated_at: new Date().toISOString(),
          })
          .eq('id', chapterId)

        if (!error) updatedCount++
      }
    }

    toast.success(`Find & Replace completed. Updated ${updatedCount} chapters.`)
    setFindText('')
    setReplaceText('')
    setSelectedChapters([])
    setSelectedOperation('')
    window.location.reload()
  }

  const handleTitlePrefix = async () => {
    let updatedCount = 0

    for (const chapterId of selectedChapters) {
      const chapter = chapters.find(c => c.id === chapterId)
      if (!chapter) continue

      const newTitle = `${titlePrefix}${chapter.title}`

      const { error } = await supabase
        .from('chapters')
        .update({
          title: newTitle,
          updated_at: new Date().toISOString(),
        })
        .eq('id', chapterId)

      if (!error) updatedCount++
    }

    toast.success(`Added prefix to ${updatedCount} chapter titles.`)
    setTitlePrefix('')
    setSelectedChapters([])
    setSelectedOperation('')
    window.location.reload()
  }

  const handleTitleSuffix = async () => {
    let updatedCount = 0

    for (const chapterId of selectedChapters) {
      const chapter = chapters.find(c => c.id === chapterId)
      if (!chapter) continue

      const newTitle = `${chapter.title}${titleSuffix}`

      const { error } = await supabase
        .from('chapters')
        .update({
          title: newTitle,
          updated_at: new Date().toISOString(),
        })
        .eq('id', chapterId)

      if (!error) updatedCount++
    }

    toast.success(`Added suffix to ${updatedCount} chapter titles.`)
    setTitleSuffix('')
    setSelectedChapters([])
    setSelectedOperation('')
    window.location.reload()
  }

  const renderOperationForm = () => {
    switch (selectedOperation) {
      case 'find-replace':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="find-text">Find Text</Label>
              <Input
                id="find-text"
                value={findText}
                onChange={e => setFindText(e.target.value)}
                placeholder="Text to find..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="replace-text">Replace With</Label>
              <Input
                id="replace-text"
                value={replaceText}
                onChange={e => setReplaceText(e.target.value)}
                placeholder="Replacement text..."
                className="mt-1"
              />
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Warning</p>
                  <p>
                    This will replace text in titles, descriptions, and content. This action cannot
                    be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'update-duration':
        return (
          <div>
            <Label htmlFor="new-duration">New Duration (minutes)</Label>
            <Input
              id="new-duration"
              type="number"
              min="1"
              value={newDuration}
              onChange={e => setNewDuration(parseInt(e.target.value) || 10)}
              className="mt-1"
            />
          </div>
        )

      case 'add-prefix':
        return (
          <div>
            <Label htmlFor="title-prefix">Title Prefix</Label>
            <Input
              id="title-prefix"
              value={titlePrefix}
              onChange={e => setTitlePrefix(e.target.value)}
              placeholder="e.g., '[NEW] '"
              className="mt-1"
            />
          </div>
        )

      case 'add-suffix':
        return (
          <div>
            <Label htmlFor="title-suffix">Title Suffix</Label>
            <Input
              id="title-suffix"
              value={titleSuffix}
              onChange={e => setTitleSuffix(e.target.value)}
              placeholder="e.g., ' (Updated)'"
              className="mt-1"
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Selection Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Chapter Selection
          </CardTitle>
          <CardDescription>Select chapters to perform bulk operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" onClick={selectAllChapters}>
              Select All ({chapters.length})
            </Button>
            <Button variant="outline" size="sm" onClick={deselectAllChapters}>
              Deselect All
            </Button>
            <Badge variant="secondary">{selectedChapters.length} selected</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {chapters.map(chapter => (
              <div
                key={chapter.id}
                className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedChapters.includes(chapter.id)
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => toggleChapterSelection(chapter.id)}
              >
                <Checkbox
                  checked={selectedChapters.includes(chapter.id)}
                  onChange={() => toggleChapterSelection(chapter.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{chapter.title}</p>
                  <p className="text-xs text-gray-500 truncate">{chapter.course_title}</p>
                </div>
                <Badge variant={chapter.is_published ? 'default' : 'secondary'} className="text-xs">
                  {chapter.is_published ? 'Published' : 'Draft'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Bulk Operations
          </CardTitle>
          <CardDescription>Choose an operation to perform on selected chapters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Operation Selection */}
          <div>
            <Label>Select Operation</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
              {bulkOperations.map(operation => {
                const Icon = operation.icon
                return (
                  <div
                    key={operation.type}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedOperation === operation.type
                        ? 'bg-blue-50 border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedOperation(operation.type)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">{operation.label}</p>
                        <p className="text-xs text-gray-600">{operation.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Operation Form */}
          {selectedOperation && (
            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">
                {bulkOperations.find(op => op.type === selectedOperation)?.label} Settings
              </h4>
              {renderOperationForm()}
            </div>
          )}

          {/* Execute Button */}
          {selectedOperation && selectedChapters.length > 0 && (
            <div className="border-t pt-6">
              <Button onClick={executeBulkOperation} disabled={isProcessing} className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                {isProcessing ? 'Processing...' : `Execute on ${selectedChapters.length} chapters`}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
