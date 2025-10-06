'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface NotesPageClientProps {
  totalNotes: number
}

export function NotesPageClient({ totalNotes }: NotesPageClientProps) {
  const handleNewNote = () => {
    // Scroll to notes manager section
    const notesManager = document.getElementById('notes-manager')
    if (notesManager) {
      notesManager.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // For header button (always show)
  if (totalNotes > 0) {
    return (
      <Button onClick={handleNewNote}>
        <Plus className="h-4 w-4 mr-2" />
        New Note
      </Button>
    )
  }

  // For empty state button (only when no notes)
  return (
    <Button onClick={handleNewNote}>
      <Plus className="h-4 w-4 mr-2" />
      Create Your First Note
    </Button>
  )
}
