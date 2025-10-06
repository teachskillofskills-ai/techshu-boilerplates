# 📊 RAG Evaluation Boilerplate

Comprehensive evaluation framework for RAG systems with metrics for retrieval quality, answer accuracy, and system performance.

## 📋 What's Included

- ✅ Retrieval metrics (Precision, Recall, MRR, NDCG)
- ✅ Answer quality metrics (Faithfulness, Relevance, Coherence)
- ✅ RAGAS framework integration
- ✅ Custom evaluation pipelines
- ✅ A/B testing support
- ✅ Performance benchmarking
- ✅ Automated testing
- ✅ Reporting and visualization

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install @ragas/ragas openai
```

### 2. Basic Evaluation

```typescript
import { RAGEvaluator } from '@/lib/rag-evaluation/service'

const evaluator = new RAGEvaluator()

// Evaluate single query
const result = await evaluator.evaluate({
  question: 'What is React?',
  answer: 'React is a JavaScript library...',
  contexts: ['React is a library for building UIs...'],
  groundTruth: 'React is a JavaScript library for building user interfaces'
})

console.log(result.faithfulness) // 0.95
console.log(result.relevance) // 0.92
console.log(result.coherence) // 0.88
```

## 💡 Evaluation Metrics

### 1. Retrieval Metrics

```typescript
// Evaluate retrieval quality
const retrievalMetrics = await evaluator.evaluateRetrieval({
  query: 'React hooks',
  retrievedDocs: retrievedDocuments,
  relevantDocs: groundTruthDocuments
})

console.log(retrievalMetrics.precision) // 0.80
console.log(retrievalMetrics.recall) // 0.75
console.log(retrievalMetrics.f1Score) // 0.77
console.log(retrievalMetrics.mrr) // 0.85 (Mean Reciprocal Rank)
console.log(retrievalMetrics.ndcg) // 0.82 (Normalized Discounted Cumulative Gain)
```

### 2. Answer Quality Metrics

```typescript
// Evaluate answer quality
const answerMetrics = await evaluator.evaluateAnswer({
  question: 'What is useState?',
  answer: generatedAnswer,
  contexts: retrievedContexts,
  groundTruth: expectedAnswer
})

console.log(answerMetrics.faithfulness) // How well answer uses context
console.log(answerMetrics.relevance) // How relevant to question
console.log(answerMetrics.coherence) // How coherent the answer is
console.log(answerMetrics.correctness) // Compared to ground truth
```

### 3. RAGAS Metrics

```typescript
// Use RAGAS framework
const ragasMetrics = await evaluator.evaluateWithRAGAS({
  question: 'Explain React hooks',
  answer: generatedAnswer,
  contexts: retrievedContexts,
  groundTruth: expectedAnswer
})

console.log(ragasMetrics.contextPrecision)
console.log(ragasMetrics.contextRecall)
console.log(ragasMetrics.faithfulness)
console.log(ragasMetrics.answerRelevancy)
```

## 🎯 Advanced Features

### Batch Evaluation

```typescript
// Evaluate multiple queries
const testSet = [
  {
    question: 'What is React?',
    answer: generatedAnswer1,
    contexts: contexts1,
    groundTruth: truth1
  },
  // ... more test cases
]

const results = await evaluator.evaluateBatch(testSet)

console.log(`Average Faithfulness: ${results.avgFaithfulness}`)
console.log(`Average Relevance: ${results.avgRelevance}`)
```

### A/B Testing

```typescript
// Compare two RAG systems
const comparison = await evaluator.compareSystemsconst comparison = await evaluator.compareSystems({
  systemA: ragSystemA,
  systemB: ragSystemB,
  testQueries: queries
})

console.log(`System A: ${comparison.systemA.avgScore}`)
console.log(`System B: ${comparison.systemB.avgScore}`)
console.log(`Winner: ${comparison.winner}`)
```

### Custom Metrics

```typescript
// Define custom evaluation metric
evaluator.addCustomMetric('specificity', async (answer, context) => {
  // Your custom logic
  return score
})

const result = await evaluator.evaluate({
  question,
  answer,
  contexts,
  metrics: ['faithfulness', 'relevance', 'specificity']
})
```

### Performance Benchmarking

```typescript
// Benchmark system performance
const benchmark = await evaluator.benchmark({
  ragSystem: myRAGSystem,
  testQueries: queries,
  iterations: 100
})

console.log(`Avg Latency: ${benchmark.avgLatency}ms`)
console.log(`P95 Latency: ${benchmark.p95Latency}ms`)
console.log(`Throughput: ${benchmark.throughput} queries/sec`)
```

## 📚 API Reference

### RAGEvaluator Class

#### `evaluate(options)`

Evaluate single query-answer pair.

```typescript
interface EvaluateOptions {
  question: string
  answer: string
  contexts: string[]
  groundTruth?: string
  metrics?: string[]
}

interface EvaluationResult {
  faithfulness: number
  relevance: number
  coherence: number
  correctness?: number
  latency: number
}
```

#### `evaluateBatch(testSet)`

Evaluate multiple queries.

#### `evaluateRetrieval(options)`

Evaluate retrieval quality.

#### `evaluateAnswer(options)`

Evaluate answer quality.

#### `compareSystems(options)`

Compare two RAG systems.

#### `benchmark(options)`

Benchmark system performance.

## 🔧 Configuration

### Evaluation Config

```typescript
// config/evaluation-config.ts
export const EVAL_CONFIG = {
  metrics: {
    faithfulness: {
      enabled: true,
      threshold: 0.8
    },
    relevance: {
      enabled: true,
      threshold: 0.75
    },
    coherence: {
      enabled: true,
      threshold: 0.7
    }
  },
  ragas: {
    enabled: true,
    model: 'gpt-4'
  },
  benchmark: {
    iterations: 100,
    warmup: 10
  }
}
```

## 🎓 Use Cases

### 1. Continuous Evaluation

```typescript
// Evaluate RAG system continuously
const evaluator = new RAGEvaluator()

setInterval(async () => {
  const result = await evaluator.evaluateBatch(testQueries)
  
  if (result.avgFaithfulness < 0.8) {
    alert('RAG quality degraded!')
  }
}, 3600000) // Every hour
```

### 2. Model Comparison

```typescript
// Compare different embedding models
const results = await evaluator.compareEmbeddings({
  models: ['text-embedding-3-small', 'text-embedding-3-large'],
  testQueries: queries
})

console.log('Best model:', results.bestModel)
```

### 3. Regression Testing

```typescript
// Test after changes
const baseline = await evaluator.evaluateBatch(testSet)

// Make changes to RAG system

const current = await evaluator.evaluateBatch(testSet)

const regression = evaluator.detectRegression(baseline, current)
if (regression.detected) {
  console.log('Regression detected in:', regression.metrics)
}
```

## 📊 Metrics Explained

### Faithfulness
Measures if answer is grounded in retrieved context (0-1)

### Relevance
Measures if answer addresses the question (0-1)

### Coherence
Measures if answer is well-structured (0-1)

### Precision
Ratio of relevant retrieved docs to total retrieved

### Recall
Ratio of relevant retrieved docs to total relevant

### MRR (Mean Reciprocal Rank)
Average of reciprocal ranks of first relevant doc

### NDCG (Normalized Discounted Cumulative Gain)
Measures ranking quality

## 🧪 Testing

```typescript
describe('RAGEvaluator', () => {
  test('evaluates faithfulness', async () => {
    const evaluator = new RAGEvaluator()
    
    const result = await evaluator.evaluate({
      question: 'What is 2+2?',
      answer: '2+2 equals 4',
      contexts: ['2+2=4']
    })
    
    expect(result.faithfulness).toBeGreaterThan(0.9)
  })
})
```

## 🤝 Related Boilerplates

- **rag-system** - RAG implementation
- **ai-testing** - AI testing framework
- **ai-debugging** - Debugging tools

---

**Created with ❤️ by [Indranil Banerjee](https://in.linkedin.com/in/askneelnow)**  
*Head of AI Transformation, INT TechShu*

© 2025 TechShu - Created by Indranil Banerjee

