// AI Service for LMS - Supports multiple providers
import OpenAI from 'openai'

// Types for AI responses
export interface SummaryResponse {
  summary: string
  keyPoints: string[]
  concepts: string[]
}

export interface ChatResponse {
  content: string
  timestamp: Date
}

// AI Service Configuration with Latest Free Models
const AI_CONFIG = {
  // Use OpenRouter for free models - Updated with latest 2025 models
  openrouter: {
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    models: {
      // Primary free models (2025 latest)
      gptOss120b: 'openai/gpt-oss-120b', // OpenAI GPT OSS 120B (free) ✅ WORKING
      deepseekR1: 'deepseek/deepseek-r1', // DeepSeek R1 (latest, free) 🆕
      deepseekR1Free: 'deepseek/deepseek-r1:free', // DeepSeek R1 explicit free tier 🆕
      qwen25Coder: 'qwen/qwen-2.5-coder-32b-instruct', // Qwen 2.5 Coder (free) 🆕
      qwen25Latest: 'qwen/qwen-2.5-72b-instruct', // Qwen 2.5 72B (free) 🆕
      qwen32b: 'qwen/qwen-2.5-32b-instruct', // Qwen 2.5 32B (free) 🆕

      // Secondary free models
      deepseekChat: 'deepseek/deepseek-chat', // DeepSeek Chat (backup)
      llama32: 'meta-llama/llama-3.2-11b-vision-instruct', // Llama 3.2 (free) 🆕
      llama31: 'meta-llama/llama-3.1-8b-instruct', // Llama 3.1 (backup)
      mistral: 'mistralai/mistral-7b-instruct', // Mistral 7B (free) 🆕

      // Premium fallbacks (if needed)
      claude: 'anthropic/claude-3.5-sonnet', // Claude (premium)
      gpt4: 'openai/gpt-4o-mini', // GPT-4o Mini (premium)
    },
  },
  // Google Gemini API (Free tier available)
  gemini: {
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    apiKey: process.env.GEMINI_API_KEY,
    models: {
      gemini15Flash: 'gemini-1.5-flash', // Gemini 1.5 Flash (free) 🆕
      gemini15Pro: 'gemini-1.5-pro', // Gemini 1.5 Pro (free tier) 🆕
      geminiPro: 'gemini-pro', // Gemini Pro (backup)
    },
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    models: {
      gpt4oMini: 'gpt-4o-mini', // GPT-4o Mini (most cost-effective)
      gpt4: 'gpt-4', // GPT-4 (backup)
      gpt35: 'gpt-3.5-turbo', // GPT-3.5 (final fallback)
    },
  },
}

// Initialize AI clients
const openRouterClient = new OpenAI({
  baseURL: AI_CONFIG.openrouter.baseURL,
  apiKey: AI_CONFIG.openrouter.apiKey,
})

const openAIClient = new OpenAI({
  apiKey: AI_CONFIG.openai.apiKey,
})

// Gemini client (using OpenAI-compatible interface)
const geminiClient = new OpenAI({
  baseURL: AI_CONFIG.gemini.baseURL,
  apiKey: AI_CONFIG.gemini.apiKey,
})

// Simple cache for AI responses
const responseCache = new Map<string, { content: string; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// AI Service Class
export class AIService {
  private static instance: AIService
  private client: OpenAI
  private model: string

  constructor(provider: 'openrouter' | 'openai' | 'gemini' = 'openrouter', model?: string) {
    console.log('🤖 Initializing AI Service with provider:', provider)
    console.log('🔑 OpenRouter API Key available:', !!AI_CONFIG.openrouter.apiKey)
    console.log('🔑 OpenAI API Key available:', !!AI_CONFIG.openai.apiKey)
    console.log('🔑 Gemini API Key available:', !!AI_CONFIG.gemini.apiKey)

    if (provider === 'openrouter') {
      this.client = openRouterClient
      // Use latest free models as primary
      this.model = model || AI_CONFIG.openrouter.models.gptOss120b
    } else if (provider === 'gemini') {
      this.client = geminiClient
      // Use Gemini 1.5 Flash as primary (free and fast)
      this.model = model || AI_CONFIG.gemini.models.gemini15Flash
    } else {
      this.client = openAIClient
      // Use GPT-4o Mini (most cost-effective)
      this.model = model || AI_CONFIG.openai.models.gpt4oMini
    }

    console.log('🎯 Using model:', this.model)
    console.log(
      '📊 Enhanced Model Strategy 2025: GPT OSS 120B → DeepSeek R1 → Qwen 2.5 → Gemini 1.5 → Llama 3.2 → Mistral 7B'
    )
  }

  static getInstance(): AIService {
    // Always create a fresh instance to ensure latest configuration
    AIService.instance = new AIService()
    return AIService.instance
  }

  // Generate chapter summary
  async generateSummary(chapterTitle: string, chapterContent: string): Promise<SummaryResponse> {
    try {
      const prompt = `
You are an expert educational AI tutor. Analyze the following chapter content and provide a comprehensive summary.

Chapter Title: "${chapterTitle}"
Chapter Content: "${chapterContent}"

Please provide:
1. A concise summary (2-3 sentences)
2. 4-6 key points (bullet format)
3. 3-5 key concepts/terms

Format your response as JSON with this structure:
{
  "summary": "Your summary here",
  "keyPoints": ["Point 1", "Point 2", ...],
  "concepts": ["Concept 1", "Concept 2", ...]
}

Focus on the most important learning objectives and practical applications.
`

      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert educational AI tutor specializing in creating clear, concise summaries for students. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from AI service')
      }

      // Parse JSON response
      const parsed = JSON.parse(response) as SummaryResponse

      // Validate response structure
      if (!parsed.summary || !Array.isArray(parsed.keyPoints) || !Array.isArray(parsed.concepts)) {
        throw new Error('Invalid response structure from AI')
      }

      return parsed
    } catch (error) {
      console.error('Error generating summary:', error)

      // Fallback response
      return {
        summary: `This chapter covers the fundamental concepts of ${chapterTitle.toLowerCase()}. It introduces key principles and practical applications that are essential for understanding the broader context of the course material.`,
        keyPoints: [
          'Understanding the core principles and foundations',
          'Practical applications and real-world examples',
          'Key terminology and concepts to remember',
          'How this connects to previous and upcoming chapters',
        ],
        concepts: [
          'Core Methodology',
          'Best Practices',
          'Implementation Strategies',
          'Common Pitfalls',
        ],
      }
    }
  }

  // Answer student questions with comprehensive fallback support (2025 Enhanced)
  async answerQuestion(
    question: string,
    chapterTitle: string,
    chapterContent: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
  ): Promise<ChatResponse> {
    console.log('🤖 Starting AI question answering with enhanced 2025 strategy...')

    // Strategy 1: Try GPT OSS 120B (OpenRouter) - Primary working model
    try {
      console.log('🎯 Trying GPT OSS 120B (primary)...')
      return await this.tryAnswerQuestion(
        question,
        chapterTitle,
        chapterContent,
        conversationHistory,
        'gpt-oss-120b'
      )
    } catch (gptOssError) {
      console.log('❌ GPT OSS 120B failed:', (gptOssError as Error).message)

      // Strategy 2: Try DeepSeek R1 (Latest, OpenRouter)
      try {
        console.log('🎯 Trying DeepSeek R1 (latest)...')
        const deepseekService = new AIService('openrouter', AI_CONFIG.openrouter.models.deepseekR1)
        return await deepseekService.tryAnswerQuestion(
          question,
          chapterTitle,
          chapterContent,
          conversationHistory,
          'deepseek-r1'
        )
      } catch (deepseekError) {
        console.log('❌ DeepSeek R1 failed:', (deepseekError as Error).message)

        // Strategy 3: Try DeepSeek R1 Free (Explicit free tier)
        try {
          console.log('🎯 Trying DeepSeek R1 Free...')
          const deepseekFreeService = new AIService(
            'openrouter',
            AI_CONFIG.openrouter.models.deepseekR1Free
          )
          return await deepseekFreeService.tryAnswerQuestion(
            question,
            chapterTitle,
            chapterContent,
            conversationHistory,
            'deepseek-r1-free'
          )
        } catch (deepseekFreeError) {
          console.log('❌ DeepSeek R1 Free failed:', (deepseekFreeError as Error).message)

          // Strategy 4: Try Qwen 2.5 Coder (Latest, OpenRouter)
          try {
            console.log('🎯 Trying Qwen 2.5 Coder (latest)...')
            const qwenCoderService = new AIService(
              'openrouter',
              AI_CONFIG.openrouter.models.qwen25Coder
            )
            return await qwenCoderService.tryAnswerQuestion(
              question,
              chapterTitle,
              chapterContent,
              conversationHistory,
              'qwen-2.5-coder'
            )
          } catch (qwenCoderError) {
            console.log('❌ Qwen 2.5 Coder failed:', (qwenCoderError as Error).message)

            // Strategy 5: Try Qwen 2.5 72B (OpenRouter)
            try {
              console.log('🎯 Trying Qwen 2.5 72B...')
              const qwen72bService = new AIService(
                'openrouter',
                AI_CONFIG.openrouter.models.qwen25Latest
              )
              return await qwen72bService.tryAnswerQuestion(
                question,
                chapterTitle,
                chapterContent,
                conversationHistory,
                'qwen-2.5-72b'
              )
            } catch (qwen72bError) {
              console.log('❌ Qwen 2.5 72B failed:', (qwen72bError as Error).message)

              // Strategy 6: Try Gemini 1.5 Flash (Free)
              try {
                console.log('🎯 Trying Gemini 1.5 Flash (free)...')
                const geminiService = new AIService('gemini', AI_CONFIG.gemini.models.gemini15Flash)
                return await geminiService.tryAnswerQuestion(
                  question,
                  chapterTitle,
                  chapterContent,
                  conversationHistory,
                  'gemini-1.5-flash'
                )
              } catch (geminiError) {
                console.log('❌ Gemini 1.5 Flash failed:', (geminiError as Error).message)

                // Strategy 7: Try Llama 3.2 (Latest, OpenRouter)
                try {
                  console.log('🎯 Trying Llama 3.2 (latest)...')
                  const llama32Service = new AIService(
                    'openrouter',
                    AI_CONFIG.openrouter.models.llama32
                  )
                  return await llama32Service.tryAnswerQuestion(
                    question,
                    chapterTitle,
                    chapterContent,
                    conversationHistory,
                    'llama-3.2'
                  )
                } catch (llama32Error) {
                  console.log('❌ Llama 3.2 failed:', (llama32Error as Error).message)

                  // Strategy 8: Try Mistral 7B (Free, OpenRouter)
                  try {
                    console.log('🎯 Trying Mistral 7B (free)...')
                    const mistralService = new AIService(
                      'openrouter',
                      AI_CONFIG.openrouter.models.mistral
                    )
                    return await mistralService.tryAnswerQuestion(
                      question,
                      chapterTitle,
                      chapterContent,
                      conversationHistory,
                      'mistral-7b'
                    )
                  } catch (mistralError) {
                    console.log('❌ Mistral 7B failed:', (mistralError as Error).message)

                    // Strategy 9: Try Gemini 1.5 Pro (Free tier)
                    try {
                      console.log('🎯 Trying Gemini 1.5 Pro (free tier)...')
                      const geminiProService = new AIService(
                        'gemini',
                        AI_CONFIG.gemini.models.gemini15Pro
                      )
                      return await geminiProService.tryAnswerQuestion(
                        question,
                        chapterTitle,
                        chapterContent,
                        conversationHistory,
                        'gemini-1.5-pro'
                      )
                    } catch (geminiProError) {
                      console.error('❌ All free AI models failed:', {
                        gptOssError,
                        deepseekError,
                        qwenCoderError,
                        qwen72bError,
                        geminiError,
                        llama32Error,
                        mistralError,
                        geminiProError,
                      })

                      // Return intelligent fallback instead of mock conversation
                      return {
                        content: `I'm currently experiencing connectivity issues with AI models. However, I can help you with "${chapterTitle}".

Based on the chapter content, here are some key points I can share:
${this.extractKeyPoints(chapterContent)}

**Your Question:** "${question}"

**Suggested Approach:**
1. Review the key points above related to your question
2. Check the chapter content for specific details
3. Try asking a more specific question about particular concepts
4. Consider breaking complex questions into smaller parts

Please try asking your question again in a few moments, or rephrase it for better results.`,
                        timestamp: new Date(),
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // Helper method to extract key points from content
  private extractKeyPoints(content: string): string {
    const sentences = content.split('.').filter(s => s.trim().length > 20)
    const keyPoints = sentences.slice(0, 3).map((s, i) => `${i + 1}. ${s.trim()}.`)
    return keyPoints.join('\n')
  }

  // Helper method to try answering with a specific model
  private async tryAnswerQuestion(
    question: string,
    chapterTitle: string,
    chapterContent: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
    modelType: string
  ): Promise<ChatResponse> {
    const systemPrompt = `You are an expert AI tutor for the chapter "${chapterTitle}".

CRITICAL: You are responding in a CHAT INTERFACE. Never create tables, structured layouts, or complex formatting. Write as if you're texting a friend.

Chapter Content: "${chapterContent.substring(0, 2000)}..."

Instructions:
- Answer questions directly related to this chapter content
- Provide clear, educational explanations with examples
- If the question is not related to this chapter, politely redirect to chapter topics
- Keep responses concise but informative (2-3 paragraphs max)
- Use a friendly, encouraging teaching tone

CHAT FORMATTING RULES (VERY IMPORTANT):
- Write as if you're texting or chatting with a friend - be conversational and natural
- NO TABLES, NO COMPLEX STRUCTURES, NO FORMA TTED LAYOUTS
- NO pipe symbols (|), NO dashes for separators, NO structured data presentations
- Use **bold text** sparingly for key terms only
- Use simple bullet points with • for short lists (max 3-4 items)
- Keep everything in flowing, natural paragraphs
- Avoid academic or formal document formatting
- Think "friendly chat message" not "structured document"
- If you need to present multiple concepts, use natural sentences with transitions
- Replace any table-like content with conversational explanations`

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory.slice(-4).map(msg => ({
        // Limit history to last 4 messages
        role: msg.role === 'user' ? ('user' as const) : ('assistant' as const),
        content: msg.content,
      })),
      { role: 'user' as const, content: question },
    ]

    console.log(`🔄 Making API call to ${modelType} model: ${this.model}`)

    const completion = (await Promise.race([
      this.client.chat.completions.create({
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 1000, // Increased for more detailed responses
        stream: false,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`${modelType} model timeout after 20s`)), 20000)
      ),
    ])) as any

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error(`No response from ${modelType} model`)
    }

    console.log(`✅ ${modelType} model responded successfully`)
    return {
      content: response,
      timestamp: new Date(),
    }
  }

  // Provide clarity on specific topics
  async provideClarification(
    clarityRequest: string,
    chapterTitle: string,
    chapterContent: string
  ): Promise<ChatResponse> {
    try {
      const prompt = `
You are an expert AI tutor. A student needs clarification on this topic from the chapter "${chapterTitle}":

Student's request: "${clarityRequest}"

Chapter Content: "${chapterContent}"

Please provide:
1. A simplified explanation
2. Real-world examples or analogies
3. Step-by-step breakdown if applicable
4. Additional tips for understanding

Make your response clear, engaging, and educational. Use simple language and helpful examples.
`

      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert educational AI tutor specializing in providing clear explanations and clarifications. Focus on making complex topics easy to understand.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 600,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from AI service')
      }

      return {
        content: response,
        timestamp: new Date(),
      }
    } catch (error) {
      console.error('Error providing clarification:', error)

      // Fallback response
      return {
        content: `I understand you need more clarity on: "${clarityRequest}". Let me provide a simplified explanation with examples to help you better understand this concept. This topic relates to the key principles discussed in "${chapterTitle}". Would you like me to break it down into smaller, more manageable parts?`,
        timestamp: new Date(),
      }
    }
  }

  // Generate AI notes with comprehensive fallback support
  async generateNotes(
    chapterTitle: string,
    chapterContent: string,
    noteType: 'manual' | 'ai_generated' | 'summary' | 'key_points',
    customPrompt?: string
  ): Promise<string> {
    console.log('📝 Starting AI notes generation...')

    // Strategy 1: Try GPT OSS 120B (OpenRouter) - Primary working model
    try {
      console.log('🎯 Trying GPT OSS 120B for notes (primary)...')
      return await this.tryGenerateNotes(
        chapterTitle,
        chapterContent,
        noteType,
        'gpt-oss-120b',
        customPrompt
      )
    } catch (gptOssError) {
      console.log('❌ GPT OSS 120B failed for notes:', (gptOssError as Error).message)

      // Strategy 2: Try DeepSeek Chat (OpenRouter)
      try {
        console.log('🎯 Trying DeepSeek Chat for notes...')
        const deepseekChatService = new AIService(
          'openrouter',
          AI_CONFIG.openrouter.models.deepseekChat
        )
        return await deepseekChatService.tryGenerateNotes(
          chapterTitle,
          chapterContent,
          noteType,
          'deepseek-chat',
          customPrompt
        )
      } catch (deepseekChatError) {
        console.log('❌ DeepSeek Chat failed for notes:', (deepseekChatError as Error).message)

        // Strategy 3: Try Qwen (OpenRouter)
        try {
          console.log('🎯 Trying Qwen for notes...')
          const qwenService = new AIService('openrouter', AI_CONFIG.openrouter.models.qwen25Latest)
          return await qwenService.tryGenerateNotes(
            chapterTitle,
            chapterContent,
            noteType,
            'qwen',
            customPrompt
          )
        } catch (qwenError) {
          console.log('❌ Qwen failed for notes:', (qwenError as Error).message)

          // Strategy 4: Try Llama (OpenRouter)
          try {
            console.log('🎯 Trying Llama for notes (final attempt)...')
            const llamaService = new AIService('openrouter', AI_CONFIG.openrouter.models.llama32)
            return await llamaService.tryGenerateNotes(
              chapterTitle,
              chapterContent,
              noteType,
              'llama',
              customPrompt
            )
          } catch (llamaError) {
            console.error('❌ All OpenRouter models failed for notes:', {
              gptOssError,
              deepseekChatError,
              qwenError,
              llamaError,
            })

            // Return intelligent structured fallback notes
            return this.getFallbackNotes(chapterTitle, noteType, chapterContent)
          }
        }
      }
    }
  }

  // Helper method to try generating notes with a specific model
  private async tryGenerateNotes(
    chapterTitle: string,
    chapterContent: string,
    noteType: 'manual' | 'ai_generated' | 'summary' | 'key_points',
    modelType: string,
    customPrompt?: string
  ): Promise<string> {
    // Create cache key
    const cacheKey = `notes_${chapterTitle}_${noteType}_${customPrompt || ''}_${modelType}`
    const cached = responseCache.get(cacheKey)

    // Return cached response if valid
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.content
    }

    let prompt = ''
    // If a custom prompt is provided, use it directly
    if (customPrompt && customPrompt.trim()) {
      prompt = customPrompt
    } else {
      // Otherwise use the predefined prompts based on note type
      switch (noteType) {
        case 'ai_generated':
          prompt = `Create comprehensive and detailed study notes for "${chapterTitle}".

## 📚 Overview & Learning Objectives
- Brief introduction to the chapter topic
- Key learning goals and objectives

## 🔑 Key Concepts & Definitions
- All important terms with clear definitions
- Core concepts explained in detail
- Relationships between concepts

## 📝 Detailed Content Analysis
- Main points broken down into clear sections
- Step-by-step explanations where applicable
- Important processes, methodologies, or frameworks
- Critical insights and principles

## 💡 Practical Applications & Examples
- Real-world examples and use cases
- Practical applications of the concepts
- Case studies or scenarios when relevant

## 📊 Summary & Key Takeaways
- Comprehensive bullet-pointed summary
- Most important concepts to remember
- Critical success factors or best practices

## 🎯 Study Tips & Review Points
- How to apply this knowledge effectively
- Common mistakes to avoid
- Areas requiring special attention

Format with clear headings, bullet points, and proper structure. Make the notes comprehensive and detailed - provide full explanations rather than brief summaries.`
          break
        case 'summary':
          prompt = `Create a comprehensive and detailed summary of "${chapterTitle}".

## 📋 Chapter Summary
- Detailed overview of the main topic
- Context and importance of this chapter

## 🎯 Key Points & Main Takeaways
- All major concepts covered in the chapter
- Important insights and principles
- Critical information students must understand

## 💼 Practical Applications & Insights
- How to apply the knowledge in real situations
- Actionable insights and recommendations
- Best practices and implementation strategies

## 🔍 Important Details
- Specific processes, methods, or frameworks
- Key statistics, facts, or data points
- Important examples and case studies

## ✅ Essential Knowledge for Success
- Must-know concepts for exams or practical use
- Common pitfalls and how to avoid them
- Success factors and critical considerations

Provide a thorough and comprehensive summary that captures all important aspects of the chapter content.`
          break
        case 'key_points':
          prompt = `Extract and list the most important points from "${chapterTitle}" that students must remember for exams and practical application.`
          break
        case 'manual':
          prompt = `Create structured, textbook-style study notes for "${chapterTitle}" with clear sections and detailed explanations.`
          break
        default:
          prompt = 'Create helpful, well-organized study notes for this chapter.'
          break
      }
    }

    const fullPrompt = `${prompt}

Chapter: "${chapterTitle}"
Full Chapter Content:
${chapterContent}

Additional Instructions:
- Use clear headings and subheadings with emojis
- Include comprehensive bullet points for easy reading
- Add practical examples and real-world applications where relevant
- Provide detailed explanations, not just brief summaries
- Format for easy studying and review with proper structure
- Make the notes thorough and complete - don't cut content short`

    console.log(`🔄 Making notes API call to ${modelType} model: ${this.model}`)

    const completion = (await Promise.race([
      this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert educational AI that creates exceptional study notes. Your notes should be well-structured, comprehensive, and easy to understand. Use clear formatting with headings, bullet points, and examples.',
          },
          {
            role: 'user',
            content: fullPrompt,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent notes
        max_tokens: 2000, // Much longer notes for comprehensive content
        stream: false,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`${modelType} model timeout for notes after 25s`)), 25000)
      ),
    ])) as any

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error(`No response from ${modelType} model for notes generation`)
    }

    console.log(`✅ ${modelType} model generated notes successfully`)

    // Cache the response
    responseCache.set(cacheKey, { content: response, timestamp: Date.now() })

    return response
  }

  // Intelligent fallback notes when all AI models fail
  private getFallbackNotes(
    chapterTitle: string,
    noteType: string,
    chapterContent?: string
  ): string {
    const keyPoints = chapterContent
      ? this.extractKeyPoints(chapterContent)
      : 'Content analysis unavailable'

    return `📝 Study Notes for "${chapterTitle}"

⚠️ AI models are temporarily unavailable, but here are structured notes based on the chapter content:

## Key Points Identified:
${keyPoints}

## Study Framework:
1. **Review**: Read through the chapter content carefully
2. **Identify**: Mark important concepts and definitions
3. **Practice**: Apply the concepts with examples
4. **Test**: Quiz yourself on the main points

## Next Steps:
- Try generating AI notes again in a few minutes
- Create manual notes using the chapter content
- Discuss concepts with instructors or peers

*Note: This is a fallback response. AI-generated notes will provide more detailed analysis.*

🎯 **Key Learning Objectives:**
• Understand the fundamental concepts presented in this chapter
• Apply the knowledge to practical scenarios
• Identify important principles and methodologies
• Connect this content to broader course themes

📚 **Study Recommendations:**
• Review the chapter content carefully
• Take your own notes while reading
• Practice with examples and exercises
• Discuss concepts with peers or instructors

💡 **Note:** These are basic study guidelines. For detailed AI-generated notes, please try again or contact support if the issue persists.

🔄 **Next Steps:**
• Re-read the chapter for better understanding
• Create your own detailed notes
• Test your knowledge with practice questions
• Seek clarification on difficult concepts

*AI note generation temporarily unavailable - please try again later.*`
  }
}

// Export singleton instance
export const aiService = AIService.getInstance()
