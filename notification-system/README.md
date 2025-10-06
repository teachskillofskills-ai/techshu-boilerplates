# 🔔 Notification System Boilerplate

A complete real-time notification system with notification center UI, preferences management, read/unread tracking, and multiple notification types.

## ✨ Features

- ✅ **Real-time Notifications** - Instant updates
- ✅ **Notification Center** - Beautiful UI component
- ✅ **Read/Unread Tracking** - Mark as read
- ✅ **Notification Types** - Info, success, warning, error
- ✅ **Preferences** - User notification settings
- ✅ **Bulk Actions** - Mark all as read, delete all
- ✅ **Filtering** - Filter by type, status
- ✅ **Pagination** - Load more notifications
- ✅ **Push Notifications** - Browser push support
- ✅ **Email Notifications** - Optional email alerts

## 📦 Installation

```bash
npm install lucide-react date-fns
cp -r boilerplates/notification-system/components ./src/components
cp -r boilerplates/notification-system/database ./database
```

## 🚀 Quick Start

```typescript
import { NotificationCenter } from '@/components/notifications/NotificationCenter'

function App() {
  return (
    <div>
      <NotificationCenter userId={currentUser.id} />
    </div>
  )
}
```

## 📊 Database Schema

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL, -- 'info', 'success', 'warning', 'error'
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
```

## 💡 Use Cases

### 1. Course Notifications

```typescript
await createNotification({
  userId: studentId,
  type: 'info',
  title: 'New Chapter Available',
  message: 'Chapter 5 has been published',
  link: '/courses/123/chapters/5'
})
```

### 2. Assignment Reminders

```typescript
await createNotification({
  userId: studentId,
  type: 'warning',
  title: 'Assignment Due Soon',
  message: 'Assignment due in 24 hours',
  link: '/assignments/456'
})
```

### 3. Achievement Notifications

```typescript
await createNotification({
  userId: studentId,
  type: 'success',
  title: 'Achievement Unlocked!',
  message: 'You completed 10 courses',
  link: '/achievements'
})
```

## 🔧 API Reference

```typescript
// Create notification
await createNotification({
  userId: string,
  type: 'info' | 'success' | 'warning' | 'error',
  title: string,
  message?: string,
  link?: string
})

// Mark as read
await markAsRead(notificationId)

// Mark all as read
await markAllAsRead(userId)

// Delete notification
await deleteNotification(notificationId)

// Get unread count
const count = await getUnreadCount(userId)
```

---

**Need help?** Check the examples folder for complete implementations.

