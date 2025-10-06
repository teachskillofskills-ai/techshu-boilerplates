# ⏳ Loading & Error States Boilerplate

Complete loading and error state components for better UX.

## ✨ Features

- ✅ **Loading Spinners** - Various spinners
- ✅ **Skeleton Loaders** - Content placeholders
- ✅ **Progress Bars** - Progress indicators
- ✅ **Error Messages** - Error display
- ✅ **Empty States** - No data states
- ✅ **Success Messages** - Success feedback
- ✅ **Toast Notifications** - Toast messages
- ✅ **Retry Buttons** - Retry actions
- ✅ **Suspense Fallbacks** - React Suspense
- ✅ **Animations** - Smooth transitions

## 📦 Installation

```bash
npm install lucide-react
cp -r boilerplates/loading-error-states/components ./src/components/states
```

## 🚀 Quick Start

```typescript
import { LoadingSpinner, ErrorMessage, EmptyState } from '@/components/states'

function DataPage() {
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  if (!data.length) return <EmptyState message="No data found" />
  
  return <DataList data={data} />
}
```

## 💡 Use Cases

### Loading State

```typescript
<LoadingSpinner size="lg" text="Loading courses..." />
```

### Error State

```typescript
<ErrorMessage
  error={error}
  onRetry={handleRetry}
/>
```

### Empty State

```typescript
<EmptyState
  icon={<BookOpen />}
  title="No courses yet"
  description="Start by creating your first course"
  action={<Button onClick={handleCreate}>Create Course</Button>}
/>
```

---

**Need help?** Check the examples folder for complete implementations.

