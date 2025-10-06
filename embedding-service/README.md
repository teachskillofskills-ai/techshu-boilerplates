# 🧬 Embedding Service Boilerplate

Production-ready text embedding service supporting multiple providers (OpenAI, Cohere, local models) with batching, caching, and optimization.

## 📋 What's Included

- ✅ Multiple embedding providers (OpenAI, Cohere, HuggingFace)
- ✅ Batch processing for efficiency
- ✅ Embedding caching
- ✅ Automatic retry logic
- ✅ Cost optimization
- ✅ Dimension reduction
- ✅ Similarity calculations
- ✅ Performance monitoring

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install openai cohere-ai @huggingface/inference
```

### 2. Environment Variables

```env
OPENAI_API_KEY=your_openai_key
COHERE_API_KEY=your_cohere_key
HUGGINGFACE_API_KEY=your_hf_key  # Optional
```

## 💡 Usage

### Basic Embedding Generation

```typescript
import { EmbeddingService } from '@/lib/embedding-service/service'

const embedder = new EmbeddingService('openai')

// Single text
const embedding = await embedder.embed('Hello world')
console.log(embedding.length) // 1536

// Batch processing
const embeddings = await embedder.embedBatch([
  'Text 1',
  'Text 2',
  'Text 3'
])
```

### Different Providers

```typescript
// OpenAI (default)
const openaiEmbedder = new EmbeddingService('openai', {
  model: 'text-embedding-3-small',
  dimensions: 1536
})

// Cohere
const cohereEmbedder = new EmbeddingService('cohere', {
  model: 'embed-english-v3.0',
  inputType: 'search_document'
})

// HuggingFace (local/free)
const hfEmbedder = new EmbeddingService('huggingface', {
  model: 'sentence-transformers/all-MiniLM-L6-v2'
})
```

### With Caching

```typescript
const embedder = new EmbeddingService('openai', {
  enableCache: true,
  cacheSize: 1000
})

// First call - generates embedding
const emb1 = await embedder.embed('Hello')

// Second call - returns cached result
const emb2 = await embedder.embed('Hello')
```

### Similarity Calculations

```typescript
// Cosine similarity
const similarity = embedder.cosineSimilarity(embedding1, embedding2)
console.log(similarity) // 0.0 to 1.0

// Find most similar
const query = await embedder.embed('React hooks')
const documents = await embedder.embedBatch([
  'useState is a React hook',
  'Python is a language',
  'useEffect handles side effects'
])

const similarities = documents.map(doc => 
  embedder.cosineSimilarity(query, doc)
)

const mostSimilar = similarities.indexOf(Math.max(...similarities))
```

## 🎯 Advanced Features

### Batch Processing with Progress

```typescript
const texts = Array.from({ length: 1000 }, (_, i) => `Text ${i}`)

const embeddings = await embedder.embedBatch(texts, {
  batchSize: 100,
  onProgress: (progress) => {
    console.log(`Progress: ${progress}%`)
  }
})
```

### Dimension Reduction

```typescript
// Reduce dimensions for storage efficiency
const embedder = new EmbeddingService('openai', {
  model: 'text-embedding-3-large',
  dimensions: 256  // Reduce from 3072 to 256
})
```

### Cost Optimization

```typescript
// Use smaller, cheaper model
const embedder = new EmbeddingService('openai', {
  model: 'text-embedding-3-small',  // Cheaper than ada-002
  dimensions: 512  // Reduce dimensions
})

// Estimate cost
const cost = embedder.estimateCost(texts)
console.log(`Estimated cost: $${cost}`)
```

### Retry Logic

```typescript
const embedder = new EmbeddingService('openai', {
  maxRetries: 3,
  retryDelay: 1000,
  exponentialBackoff: true
})
```

## 📚 API Reference

### EmbeddingService Class

#### Constructor

```typescript
new EmbeddingService(provider: 'openai' | 'cohere' | 'huggingface', options?: {
  model?: string
  dimensions?: number
  enableCache?: boolean
  cacheSize?: number
  maxRetries?: number
  retryDelay?: number
  exponentialBackoff?: boolean
})
```

#### Methods

##### `embed(text: string): Promise<number[]>`

Generate embedding for single text.

##### `embedBatch(texts: string[], options?): Promise<number[][]>`

Generate embeddings for multiple texts.

```typescript
interface BatchOptions {
  batchSize?: number  // Default: 100
  onProgress?: (progress: number) => void
  parallel?: boolean  // Default: false
}
```

##### `cosineSimilarity(a: number[], b: number[]): number`

Calculate cosine similarity between two embeddings.

##### `euclideanDistance(a: number[], b: number[]): number`

Calculate Euclidean distance.

##### `dotProduct(a: number[], b: number[]): number`

Calculate dot product.

##### `estimateCost(texts: string[]): number`

Estimate API cost for embedding texts.

##### `clearCache(): void`

Clear embedding cache.

## 🔧 Configuration

### Provider Comparison

| Provider | Model | Dimensions | Cost/1M tokens | Speed |
|----------|-------|------------|----------------|-------|
| OpenAI | text-embedding-3-small | 1536 | $0.02 | Fast |
| OpenAI | text-embedding-3-large | 3072 | $0.13 | Fast |
| Cohere | embed-english-v3.0 | 1024 | $0.10 | Fast |
| HuggingFace | all-MiniLM-L6-v2 | 384 | Free | Medium |

### Recommended Settings

```typescript
// For production (balanced)
const embedder = new EmbeddingService('openai', {
  model: 'text-embedding-3-small',
  dimensions: 1536,
  enableCache: true,
  cacheSize: 5000,
  maxRetries: 3
})

// For development (free)
const embedder = new EmbeddingService('huggingface', {
  model: 'sentence-transformers/all-MiniLM-L6-v2',
  enableCache: true
})

// For high accuracy
const embedder = new EmbeddingService('openai', {
  model: 'text-embedding-3-large',
  dimensions: 3072
})
```

## 🎓 Use Cases

### 1. Semantic Search

```typescript
// Index documents
const embedder = new EmbeddingService('openai')
const docEmbeddings = await embedder.embedBatch(documents)

// Search
const queryEmbedding = await embedder.embed(userQuery)
const similarities = docEmbeddings.map(doc => 
  embedder.cosineSimilarity(queryEmbedding, doc)
)
```

### 2. Duplicate Detection

```typescript
// Find duplicates
const embeddings = await embedder.embedBatch(texts)

for (let i = 0; i < embeddings.length; i++) {
  for (let j = i + 1; j < embeddings.length; j++) {
    const similarity = embedder.cosineSimilarity(
      embeddings[i],
      embeddings[j]
    )
    
    if (similarity > 0.95) {
      console.log(`Duplicate found: ${i} and ${j}`)
    }
  }
}
```

### 3. Clustering

```typescript
// Group similar texts
const embeddings = await embedder.embedBatch(texts)

// Use k-means or other clustering algorithm
const clusters = kMeans(embeddings, numClusters)
```

## 📊 Performance

- **Single embedding**: ~50ms (OpenAI)
- **Batch (100 texts)**: ~500ms (OpenAI)
- **Cache hit**: <1ms
- **HuggingFace local**: ~100ms per text

## 🧪 Testing

```typescript
describe('EmbeddingService', () => {
  test('generates embedding', async () => {
    const embedder = new EmbeddingService('openai')
    const embedding = await embedder.embed('test')
    
    expect(embedding).toHaveLength(1536)
    expect(embedding[0]).toBeTypeOf('number')
  })
  
  test('calculates similarity', () => {
    const embedder = new EmbeddingService('openai')
    const sim = embedder.cosineSimilarity([1, 0], [1, 0])
    
    expect(sim).toBe(1)
  })
})
```

## 🤝 Related Boilerplates

- **rag-system** - Complete RAG implementation
- **chunking-service** - Document chunking
- **rag-evaluation** - Evaluation metrics

---

**Created with ❤️ by [Indranil Banerjee](https://in.linkedin.com/in/askneelnow)**  
*Head of AI Transformation, INT TechShu*

© 2025 TechShu - Created by Indranil Banerjee

