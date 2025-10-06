# 📝 AI Notes Generator Boilerplate

AI-powered study notes generator that creates summaries, bullet points, flashcards, and study guides from course content.

## ✨ Features

- ✅ **Summary Generation** - Create concise summaries
- ✅ **Bullet Points** - Key points extraction
- ✅ **Flashcards** - Generate flashcards
- ✅ **Study Guides** - Comprehensive guides
- ✅ **Mind Maps** - Visual learning aids
- ✅ **Practice Questions** - Test preparation
- ✅ **Multiple Formats** - PDF, markdown, HTML
- ✅ **Customization** - Adjust detail level
- ✅ **Multi-language** - Support multiple languages
- ✅ **Export** - Download notes

## 📦 Installation

```bash
npm install openai
cp -r boilerplates/ai-notes-generator/lib ./src/lib/ai
```

## 🚀 Quick Start

```typescript
import { NotesGenerator } from '@/lib/ai/notes-generator'

const generator = new NotesGenerator()

const notes = await generator.generateNotes({
  content: chapterContent,
  type: 'summary',
  detailLevel: 'medium'
})

console.log(notes)
```

## 📚 Note Types

### 1. Summary

```typescript
const summary = await generator.generateNotes({
  content: chapterContent,
  type: 'summary',
  detailLevel: 'brief' // 'brief' | 'medium' | 'detailed'
})
```

### 2. Bullet Points

```typescript
const bulletPoints = await generator.generateNotes({
  content: chapterContent,
  type: 'bullets',
  maxPoints: 10
})
```

### 3. Flashcards

```typescript
const flashcards = await generator.generateFlashcards({
  content: chapterContent,
  count: 20
})
// Returns: [{ front: 'Question', back: 'Answer' }, ...]
```

### 4. Study Guide

```typescript
const studyGuide = await generator.generateStudyGuide({
  content: chapterContent,
  includeQuestions: true,
  includeExamples: true
})
```

## 💡 Use Cases

### 1. Chapter Notes

```typescript
const notes = await generator.generateNotes({
  content: chapter.content,
  type: 'summary',
  detailLevel: 'medium'
})

await saveNotes(chapterId, notes)
```

### 2. Exam Preparation

```typescript
const studyMaterial = await generator.generateStudyGuide({
  content: courseContent,
  includeQuestions: true,
  includeExamples: true,
  difficulty: 'exam-level'
})
```

### 3. Quick Review

```typescript
const quickNotes = await generator.generateNotes({
  content: chapterContent,
  type: 'bullets',
  maxPoints: 5
})
```

---

**Need help?** Check the examples folder for complete implementations.

