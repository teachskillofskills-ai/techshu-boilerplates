# ⚡ Quick Reference Card

## 🎯 Start Here

**New to boilerplates?** → Read [GETTING_STARTED.md](./GETTING_STARTED.md)  
**Want an overview?** → Read [OVERVIEW.md](./OVERVIEW.md)  
**Looking for something specific?** → Check [BOILERPLATE_INDEX.md](./BOILERPLATE_INDEX.md)  
**Want to see the structure?** → Check [DIRECTORY_STRUCTURE.md](./DIRECTORY_STRUCTURE.md)

## 📦 Available Boilerplates

| Name | Status | Time | Database | Complexity |
|------|--------|------|----------|------------|
| [Authentication](#authentication) | ✅ Ready | 30 min | Yes | ⭐⭐ |
| [Theme System](#theme-system) | ✅ Ready | 15 min | No | ⭐ |
| [File Upload](#file-upload) | 📋 Docs | 25 min | Yes | ⭐⭐ |

## 🔐 Authentication

**What**: Complete auth system with Supabase  
**Location**: `boilerplates/authentication/`  
**Time**: 30 minutes  
**Database**: Required (Supabase)

### Quick Start
```bash
# 1. Copy
cp -r boilerplates/authentication ./

# 2. Install
npm install @supabase/ssr @supabase/supabase-js zod

# 3. Configure
cp authentication/.env.example .env.local
# Fill in your Supabase credentials

# 4. Database
# Run authentication/database/*.sql in Supabase

# 5. Use
import { SignInForm } from './authentication/components/SignInForm'
```

### Features
- ✅ Email/Password login
- ✅ OAuth (Google, GitHub)
- ✅ Password reset
- ✅ Protected routes
- ✅ RBAC
- ✅ Session management

### Key Files
- `lib/supabase/client.ts` - Browser client
- `lib/supabase/server.ts` - Server client
- `database/01_profiles_table.sql` - Database schema
- `database/02_rls_policies.sql` - Security policies

## 🎨 Theme System

**What**: Dark/light mode with preferences  
**Location**: `boilerplates/theme-system/`  
**Time**: 15 minutes  
**Database**: Optional

### Quick Start
```bash
# 1. Copy
cp -r boilerplates/theme-system ./

# 2. No dependencies needed!

# 3. Wrap your app
import { ThemeProvider } from './theme-system/providers/ThemeProvider'

<ThemeProvider>
  <App />
</ThemeProvider>

# 4. Add toggle
import { ThemeToggle } from './theme-system/components/ThemeToggle'
<ThemeToggle />
```

### Features
- ✅ Dark/Light/Auto modes
- ✅ Font size control
- ✅ Reduced motion
- ✅ High contrast
- ✅ Persistent settings
- ✅ System detection

### Key Files
- `providers/ThemeProvider.tsx` - Main provider
- `components/ThemeToggle.tsx` - Toggle button
- `hooks/useTheme.tsx` - Theme hook

## 📁 File Upload

**What**: Drag & drop file upload  
**Location**: `boilerplates/file-upload/`  
**Time**: 25 minutes  
**Database**: Required (Supabase Storage)

### Quick Start
```bash
# 1. Copy
cp -r boilerplates/file-upload ./

# 2. Install
npm install @supabase/supabase-js react-dropzone

# 3. Configure storage
# Run file-upload/database/storage_setup.sql

# 4. Use
import { FileUpload } from './file-upload/components/FileUpload'

<FileUpload
  bucket="uploads"
  onUpload={(url) => console.log(url)}
/>
```

### Features
- ✅ Drag & drop
- ✅ Multiple files
- ✅ Progress tracking
- ✅ File validation
- ✅ Image optimization
- ✅ Preview

### Key Files
- `components/FileUpload.tsx` - Main component
- `lib/upload-service.ts` - Upload logic
- `hooks/useFileUpload.ts` - Upload hook

## 🚀 Common Patterns

### Pattern 1: Full Auth App
```typescript
// 1. Authentication
import { SignInForm } from './authentication/components/SignInForm'

// 2. Theme
import { ThemeProvider } from './theme-system/providers/ThemeProvider'

// 3. Protected Page
import { createClient } from './authentication/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')
  return <div>Protected</div>
}
```

### Pattern 2: File Upload with Auth
```typescript
// Combine authentication + file upload
import { FileUpload } from './file-upload/components/FileUpload'
import { createClient } from './authentication/lib/supabase/client'

function UploadPage() {
  const supabase = createClient()
  
  return (
    <FileUpload
      bucket="uploads"
      folder={user.id}
      onUpload={(url) => {
        // Save to database
        supabase.from('files').insert({ url, user_id: user.id })
      }}
    />
  )
}
```

### Pattern 3: Themed App
```typescript
// Theme + Components
import { ThemeProvider, useTheme } from './theme-system/providers/ThemeProvider'

function App() {
  return (
    <ThemeProvider>
      <ThemedComponent />
    </ThemeProvider>
  )
}

function ThemedComponent() {
  const { theme, setTheme } = useTheme()
  return (
    <div>
      <p>Current: {theme}</p>
      <button onClick={() => setTheme('dark')}>Dark</button>
    </div>
  )
}
```

## 🔧 Common Commands

### Copy Boilerplate
```bash
cp -r boilerplates/[name] ./src/
```

### Install Dependencies
```bash
# Authentication
npm install @supabase/ssr @supabase/supabase-js zod

# File Upload
npm install @supabase/supabase-js react-dropzone

# Theme (no dependencies!)
```

### Run Database Migrations
```bash
# Using Supabase CLI
supabase db push

# Using psql
psql -f boilerplates/[name]/database/*.sql

# Using Supabase Dashboard
# Copy-paste SQL into SQL Editor
```

### Generate Types
```bash
npx supabase gen types typescript --project-id [id] > types/supabase.ts
```

## 🐛 Troubleshooting

### "Module not found"
```bash
npm install [missing-package]
```

### "Supabase not configured"
```bash
# Check .env.local
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### "Database table doesn't exist"
```bash
# Run migrations
psql -f boilerplates/[name]/database/*.sql
```

### "RLS policy violation"
```bash
# Check RLS policies are applied
# See database/02_rls_policies.sql
```

### "Type errors"
```bash
# Generate Supabase types
npx supabase gen types typescript > types/supabase.ts
```

## 📚 Documentation

Each boilerplate has:
- **README.md** - Complete guide
- **examples/** - Working code
- **database/** - SQL schemas
- **.env.example** - Environment variables

## 🎯 Integration Times

| Task | Time | Difficulty |
|------|------|------------|
| Add authentication | 30 min | Medium |
| Add theme system | 15 min | Easy |
| Add file upload | 25 min | Medium |
| Combine auth + theme | 40 min | Medium |
| Combine all three | 60 min | Medium |

## 🔒 Security Checklist

- [ ] Environment variables set
- [ ] Database migrations run
- [ ] RLS policies applied
- [ ] Service role key server-only
- [ ] Input validation added
- [ ] Error handling implemented
- [ ] CORS configured (if needed)

## ⚡ Performance Tips

1. **Use Server Components** - Default to server rendering
2. **Lazy Load** - Dynamic imports for heavy components
3. **Optimize Images** - Use Next.js Image component
4. **Cache Strategically** - Cache at multiple levels
5. **Minimize Client JS** - Keep bundles small

## 📖 Learning Path

### Beginner (Start Here)
1. Theme System (15 min)
2. Authentication (30 min)
3. File Upload (25 min)

### Intermediate
1. User Management (20 min)
2. Search System (30 min)
3. Email Service (20 min)

### Advanced
1. Admin Dashboard (60 min)
2. AI Integration (40 min)
3. Rich Text Editor (45 min)

## 🎓 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://typescriptlang.org/docs)

## 🆘 Need Help?

1. **Check README** - Each boilerplate has detailed docs
2. **Check examples/** - Working code samples
3. **Check inline comments** - Code is well-documented
4. **Check main docs** - GETTING_STARTED.md, OVERVIEW.md

## 🎉 Quick Wins

### 5-Minute Win
```bash
# Add theme system
cp -r boilerplates/theme-system ./src/
# Wrap app with ThemeProvider
# Add ThemeToggle to header
# Done! ✅
```

### 15-Minute Win
```bash
# Add authentication
cp -r boilerplates/authentication ./src/
npm install @supabase/ssr @supabase/supabase-js zod
# Set up .env.local
# Run database migrations
# Add SignInForm to page
# Done! ✅
```

### 30-Minute Win
```bash
# Add auth + theme + file upload
# Follow Quick Start for each
# Combine them together
# Build something awesome! 🚀
```

## 📊 Status Summary

- **Ready to Use**: 2 boilerplates
- **Documentation Complete**: 1 boilerplate
- **Total Planned**: 20 boilerplates
- **Lines of Code**: ~2,500 lines
- **Documentation**: ~2,000 lines

---

**Last Updated**: 2025-01-06  
**Version**: 1.0.0  
**Status**: Foundation Complete ✅

**Ready to start?** Pick a boilerplate and follow its Quick Start! 🚀

