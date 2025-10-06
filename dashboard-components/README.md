# 📊 Dashboard Components Boilerplate

A complete set of dashboard components including stats cards, charts, quick actions, recent activity, and progress overview. Perfect for building admin and user dashboards.

## ✨ Features

- ✅ **Stats Cards** - Display key metrics
- ✅ **Quick Actions** - Common action buttons
- ✅ **Recent Activity** - Activity feed
- ✅ **Progress Overview** - Progress tracking
- ✅ **Charts** - Data visualization
- ✅ **Responsive Grid** - Adaptive layout
- ✅ **Loading States** - Skeleton loaders
- ✅ **Empty States** - No data placeholders
- ✅ **Customizable** - Easy to customize
- ✅ **TypeScript** - Full type safety

## 📦 Installation

```bash
npm install lucide-react recharts date-fns
cp -r boilerplates/dashboard-components/components ./src/components/dashboard
```

## 🚀 Quick Start

```typescript
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentCourses } from '@/components/dashboard/RecentCourses'
import { ProgressOverview } from '@/components/dashboard/ProgressOverview'

function Dashboard() {
  return (
    <div className="grid gap-6">
      <DashboardStats stats={stats} />
      <QuickActions actions={actions} />
      <div className="grid md:grid-cols-2 gap-6">
        <RecentCourses courses={courses} />
        <ProgressOverview progress={progress} />
      </div>
    </div>
  )
}
```

## 📊 Components

### 1. DashboardStats

```typescript
<DashboardStats
  stats={[
    { label: 'Total Users', value: 1234, change: +12, icon: <Users /> },
    { label: 'Active Courses', value: 56, change: +5, icon: <BookOpen /> },
    { label: 'Completion Rate', value: '78%', change: +3, icon: <TrendingUp /> }
  ]}
/>
```

### 2. QuickActions

```typescript
<QuickActions
  actions={[
    { label: 'Create Course', icon: <Plus />, onClick: () => {} },
    { label: 'Manage Users', icon: <Users />, onClick: () => {} },
    { label: 'View Reports', icon: <BarChart />, onClick: () => {} }
  ]}
/>
```

### 3. RecentCourses

```typescript
<RecentCourses
  courses={[
    { id: '1', title: 'React Basics', progress: 75, lastAccessed: new Date() },
    { id: '2', title: 'TypeScript', progress: 50, lastAccessed: new Date() }
  ]}
/>
```

### 4. ProgressOverview

```typescript
<ProgressOverview
  progress={{
    completed: 10,
    inProgress: 5,
    total: 20,
    completionRate: 50
  }}
/>
```

## 💡 Use Cases

### Admin Dashboard

```typescript
function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1>Admin Dashboard</h1>
      <DashboardStats stats={adminStats} />
      <QuickActions actions={adminActions} />
      <RecentActivity activities={recentActivities} />
    </div>
  )
}
```

### Student Dashboard

```typescript
function StudentDashboard() {
  return (
    <div className="space-y-6">
      <h1>My Dashboard</h1>
      <DashboardStats stats={studentStats} />
      <RecentCourses courses={enrolledCourses} />
      <ProgressOverview progress={learningProgress} />
    </div>
  )
}
```

---

**Need help?** Check the examples folder for complete implementations.

