'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import {
  Plus,
  Save,
  X,
  Sparkles,
  Wand2,
  Loader2,
  Edit,
  Trash2,
  Calendar,
  ChevronDown,
  ChevronRight,
  Bot,
  User,
  FileText,
  Clock,
} from 'lucide-react'

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

interface ModernAINotesPanelProps {
  userId: string
  courseId: string
  chapterId: string
  chapterTitle: string
  chapterContent: string
  className?: string
}

export function ModernAINotesPanel({
  userId,
  courseId,
  chapterId,
  chapterTitle,
  chapterContent,
  className = '',
}: ModernAINotesPanelProps) {
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
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())
  const [selectedNoteType, setSelectedNoteType] = useState('ai_generated')
  const supabase = createClient()

  useEffect(() => {
    fetchNotes()
  }, [userId, courseId, chapterId])

  const toggleNoteExpansion = (noteId: string) => {
    const newExpanded = new Set(expandedNotes)
    if (newExpanded.has(noteId)) {
      newExpanded.delete(noteId)
    } else {
      newExpanded.add(noteId)
    }
    setExpandedNotes(newExpanded)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const fetchNotes = async () => {
    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  }

  const createNote = async (content: string) => {
    try {
      const { error } = await supabase.from('notes').insert({
        user_id: userId,
        course_id: courseId,
        chapter_id: chapterId,
        content: content,
        note_type: 'manual',
      })

      if (error) {
        console.error('Error creating note:', error)
      } else {
        setNewNoteContent('')
        setIsCreating(false)
        await fetchNotes()
      }
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  const deleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return
    }

    try {
      const { error } = await supabase.from('notes').delete().eq('id', noteId).eq('user_id', userId) // Security: only delete own notes

      if (error) {
        console.error('Error deleting note:', error)
        alert('Failed to delete note. Please try again.')
      } else {
        // Remove from expanded notes if it was expanded
        const newExpanded = new Set(expandedNotes)
        newExpanded.delete(noteId)
        setExpandedNotes(newExpanded)

        // Refresh notes list
        await fetchNotes()
      }
    } catch (error) {
      console.error('Error deleting note:', error)
      alert('Failed to delete note. Please try again.')
    }
  }

  const updateNote = async (noteId: string, newContent: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          content: newContent,
          updated_at: new Date().toISOString(),
        })
        .eq('id', noteId)
        .eq('user_id', userId) // Security: only update own notes

      if (error) {
        console.error('Error updating note:', error)
        alert('Failed to update note. Please try again.')
      } else {
        setEditingNoteId(null)
        setEditContent('')
        await fetchNotes()
      }
    } catch (error) {
      console.error('Error updating note:', error)
      alert('Failed to update note. Please try again.')
    }
  }

  const generateAINotes = async () => {
    setIsGeneratingAINotes(true)

    // Show contextual loading messages
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
      const response = await fetch('/api/ai/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterTitle,
          chapterContent,
          courseId,
          chapterId,
          noteType: selectedNoteType,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        await fetchNotes()
        console.log('AI notes generated successfully!')
      } else {
        console.error('AI Notes API Error:', result.error || 'Unknown error')
        alert(`Failed to generate AI notes: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error generating AI notes:', error)
      alert('Failed to generate AI notes. Please try again.')
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterTitle,
          chapterContent,
          courseId,
          chapterId,
          noteType: 'ai_generated',
          customPrompt: currentPrompt,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        await fetchNotes()
        console.log('Custom AI note generated successfully!')
      } else {
        console.error('Custom AI Notes API Error:', result.error || 'Unknown error')
        alert(`Failed to generate custom AI note: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error generating custom AI note:', error)
      alert('Failed to generate custom AI note. Please try again.')
    } finally {
      clearInterval(promptLoadingInterval)
      setIsGeneratingFromPrompt(false)
      setPromptLoadingMessage('')
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ff3968] via-[#ff6b47] to-[#8b5cf6]"></div>
        <h3 className="text-lg font-semibold text-slate-900">AI Notes</h3>
      </div>

      {/* Manual Note Creation */}
      <div className="space-y-4">
        {!isCreating ? (
          <Button
            onClick={() => setIsCreating(true)}
            variant="outline"
            className="w-full bg-white/50 border-slate-200/60 hover:bg-gradient-to-r hover:from-[#ff3968]/10 hover:to-[#ff6b47]/10 hover:border-[#ff3968]/30 text-slate-700 hover:text-[#ff3968] transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Note
          </Button>
        ) : (
          <div className="space-y-3">
            <Textarea
              placeholder="Write your note here..."
              value={newNoteContent}
              onChange={e => setNewNoteContent(e.target.value)}
              className="min-h-[100px] bg-white/50 border-slate-200/60 focus:bg-white/80"
            />
            <div className="flex space-x-2">
              <Button
                onClick={() => createNote(newNoteContent)}
                disabled={!newNoteContent.trim()}
                size="sm"
                className="bg-gradient-to-r from-[#ff3968] via-[#ff6b47] to-[#8b5cf6] text-white"
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
                className="bg-white/50 border-slate-200/60 hover:bg-white/80 text-slate-700"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* AI Note Generation */}
      <div className="space-y-4 pt-4 border-t border-slate-200/60">
        {/* Note Type Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">AI Note Type</label>
          <select
            value={selectedNoteType}
            onChange={e => setSelectedNoteType(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white/50 border border-slate-200/60 rounded-lg focus:bg-white/80 focus:border-blue-300 focus:outline-none"
          >
            <option value="ai_generated">📚 AI Generated Notes</option>
            <option value="summary">📝 Summary</option>
            <option value="key_points">🎯 Key Points</option>
            <option value="manual">✏️ Manual Style</option>
          </select>
        </div>

        <Button
          variant="learning"
          onClick={generateAINotes}
          disabled={isGeneratingAINotes}
          className="w-full"
        >
          {isGeneratingAINotes ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {aiNotesLoadingMessage || 'Generating... (~15s)'}
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate AI Notes
            </>
          )}
        </Button>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Custom AI Note Request</label>
          <Textarea
            placeholder="Ask AI to create specific notes... e.g., 'Create a summary of key formulas'"
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            className="min-h-[80px] bg-white/50 border-slate-200/60 focus:bg-white/80"
          />
          <Button
            onClick={generateNoteFromPrompt}
            disabled={isGeneratingFromPrompt || !aiPrompt.trim()}
            size="sm"
            className="w-full bg-gradient-to-r from-[#ff3968] via-[#ff6b47] to-[#8b5cf6] text-white"
          >
            {isGeneratingFromPrompt ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {promptLoadingMessage || 'Creating... (~10s)'}
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

      {/* Notes List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-slate-400" />
            <p className="text-sm text-slate-500">Loading notes...</p>
          </div>
        ) : notes.length > 0 ? (
          <div className="space-y-3">
            {notes.map(note => {
              const isExpanded = expandedNotes.has(note.id)
              const previewText =
                note.content.length > 300 ? note.content.substring(0, 300) + '...' : note.content

              return (
                <div
                  key={note.id}
                  className={`rounded-xl border transition-all duration-200 bg-white/60 border-slate-200/60 ${isExpanded ? 'shadow-md' : 'shadow-sm hover:shadow-md'}`}
                >
                  {/* Note Header - Always Visible */}
                  <div className="p-4 cursor-pointer" onClick={() => toggleNoteExpansion(note.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {note.is_ai_generated ? (
                            <Bot className="h-4 w-4 text-blue-500" />
                          ) : (
                            <User className="h-4 w-4 text-slate-500" />
                          )}
                          <span className="text-sm font-medium text-slate-700">
                            {note.is_ai_generated ? 'AI Generated' : 'Personal Note'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="h-3 w-3" />
                          {formatDate(note.created_at)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isExpanded && (
                          <span className="text-xs text-slate-400">
                            {note.content.length} chars
                          </span>
                        )}
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Preview Text when collapsed */}
                    {!isExpanded && (
                      <div className="mt-2">
                        <p className="text-sm text-slate-600 leading-relaxed">{previewText}</p>
                      </div>
                    )}
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4">
                      <div className="bg-white/50 rounded-lg p-4 border border-slate-200/50">
                        {editingNoteId === note.id ? (
                          /* Edit Mode */
                          <div className="space-y-3">
                            <Textarea
                              value={editContent}
                              onChange={e => setEditContent(e.target.value)}
                              className="min-h-[120px] bg-white border-slate-200 focus:border-blue-300"
                              placeholder="Edit your note..."
                            />
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateNote(note.id, editContent)}
                                disabled={!editContent.trim()}
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                              >
                                <Save className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingNoteId(null)
                                  setEditContent('')
                                }}
                                className="text-slate-600"
                              >
                                <X className="h-3 w-3 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          /* View Mode */
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
                              {note.content}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/50">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <FileText className="h-3 w-3" />
                            {note.note_type || 'standard'} note
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-slate-500 hover:text-slate-700"
                              onClick={e => {
                                e.stopPropagation()
                                setEditingNoteId(note.id)
                                setEditContent(note.content)
                              }}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-red-500 hover:text-red-700"
                              onClick={e => {
                                e.stopPropagation()
                                deleteNote(note.id)
                              }}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-xl bg-slate-100/60 flex items-center justify-center mx-auto mb-3">
              <FileText className="h-5 w-5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-600">No notes yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Create your first note or generate AI notes
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
