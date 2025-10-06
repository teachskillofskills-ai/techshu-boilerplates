# 👥 User Management Boilerplate

A complete user management system with user approval workflow, role assignment, bulk operations, search/filter, and activity tracking. Perfect for admin dashboards and user administration.

## ✨ Features

- ✅ **User List Table** - Sortable, filterable user list
- ✅ **Approval Workflow** - Approve/reject pending users
- ✅ **Role Management** - Assign and manage user roles
- ✅ **Bulk Operations** - Select and act on multiple users
- ✅ **Search & Filter** - Find users quickly
- ✅ **User Actions** - Activate, deactivate, delete users
- ✅ **Activity Tracking** - Last seen, registration date
- ✅ **Export Users** - Export to CSV/JSON
- ✅ **Responsive Design** - Works on all devices
- ✅ **TypeScript** - Full type safety

## 📦 Installation

### 1. Install Dependencies

```bash
npm install @tanstack/react-table lucide-react date-fns
```

### 2. Copy Files

```bash
cp -r boilerplates/user-management/components ./src/components/admin
cp -r boilerplates/user-management/database ./database
```

### 3. Run Database Migrations

```bash
psql -f database/user_management_schema.sql
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { UserManagementTable } from '@/components/admin/UserManagementTable'

function AdminPage() {
  return (
    <div>
      <h1>User Management</h1>
      <UserManagementTable />
    </div>
  )
}
```

### With Custom Actions

```typescript
import { UserManagementTable } from '@/components/admin/UserManagementTable'

function AdminPage() {
  const handleUserApproved = (userId: string) => {
    console.log('User approved:', userId)
    // Send welcome email, etc.
  }

  return (
    <UserManagementTable
      onUserApproved={handleUserApproved}
      onUserRejected={(userId) => console.log('Rejected:', userId)}
    />
  )
}
```

## 📊 Features in Detail

### 1. User Approval Workflow

```typescript
// Approve user
<UserApprovalActions
  userId={user.id}
  currentStatus={user.approval_status}
  onApprove={handleApprove}
  onReject={handleReject}
/>
```

### 2. Role Assignment

```typescript
// Assign role to user
await assignRole(userId, 'instructor')

// Remove role
await removeRole(userId, 'instructor')

// Check user roles
const roles = await getUserRoles(userId)
```

### 3. Bulk Operations

```typescript
// Select multiple users
const [selectedUsers, setSelectedUsers] = useState<string[]>([])

// Bulk approve
await bulkApproveUsers(selectedUsers)

// Bulk delete
await bulkDeleteUsers(selectedUsers)
```

### 4. Search & Filter

```typescript
// Search by name or email
const filteredUsers = users.filter(user =>
  user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  user.email.toLowerCase().includes(searchTerm.toLowerCase())
)

// Filter by status
const pendingUsers = users.filter(u => u.approval_status === 'pending')
const approvedUsers = users.filter(u => u.approval_status === 'approved')
```

## 📝 Database Schema

### Users Table (profiles)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  approval_status TEXT DEFAULT 'pending',
  is_active BOOLEAN DEFAULT true,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### User Roles Table

```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  role_name TEXT NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES profiles(id)
);
```

## 🔧 API Reference

### UserManagementTable Component

```typescript
interface UserManagementTableProps {
  onUserApproved?: (userId: string) => void
  onUserRejected?: (userId: string) => void
  onUserDeleted?: (userId: string) => void
  showPendingOnly?: boolean
  pageSize?: number
}
```

### UserApprovalActions Component

```typescript
interface UserApprovalActionsProps {
  userId: string
  currentStatus: 'pending' | 'approved' | 'rejected'
  onApprove: (userId: string) => Promise<void>
  onReject: (userId: string) => Promise<void>
}
```

## 💡 Use Cases

### 1. Admin Dashboard

```typescript
function AdminDashboard() {
  return (
    <div className="grid gap-6">
      <div className="stats">
        <StatCard title="Total Users" value={totalUsers} />
        <StatCard title="Pending Approval" value={pendingCount} />
        <StatCard title="Active Users" value={activeCount} />
      </div>
      
      <UserManagementTable />
    </div>
  )
}
```

### 2. User Approval Queue

```typescript
function ApprovalQueue() {
  return (
    <UserManagementTable
      showPendingOnly={true}
      onUserApproved={async (userId) => {
        await sendWelcomeEmail(userId)
        toast.success('User approved and welcome email sent!')
      }}
    />
  )
}
```

### 3. Role Management

```typescript
function RoleManagement() {
  const assignInstructorRole = async (userId: string) => {
    await assignRole(userId, 'instructor')
    await sendRoleAssignmentEmail(userId, 'instructor')
  }

  return (
    <UserManagementTable
      onRoleAssign={assignInstructorRole}
    />
  )
}
```

## 🔒 Security Best Practices

1. **RLS Policies** - Implement Row Level Security
2. **Admin Only** - Restrict to admin users
3. **Audit Logs** - Log all user management actions
4. **Email Verification** - Verify email before approval
5. **Rate Limiting** - Limit bulk operations

## 📈 Performance Tips

1. **Pagination** - Load users in pages
2. **Virtual Scrolling** - For large user lists
3. **Debounced Search** - Debounce search input
4. **Lazy Loading** - Load data on demand
5. **Caching** - Cache user data

## 🐛 Troubleshooting

**Issue**: Users not loading
- **Solution**: Check database connection, RLS policies

**Issue**: Approval not working
- **Solution**: Check user permissions, database triggers

**Issue**: Slow performance
- **Solution**: Add indexes, implement pagination

## 📚 Examples

Check the `examples/` folder for:
- Complete admin dashboard
- User approval workflow
- Role management system
- Bulk operations
- Export functionality

---

**Need help?** Check the examples folder for complete implementations.

