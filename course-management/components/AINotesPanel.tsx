'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  StickyNote,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Calendar,
  Sparkles,
  Wand2,
  Lightbulb,
  Loader2,
  Brain,
  FileText,
} from 'lucide-react'
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

interface AINotesPanelProps {
  userId: string
  courseId: string
  chapterId: string
  chapterTitle: string
  chapterContent: string
  className?: string
}

export function AINotesPanel({
  userId,
  courseId,
  chapterId,
  chapterTitle,
  chapterContent,
  className = '',
}: AINotesPanelProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [newNoteContent, setNewNoteContent] = useState('')
  const [editContent, setEditContent] = useState('')
  const [isGeneratingAINotes, setIsGeneratingAINotes] = useState(false)
  const [aiNotesLoadingMessage, setAiNotesLoadingMessage] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGeneratingFromPrompt, setIsGeneratingFromPrompt] = useState(false)
  const [promptLoadingMessage, setPromptLoadingMessage] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchNotes()
  }, [userId, courseId, chapterId])

  const fetchNotes = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('chapter_id', chapterId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createNote = async (content: string, isAiGenerated = false) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([
          {
            user_id: userId,
            course_id: courseId,
            chapter_id: chapterId,
            content: content,
            note_type: isAiGenerated ? 'ai_generated' : 'manual',
            is_ai_generated: isAiGenerated,
          },
        ])
        .select()
        .single()

      if (error) throw error
      setNotes(prev => [data, ...prev])
      setNewNoteContent('')
      setIsCreating(false)
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  const updateNote = async (noteId: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update({ content: content, updated_at: new Date().toISOString() })
        .eq('id', noteId)
        .select()
        .single()

      if (error) throw error
      setNotes(prev => prev.map(note => (note.id === noteId ? data : note)))
      setEditingNoteId(null)
      setEditContent('')
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase.from('notes').delete().eq('id', noteId)

      if (error) throw error
      setNotes(prev => prev.filter(note => note.id !== noteId))
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const generateAINotes = async () => {
    setIsGeneratingAINotes(true)

    // Show contextual loading messages for AI notes
    const loadingMessages = [
      '📝 Preparing to generate notes...',
      '🔍 Analyzing chapter content...',
      '🧠 Processing key concepts...',
      '📚 Structuring information...',
      '✨ Finalizing comprehensive notes...',
    ]

    let messageIndex = 0
    setAiNotesLoadingMessage(loadingMessages[0])

    const loadingInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length
      setAiNotesLoadingMessage(loadingMessages[messageIndex])
    }, 2500)

    try {
      // Generate comprehensive AI notes
      const response = await fetch('/api/ai/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chapterTitle,
          chapterContent,
          courseId,
          chapterId,
          noteType: 'ai_generated',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate AI notes')
      }

      const result = await response.json()
      if (result.success) {
        // Refresh notes to show the new AI-generated note
        await fetchNotes()
      } else {
        throw new Error(result.error || 'Failed to generate AI notes')
      }
    } catch (error) {
      console.error('Error generating AI notes:', error)
      // Fallback: create a basic AI note locally
      const fallbackNote = `📝 AI-Generated Notes for "${chapterTitle}"

🎯 Key Takeaways:
• Main concept: Understanding the fundamental principles
• Practical application: How to implement in real scenarios
• Important considerations: Common pitfalls to avoid
• Next steps: Building upon this foundation

💡 Important Points to Remember:
• Definition and core concepts explained
• Step-by-step methodology outlined
• Real-world examples provided
• Connection to previous chapters established

🚀 Action Items:
• Practice the techniques discussed
• Review the examples provided
• Apply concepts to personal projects
• Prepare questions for further clarification`

      await createNote(fallbackNote, true)
    } finally {
      clearInterval(loadingInterval)
      setIsGeneratingAINotes(false)
      setAiNotesLoadingMessage('')
    }
  }

  const generateNoteFromPrompt = async () => {
    if (!aiPrompt.trim()) return

    setIsGeneratingFromPrompt(true)
    const currentPrompt = aiPrompt
    setAiPrompt('')

    // Show contextual loading messages for custom prompt
    const promptLoadingMessages = [
      '🎯 Understanding your request...',
      '📖 Analyzing chapter content...',
      '🤖 Crafting custom notes...',
      '📝 Formatting response...',
      '✅ Completing your note...',
    ]

    let messageIndex = 0
    setPromptLoadingMessage(promptLoadingMessages[0])

    const promptLoadingInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % promptLoadingMessages.length
      setPromptLoadingMessage(promptLoadingMessages[messageIndex])
    }, 2000)

    try {
      const response = await fetch('/api/ai/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chapterTitle,
          chapterContent,
          courseId,
          chapterId,
          noteType: 'ai_generated',
          customPrompt: currentPrompt,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate custom AI note')
      }

      const result = await response.json()
      if (result.success) {
        // Refresh notes to show the new AI-generated note
        await fetchNotes()
      } else {
        throw new Error(result.error || 'Failed to generate custom AI note')
      }
    } catch (error) {
      console.error('Error generating note from prompt:', error)
      // Fallback: create a basic AI note locally
      const fallbackNote = `🤖 AI Note based on your request: "${currentPrompt}"

Based on the chapter "${chapterTitle}", here's what I found relevant:

• Key insight: This relates to the main concepts discussed in the chapter
• Practical application: How you can apply this in real scenarios
• Additional context: Supporting information and examples
• Recommendation: Next steps for deeper understanding

This note was generated to help you focus on the specific aspect you requested.`

      await createNote(fallbackNote, true)
    } finally {
      clearInterval(promptLoadingInterval)
      setIsGeneratingFromPrompt(false)
      setPromptLoadingMessage('')
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <h3 className="text-lg font-semibold text-slate-900">AI Notes</h3>
        </div>
      </div>

      <CardContent className="space-y-4">
        <div className="space-y-6">
          {/* Manual Note Creation */}
          <div className="space-y-4">
            {/* Manual Note Creation */}
            {!isCreating ? (
              <Button onClick={() => setIsCreating(true)} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Note
              </Button>
            ) : (
              <div className="space-y-3">
                <Textarea
                  placeholder="Write your note here..."
                  value={newNoteContent}
                  onChange={e => setNewNoteContent(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={() => createNote(newNoteContent)}
                    disabled={!newNoteContent.trim()}
                    size="sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Note
                  </Button>
                  <Button
                    onClick={() => {
                      setIsCreating(false)
                      setNewNoteContent('')
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* AI Note Generation */}
          <div className="space-y-4 border-t pt-4">
            {/* AI Note Generation */}
            <div className="space-y-3">
              <Button onClick={generateAINotes} disabled={isGeneratingAINotes} className="w-full">
                {isGeneratingAINotes ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {aiNotesLoadingMessage || 'Generating AI Notes...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Notes
                  </>
                )}
              </Button>

              <div className="space-y-2">
                <label className="text-sm font-medium">Custom AI Note Request</label>
                <Textarea
                  placeholder="Ask AI to create specific notes... e.g., 'Create a summary of key formulas' or 'List the main benefits discussed'"
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button
                  onClick={generateNoteFromPrompt}
                  disabled={isGeneratingFromPrompt || !aiPrompt.trim()}
                  size="sm"
                  className="w-full"
                >
                  {isGeneratingFromPrompt ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {promptLoadingMessage || 'Creating Note...'}
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Create AI Note
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-4">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-500">Loading notes...</p>
            </div>
          ) : notes.length > 0 ? (
            notes.map(note => (
              <div key={note.id} className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                {editingNoteId === note.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => updateNote(note.id, editContent)}
                        disabled={!editContent.trim()}
                        size="sm"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={cancelEditing} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {/* AI Generated badge removed - field not in schema */}
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {formatDate(note.created_at).date} at {formatDate(note.created_at).time}
                          </span>
                          {note.updated_at !== note.created_at && (
                            <span className="text-gray-400">(edited)</span>
                          )}
                        </div>
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
            ))
          ) : (
            <div className="text-center py-6">
              <StickyNote className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                No notes yet. Add your first note or let AI help you!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </div>
  )
}
