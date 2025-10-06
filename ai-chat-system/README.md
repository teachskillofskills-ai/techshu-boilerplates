# 💬 AI Chat System Boilerplate

Complete AI-powered chat system with conversation management, context awareness, and streaming responses.

## ✨ Features

- ✅ **AI Chat Interface** - Beautiful chat UI
- ✅ **Streaming Responses** - Real-time AI responses
- ✅ **Context Awareness** - Maintains context
- ✅ **Conversation History** - Save conversations
- ✅ **Multi-turn Conversations** - Natural dialogue
- ✅ **Code Highlighting** - Syntax highlighting
- ✅ **Markdown Support** - Rich formatting
- ✅ **File Attachments** - Attach files
- ✅ **Voice Input** - Speech-to-text
- ✅ **Export Chat** - Download conversations

## 📦 Installation

```bash
npm install openai lucide-react
cp -r boilerplates/ai-chat-system/components ./src/components/chat
cp -r boilerplates/ai-chat-system/lib ./src/lib/chat
```

## 🚀 Quick Start

```typescript
import { AIChatInterface } from '@/components/chat/AIChatInterface'

function ChatPage() {
  return (
    <AIChatInterface
      context="course content"
      onMessage={handleMessage}
    />
  )
}
```

## 💡 Use Cases

### Course Q&A

```typescript
<AIChatInterface
  context={courseContent}
  systemPrompt="You are a helpful tutor for this course."
  placeholder="Ask a question about the course..."
/>
```

### AI Tutor

```typescript
<AIChatInterface
  context={chapterContent}
  conversationHistory={history}
  onMessage={async (message) => {
    const response = await getAIResponse(message)
    return response
  }}
/>
```

---

**Need help?** Check the examples folder for complete implementations.

