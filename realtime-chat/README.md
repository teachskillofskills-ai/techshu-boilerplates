# 💬 Real-time Chat Boilerplate

Real-time chat system with Supabase Realtime for instant messaging and collaboration.

## ✨ Features

- ✅ **Real-time Messages** - Instant messaging
- ✅ **Typing Indicators** - See who's typing
- ✅ **Read Receipts** - Message read status
- ✅ **File Sharing** - Share files
- ✅ **Emoji Support** - Reactions
- ✅ **Message Search** - Find messages
- ✅ **User Presence** - Online/offline status
- ✅ **Group Chat** - Multiple users
- ✅ **Direct Messages** - 1-on-1 chat
- ✅ **Message History** - Load history

## 📦 Installation

```bash
npm install @supabase/supabase-js lucide-react
cp -r boilerplates/realtime-chat/components ./src/components/chat
cp -r boilerplates/realtime-chat/lib ./src/lib/chat
```

## 🚀 Quick Start

```typescript
import { RealtimeChat } from '@/components/chat/RealtimeChat'

function ChatPage() {
  return (
    <RealtimeChat
      roomId={roomId}
      userId={userId}
    />
  )
}
```

## 💡 Use Cases

### Course Discussion

```typescript
<RealtimeChat
  roomId={`course-${courseId}`}
  userId={userId}
  title="Course Discussion"
/>
```

---

**Need help?** Check the examples folder for complete implementations.

