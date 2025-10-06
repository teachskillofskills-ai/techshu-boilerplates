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
      question,
      chapterTitle,
      chapterContent,
      courseId,
      chapterId,
      conversationHistory = [],
      type = 'question', // 'question' or 'clarity'
    } = await request.json()

    if (!question || !chapterTitle || !chapterContent) {
      return NextResponse.json(
        { error: 'Question, chapter title, and content are required' },
        { status: 400 }
      )
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

    let response

    if (type === 'clarity') {
      // Handle clarity requests
      response = await aiService.provideClarification(question, chapterTitle, chapterContent)
    } else {
      // Handle regular questions
      response = await aiService.answerQuestion(
        question,
        chapterTitle,
        chapterContent,
        conversationHistory
      )
    }

    // Note: AI usage logging disabled as ai_usage_logs table doesn't exist

    return NextResponse.json({ success: true, data: response })
  } catch (error) {
    console.error('Error processing AI chat:', error)
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    )
  }
}
