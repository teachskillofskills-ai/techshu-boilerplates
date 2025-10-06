# 🔍 RAG System Boilerplate

Complete Retrieval Augmented Generation (RAG) system with vector embeddings, semantic search, and context retrieval.

## 📋 What's Included

- ✅ Vector embedding generation (OpenAI, Cohere, local models)
- ✅ Semantic search with pgvector
- ✅ Context retrieval and ranking
- ✅ Hybrid search (vector + keyword)
- ✅ Re-ranking algorithms
- ✅ Context window management
- ✅ Multi-query retrieval
- ✅ Query expansion
- ✅ Metadata filtering
- ✅ Performance optimization

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install openai @supabase/supabase-js cohere-ai
```

### 2. Database Setup

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create embeddings table (already in TechShu schema)
CREATE TABLE embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL,
    content_text TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vector index for fast similarity search
CREATE INDEX idx_embeddings_vector 
ON embeddings USING ivfflat (embedding vector_cosine_ops) 
WITH (lists=100);
```

### 3. Environment Variables

```env
OPENAI_API_KEY=your_openai_key
COHERE_API_KEY=your_cohere_key  # Optional for re-ranking
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 💡 Usage

### Basic RAG Query

```typescript
import { RAGSystem } from '@/lib/rag-system/service'

const rag = new RAGSystem()

// Query with context retrieval
const result = await rag.query({
  question: 'What is React?',
  courseId: 'course-uuid',
  topK: 5,
  similarityThreshold: 0.7
})

console.log(result.answer)
console.log(result.sources) // Retrieved context
console.log(result.confidence) // Confidence score
```

### Index Documents

```typescript
// Index course content
await rag.indexDocument({
  courseId: 'course-uuid',
  chapterId: 'chapter-uuid',
  contentType: 'chapter',
  contentText: 'Your content here...',
  metadata: {
    title: 'Chapter Title',
    tags: ['react', 'hooks']
  }
})
```

### Semantic Search

```typescript
// Search without generating answer
const results = await rag.semanticSearch({
  query: 'React hooks',
  courseId: 'course-uuid',
  topK: 10,
  filters: {
    contentType: 'chapter',
    tags: ['react']
  }
})
```

### Hybrid Search (Vector + Keyword)

```typescript
const results = await rag.hybridSearch({
  query: 'useState hook',
  courseId: 'course-uuid',
  vectorWeight: 0.7,  // 70% vector, 30% keyword
  keywordWeight: 0.3
})
```

## 🎯 Advanced Features

### Multi-Query Retrieval

```typescript
// Generate multiple query variations for better retrieval
const result = await rag.multiQueryRetrieval({
  question: 'How do I use React hooks?',
  courseId: 'course-uuid',
  numQueries: 3  // Generate 3 query variations
})
```

### Re-Ranking with Cohere

```typescript
// Re-rank results for better relevance
const result = await rag.queryWithReranking({
  question: 'What is useState?',
  courseId: 'course-uuid',
  topK: 20,  // Retrieve 20, re-rank to top 5
  rerankTopK: 5
})
```

### Context Window Management

```typescript
// Automatically manage context window size
const result = await rag.query({
  question: 'Explain React',
  courseId: 'course-uuid',
  maxContextTokens: 3000,  // Fit within 3000 tokens
  model: 'gpt-4'
})
```

### Metadata Filtering

```typescript
// Filter by metadata
const results = await rag.semanticSearch({
  query: 'React hooks',
  courseId: 'course-uuid',
  filters: {
    contentType: 'chapter',
    difficulty: 'beginner',
    tags: { contains: 'react' }
  }
})
```

## 📚 API Reference

### RAGSystem Class

#### `query(options)`

Main RAG query method.

```typescript
interface QueryOptions {
  question: string
  courseId: string
  topK?: number  // Default: 5
  similarityThreshold?: number  // Default: 0.7
  maxContextTokens?: number  // Default: 3000
  model?: string  // Default: 'gpt-4'
  includeMetadata?: boolean  // Default: true
}
```

#### `indexDocument(options)`

Index a document for retrieval.

```typescript
interface IndexOptions {
  courseId: string
  chapterId?: string
  contentType: string
  contentText: string
  metadata?: Record<string, any>
}
```

#### `semanticSearch(options)`

Perform semantic search without generating answer.

```typescript
interface SearchOptions {
  query: string
  courseId: string
  topK?: number
  similarityThreshold?: number
  filters?: Record<string, any>
}
```

#### `hybridSearch(options)`

Combine vector and keyword search.

```typescript
interface HybridSearchOptions {
  query: string
  courseId: string
  vectorWeight?: number  // Default: 0.7
  keywordWeight?: number  // Default: 0.3
  topK?: number
}
```

## 🔧 Configuration

### Embedding Models

```typescript
// config/rag-config.ts
export const RAG_CONFIG = {
  embedding: {
    model: 'text-embedding-3-small',  // OpenAI
    dimensions: 1536,
    batchSize: 100
  },
  retrieval: {
    defaultTopK: 5,
    similarityThreshold: 0.7,
    maxContextTokens: 3000
  },
  reranking: {
    enabled: true,
    model: 'rerank-english-v2.0',  // Cohere
    topK: 5
  }
}
```

## 🎓 Use Cases

### 1. AI Tutor with Context

```typescript
// Create AI tutor with course context
const rag = new RAGSystem()

const answer = await rag.query({
  question: 'How do I use useState?',
  courseId: courseId,
  topK: 3
})

// Display answer with sources
console.log(answer.answer)
answer.sources.forEach(source => {
  console.log(`Source: ${source.metadata.title}`)
})
```

### 2. Course Search

```typescript
// Semantic course search
const results = await rag.semanticSearch({
  query: 'advanced React patterns',
  courseId: courseId,
  topK: 10
})
```

### 3. Q&A System

```typescript
// Build Q&A with context
const qa = new RAGSystem()

const result = await qa.queryWithReranking({
  question: userQuestion,
  courseId: courseId,
  topK: 20,
  rerankTopK: 5
})
```

## 📊 Performance

- **Embedding Generation**: ~100ms per document
- **Vector Search**: ~50ms for 10K documents
- **Re-ranking**: ~200ms for 20 documents
- **End-to-End Query**: ~500ms average

## 🔒 Security

- ✅ Row Level Security on embeddings table
- ✅ Service role key only in server-side code
- ✅ Input validation and sanitization
- ✅ Rate limiting on API endpoints

## 🧪 Testing

```typescript
describe('RAGSystem', () => {
  test('indexes document', async () => {
    const rag = new RAGSystem()
    
    await rag.indexDocument({
      courseId: 'test-course',
      contentType: 'chapter',
      contentText: 'React is a library'
    })
    
    const results = await rag.semanticSearch({
      query: 'React',
      courseId: 'test-course'
    })
    
    expect(results.length).toBeGreaterThan(0)
  })
})
```

## 📖 Examples

See [EXAMPLES.md](./EXAMPLES.md) for complete examples.

## 🤝 Related Boilerplates

- **embedding-service** - Embedding generation
- **chunking-service** - Document chunking
- **rag-evaluation** - RAG quality metrics
- **ai-service** - AI model integration

---

**Created with ❤️ by [Indranil Banerjee](https://in.linkedin.com/in/askneelnow)**  
*Head of AI Transformation, INT TechShu*

© 2025 TechShu - Created by Indranil Banerjee

