# 🔐 Role & Permission Management Boilerplate

Complete role-based access control (RBAC) system with roles, permissions, and access control.

## ✨ Features

- ✅ **Role Management** - Create/edit roles
- ✅ **Permission System** - Granular permissions
- ✅ **Access Control** - Protect resources
- ✅ **User Assignment** - Assign roles to users
- ✅ **Permission Checks** - Check permissions
- ✅ **Hierarchical Roles** - Role inheritance
- ✅ **Audit Logs** - Track changes
- ✅ **Dynamic Permissions** - Runtime permissions
- ✅ **API Protection** - Protect API routes
- ✅ **UI Protection** - Hide/show UI elements

## 📦 Installation

```bash
cp -r boilerplates/role-permission/lib ./src/lib/rbac
cp -r boilerplates/role-permission/database ./database
```

## 🚀 Quick Start

```typescript
import { checkPermission, hasRole } from '@/lib/rbac/permissions'

// Check permission
if (await checkPermission(userId, 'courses.create')) {
  // Allow action
}

// Check role
if (await hasRole(userId, 'admin')) {
  // Allow action
}
```

## 📚 Default Roles

- **Super Admin** - Full access
- **Admin** - Manage users, courses
- **Instructor** - Create/manage courses
- **Student** - View courses, submit assignments

## 💡 Use Cases

### Protect Routes

```typescript
export async function middleware(request: NextRequest) {
  const user = await getUser()
  
  if (!await hasRole(user.id, 'admin')) {
    return NextResponse.redirect('/unauthorized')
  }
}
```

### Protect Components

```typescript
function AdminPanel() {
  const hasAccess = await checkPermission(userId, 'admin.access')
  
  if (!hasAccess) {
    return <Unauthorized />
  }
  
  return <AdminDashboard />
}
```

---

**Need help?** Check the examples folder for complete implementations.

