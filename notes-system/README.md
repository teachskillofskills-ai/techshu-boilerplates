# 📝 Notes System Boilerplate

Complete note-taking system for students to create, organize, and manage study notes.

## ✨ Features

- ✅ **Create Notes** - Rich text notes
- ✅ **Organize** - Folders and tags
- ✅ **Search** - Find notes quickly
- ✅ **Markdown Support** - Markdown editing
- ✅ **Attachments** - Attach files
- ✅ **Sharing** - Share notes
- ✅ **Collaboration** - Collaborative notes
- ✅ **Export** - Export to PDF/markdown
- ✅ **Templates** - Note templates
- ✅ **Sync** - Cloud sync

## 📦 Installation

```bash
npm install @tiptap/react lucide-react
cp -r boilerplates/notes-system/components ./src/components/notes
cp -r boilerplates/notes-system/database ./database
```

## 🚀 Quick Start

```typescript
import { NotesManager } from '@/components/notes/NotesManager'

function NotesPage() {
  return (
    <NotesManager
      userId={userId}
      courseId={courseId}
    />
  )
}
```

## 💡 Use Cases

### Course Notes

```typescript
<NotesManager
  userId={userId}
  courseId={courseId}
  chapterId={chapterId}
  onSave={handleSave}
/>
```

### Study Notes

```typescript
<NoteEditor
  note={note}
  onChange={handleChange}
  onSave={handleSave}
  templates={noteTemplates}
/>
```

---

**Need help?** Check the examples folder for complete implementations.

