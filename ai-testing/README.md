# 🧪 AI Testing Boilerplate

Comprehensive testing framework for AI/LLM applications with prompt testing, model evaluation, and automated test generation.

## 📋 What's Included

- ✅ Prompt testing framework
- ✅ LLM output validation
- ✅ Regression testing for AI
- ✅ Automated test generation
- ✅ Mock AI responses
- ✅ Performance testing
- ✅ Cost tracking
- ✅ CI/CD integration

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install vitest @testing-library/react
```

### 2. Basic AI Test

```typescript
import { AITester } from '@/lib/ai-testing/tester'

describe('AI Chat System', () => {
  const tester = new AITester()

  test('answers question correctly', async () => {
    const response = await tester.testPrompt({
      prompt: 'What is 2+2?',
      expectedKeywords: ['4', 'four'],
      maxTokens: 100
    })

    expect(response.containsKeywords).toBe(true)
    expect(response.tokenCount).toBeLessThan(100)
  })
})
```

## 💡 Testing Strategies

### 1. Prompt Testing

```typescript
// Test prompt variations
const results = await tester.testPromptVariations({
  basePrompt: 'Explain {topic}',
  variations: [
    { topic: 'React' },
    { topic: 'Python' },
    { topic: 'SQL' }
  ],
  assertions: {
    minLength: 100,
    maxLength: 500,
    mustInclude: ['example']
  }
})
```

### 2. Output Validation

```typescript
// Validate AI output structure
const result = await tester.validateOutput({
  prompt: 'Generate JSON for user',
  validators: [
    tester.validators.isJSON(),
    tester.validators.hasFields(['name', 'email']),
    tester.validators.matchesSchema(userSchema)
  ]
})

expect(result.isValid).toBe(true)
```

### 3. Regression Testing

```typescript
// Test for regressions
const baseline = await tester.createBaseline({
  testCases: testSuite,
  model: 'gpt-4'
})

// After changes
const current = await tester.runTests(testSuite)

const regression = tester.compareResults(baseline, current)
expect(regression.degraded).toHaveLength(0)
```

### 4. Mock AI Responses

```typescript
// Mock for fast testing
tester.mockResponse('What is React?', {
  content: 'React is a JavaScript library',
  tokens: 50,
  latency: 100
})

const response = await aiService.ask('What is React?')
expect(response).toBe('React is a JavaScript library')
```

## 🎯 Advanced Features

### Automated Test Generation

```typescript
// Generate tests from examples
const tests = await tester.generateTests({
  examples: [
    { input: 'Hello', output: 'Hi there!' },
    { input: 'Bye', output: 'Goodbye!' }
  ],
  numVariations: 10
})

// Run generated tests
await tester.runTests(tests)
```

### Performance Testing

```typescript
// Load test AI system
const perfResults = await tester.loadTest({
  prompt: 'Test prompt',
  concurrency: 10,
  duration: 60000, // 1 minute
  rampUp: 5000 // 5 seconds
})

console.log(`Avg latency: ${perfResults.avgLatency}ms`)
console.log(`P95 latency: ${perfResults.p95Latency}ms`)
console.log(`Throughput: ${perfResults.throughput} req/s`)
console.log(`Error rate: ${perfResults.errorRate}%`)
```

### Cost Tracking

```typescript
// Track API costs during testing
const costTracker = tester.startCostTracking()

await runAllTests()

const costs = costTracker.stop()
console.log(`Total cost: $${costs.total}`)
console.log(`Tokens used: ${costs.tokens}`)
```

### Flakiness Detection

```typescript
// Detect flaky tests
const flaky = await tester.detectFlakiness({
  test: myAITest,
  iterations: 100
})

if (flaky.isFlaky) {
  console.log(`Test is flaky: ${flaky.successRate}% success rate`)
}
```

## 📚 API Reference

### AITester Class

#### `testPrompt(options)`

Test single prompt.

```typescript
interface PromptTestOptions {
  prompt: string
  expectedKeywords?: string[]
  expectedPattern?: RegExp
  maxTokens?: number
  maxLatency?: number
  model?: string
}
```

#### `testPromptVariations(options)`

Test multiple prompt variations.

#### `validateOutput(options)`

Validate AI output.

#### `createBaseline(options)`

Create baseline for regression testing.

#### `runTests(testSuite)`

Run test suite.

#### `loadTest(options)`

Performance/load testing.

#### `mockResponse(prompt, response)`

Mock AI response.

## 🔧 Built-in Validators

```typescript
// JSON validator
tester.validators.isJSON()

// Schema validator
tester.validators.matchesSchema(schema)

// Length validator
tester.validators.hasLength({ min: 10, max: 100 })

// Keyword validator
tester.validators.containsKeywords(['react', 'hooks'])

// Pattern validator
tester.validators.matchesPattern(/^[A-Z]/)

// Sentiment validator
tester.validators.hasSentiment('positive')

// Language validator
tester.validators.isLanguage('en')
```

## 🎓 Use Cases

### 1. Prompt Engineering

```typescript
// Test different prompts
const prompts = [
  'Explain React in simple terms',
  'What is React? Keep it simple.',
  'React explanation for beginners'
]

const results = await Promise.all(
  prompts.map(p => tester.testPrompt({
    prompt: p,
    assertions: {
      minLength: 50,
      maxLength: 200,
      readabilityScore: 'easy'
    }
  }))
)

const bestPrompt = results.reduce((best, curr) => 
  curr.score > best.score ? curr : best
)
```

### 2. Model Comparison

```typescript
// Compare models
const comparison = await tester.compareModels({
  models: ['gpt-4', 'gpt-3.5-turbo', 'claude-3'],
  testCases: testSuite
})

console.log('Best model:', comparison.bestModel)
console.log('Cheapest:', comparison.cheapest)
console.log('Fastest:', comparison.fastest)
```

### 3. CI/CD Integration

```typescript
// In your CI pipeline
describe('AI System Tests', () => {
  test('meets quality threshold', async () => {
    const results = await tester.runTests(testSuite)
    
    expect(results.passRate).toBeGreaterThan(0.95)
    expect(results.avgLatency).toBeLessThan(1000)
    expect(results.totalCost).toBeLessThan(1.00)
  })
})
```

## 📊 Test Reports

```typescript
// Generate test report
const report = await tester.generateReport({
  results: testResults,
  format: 'html', // or 'json', 'markdown'
  outputPath: './reports/ai-tests.html'
})

// Report includes:
// - Pass/fail rates
// - Performance metrics
// - Cost analysis
// - Flaky tests
// - Regression detection
```

## 🧪 Example Test Suite

```typescript
const testSuite = [
  {
    name: 'Basic Q&A',
    prompt: 'What is 2+2?',
    expectedKeywords: ['4', 'four'],
    maxLatency: 1000
  },
  {
    name: 'Code Generation',
    prompt: 'Write a React component',
    validators: [
      tester.validators.containsKeywords(['function', 'return']),
      tester.validators.isValidCode('javascript')
    ]
  },
  {
    name: 'JSON Output',
    prompt: 'Generate user JSON',
    validators: [
      tester.validators.isJSON(),
      tester.validators.hasFields(['name', 'email'])
    ]
  }
]

await tester.runTests(testSuite)
```

## 🤝 Related Boilerplates

- **rag-evaluation** - RAG metrics
- **ai-debugging** - Debugging tools
- **ai-service** - AI integration

---

**Created with ❤️ by [Indranil Banerjee](https://in.linkedin.com/in/askneelnow)**  
*Head of AI Transformation, INT TechShu*

© 2025 TechShu - Created by Indranil Banerjee

