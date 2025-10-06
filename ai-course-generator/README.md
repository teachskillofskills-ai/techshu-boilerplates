# 🎓 AI Course Generator Boilerplate

AI-powered course generation system that creates complete courses with chapters, content, quizzes, and assignments from a topic description.

## ✨ Features

- ✅ **Course Generation** - Generate complete courses
- ✅ **Chapter Creation** - Auto-generate chapters
- ✅ **Content Writing** - AI-written content
- ✅ **Quiz Generation** - Auto-create quizzes
- ✅ **Assignment Creation** - Generate assignments
- ✅ **Learning Objectives** - Define objectives
- ✅ **Prerequisites** - Identify prerequisites
- ✅ **Difficulty Levels** - Beginner to advanced
- ✅ **Templates** - Course templates
- ✅ **Customization** - Edit generated content

## 📦 Installation

```bash
npm install openai
cp -r boilerplates/ai-course-generator/lib ./src/lib/ai
```

## 🚀 Quick Start

```typescript
import { CourseGenerator } from '@/lib/ai/course-generator'

const generator = new CourseGenerator()

const course = await generator.generateCourse({
  topic: 'Introduction to React',
  difficulty: 'beginner',
  duration: '4 weeks',
  targetAudience: 'Web developers'
})

console.log(course)
// {
//   title: 'Introduction to React',
//   description: '...',
//   chapters: [...],
//   quizzes: [...],
//   assignments: [...]
// }
```

## 📚 API Reference

### generateCourse(options)

```typescript
const course = await generator.generateCourse({
  topic: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  duration: string,
  targetAudience: string,
  chapterCount?: number,
  includeQuizzes?: boolean,
  includeAssignments?: boolean
})
```

### generateChapter(topic, context)

```typescript
const chapter = await generator.generateChapter(
  'React Hooks',
  'Introduction to React course'
)
```

### generateQuiz(chapterContent)

```typescript
const quiz = await generator.generateQuiz(chapterContent, {
  questionCount: 10,
  difficulty: 'medium'
})
```

## 💡 Use Cases

### 1. Quick Course Creation

```typescript
const course = await generator.generateCourse({
  topic: 'Python for Data Science',
  difficulty: 'intermediate',
  duration: '8 weeks',
  targetAudience: 'Data analysts',
  chapterCount: 12
})

await saveCourse(course)
```

### 2. Chapter Expansion

```typescript
const newChapter = await generator.generateChapter(
  'Advanced React Patterns',
  existingCourse.description
)

await addChapterToCourse(courseId, newChapter)
```

### 3. Quiz Generation

```typescript
const quiz = await generator.generateQuiz(chapterContent, {
  questionCount: 15,
  difficulty: 'hard',
  includeExplanations: true
})
```

---

**Need help?** Check the examples folder for complete implementations.

