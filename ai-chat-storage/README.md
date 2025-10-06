# 💬 AI Chat Storage Boilerplate

An optimized chat session storage system designed for AI chat applications. Manages conversation history, automatic cleanup, and minimal storage footprint with intelligent session management.

## ✨ Features

- ✅ **Session Management** - Create and manage chat sessions
- ✅ **Message History** - Store conversation history
- ✅ **Automatic Cleanup** - Remove old sessions (24h default)
- ✅ **Storage Optimization** - Limits messages per session (50 max)
- ✅ **Temporary Sessions** - In-memory sessions until saved
- ✅ **Session Index** - Quick access to all sessions
- ✅ **Storage Analytics** - Track usage and limits
- ✅ **Welcome Messages** - Auto-generated welcome messages
- ✅ **TypeScript** - Full type safety
- ✅ **Zero Dependencies** - Uses native sessionStorage

## 📦 Installation

### 1. Copy Files

```bash
cp -r boilerplates/ai-chat-storage/lib ./src/lib/storage
```

### 2. Import and Use

```typescript
import { aiChatStorage } from '@/lib/storage/ai-chat-storage'
```

## 🚀 Quick Start

### Create Chat Session

```typescript
import { aiChatStorage } from '@/lib/storage/ai-chat-storage'

// Create or get existing session
const session = aiChatStorage.getOrCreateSession(
  'course-123',      // courseId
  'chapter-456',     // chapterId
  'Introduction to React'  // chapterTitle
)

console.log(session.messages) // Includes welcome message
```

### Add Messages

```typescript
// Add user message
const userMessage = aiChatStorage.addMessage(session.id, {
  role: 'user',
  content: 'What is React?'
})

// Add AI response
const aiMessage = aiChatStorage.addMessage(session.id, {
  role: 'assistant',
  content: 'React is a JavaScript library for building user interfaces...'
})
```

### Save Session

```typescript
// Sessions are temporary until saved
const saved = aiChatStorage.saveCurrentSession(session.id)

if (saved) {
  console.log('Session saved successfully!')
}
```

### Get All Sessions

```typescript
// Get session summaries
const sessions = aiChatStorage.getAllSessionSummaries()

sessions.forEach(session => {
  console.log(`${session.chapterTitle}: ${session.messageCount} messages`)
})
```

## 📝 Complete Example

```typescript
import { aiChatStorage } from '@/lib/storage/ai-chat-storage'

// 1. Create session
const session = aiChatStorage.getOrCreateSession(
  'course-react-101',
  'chapter-1',
  'Getting Started with React'
)

// 2. Add conversation
aiChatStorage.addMessage(session.id, {
  role: 'user',
  content: 'How do I create a React component?'
})

aiChatStorage.addMessage(session.id, {
  role: 'assistant',
  content: 'You can create a React component using a function...'
})

// 3. Save session
aiChatStorage.saveCurrentSession(session.id)

// 4. Later, retrieve session
const savedSession = aiChatStorage.getSession(session.id)
console.log(savedSession.messages)

// 5. Clear conversation
aiChatStorage.clearSession(session.id)

// 6. Delete session
aiChatStorage.deleteSession(session.id)
```

## 📊 API Reference

### getOrCreateSession(courseId, chapterId, chapterTitle)

Get existing or create new chat session.

```typescript
const session = aiChatStorage.getOrCreateSession(
  'course-123',
  'chapter-456',
  'Chapter Title'
)
```

### addMessage(sessionId, message)

Add message to session (not auto-saved).

```typescript
const message = aiChatStorage.addMessage(sessionId, {
  role: 'user' | 'assistant' | 'system',
  content: 'Message content',
  attachments?: [{ name, type, size, url }]
})
```

### saveCurrentSession(sessionId)

Manually save session to storage.

```typescript
const saved = aiChatStorage.saveCurrentSession(sessionId)
```

### getSession(sessionId)

Get session by ID.

```typescript
const session = aiChatStorage.getSession(sessionId)
```

### getAllSessionSummaries()

Get all session summaries.

```typescript
const summaries = aiChatStorage.getAllSessionSummaries()
// Returns: ChatSessionSummary[]
```

### clearSession(sessionId)

Clear all messages except welcome message.

```typescript
aiChatStorage.clearSession(sessionId)
```

### deleteSession(sessionId)

Delete session completely.

```typescript
aiChatStorage.deleteSession(sessionId)
```

### clearAllSessions()

Delete all sessions.

```typescript
aiChatStorage.clearAllSessions()
```

### getStorageStats()

Get storage usage statistics.

```typescript
const stats = aiChatStorage.getStorageStats()
// {
//   totalSessions: 5,
//   totalMessages: 150,
//   storageUsed: 50000,
//   storageLimit: 5242880
// }
```

## 🎯 Use Cases

### 1. AI Tutor Chat

```typescript
// Create tutor session
const session = aiChatStorage.getOrCreateSession(
  courseId,
  chapterId,
  'AI Tutor Session'
)

// Student asks question
aiChatStorage.addMessage(session.id, {
  role: 'user',
  content: 'Can you explain this concept?'
})

// AI responds
aiChatStorage.addMessage(session.id, {
  role: 'assistant',
  content: 'Sure! Let me explain...'
})

// Save important conversations
aiChatStorage.saveCurrentSession(session.id)
```

### 2. Course Q&A

```typescript
// Get or create Q&A session for chapter
const qaSession = aiChatStorage.getOrCreateSession(
  courseId,
  chapterId,
  `Q&A: ${chapterTitle}`
)

// Add Q&A pairs
aiChatStorage.addMessage(qaSession.id, {
  role: 'user',
  content: 'What are the prerequisites?'
})

aiChatStorage.addMessage(qaSession.id, {
  role: 'assistant',
  content: 'The prerequisites are...'
})
```

### 3. Session History

```typescript
// Get all user's chat sessions
const sessions = aiChatStorage.getAllSessionSummaries()

// Display in UI
sessions.forEach(session => {
  console.log(`
    Chapter: ${session.chapterTitle}
    Messages: ${session.messageCount}
    Last Active: ${session.lastActivity}
    Preview: ${session.preview}
  `)
})
```

### 4. Export Conversation

```typescript
// Get session
const session = aiChatStorage.getSession(sessionId)

// Export as JSON
const exportData = JSON.stringify(session, null, 2)
const blob = new Blob([exportData], { type: 'application/json' })
const url = URL.createObjectURL(blob)

// Download
const link = document.createElement('a')
link.href = url
link.download = `chat-${session.chapterTitle}.json`
link.click()
```

## 🔧 Configuration

### Limits

```typescript
// In ai-chat-storage.ts
private readonly MAX_SESSIONS = 10              // Max sessions
private readonly MAX_MESSAGES_PER_SESSION = 50  // Max messages
private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000  // 24 hours
```

### Custom Welcome Message

```typescript
// Modify in createTempSession()
const welcomeMessage: ChatMessage = {
  id: 'welcome_' + Date.now(),
  role: 'assistant',
  content: 'Your custom welcome message here!',
  timestamp: new Date()
}
```

## 💡 Best Practices

1. **Save Important Conversations** - Don't auto-save everything
2. **Regular Cleanup** - Remove old sessions periodically
3. **Limit Message Length** - Keep messages concise
4. **Monitor Storage** - Check storage stats regularly
5. **Handle Errors** - Always try/catch storage operations
6. **Validate Data** - Check session exists before operations

## 🔒 Security Considerations

1. **No Sensitive Data** - Don't store passwords or tokens
2. **User Privacy** - Clear sessions on logout
3. **Data Validation** - Validate message content
4. **XSS Prevention** - Sanitize message content before display
5. **Storage Limits** - Respect browser storage limits

## 📈 Performance Tips

1. **Lazy Loading** - Load sessions on demand
2. **Pagination** - Paginate message history
3. **Compression** - Compress large messages
4. **Debounce Saves** - Don't save on every message
5. **Background Cleanup** - Clean up in background

## 🐛 Troubleshooting

**Issue**: "Session not found"
- **Solution**: Check sessionId format, ensure session was created

**Issue**: "Storage quota exceeded"
- **Solution**: Run cleanup, reduce MAX_MESSAGES_PER_SESSION

**Issue**: Messages not persisting
- **Solution**: Call saveCurrentSession() to persist

**Issue**: Old sessions not cleaning up
- **Solution**: Check SESSION_TIMEOUT, run cleanup manually

## 🧪 Testing

```typescript
describe('AIChatStorage', () => {
  beforeEach(() => {
    aiChatStorage.clearAllSessions()
  })

  test('creates session', () => {
    const session = aiChatStorage.getOrCreateSession(
      'course-1',
      'chapter-1',
      'Test Chapter'
    )
    
    expect(session.id).toBe('course-1_chapter-1')
    expect(session.messages.length).toBe(1) // Welcome message
  })

  test('adds messages', () => {
    const session = aiChatStorage.getOrCreateSession(
      'course-1',
      'chapter-1',
      'Test'
    )
    
    aiChatStorage.addMessage(session.id, {
      role: 'user',
      content: 'Test message'
    })
    
    const updated = aiChatStorage.getSession(session.id)
    expect(updated.messages.length).toBe(2)
  })

  test('saves session', () => {
    const session = aiChatStorage.getOrCreateSession(
      'course-1',
      'chapter-1',
      'Test'
    )
    
    const saved = aiChatStorage.saveCurrentSession(session.id)
    expect(saved).toBe(true)
  })
})
```

## 📚 Examples

### React Component Example

```typescript
import { useState, useEffect } from 'react'
import { aiChatStorage } from '@/lib/storage/ai-chat-storage'

function ChatComponent({ courseId, chapterId, chapterTitle }) {
  const [session, setSession] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Load or create session
    const chatSession = aiChatStorage.getOrCreateSession(
      courseId,
      chapterId,
      chapterTitle
    )
    setSession(chatSession)
  }, [courseId, chapterId])

  const sendMessage = () => {
    if (!message.trim() || !session) return

    // Add user message
    aiChatStorage.addMessage(session.id, {
      role: 'user',
      content: message
    })

    // Get AI response (your AI logic here)
    const aiResponse = getAIResponse(message)
    
    aiChatStorage.addMessage(session.id, {
      role: 'assistant',
      content: aiResponse
    })

    // Update UI
    const updated = aiChatStorage.getSession(session.id)
    setSession(updated)
    setMessage('')
  }

  const saveChat = () => {
    aiChatStorage.saveCurrentSession(session.id)
    alert('Chat saved!')
  }

  return (
    <div>
      <div className="messages">
        {session?.messages.map(msg => (
          <div key={msg.id} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>
      
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      
      <button onClick={sendMessage}>Send</button>
      <button onClick={saveChat}>Save Chat</button>
    </div>
  )
}
```

## 🔄 Migration Guide

### From localStorage

```typescript
// Before
const messages = JSON.parse(localStorage.getItem('chat') || '[]')
messages.push(newMessage)
localStorage.setItem('chat', JSON.stringify(messages))

// After
const session = aiChatStorage.getOrCreateSession(courseId, chapterId, title)
aiChatStorage.addMessage(session.id, newMessage)
aiChatStorage.saveCurrentSession(session.id)
```

## 📖 Resources

- [sessionStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
- [Chat UI Best Practices](https://www.nngroup.com/articles/chat-ui/)

---

**Need help?** Check the examples folder for complete implementations.

