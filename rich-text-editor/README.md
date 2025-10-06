# ✍️ Rich Text Editor Boilerplate

A powerful TipTap-based rich text editor with AI assistance, media support, templates, and markdown compatibility. Perfect for content creation and course materials.

## ✨ Features

- ✅ **Rich Formatting** - Bold, italic, underline, strikethrough
- ✅ **Headings** - H1-H6 support
- ✅ **Lists** - Bullet and numbered lists
- ✅ **Links** - Insert and edit links
- ✅ **Images** - Upload and embed images
- ✅ **Videos** - Embed YouTube, Vimeo videos
- ✅ **Code Blocks** - Syntax highlighting
- ✅ **Tables** - Create and edit tables
- ✅ **Markdown** - Import/export markdown
- ✅ **AI Assistance** - AI-powered writing help
- ✅ **Templates** - Pre-built content templates
- ✅ **Auto-save** - Automatic content saving
- ✅ **Collaboration** - Real-time collaboration (optional)
- ✅ **Mobile Friendly** - Touch-optimized

## 📦 Installation

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-table @tiptap/extension-code-block-lowlight lowlight
```

```bash
cp -r boilerplates/rich-text-editor/components ./src/components/editor
cp -r boilerplates/rich-text-editor/extensions ./src/components/editor/extensions
```

## 🚀 Quick Start

### Basic Editor

```typescript
import { RichContentEditor } from '@/components/editor/RichContentEditor'

function ContentPage() {
  const [content, setContent] = useState('')

  return (
    <RichContentEditor
      content={content}
      onChange={setContent}
      placeholder="Start writing..."
    />
  )
}
```

### With AI Assistance

```typescript
import { EnhancedRichContentEditor } from '@/components/editor/EnhancedRichContentEditor'

function CourseEditor() {
  return (
    <EnhancedRichContentEditor
      content={content}
      onChange={setContent}
      enableAI={true}
      aiContext="course content"
    />
  )
}
```

## 🎨 Features in Detail

### 1. Text Formatting

```typescript
// Bold, italic, underline
editor.chain().focus().toggleBold().run()
editor.chain().focus().toggleItalic().run()
editor.chain().focus().toggleUnderline().run()

// Headings
editor.chain().focus().toggleHeading({ level: 1 }).run()
editor.chain().focus().toggleHeading({ level: 2 }).run()
```

### 2. Lists

```typescript
// Bullet list
editor.chain().focus().toggleBulletList().run()

// Numbered list
editor.chain().focus().toggleOrderedList().run()

// Task list
editor.chain().focus().toggleTaskList().run()
```

### 3. Media

```typescript
// Insert image
editor.chain().focus().setImage({ src: imageUrl }).run()

// Insert video
editor.chain().focus().setYoutubeVideo({ src: videoUrl }).run()
```

### 4. Code Blocks

```typescript
// Insert code block
editor.chain().focus().toggleCodeBlock().run()

// With language
editor.chain().focus().setCodeBlock({ language: 'javascript' }).run()
```

### 5. Tables

```typescript
// Insert table
editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()

// Add row
editor.chain().focus().addRowAfter().run()

// Add column
editor.chain().focus().addColumnAfter().run()
```

## 🔧 API Reference

### RichContentEditor Props

```typescript
interface RichContentEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  editable?: boolean
  className?: string
  onSave?: () => void
  autoSave?: boolean
  autoSaveInterval?: number
}
```

### EnhancedRichContentEditor Props

```typescript
interface EnhancedRichContentEditorProps extends RichContentEditorProps {
  enableAI?: boolean
  aiContext?: string
  templates?: Template[]
  onTemplateSelect?: (template: Template) => void
}
```

## 💡 Use Cases

### 1. Course Content Editor

```typescript
function CourseContentEditor() {
  const [content, setContent] = useState('')

  const handleSave = async () => {
    await saveCourseContent(courseId, content)
    toast.success('Content saved!')
  }

  return (
    <EnhancedRichContentEditor
      content={content}
      onChange={setContent}
      onSave={handleSave}
      autoSave={true}
      autoSaveInterval={30000} // 30 seconds
      enableAI={true}
      aiContext="educational content"
    />
  )
}
```

### 2. Blog Post Editor

```typescript
function BlogEditor() {
  return (
    <RichContentEditor
      content={post.content}
      onChange={(content) => updatePost({ content })}
      placeholder="Write your blog post..."
      templates={blogTemplates}
    />
  )
}
```

### 3. Assignment Editor

```typescript
function AssignmentEditor() {
  return (
    <RichContentEditor
      content={assignment.description}
      onChange={(content) => setAssignment({ ...assignment, description: content })}
      placeholder="Describe the assignment..."
    />
  )
}
```

## 🎨 Customization

### Custom Toolbar

```typescript
const customToolbar = [
  'bold', 'italic', 'underline',
  'heading1', 'heading2',
  'bulletList', 'orderedList',
  'link', 'image',
  'codeBlock'
]

<RichContentEditor
  content={content}
  onChange={setContent}
  toolbar={customToolbar}
/>
```

### Custom Styling

```typescript
<RichContentEditor
  content={content}
  onChange={setContent}
  className="min-h-[500px] border rounded-lg p-4"
  editorClassName="prose prose-lg max-w-none"
/>
```

## 🔒 Security Best Practices

1. **Sanitize HTML** - Always sanitize user-generated HTML
2. **XSS Prevention** - Use DOMPurify for sanitization
3. **File Upload** - Validate and scan uploaded files
4. **Content Validation** - Validate content before saving
5. **Rate Limiting** - Limit AI assistance requests

## 📈 Performance Tips

1. **Lazy Loading** - Load editor on demand
2. **Debounced Auto-save** - Debounce auto-save
3. **Image Optimization** - Compress images before upload
4. **Code Splitting** - Split editor extensions
5. **Virtual Scrolling** - For long documents

## 🐛 Troubleshooting

**Issue**: Editor not loading
- **Solution**: Check TipTap dependencies, ensure all extensions installed

**Issue**: Images not uploading
- **Solution**: Check upload endpoint, file size limits

**Issue**: Slow performance
- **Solution**: Reduce auto-save frequency, optimize images

**Issue**: Formatting lost on save
- **Solution**: Check HTML sanitization settings

## 📚 Examples

### Markdown Import/Export

```typescript
// Import markdown
const htmlContent = markdownToHtml(markdownContent)
editor.commands.setContent(htmlContent)

// Export markdown
const markdown = htmlToMarkdown(editor.getHTML())
```

### Templates

```typescript
const templates = [
  {
    id: 'lesson',
    name: 'Lesson Template',
    content: `
      <h1>Lesson Title</h1>
      <h2>Learning Objectives</h2>
      <ul><li>Objective 1</li></ul>
      <h2>Content</h2>
      <p>Lesson content here...</p>
    `
  },
  {
    id: 'assignment',
    name: 'Assignment Template',
    content: `
      <h1>Assignment Title</h1>
      <h2>Instructions</h2>
      <p>Instructions here...</p>
      <h2>Requirements</h2>
      <ul><li>Requirement 1</li></ul>
    `
  }
]

<EnhancedRichContentEditor
  templates={templates}
  onTemplateSelect={(template) => {
    editor.commands.setContent(template.content)
  }}
/>
```

## 🔄 Migration Guide

### From Quill

```typescript
// Before (Quill)
<ReactQuill value={content} onChange={setContent} />

// After (TipTap)
<RichContentEditor content={content} onChange={setContent} />
```

### From Draft.js

```typescript
// Before (Draft.js)
<Editor editorState={editorState} onChange={setEditorState} />

// After (TipTap)
<RichContentEditor content={content} onChange={setContent} />
```

## 📖 Resources

- [TipTap Documentation](https://tiptap.dev/)
- [TipTap Extensions](https://tiptap.dev/extensions)
- [Markdown Guide](https://www.markdownguide.org/)

---

**Need help?** Check the examples folder for complete implementations.

