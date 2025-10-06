# 🎤 Voice AI Integration Boilerplate

Voice AI integration with VAPI for voice interactions, speech-to-text, and text-to-speech capabilities.

## ✨ Features

- ✅ **Voice Chat** - Voice conversations
- ✅ **Speech-to-Text** - Convert speech to text
- ✅ **Text-to-Speech** - Convert text to speech
- ✅ **Voice Commands** - Voice control
- ✅ **Multi-language** - Multiple languages
- ✅ **Real-time** - Live transcription
- ✅ **Voice Profiles** - Custom voices
- ✅ **Noise Cancellation** - Clear audio
- ✅ **Recording** - Save conversations
- ✅ **Playback** - Replay conversations

## 📦 Installation

```bash
npm install @vapi-ai/web lucide-react
cp -r boilerplates/voice-ai/lib ./src/lib/voice
cp -r boilerplates/voice-ai/components ./src/components/voice
```

## 🚀 Quick Start

```typescript
import { VoiceChat } from '@/components/voice/VoiceChat'

function VoicePage() {
  return (
    <VoiceChat
      apiKey={process.env.VAPI_API_KEY}
      onTranscript={handleTranscript}
    />
  )
}
```

## 💡 Use Cases

### Voice Tutor

```typescript
<VoiceChat
  systemPrompt="You are a helpful tutor."
  context={courseContent}
  onMessage={handleVoiceMessage}
/>
```

---

**Need help?** Check the examples folder for complete implementations.

