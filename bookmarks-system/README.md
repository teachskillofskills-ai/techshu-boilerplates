# 🔖 Bookmarks System Boilerplate

Complete bookmarking system for saving and organizing favorite content, courses, and resources.

## ✨ Features

- ✅ **Save Bookmarks** - Bookmark content
- ✅ **Organize** - Folders and collections
- ✅ **Tags** - Tag bookmarks
- ✅ **Search** - Find bookmarks
- ✅ **Quick Access** - Fast access
- ✅ **Sharing** - Share bookmarks
- ✅ **Import/Export** - Backup bookmarks
- ✅ **Browser Extension** - Browser integration
- ✅ **Sync** - Cross-device sync
- ✅ **Notes** - Add notes to bookmarks

## 📦 Installation

```bash
npm install lucide-react
cp -r boilerplates/bookmarks-system/components ./src/components/bookmarks
cp -r boilerplates/bookmarks-system/database ./database
```

## 🚀 Quick Start

```typescript
import { BookmarksManager } from '@/components/bookmarks/BookmarksManager'

function BookmarksPage() {
  return (
    <BookmarksManager
      userId={userId}
      onBookmark={handleBookmark}
    />
  )
}
```

## 💡 Use Cases

### Bookmark Course

```typescript
<BookmarkButton
  itemId={courseId}
  itemType="course"
  userId={userId}
  onBookmark={handleBookmark}
/>
```

### Bookmark Chapter

```typescript
<BookmarkButton
  itemId={chapterId}
  itemType="chapter"
  userId={userId}
  label="Save for later"
/>
```

### Bookmarks List

```typescript
<BookmarksList
  userId={userId}
  filter="courses"
  onRemove={handleRemove}
/>
```

## 📊 Database Schema

```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  item_id UUID NOT NULL,
  item_type TEXT NOT NULL, -- 'course', 'chapter', 'resource'
  folder TEXT,
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_item ON bookmarks(item_id, item_type);
```

## 🔧 API Reference

### BookmarkButton Component

```typescript
interface BookmarkButtonProps {
  itemId: string
  itemType: 'course' | 'chapter' | 'resource'
  userId: string
  label?: string
  onBookmark?: (bookmarked: boolean) => void
}
```

### BookmarksManager Component

```typescript
interface BookmarksManagerProps {
  userId: string
  filter?: 'all' | 'courses' | 'chapters' | 'resources'
  onBookmark?: (bookmark: Bookmark) => void
  onRemove?: (bookmarkId: string) => void
}
```

## 💡 Advanced Use Cases

### Organize Bookmarks

```typescript
<BookmarksOrganizer
  userId={userId}
  bookmarks={bookmarks}
  onCreateFolder={handleCreateFolder}
  onMove={handleMove}
  onTag={handleTag}
/>
```

### Export Bookmarks

```typescript
const exportBookmarks = async () => {
  const bookmarks = await getBookmarks(userId)
  const json = JSON.stringify(bookmarks, null, 2)
  downloadFile(json, 'bookmarks.json')
}
```

### Import Bookmarks

```typescript
const importBookmarks = async (file: File) => {
  const content = await file.text()
  const bookmarks = JSON.parse(content)
  await bulkCreateBookmarks(userId, bookmarks)
}
```

## 🔒 Security

```typescript
// RLS Policy
CREATE POLICY "Users can manage own bookmarks"
ON bookmarks
FOR ALL
USING (auth.uid() = user_id);
```

## 📈 Performance Tips

1. **Index properly** - Add indexes on user_id and item_id
2. **Pagination** - Load bookmarks in pages
3. **Caching** - Cache frequently accessed bookmarks
4. **Debounce search** - Debounce search input
5. **Lazy loading** - Load bookmark details on demand

## 🐛 Troubleshooting

**Issue**: Bookmarks not saving
- **Solution**: Check RLS policies, ensure user is authenticated

**Issue**: Slow loading
- **Solution**: Add database indexes, implement pagination

**Issue**: Duplicate bookmarks
- **Solution**: Add unique constraint on (user_id, item_id, item_type)

## 📚 Examples

### React Component Example

```typescript
import { useState, useEffect } from 'react'
import { BookmarkButton } from '@/components/bookmarks/BookmarkButton'

function CourseCard({ course, userId }) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    checkBookmark(userId, course.id).then(setIsBookmarked)
  }, [userId, course.id])

  return (
    <div className="course-card">
      <h3>{course.title}</h3>
      <BookmarkButton
        itemId={course.id}
        itemType="course"
        userId={userId}
        onBookmark={setIsBookmarked}
      />
    </div>
  )
}
```

### Server Action Example

```typescript
'use server'

export async function toggleBookmark(
  userId: string,
  itemId: string,
  itemType: string
) {
  const supabase = createServerClient()
  
  // Check if already bookmarked
  const { data: existing } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('item_id', itemId)
    .eq('item_type', itemType)
    .single()

  if (existing) {
    // Remove bookmark
    await supabase
      .from('bookmarks')
      .delete()
      .eq('id', existing.id)
    return false
  } else {
    // Add bookmark
    await supabase
      .from('bookmarks')
      .insert({
        user_id: userId,
        item_id: itemId,
        item_type: itemType
      })
    return true
  }
}
```

## 🔄 Migration Guide

### From localStorage

```typescript
// Before
const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
bookmarks.push(newBookmark)
localStorage.setItem('bookmarks', JSON.stringify(bookmarks))

// After
await createBookmark({
  userId,
  itemId,
  itemType
})
```

## 📖 Resources

- [Bookmark Best Practices](https://www.nngroup.com/articles/bookmarking/)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Need help?** Check the examples folder for complete implementations.

