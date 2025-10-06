'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { RichContentEditor } from '@/components/editor/RichContentEditor'
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Star,
  Tag,
  BookOpen,
  FileText,
  Search,
  Filter,
  Download,
  Share,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Note {
  id: string
  user_id: string
  course_id: string | null
  chapter_id: string | null
  title: string | null
  content: string
  note_type: string
  is_ai_generated: boolean
  tags: string[]
  is_favorite: boolean
  created_at: string
  updated_at: string
}

interface NotesManagerProps {
  userId: string
  courseId?: string
  chapterId?: string
}

export function NotesManager({ userId, courseId, chapterId }: NotesManagerProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCourse, setFilterCourse] = useState('all')

  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    type: 'manual' as const,
    tags: [] as string[],
    is_favorite: false,
  })

  const [newTag, setNewTag] = useState('')
  const supabase = createClient()

  useEffect(() => {
    loadNotes()
  }, [userId, courseId, chapterId])

  // Populate form when editing a note
  useEffect(() => {
    if (editingNote) {
      setNewNote({
        title: editingNote.title || '',
        content: editingNote.content || '',
        type: editingNote.note_type as any,
        tags: editingNote.tags || [],
        is_favorite: editingNote.is_favorite || false,
      })
    }
  }, [editingNote])

  const loadNotes = async () => {
    try {
      let query = supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (courseId) {
        query = query.eq('course_id', courseId)
      }

      if (chapterId) {
        query = query.eq('chapter_id', chapterId)
      }

      const { data, error } = await query

      if (error) throw error
      setNotes(data || [])
    } catch (error) {
      console.error('Error loading notes:', error)
      toast.error('Failed to load notes')
    }
  }

  const createNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast.error('Title and content are required')
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: userId,
          course_id: courseId,
          chapter_id: chapterId,
          title: newNote.title,
          content: newNote.content,
          note_type: newNote.type,
          tags: newNote.tags,
          is_favorite: newNote.is_favorite,
        })
        .select()
        .single()

      if (error) throw error

      setNotes(prev => [data, ...prev])
      setNewNote({
        title: '',
        content: '',
        type: 'manual',
        tags: [],
        is_favorite: false,
      })
      setIsDialogOpen(false)
      toast.success('Note created successfully')
    } catch (error) {
      console.error('Error creating note:', error)
      toast.error('Failed to create note')
    } finally {
      setIsLoading(false)
    }
  }

  const updateNote = async (noteId: string, updates: Partial<Note>) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from('notes').update(updates).eq('id', noteId)

      if (error) throw error

      setNotes(prev => prev.map(note => (note.id === noteId ? { ...note, ...updates } : note)))

      toast.success('Note updated successfully')
    } catch (error) {
      console.error('Error updating note:', error)
      toast.error('Failed to update note')
    } finally {
      setIsLoading(false)
    }
  }

  const saveEditedNote = async () => {
    if (!editingNote || !newNote.title.trim() || !newNote.content.trim()) {
      toast.error('Title and content are required')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          title: newNote.title,
          content: newNote.content,
          note_type: newNote.type,
          tags: newNote.tags,
          is_favorite: newNote.is_favorite,
        })
        .eq('id', editingNote.id)

      if (error) throw error

      setNotes(prev =>
        prev.map(note =>
          note.id === editingNote.id
            ? {
                ...note,
                title: newNote.title,
                content: newNote.content,
                note_type: newNote.type,
                tags: newNote.tags,
                is_favorite: newNote.is_favorite,
              }
            : note
        )
      )

      setEditingNote(null)
      setNewNote({
        title: '',
        content: '',
        type: 'manual',
        tags: [],
        is_favorite: false,
      })
      setIsDialogOpen(false)
      toast.success('Note updated successfully')
    } catch (error) {
      console.error('Error updating note:', error)
      toast.error('Failed to update note')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    setIsLoading(true)
    try {
      const { error } = await supabase.from('notes').delete().eq('id', noteId)

      if (error) throw error

      setNotes(prev => prev.filter(note => note.id !== noteId))
      toast.success('Note deleted successfully')
    } catch (error) {
      console.error('Error deleting note:', error)
      toast.error('Failed to delete note')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = async (noteId: string, isFavorite: boolean) => {
    await updateNote(noteId, { is_favorite: !isFavorite })
  }

  const addTag = () => {
    if (newTag.trim() && !newNote.tags.includes(newTag.trim())) {
      setNewNote(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setNewNote(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }))
  }

  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || note.note_type === filterType
    return matchesSearch && matchesType
  })

  const exportNotes = () => {
    const notesData = filteredNotes.map(note => ({
      title: note.title,
      content: note.content,
      type: note.note_type,
      tags: note.tags.join(', '),
      created: new Date(note.created_at).toLocaleDateString(),
      favorite: note.is_favorite ? 'Yes' : 'No',
    }))

    const csv = [
      ['Title', 'Content', 'Type', 'Tags', 'Created', 'Favorite'],
      ...notesData.map(note => [
        note.title,
        note.content.replace(/"/g, '""'),
        note.type,
        note.tags,
        note.created,
        note.favorite,
      ]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'my-notes.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="ai_generated">AI Generated</SelectItem>
              <SelectItem value="summary">Summary</SelectItem>
              <SelectItem value="key_points">Key Points</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportNotes}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Dialog
            open={isDialogOpen}
            onOpenChange={open => {
              setIsDialogOpen(open)
              if (!open) {
                setEditingNote(null)
                setNewNote({
                  title: '',
                  content: '',
                  type: 'manual',
                  tags: [],
                  is_favorite: false,
                })
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingNote(null)
                  setNewNote({
                    title: '',
                    content: '',
                    type: 'manual',
                    tags: [],
                    is_favorite: false,
                  })
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingNote ? 'Edit Note' : 'Create New Note'}</DialogTitle>
                <DialogDescription>
                  {editingNote ? 'Update your note' : 'Add a new note to your collection'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="note-title">Title *</Label>
                    <Input
                      id="note-title"
                      value={newNote.title}
                      onChange={e => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter note title"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="note-type">Type</Label>
                    <Select
                      value={newNote.type}
                      onValueChange={(value: any) => setNewNote(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual Note</SelectItem>
                        <SelectItem value="summary">Summary</SelectItem>
                        <SelectItem value="key_points">Key Points</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newNote.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="ml-1">
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Content *</Label>
                  <div className="mt-1">
                    <RichContentEditor
                      content={newNote.content}
                      onChange={content => setNewNote(prev => ({ ...prev, content }))}
                      placeholder="Write your note content here..."
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is-favorite"
                    checked={newNote.is_favorite}
                    onChange={e => setNewNote(prev => ({ ...prev, is_favorite: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="is-favorite">Mark as favorite</Label>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={editingNote ? () => saveEditedNote() : createNote}
                    disabled={isLoading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingNote ? 'Update Note' : 'Save Note'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map(note => (
          <Card
            key={note.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setEditingNote(note)
              setIsDialogOpen(true)
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base line-clamp-2">{note.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant={note.note_type === 'ai_generated' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {note.note_type.replace('_', ' ')}
                    </Badge>
                    {note.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(note.id, note.is_favorite)}
                  >
                    <Star
                      className={`h-4 w-4 ${note.is_favorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`}
                    />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div
                className="text-sm text-gray-600 line-clamp-6 prose prose-sm"
                dangerouslySetInnerHTML={{
                  __html: note.content.substring(0, 500) + (note.content.length > 500 ? '...' : ''),
                }}
              />

              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-gray-500">
                  {new Date(note.created_at).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingNote(note)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNote(note.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {searchTerm || filterType !== 'all' ? 'No notes found' : 'No notes yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterType !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first note to get started'}
          </p>
        </div>
      )}
    </div>
  )
}
