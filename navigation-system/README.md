# 🧭 Navigation System Boilerplate

A universal navigation component with responsive design, user menu, search integration, notifications, and theme toggle.

## ✨ Features

- ✅ **Responsive Design** - Mobile, tablet, desktop
- ✅ **User Menu** - Profile, settings, logout
- ✅ **Search Integration** - Global search
- ✅ **Notifications** - Notification bell with count
- ✅ **Theme Toggle** - Dark/light mode
- ✅ **Breadcrumbs** - Navigation breadcrumbs
- ✅ **Active States** - Highlight current page
- ✅ **Dropdown Menus** - Nested navigation
- ✅ **Mobile Menu** - Hamburger menu
- ✅ **Sticky Header** - Fixed on scroll

## 📦 Installation

```bash
npm install lucide-react
cp -r boilerplates/navigation-system/components ./src/components
```

## 🚀 Quick Start

```typescript
import { UniversalNav } from '@/components/navigation/UniversalNav'

function Layout({ children }) {
  return (
    <div>
      <UniversalNav
        user={currentUser}
        notificationCount={5}
        onSearch={(query) => console.log(query)}
      />
      <main>{children}</main>
    </div>
  )
}
```

## 🔧 API Reference

```typescript
interface UniversalNavProps {
  user: User
  notificationCount?: number
  onSearch?: (query: string) => void
  onThemeToggle?: () => void
  links?: NavLink[]
}

interface NavLink {
  label: string
  href: string
  icon?: React.ReactNode
  children?: NavLink[]
}
```

## 💡 Use Cases

### 1. Admin Navigation

```typescript
const adminLinks = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard /> },
  { label: 'Users', href: '/admin/users', icon: <Users /> },
  { label: 'Courses', href: '/admin/courses', icon: <BookOpen /> }
]

<UniversalNav links={adminLinks} />
```

### 2. Student Navigation

```typescript
const studentLinks = [
  { label: 'My Courses', href: '/courses', icon: <BookOpen /> },
  { label: 'Assignments', href: '/assignments', icon: <FileText /> },
  { label: 'Progress', href: '/progress', icon: <TrendingUp /> }
]

<UniversalNav links={studentLinks} />
```

---

**Need help?** Check the examples folder for complete implementations.

