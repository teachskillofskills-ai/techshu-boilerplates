# 🤖 AI Service Integration Boilerplate

A powerful multi-provider AI service with automatic fallback system. Supports OpenAI, OpenRouter (9 models), and Google Gemini with intelligent model selection and error handling.

## ✨ Features

- ✅ **Multi-Provider Support** - OpenAI, OpenRouter, Gemini
- ✅ **9 AI Models** - Automatic fallback across models
- ✅ **Streaming Responses** - Real-time AI responses
- ✅ **Context Management** - Conversation history
- ✅ **Token Counting** - Track usage
- ✅ **Error Handling** - Graceful degradation
- ✅ **Cost Optimization** - Free models first
- ✅ **Question Answering** - Context-aware Q&A
- ✅ **Content Generation** - Notes, summaries, courses
- ✅ **TypeScript** - Full type safety

## 📦 Installation

### 1. Install Dependencies

```bash
npm install openai @google/generative-ai
```

### 2. Copy Files

```bash
cp -r boilerplates/ai-service/lib ./src/lib/ai
```

### 3. Environment Variables

```env
# OpenAI
OPENAI_API_KEY=your_openai_key

# OpenRouter (for fallback models)
OPENROUTER_API_KEY=your_openrouter_key

# Google Gemini (free tier)
GEMINI_API_KEY=your_gemini_key
```

## 🚀 Quick Start

### Basic Question Answering

```typescript
import { AIService } from '@/lib/ai/service'

const aiService = new AIService('openai', 'gpt-4')

const response = await aiService.answerQuestion(
  'What is React?',
  'Introduction to React',
  'React is a JavaScript library...',
  [] // conversation history
)

console.log(response.content)
```

### With Automatic Fallback

```typescript
// Tries 9 different models automatically if one fails
const response = await aiService.answerQuestionWithFallback(
  'Explain hooks in React',
  'React Hooks',
  chapterContent,
  conversationHistory
)
```

### Streaming Responses

```typescript
const stream = await aiService.streamAnswer(
  'What are React components?',
  'React Components',
  chapterContent,
  conversationHistory
)

for await (const chunk of stream) {
  process.stdout.write(chunk)
}
```

## 🎯 Supported AI Models

### Fallback Order (Free → Paid)

1. **GPT OSS 120B** (OpenRouter) - Free, primary
2. **DeepSeek Chat** (OpenRouter) - Free
3. **Qwen 2.5 Coder** (OpenRouter) - Free
4. **Qwen 2.5 72B** (OpenRouter) - Free
5. **Gemini 1.5 Flash** (Google) - Free
6. **Llama 3.2 90B** (OpenRouter) - Free
7. **Mistral 7B** (OpenRouter) - Free
8. **Gemini 1.5 Pro** (Google) - Free tier
9. **GPT-4** (OpenAI) - Paid fallback

## 📝 Complete Example

```typescript
import { AIService } from '@/lib/ai/service'

// Initialize service
const aiService = new AIService('openai', 'gpt-4')

// Conversation history
const history = [
  { role: 'user', content: 'What is React?' },
  { role: 'assistant', content: 'React is a JavaScript library...' }
]

// Ask question with context
const response = await aiService.answerQuestionWithFallback(
  'How do I use useState?',
  'React Hooks',
  `
  # React Hooks
  
  Hooks are functions that let you use state and other React features.
  
  ## useState
  useState is a Hook that lets you add state to function components.
  `,
  history
)

console.log(response.content)
console.log('Model used:', response.model)
console.log('Tokens:', response.usage)
```

## 📊 API Reference

### AIService Class

#### constructor(provider, model)

```typescript
const aiService = new AIService(
  'openai' | 'openrouter' | 'gemini',
  'model-name'
)
```

#### answerQuestion(question, chapterTitle, chapterContent, history)

Answer question with context.

```typescript
const response = await aiService.answerQuestion(
  'Your question',
  'Chapter Title',
  'Chapter content...',
  conversationHistory
)
```

#### answerQuestionWithFallback(question, chapterTitle, chapterContent, history)

Answer with automatic fallback across 9 models.

```typescript
const response = await aiService.answerQuestionWithFallback(
  question,
  chapterTitle,
  content,
  history
)
```

#### streamAnswer(question, chapterTitle, chapterContent, history)

Stream response in real-time.

```typescript
const stream = await aiService.streamAnswer(
  question,
  chapterTitle,
  content,
  history
)

for await (const chunk of stream) {
  console.log(chunk)
}
```

#### generateNotes(chapterTitle, chapterContent, noteType, customPrompt)

Generate study notes.

```typescript
const notes = await aiService.generateNotes(
  'React Hooks',
  chapterContent,
  'summary', // 'summary' | 'detailed' | 'bullet'
  'Focus on useState and useEffect'
)
```

#### generateNotesWithFallback(chapterTitle, chapterContent, noteType, customPrompt)

Generate notes with fallback.

```typescript
const notes = await aiService.generateNotesWithFallback(
  chapterTitle,
  content,
  'detailed'
)
```

## 💡 Use Cases

### 1. AI Tutor

```typescript
// Create AI tutor for course
const tutor = new AIService('openai', 'gpt-4')

const answer = await tutor.answerQuestionWithFallback(
  studentQuestion,
  chapterTitle,
  chapterContent,
  conversationHistory
)

// Display to student
console.log(answer.content)
```

### 2. Study Notes Generator

```typescript
// Generate study notes
const notes = await aiService.generateNotesWithFallback(
  'Introduction to JavaScript',
  chapterContent,
  'summary'
)

// Save notes
await saveNotes(notes.content)
```

### 3. Q&A System

```typescript
// Build Q&A system
const qa = new AIService('gemini', 'gemini-1.5-flash')

const answer = await qa.answerQuestion(
  userQuestion,
  documentTitle,
  documentContent,
  []
)
```

### 4. Content Summarization

```typescript
// Summarize content
const summary = await aiService.generateNotes(
  'Long Article',
  articleContent,
  'summary',
  'Create a 3-paragraph summary'
)
```

## 🔧 Configuration

### AI Config

```typescript
// In service.ts
export const AI_CONFIG = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    models: {
      gpt4: 'gpt-4',
      gpt35: 'gpt-3.5-turbo'
    }
  },
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    models: {
      gptOss120b: 'openrouter/gpt-oss-120b',
      deepseekChat: 'deepseek/deepseek-chat',
      qwen25Coder: 'qwen/qwen-2.5-coder-32b-instruct',
      // ... more models
    }
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    models: {
      gemini15Flash: 'gemini-1.5-flash',
      gemini15Pro: 'gemini-1.5-pro'
    }
  }
}
```

### Custom Prompts

```typescript
// Modify system prompts
const systemPrompt = `
You are an expert tutor specializing in ${subject}.
Provide clear, concise explanations with examples.
`

const response = await aiService.answerQuestion(
  question,
  title,
  content,
  history,
  systemPrompt // custom prompt
)
```

## 🔒 Security Best Practices

1. **API Keys** - Store in environment variables
2. **Rate Limiting** - Implement rate limits
3. **Input Validation** - Validate user input
4. **Content Filtering** - Filter inappropriate content
5. **Cost Monitoring** - Track API usage
6. **Error Handling** - Handle API errors gracefully

## 📈 Cost Optimization

### Free Models First

```typescript
// Fallback system tries free models first
1. GPT OSS 120B (Free)
2. DeepSeek Chat (Free)
3. Qwen models (Free)
4. Gemini Flash (Free)
5. ... more free models
9. GPT-4 (Paid) - Last resort
```

### Token Management

```typescript
// Limit context size
const maxTokens = 4000
const truncatedContent = content.substring(0, maxTokens * 4)

const response = await aiService.answerQuestion(
  question,
  title,
  truncatedContent,
  history
)
```

## 🐛 Troubleshooting

**Issue**: "API key not found"
- **Solution**: Set environment variables correctly

**Issue**: "All models failed"
- **Solution**: Check API keys, network connection, rate limits

**Issue**: "Response too slow"
- **Solution**: Use streaming, reduce context size, try faster models

**Issue**: "High costs"
- **Solution**: Use free models, implement caching, limit requests

## 📊 Performance Tips

1. **Use Streaming** - For better UX
2. **Cache Responses** - Cache common questions
3. **Limit Context** - Send only relevant content
4. **Batch Requests** - Group similar requests
5. **Use Free Models** - For non-critical tasks

## 🧪 Testing

```typescript
describe('AIService', () => {
  test('answers question', async () => {
    const aiService = new AIService('openai', 'gpt-4')
    
    const response = await aiService.answerQuestion(
      'What is 2+2?',
      'Math',
      'Basic arithmetic',
      []
    )
    
    expect(response.content).toContain('4')
  })

  test('falls back on error', async () => {
    const aiService = new AIService('invalid', 'invalid')
    
    const response = await aiService.answerQuestionWithFallback(
      'Test question',
      'Test',
      'Test content',
      []
    )
    
    expect(response.content).toBeDefined()
  })
})
```

## 📚 Examples

### React Component

```typescript
import { useState } from 'react'
import { AIService } from '@/lib/ai/service'

function AIChat() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const askQuestion = async () => {
    setLoading(true)
    
    const aiService = new AIService('openai', 'gpt-4')
    const response = await aiService.answerQuestionWithFallback(
      question,
      'General Knowledge',
      '',
      []
    )
    
    setAnswer(response.content)
    setLoading(false)
  }

  return (
    <div>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
      />
      <button onClick={askQuestion} disabled={loading}>
        {loading ? 'Thinking...' : 'Ask'}
      </button>
      {answer && <div>{answer}</div>}
    </div>
  )
}
```

## 🔄 Migration Guide

### From OpenAI SDK

```typescript
// Before
const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello' }]
})

// After
const aiService = new AIService('openai', 'gpt-4')
const response = await aiService.answerQuestion(
  'Hello',
  'Chat',
  '',
  []
)
```

## 📖 Resources

- [OpenAI API Docs](https://platform.openai.com/docs)
- [OpenRouter Docs](https://openrouter.ai/docs)
- [Gemini API Docs](https://ai.google.dev/docs)

---

**Need help?** Check the examples folder for complete implementations.

