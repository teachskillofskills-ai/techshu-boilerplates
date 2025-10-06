# 📄 Content Management Boilerplate

Complete content management system for creating, editing, organizing, and publishing content with version control and media management.

## ✨ Features

- ✅ **Content Editor** - Rich text editing
- ✅ **Media Library** - Manage images/videos
- ✅ **Version Control** - Track changes
- ✅ **Publishing** - Draft/publish workflow
- ✅ **Categories** - Organize content
- ✅ **Tags** - Tag content
- ✅ **Search** - Find content quickly
- ✅ **Permissions** - Role-based access
- ✅ **SEO** - Meta tags, slugs
- ✅ **Scheduling** - Schedule publishing

## 📦 Installation

```bash
npm install @tiptap/react lucide-react
cp -r boilerplates/content-management/components ./src/components/content
```

## 🚀 Quick Start

```typescript
import { ContentManager } from '@/components/content/ContentManager'

function ContentPage() {
  return (
    <ContentManager
      onSave={handleSave}
      onPublish={handlePublish}
    />
  )
}
```

## 💡 Use Cases

### Create Content

```typescript
<ContentEditor
  content={content}
  onChange={setContent}
  onSave={handleSave}
  status="draft"
/>
```

### Manage Media

```typescript
<MediaLibrary
  onSelect={handleMediaSelect}
  onUpload={handleUpload}
  onDelete={handleDelete}
/>
```

---

**Need help?** Check the examples folder for complete implementations.

