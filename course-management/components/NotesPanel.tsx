'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StickyNote, Plus, Edit, Trash2, Save, X, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

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

interface NotesPanelProps {
  userId: string
  courseId: string
  chapterId: string
  className?: string
}

export function NotesPanel({ userId, courseId, chapterId, className = '' }: NotesPanelProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [newNoteContent, setNewNoteContent] = useState('')
  const [editContent, setEditContent] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchNotes()
  }, [userId, courseId, chapterId])

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('chapter_id', chapterId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching notes:', error)
      } else {
        setNotes(data || [])
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }

  const createNote = async () => {
    if (!newNoteContent.trim()) return

    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: userId,
          course_id: courseId,
          chapter_id: chapterId,
          content: newNoteContent.trim(),
          note_type: 'manual',
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating note:', error)
      } else {
        setNotes(prev => [data, ...prev])
        setNewNoteContent('')
        setIsCreating(false)
      }
    } catch (error) {
      console.error('Error creating note:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateNote = async (noteId: string) => {
    if (!editContent.trim()) return

    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from('notes')
        .update({
          content: editContent.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', noteId)
        .select()
        .single()

      if (error) {
        console.error('Error updating note:', error)
      } else {
        setNotes(prev => prev.map(note => (note.id === noteId ? data : note)))
        setEditingNoteId(null)
        setEditContent('')
      }
    } catch (error) {
      console.error('Error updating note:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    setIsLoading(true)

    try {
      const { error } = await supabase.from('notes').delete().eq('id', noteId)

      if (error) {
        console.error('Error deleting note:', error)
      } else {
        setNotes(prev => prev.filter(note => note.id !== noteId))
      }
    } catch (error) {
      console.error('Error deleting note:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const startEditing = (note: Note) => {
    setEditingNoteId(note.id)
    setEditContent(note.content)
  }

  const cancelEditing = () => {
    setEditingNoteId(null)
    setEditContent('')
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <StickyNote className="h-5 w-5" />
          <span>My Notes</span>
          <Badge variant="secondary" className="text-xs">
            {notes.length}
          </Badge>
        </CardTitle>
        <CardDescription>Take notes while learning this chapter</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Create New Note */}
        {isCreating ? (
          <div className="space-y-3">
            <Textarea
              placeholder="Write your note here..."
              value={newNoteContent}
              onChange={e => setNewNoteContent(e.target.value)}
              rows={3}
            />
            <div className="flex items-center space-x-2">
              <Button size="sm" onClick={createNote} disabled={isLoading || !newNoteContent.trim()}>
                <Save className="h-4 w-4 mr-2" />
                Save Note
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsCreating(false)
                  setNewNoteContent('')
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(true)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        )}

        {/* Notes List */}
        {notes.length > 0 ? (
          <div className="space-y-3">
            {notes.map(note => (
              <div key={note.id} className="border rounded-lg p-3 bg-gray-50">
                {editingNoteId === note.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      rows={3}
                    />
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => updateNote(note.id)}
                        disabled={isLoading || !editContent.trim()}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEditing}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(note.created_at).toLocaleDateString()} at{' '}
                          {new Date(note.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {note.updated_at !== note.created_at && (
                          <span className="text-gray-400">(edited)</span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(note)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNote(note.id)}
                          className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          !isCreating && (
            <div className="text-center py-6">
              <StickyNote className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                No notes yet. Add your first note to remember key insights!
              </p>
            </div>
          )
        )}
      </CardContent>
    </Card>
  )
}
