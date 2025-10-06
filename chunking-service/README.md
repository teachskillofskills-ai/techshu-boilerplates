# ✂️ Chunking Service Boilerplate

Intelligent document chunking strategies for RAG systems with semantic splitting, overlap management, and metadata preservation.

## 📋 What's Included

- ✅ Multiple chunking strategies (fixed, semantic, recursive)
- ✅ Overlap management
- ✅ Metadata preservation
- ✅ Token counting
- ✅ Markdown-aware splitting
- ✅ Code-aware splitting
- ✅ Sentence boundary detection
- ✅ Chunk optimization

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install tiktoken
```

### 2. Basic Usage

```typescript
import { ChunkingService } from '@/lib/chunking-service/service'

const chunker = new ChunkingService()

// Simple chunking
const chunks = await chunker.chunk(longText, {
  strategy: 'semantic',
  chunkSize: 500,
  overlap: 50
})

console.log(chunks.length)
chunks.forEach((chunk, i) => {
  console.log(`Chunk ${i}: ${chunk.text.substring(0, 50)}...`)
})
```

## 💡 Chunking Strategies

### 1. Fixed Size Chunking

```typescript
const chunks = await chunker.chunk(text, {
  strategy: 'fixed',
  chunkSize: 500,  // tokens
  overlap: 50      // tokens
})
```

### 2. Semantic Chunking

```typescript
// Split by meaning, not just size
const chunks = await chunker.chunk(text, {
  strategy: 'semantic',
  chunkSize: 500,
  minSimilarity: 0.7  // Similarity threshold
})
```

### 3. Recursive Chunking

```typescript
// Try multiple separators
const chunks = await chunker.chunk(text, {
  strategy: 'recursive',
  separators: ['\n\n', '\n', '. ', ' '],
  chunkSize: 500
})
```

### 4. Markdown-Aware Chunking

```typescript
// Preserve markdown structure
const chunks = await chunker.chunkMarkdown(markdownText, {
  chunkSize: 500,
  preserveHeaders: true,
  preserveCodeBlocks: true
})
```

### 5. Code-Aware Chunking

```typescript
// Preserve code structure
const chunks = await chunker.chunkCode(codeText, {
  language: 'typescript',
  chunkSize: 500,
  preserveFunctions: true
})
```

## 🎯 Advanced Features

### Chunk with Metadata

```typescript
const chunks = await chunker.chunk(text, {
  strategy: 'semantic',
  chunkSize: 500,
  metadata: {
    source: 'chapter-1',
    author: 'John Doe',
    date: '2025-01-01'
  }
})

// Each chunk includes metadata
chunks.forEach(chunk => {
  console.log(chunk.metadata)
})
```

### Optimize Chunk Size

```typescript
// Find optimal chunk size
const optimalSize = await chunker.findOptimalChunkSize(text, {
  minSize: 200,
  maxSize: 1000,
  targetChunks: 10
})

console.log(`Optimal chunk size: ${optimalSize} tokens`)
```

### Sentence Boundary Detection

```typescript
const chunks = await chunker.chunk(text, {
  strategy: 'fixed',
  chunkSize: 500,
  respectSentences: true  // Don't split mid-sentence
})
```

### Token Counting

```typescript
// Count tokens before chunking
const tokenCount = chunker.countTokens(text)
console.log(`Text has ${tokenCount} tokens`)

// Estimate chunks
const estimatedChunks = Math.ceil(tokenCount / 500)
```

## 📚 API Reference

### ChunkingService Class

#### `chunk(text, options)`

Main chunking method.

```typescript
interface ChunkOptions {
  strategy: 'fixed' | 'semantic' | 'recursive'
  chunkSize: number  // in tokens
  overlap?: number  // in tokens
  minSimilarity?: number  // for semantic
  separators?: string[]  // for recursive
  respectSentences?: boolean
  metadata?: Record<string, any>
}

interface Chunk {
  text: string
  tokens: number
  startIndex: number
  endIndex: number
  metadata: Record<string, any>
}
```

#### `chunkMarkdown(text, options)`

Markdown-aware chunking.

```typescript
interface MarkdownChunkOptions {
  chunkSize: number
  preserveHeaders?: boolean
  preserveCodeBlocks?: boolean
  preserveLists?: boolean
}
```

#### `chunkCode(text, options)`

Code-aware chunking.

```typescript
interface CodeChunkOptions {
  language: string
  chunkSize: number
  preserveFunctions?: boolean
  preserveClasses?: boolean
}
```

#### `countTokens(text): number`

Count tokens in text.

#### `findOptimalChunkSize(text, options): number`

Find optimal chunk size.

## 🔧 Configuration

### Recommended Settings

```typescript
// For RAG (balanced)
const chunks = await chunker.chunk(text, {
  strategy: 'semantic',
  chunkSize: 500,
  overlap: 50,
  respectSentences: true
})

// For long documents
const chunks = await chunker.chunk(text, {
  strategy: 'recursive',
  separators: ['\n\n\n', '\n\n', '\n', '. '],
  chunkSize: 1000,
  overlap: 100
})

// For code
const chunks = await chunker.chunkCode(code, {
  language: 'typescript',
  chunkSize: 800,
  preserveFunctions: true
})
```

## 🎓 Use Cases

### 1. RAG System

```typescript
// Chunk documents for RAG
const chunker = new ChunkingService()

const chunks = await chunker.chunk(document, {
  strategy: 'semantic',
  chunkSize: 500,
  overlap: 50,
  metadata: {
    documentId: doc.id,
    title: doc.title
  }
})

// Index each chunk
for (const chunk of chunks) {
  await ragSystem.indexDocument({
    text: chunk.text,
    metadata: chunk.metadata
  })
}
```

### 2. Long Document Processing

```typescript
// Process long documents
const chunks = await chunker.chunk(longDocument, {
  strategy: 'recursive',
  chunkSize: 1000,
  overlap: 100
})

// Process each chunk
for (const chunk of chunks) {
  await processChunk(chunk)
}
```

### 3. Code Documentation

```typescript
// Chunk code for documentation
const chunks = await chunker.chunkCode(sourceCode, {
  language: 'typescript',
  chunkSize: 500,
  preserveFunctions: true
})

// Generate docs for each chunk
for (const chunk of chunks) {
  const docs = await generateDocs(chunk.text)
}
```

## 📊 Performance

- **Fixed chunking**: ~10ms per 10K tokens
- **Semantic chunking**: ~100ms per 10K tokens
- **Recursive chunking**: ~20ms per 10K tokens
- **Markdown chunking**: ~30ms per 10K tokens

## 🧪 Testing

```typescript
describe('ChunkingService', () => {
  test('chunks text', async () => {
    const chunker = new ChunkingService()
    const text = 'A'.repeat(10000)
    
    const chunks = await chunker.chunk(text, {
      strategy: 'fixed',
      chunkSize: 500
    })
    
    expect(chunks.length).toBeGreaterThan(0)
    expect(chunks[0].tokens).toBeLessThanOrEqual(500)
  })
})
```

## 🤝 Related Boilerplates

- **rag-system** - Complete RAG implementation
- **embedding-service** - Embedding generation
- **rag-evaluation** - Evaluation metrics

---

**Created with ❤️ by [Indranil Banerjee](https://in.linkedin.com/in/askneelnow)**  
*Head of AI Transformation, INT TechShu*

© 2025 TechShu - Created by Indranil Banerjee

