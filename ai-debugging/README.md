# 🐛 AI Debugging Boilerplate

Comprehensive debugging tools for AI/LLM applications with prompt tracing, token analysis, and performance profiling.

## 📋 What's Included

- ✅ Prompt tracing and logging
- ✅ Token usage analysis
- ✅ Latency profiling
- ✅ Error tracking
- ✅ Response inspection
- ✅ Cost monitoring
- ✅ Debug dashboard
- ✅ Replay functionality

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install winston pino
```

### 2. Basic Debugging

```typescript
import { AIDebugger } from '@/lib/ai-debugging/debugger'

const debugger = new AIDebugger({
  enabled: process.env.NODE_ENV === 'development',
  logLevel: 'debug'
})

// Wrap AI calls
const response = await debugger.trace('chat-completion', async () => {
  return await aiService.chat(messages)
})

// View debug info
console.log(debugger.getLastTrace())
```

## 💡 Debugging Features

### 1. Prompt Tracing

```typescript
// Trace prompt execution
const trace = await debugger.tracePrompt({
  name: 'user-question',
  prompt: 'What is React?',
  model: 'gpt-4',
  execute: async (prompt) => {
    return await aiService.ask(prompt)
  }
})

console.log(trace.input) // Original prompt
console.log(trace.output) // AI response
console.log(trace.tokens) // Token usage
console.log(trace.latency) // Response time
console.log(trace.cost) // API cost
```

### 2. Token Analysis

```typescript
// Analyze token usage
const analysis = debugger.analyzeTokens({
  prompt: longPrompt,
  response: aiResponse,
  model: 'gpt-4'
})

console.log(`Prompt tokens: ${analysis.promptTokens}`)
console.log(`Response tokens: ${analysis.responseTokens}`)
console.log(`Total tokens: ${analysis.totalTokens}`)
console.log(`Cost: $${analysis.cost}`)
console.log(`% of context window: ${analysis.contextUsage}%`)
```

### 3. Latency Profiling

```typescript
// Profile AI call latency
const profile = await debugger.profile('rag-query', async () => {
  const embedding = await generateEmbedding(query) // Step 1
  const contexts = await retrieveContexts(embedding) // Step 2
  const answer = await generateAnswer(query, contexts) // Step 3
  return answer
})

console.log(profile.steps)
// [
//   { name: 'generateEmbedding', duration: 50ms },
//   { name: 'retrieveContexts', duration: 100ms },
//   { name: 'generateAnswer', duration: 800ms }
// ]
console.log(`Total: ${profile.totalDuration}ms`)
```

### 4. Error Tracking

```typescript
// Track AI errors
debugger.onError((error) => {
  console.error('AI Error:', {
    type: error.type,
    message: error.message,
    prompt: error.prompt,
    model: error.model,
    timestamp: error.timestamp
  })
})

try {
  await aiService.chat(messages)
} catch (error) {
  debugger.logError(error, { context: 'chat-completion' })
}
```

## 🎯 Advanced Features

### Response Inspection

```typescript
// Inspect AI response
const inspection = debugger.inspectResponse(response)

console.log(inspection.sentiment) // positive/negative/neutral
console.log(inspection.toxicity) // 0-1 score
console.log(inspection.language) // detected language
console.log(inspection.readability) // readability score
console.log(inspection.factuality) // fact-check score
```

### Cost Monitoring

```typescript
// Monitor costs in real-time
const monitor = debugger.startCostMonitor()

// Run AI operations
await runAIWorkflow()

const costs = monitor.stop()
console.log(`Total cost: $${costs.total}`)
console.log(`By model:`, costs.byModel)
console.log(`By operation:`, costs.byOperation)
console.log(`Hourly rate: $${costs.hourlyRate}`)
```

### Replay Functionality

```typescript
// Save trace for replay
await debugger.saveTrace('trace-123', trace)

// Replay later
const replayResult = await debugger.replay('trace-123', {
  modifyPrompt: (prompt) => prompt + ' Be concise.',
  modifyModel: 'gpt-3.5-turbo'
})

// Compare results
const comparison = debugger.compare(trace, replayResult)
```

### Debug Dashboard

```typescript
// Start debug dashboard
debugger.startDashboard({
  port: 3001,
  auth: { username: 'admin', password: 'secret' }
})

// Access at http://localhost:3001
// View:
// - Live traces
// - Token usage
// - Cost analytics
// - Error logs
// - Performance metrics
```

## 📚 API Reference

### AIDebugger Class

#### `trace(name, fn)`

Trace function execution.

```typescript
interface TraceResult {
  name: string
  input: any
  output: any
  duration: number
  tokens: number
  cost: number
  timestamp: Date
}
```

#### `tracePrompt(options)`

Trace prompt execution.

#### `analyzeTokens(options)`

Analyze token usage.

#### `profile(name, fn)`

Profile performance.

#### `inspectResponse(response)`

Inspect AI response.

#### `logError(error, context)`

Log AI error.

#### `startCostMonitor()`

Start cost monitoring.

#### `replay(traceId, options)`

Replay saved trace.

## 🔧 Configuration

```typescript
// config/debug-config.ts
export const DEBUG_CONFIG = {
  enabled: process.env.NODE_ENV !== 'production',
  logLevel: 'debug',
  saveTraces: true,
  maxTraces: 1000,
  dashboard: {
    enabled: true,
    port: 3001
  },
  alerts: {
    highCost: 1.00, // Alert if cost > $1
    highLatency: 5000, // Alert if latency > 5s
    errorRate: 0.05 // Alert if error rate > 5%
  }
}
```

## 🎓 Use Cases

### 1. Debug Slow Responses

```typescript
// Find bottlenecks
const profile = await debugger.profile('slow-query', async () => {
  return await ragSystem.query(question)
})

// Identify slow step
const slowest = profile.steps.reduce((max, step) => 
  step.duration > max.duration ? step : max
)

console.log(`Bottleneck: ${slowest.name} (${slowest.duration}ms)`)
```

### 2. Debug High Costs

```typescript
// Track expensive operations
const monitor = debugger.startCostMonitor()

await runDailyJobs()

const costs = monitor.stop()

// Find most expensive
const expensive = Object.entries(costs.byOperation)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 5)

console.log('Most expensive operations:', expensive)
```

### 3. Debug Poor Quality

```typescript
// Inspect low-quality responses
const response = await aiService.ask(question)

const inspection = debugger.inspectResponse(response)

if (inspection.factuality < 0.7) {
  console.log('Low factuality detected!')
  console.log('Prompt:', question)
  console.log('Response:', response)
  console.log('Contexts:', contexts)
}
```

### 4. Debug Errors

```typescript
// Track error patterns
debugger.onError((error) => {
  if (error.type === 'rate_limit') {
    console.log('Rate limit hit, implementing backoff...')
  } else if (error.type === 'context_length') {
    console.log('Context too long, need chunking...')
  }
})
```

## 📊 Debug Dashboard Features

- **Live Traces**: See AI calls in real-time
- **Token Usage**: Track token consumption
- **Cost Analytics**: Monitor spending
- **Error Logs**: View all errors
- **Performance**: Latency charts
- **Replay**: Replay past traces
- **Alerts**: Get notified of issues

## 🧪 Example Debug Session

```typescript
// Start debugging session
const session = debugger.startSession('user-123')

// Run AI operations
await aiService.chat(messages)
await ragSystem.query(question)
await aiService.generateNotes(content)

// End session
const report = session.end()

console.log(`Session duration: ${report.duration}ms`)
console.log(`Total calls: ${report.totalCalls}`)
console.log(`Total tokens: ${report.totalTokens}`)
console.log(`Total cost: $${report.totalCost}`)
console.log(`Errors: ${report.errors.length}`)
```

## 🚨 Alerts

```typescript
// Configure alerts
debugger.configureAlerts({
  highCost: {
    threshold: 1.00,
    action: (cost) => {
      sendEmail(`High cost alert: $${cost}`)
    }
  },
  highLatency: {
    threshold: 5000,
    action: (latency) => {
      console.warn(`Slow response: ${latency}ms`)
    }
  },
  errorRate: {
    threshold: 0.05,
    window: 3600000, // 1 hour
    action: (rate) => {
      sendSlack(`Error rate: ${rate * 100}%`)
    }
  }
})
```

## 🤝 Related Boilerplates

- **ai-testing** - Testing framework
- **rag-evaluation** - Evaluation metrics
- **ai-service** - AI integration

---

**Created with ❤️ by [Indranil Banerjee](https://in.linkedin.com/in/askneelnow)**  
*Head of AI Transformation, INT TechShu*

© 2025 TechShu - Created by Indranil Banerjee

