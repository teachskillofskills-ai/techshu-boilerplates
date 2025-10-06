import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { aiService } from '@/lib/ai/service'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const {
      chapterTitle,
      chapterContent,
      courseId,
      chapterId,
      noteType = 'ai_generated',
      customPrompt,
    } = await request.json()

    if (!chapterTitle || !chapterContent) {
      return NextResponse.json({ error: 'Chapter title and content are required' }, { status: 400 })
    }

    // Verify user has access to the course
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single()

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        { error: 'Access denied. You must be enrolled in this course.' },
        { status: 403 }
      )
    }

    // Generate notes using AI service
    const noteContent = await aiService.generateNotes(
      chapterTitle,
      chapterContent,
      noteType,
      customPrompt
    )

    // Debug: Log the note data being inserted
    console.log('Inserting note with data:', {
      user_id: user.id,
      course_id: courseId,
      chapter_id: chapterId,
      title: `AI Notes: ${chapterTitle}`,
      note_type: noteType,
      is_ai_generated: true,
    })

    // Save the AI-generated note to the database
    const { data: note, error: noteError } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        course_id: courseId,
        chapter_id: chapterId,
        title: `AI Notes: ${chapterTitle}`,
        content: noteContent,
        note_type: noteType,
        is_ai_generated: true,
      })
      .select()
      .single()

    if (noteError) {
      console.error('Error saving AI note:', noteError)

      // Check if it's a schema issue
      if (noteError.message?.includes('content') || noteError.code === 'PGRST204') {
        return NextResponse.json(
          {
            error: 'Database schema issue. Please run the notes table fix migration.',
            details: noteError.message,
            generatedContent: noteContent, // Return the content so it's not lost
          },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to save AI-generated note', details: noteError.message },
        { status: 500 }
      )
    }

    // Note: AI usage logging disabled as ai_usage_logs table doesn't exist

    return NextResponse.json({ success: true, data: note })
  } catch (error) {
    console.error('Error generating AI notes:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI notes. Please try again.' },
      { status: 500 }
    )
  }
}
