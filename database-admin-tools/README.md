# 🗄️ Database Admin Tools Boilerplate

Advanced database administration tools including query runner, backup management, table browser, and performance monitoring. Perfect for admin dashboards.

## ✨ Features

- ✅ **Query Runner** - Execute SQL queries safely
- ✅ **Table Browser** - Browse and edit tables
- ✅ **Backup Management** - Create and restore backups
- ✅ **Performance Monitor** - Track database performance
- ✅ **Schema Viewer** - View database schema
- ✅ **Query History** - Track executed queries
- ✅ **Export Data** - Export to CSV/JSON
- ✅ **Import Data** - Import from files
- ✅ **User Permissions** - Admin-only access
- ✅ **Audit Logging** - Log all operations

## 📦 Installation

```bash
npm install @tanstack/react-table lucide-react
cp -r boilerplates/database-admin-tools/components ./src/components/admin/database
```

## 🚀 Quick Start

```typescript
import { DatabaseQueryRunner } from '@/components/admin/database/QueryRunner'
import { TableBrowser } from '@/components/admin/database/TableBrowser'

function DatabaseAdmin() {
  return (
    <div className="space-y-6">
      <h1>Database Administration</h1>
      <DatabaseQueryRunner />
      <TableBrowser />
    </div>
  )
}
```

## 🔒 Security

**CRITICAL**: These tools should only be accessible to super admins!

```typescript
// Protect routes
if (user.role !== 'super_admin') {
  return <Unauthorized />
}
```

## 💡 Use Cases

### 1. Query Runner

```typescript
<DatabaseQueryRunner
  onQueryExecute={async (query) => {
    const result = await executeQuery(query)
    return result
  }}
  maxRows={1000}
  readOnly={false}
/>
```

### 2. Table Browser

```typescript
<TableBrowser
  tables={['users', 'courses', 'enrollments']}
  onEdit={(table, row) => updateRow(table, row)}
  onDelete={(table, id) => deleteRow(table, id)}
/>
```

### 3. Backup Management

```typescript
<BackupManager
  onBackup={async () => await createBackup()}
  onRestore={async (backupId) => await restoreBackup(backupId)}
  backups={backupList}
/>
```

---

**⚠️ WARNING**: Use with extreme caution. Always test on staging first!

