# 📚 Course Management Boilerplate

Complete course management system for creating, editing, organizing courses with chapters, lessons, and student enrollment.

## ✨ Features

- ✅ **Course Creation** - Create courses
- ✅ **Chapter Management** - Organize chapters
- ✅ **Lesson Editor** - Edit lessons
- ✅ **Enrollment** - Manage students
- ✅ **Prerequisites** - Set requirements
- ✅ **Pricing** - Set course prices
- ✅ **Publishing** - Publish/unpublish
- ✅ **Analytics** - Track performance
- ✅ **Certificates** - Issue certificates
- ✅ **Reviews** - Student reviews

## 📦 Installation

```bash
npm install lucide-react date-fns
cp -r boilerplates/course-management/components ./src/components/courses
cp -r boilerplates/course-management/database ./database
```

## 🚀 Quick Start

```typescript
import { CourseManager } from '@/components/courses/CourseManager'

function CoursesPage() {
  return <CourseManager courses={courses} />
}
```

## 💡 Use Cases

### Create Course

```typescript
<CourseCreator
  onSave={async (course) => {
    await createCourse(course)
  }}
/>
```

### Manage Chapters

```typescript
<ChapterManager
  courseId={courseId}
  chapters={chapters}
  onReorder={handleReorder}
  onAdd={handleAdd}
  onDelete={handleDelete}
/>
```

---

**Need help?** Check the examples folder for complete implementations.

