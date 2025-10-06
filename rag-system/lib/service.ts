import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

/**
 * RAG System Service
 * 
 * Complete Retrieval Augmented Generation implementation
 * with vector embeddings and semantic search
 * 
 * Created by: Indranil Banerjee
 * Head of AI Transformation, INT TechShu
 */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface QueryOptions {
  question: string
  courseId: string
  topK?: number
  similarityThreshold?: number
  maxContextTokens?: number
  model?: string
  includeMetadata?: boolean
}

export interface IndexOptions {
  courseId: string
  chapterId?: string
  contentType: string
  contentText: string
  metadata?: Record<string, any>
}

export interface SearchOptions {
  query: string
  courseId: string
  topK?: number
  similarityThreshold?: number
  filters?: Record<string, any>
}

export interface RAGResult {
  answer: string
  sources: Array<{
    id: string
    content: string
    similarity: number
    metadata: Record<string, any>
  }>
  confidence: number
  tokensUsed: number
}

export class RAGSystem {
  private embeddingModel = 'text-embedding-3-small'
  private embeddingDimensions = 1536

  /**
   * Main RAG query method
   */
  async query(options: QueryOptions): Promise<RAGResult> {
    const {
      question,
      courseId,
      topK = 5,
      similarityThreshold = 0.7,
      maxContextTokens = 3000,
      model = 'gpt-4',
      includeMetadata = true,
    } = options

    console.log('🔍 Starting RAG query:', question)

    // 1. Generate embedding for question
    const questionEmbedding = await this.generateEmbedding(question)

    // 2. Retrieve relevant context
    const contexts = await this.retrieveContext({
      embedding: questionEmbedding,
      courseId,
      topK,
      similarityThreshold,
    })

    if (contexts.length === 0) {
      return {
        answer: 'I could not find relevant information to answer your question.',
        sources: [],
        confidence: 0,
        tokensUsed: 0,
      }
    }

    // 3. Build context string
    const contextString = this.buildContextString(contexts, maxContextTokens)

    // 4. Generate answer with LLM
    const result = await this.generateAnswer({
      question,
      context: contextString,
      model,
    })

    // 5. Calculate confidence
    const confidence = this.calculateConfidence(contexts, result.answer)

    return {
      answer: result.answer,
      sources: contexts.map(ctx => ({
        id: ctx.id,
        content: ctx.content_text,
        similarity: ctx.similarity,
        metadata: includeMetadata ? ctx.metadata : {},
      })),
      confidence,
      tokensUsed: result.tokensUsed,
    }
  }

  /**
   * Index a document for retrieval
   */
  async indexDocument(options: IndexOptions): Promise<string> {
    const { courseId, chapterId, contentType, contentText, metadata } = options

    console.log('📝 Indexing document:', contentType)

    // Generate embedding
    const embedding = await this.generateEmbedding(contentText)

    // Store in database
    const { data, error } = await supabase
      .from('embeddings')
      .insert({
        course_id: courseId,
        chapter_id: chapterId,
        content_type: contentType,
        content_text: contentText,
        embedding: JSON.stringify(embedding),
        metadata: metadata || {},
      })
      .select('id')
      .single()

    if (error) {
      console.error('❌ Error indexing document:', error)
      throw new Error(`Failed to index document: ${error.message}`)
    }

    console.log('✅ Document indexed:', data.id)
    return data.id
  }

  /**
   * Semantic search without generating answer
   */
  async semanticSearch(options: SearchOptions) {
    const { query, courseId, topK = 10, similarityThreshold = 0.7, filters } = options

    // Generate embedding
    const queryEmbedding = await this.generateEmbedding(query)

    // Retrieve context
    return await this.retrieveContext({
      embedding: queryEmbedding,
      courseId,
      topK,
      similarityThreshold,
      filters,
    })
  }

  /**
   * Generate embedding for text
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await openai.embeddings.create({
        model: this.embeddingModel,
        input: text,
        dimensions: this.embeddingDimensions,
      })

      return response.data[0].embedding
    } catch (error) {
      console.error('❌ Error generating embedding:', error)
      throw new Error('Failed to generate embedding')
    }
  }

  /**
   * Retrieve relevant context from vector database
   */
  private async retrieveContext(options: {
    embedding: number[]
    courseId: string
    topK: number
    similarityThreshold: number
    filters?: Record<string, any>
  }) {
    const { embedding, courseId, topK, similarityThreshold, filters } = options

    // Build query
    let query = supabase.rpc('match_embeddings', {
      query_embedding: JSON.stringify(embedding),
      match_threshold: similarityThreshold,
      match_count: topK,
      filter_course_id: courseId,
    })

    // Apply filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.filter(key, 'eq', value)
      })
    }

    const { data, error } = await query

    if (error) {
      console.error('❌ Error retrieving context:', error)
      return []
    }

    return data || []
  }

  /**
   * Build context string from retrieved documents
   */
  private buildContextString(contexts: any[], maxTokens: number): string {
    let contextString = ''
    let tokenCount = 0

    for (const ctx of contexts) {
      const text = ctx.content_text
      const estimatedTokens = Math.ceil(text.length / 4) // Rough estimate

      if (tokenCount + estimatedTokens > maxTokens) {
        break
      }

      contextString += `\n\n---\n${text}`
      tokenCount += estimatedTokens
    }

    return contextString
  }

  /**
   * Generate answer using LLM
   */
  private async generateAnswer(options: {
    question: string
    context: string
    model: string
  }): Promise<{ answer: string; tokensUsed: number }> {
    const { question, context, model } = options

    const systemPrompt = `You are a helpful AI assistant. Answer the question based on the provided context.
If the context doesn't contain enough information, say so clearly.
Always cite which parts of the context you used.`

    const userPrompt = `Context:\n${context}\n\nQuestion: ${question}\n\nAnswer:`

    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    return {
      answer: response.choices[0].message.content || '',
      tokensUsed: response.usage?.total_tokens || 0,
    }
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(contexts: any[], answer: string): number {
    if (contexts.length === 0) return 0

    // Average similarity of top contexts
    const avgSimilarity = contexts.reduce((sum, ctx) => sum + ctx.similarity, 0) / contexts.length

    // Check if answer indicates uncertainty
    const uncertaintyPhrases = [
      'i don\'t know',
      'not sure',
      'cannot find',
      'no information',
      'unclear',
    ]
    const hasUncertainty = uncertaintyPhrases.some(phrase =>
      answer.toLowerCase().includes(phrase)
    )

    const confidence = hasUncertainty ? avgSimilarity * 0.5 : avgSimilarity

    return Math.round(confidence * 100) / 100
  }
}

