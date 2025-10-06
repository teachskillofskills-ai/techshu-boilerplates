import OpenAI from 'openai'

/**
 * Embedding Service
 * 
 * Multi-provider embedding generation with caching and optimization
 * 
 * Created by: Indranil Banerjee
 * Head of AI Transformation, INT TechShu
 */

export type EmbeddingProvider = 'openai' | 'cohere' | 'huggingface'

export interface EmbeddingOptions {
  model?: string
  dimensions?: number
  enableCache?: boolean
  cacheSize?: number
  maxRetries?: number
  retryDelay?: number
  exponentialBackoff?: boolean
}

export interface BatchOptions {
  batchSize?: number
  onProgress?: (progress: number) => void
  parallel?: boolean
}

export class EmbeddingService {
  private provider: EmbeddingProvider
  private client: any
  private options: Required<EmbeddingOptions>
  private cache: Map<string, number[]>

  constructor(provider: EmbeddingProvider = 'openai', options: EmbeddingOptions = {}) {
    this.provider = provider
    this.options = {
      model: this.getDefaultModel(provider),
      dimensions: this.getDefaultDimensions(provider),
      enableCache: options.enableCache ?? true,
      cacheSize: options.cacheSize ?? 1000,
      maxRetries: options.maxRetries ?? 3,
      retryDelay: options.retryDelay ?? 1000,
      exponentialBackoff: options.exponentialBackoff ?? true,
      ...options,
    }

    this.cache = new Map()
    this.initializeClient()
  }

  private initializeClient() {
    switch (this.provider) {
      case 'openai':
        this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
        break
      case 'cohere':
        // Initialize Cohere client
        break
      case 'huggingface':
        // Initialize HuggingFace client
        break
    }
  }

  private getDefaultModel(provider: EmbeddingProvider): string {
    const models = {
      openai: 'text-embedding-3-small',
      cohere: 'embed-english-v3.0',
      huggingface: 'sentence-transformers/all-MiniLM-L6-v2',
    }
    return models[provider]
  }

  private getDefaultDimensions(provider: EmbeddingProvider): number {
    const dimensions = {
      openai: 1536,
      cohere: 1024,
      huggingface: 384,
    }
    return dimensions[provider]
  }

  /**
   * Generate embedding for single text
   */
  async embed(text: string): Promise<number[]> {
    // Check cache
    if (this.options.enableCache && this.cache.has(text)) {
      return this.cache.get(text)!
    }

    // Generate embedding with retry
    const embedding = await this.generateWithRetry(text)

    // Cache result
    if (this.options.enableCache) {
      this.addToCache(text, embedding)
    }

    return embedding
  }

  /**
   * Generate embeddings for multiple texts
   */
  async embedBatch(texts: string[], options: BatchOptions = {}): Promise<number[][]> {
    const { batchSize = 100, onProgress, parallel = false } = options

    const results: number[][] = []
    const batches = this.createBatches(texts, batchSize)

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]

      if (parallel) {
        const batchResults = await Promise.all(batch.map(text => this.embed(text)))
        results.push(...batchResults)
      } else {
        for (const text of batch) {
          const embedding = await this.embed(text)
          results.push(embedding)
        }
      }

      if (onProgress) {
        const progress = Math.round(((i + 1) / batches.length) * 100)
        onProgress(progress)
      }
    }

    return results
  }

  /**
   * Calculate cosine similarity
   */
  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have same length')
    }

    const dotProduct = this.dotProduct(a, b)
    const magnitudeA = Math.sqrt(this.dotProduct(a, a))
    const magnitudeB = Math.sqrt(this.dotProduct(b, b))

    return dotProduct / (magnitudeA * magnitudeB)
  }

  /**
   * Calculate dot product
   */
  dotProduct(a: number[], b: number[]): number {
    return a.reduce((sum, val, i) => sum + val * b[i], 0)
  }

  /**
   * Calculate Euclidean distance
   */
  euclideanDistance(a: number[], b: number[]): number {
    const sumSquares = a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0)
    return Math.sqrt(sumSquares)
  }

  /**
   * Estimate API cost
   */
  estimateCost(texts: string[]): number {
    const totalTokens = texts.reduce((sum, text) => sum + Math.ceil(text.length / 4), 0)

    const costPer1M = {
      openai: 0.02, // text-embedding-3-small
      cohere: 0.1,
      huggingface: 0, // Free
    }

    return (totalTokens / 1_000_000) * costPer1M[this.provider]
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Generate embedding with retry logic
   */
  private async generateWithRetry(text: string, attempt = 1): Promise<number[]> {
    try {
      return await this.generateEmbedding(text)
    } catch (error) {
      if (attempt >= this.options.maxRetries) {
        throw error
      }

      const delay = this.options.exponentialBackoff
        ? this.options.retryDelay * Math.pow(2, attempt - 1)
        : this.options.retryDelay

      await new Promise(resolve => setTimeout(resolve, delay))
      return this.generateWithRetry(text, attempt + 1)
    }
  }

  /**
   * Generate embedding using provider
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    switch (this.provider) {
      case 'openai':
        return await this.generateOpenAIEmbedding(text)
      case 'cohere':
        return await this.generateCohereEmbedding(text)
      case 'huggingface':
        return await this.generateHuggingFaceEmbedding(text)
      default:
        throw new Error(`Unsupported provider: ${this.provider}`)
    }
  }

  private async generateOpenAIEmbedding(text: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: this.options.model,
      input: text,
      dimensions: this.options.dimensions,
    })

    return response.data[0].embedding
  }

  private async generateCohereEmbedding(text: string): Promise<number[]> {
    // Implement Cohere embedding generation
    throw new Error('Cohere not implemented yet')
  }

  private async generateHuggingFaceEmbedding(text: string): Promise<number[]> {
    // Implement HuggingFace embedding generation
    throw new Error('HuggingFace not implemented yet')
  }

  /**
   * Add to cache with size limit
   */
  private addToCache(text: string, embedding: number[]): void {
    if (this.cache.size >= this.options.cacheSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(text, embedding)
  }

  /**
   * Create batches from array
   */
  private createBatches<T>(array: T[], batchSize: number): T[][] {
    const batches: T[][] = []

    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize))
    }

    return batches
  }
}

