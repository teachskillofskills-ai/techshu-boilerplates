# 👨‍💼 Admin Dashboard Boilerplate

Complete admin dashboard with user management, course management, analytics, settings, and system monitoring. Full-featured admin panel.

## ✨ Features

- ✅ **User Management** - Manage all users
- ✅ **Course Management** - Manage courses
- ✅ **Analytics** - System analytics
- ✅ **Settings** - System settings
- ✅ **Monitoring** - System health
- ✅ **Audit Logs** - Activity tracking
- ✅ **Reports** - Generate reports
- ✅ **Notifications** - Admin notifications
- ✅ **Responsive** - Mobile-friendly
- ✅ **Role-Based** - Permission system

## 📦 Installation

```bash
npm install recharts lucide-react date-fns
cp -r boilerplates/admin-dashboard/components ./src/components/admin
cp -r boilerplates/admin-dashboard/pages ./src/app/admin
```

## 🚀 Quick Start

```typescript
import { AdminDashboard } from '@/components/admin/AdminDashboard'

function AdminPage() {
  return <AdminDashboard user={currentUser} />
}
```

## 📊 Dashboard Sections

### 1. Overview

```typescript
<AdminOverview
  stats={{
    totalUsers: 1234,
    activeUsers: 890,
    totalCourses: 56,
    revenue: 45000
  }}
/>
```

### 2. User Management

```typescript
<UserManagement
  users={users}
  onApprove={handleApprove}
  onReject={handleReject}
  onDelete={handleDelete}
/>
```

### 3. Course Management

```typescript
<CourseManagement
  courses={courses}
  onPublish={handlePublish}
  onUnpublish={handleUnpublish}
  onDelete={handleDelete}
/>
```

### 4. Analytics

```typescript
<Analytics
  data={analyticsData}
  dateRange={dateRange}
  metrics={['users', 'courses', 'revenue']}
/>
```

## 💡 Use Cases

### Complete Admin Panel

```typescript
function AdminPanel() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main>
        <AdminDashboard />
      </main>
    </div>
  )
}
```

---

**Need help?** Check the examples folder for complete implementations.

