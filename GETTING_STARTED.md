# 🚀 Getting Started with TechShu Boilerplates

Welcome! This guide will help you quickly integrate any boilerplate into your project.

## 📋 Prerequisites

Before you start, make sure you have:

- ✅ Node.js 18+ installed
- ✅ A Next.js 14+ project (or create one with `npx create-next-app@latest`)
- ✅ Basic knowledge of React and TypeScript
- ✅ (Optional) A Supabase account for backend features

## 🎯 Quick Start (5 Minutes)

### Step 1: Choose Your Boilerplate

Browse the [Boilerplate Index](./BOILERPLATE_INDEX.md) and choose what you need.

**Most Common Starting Points:**
1. **Authentication System** - If you need user login
2. **Theme System** - If you want dark/light mode
3. **File Upload** - If you need file handling
4. **Admin Dashboard** - If you need admin features

### Step 2: Copy the Boilerplate

```bash
# Navigate to your project
cd my-project

# Copy the boilerplate you need
cp -r path/to/TechShuLMS/boilerplates/authentication ./boilerplates/authentication

# Or copy all boilerplates
cp -r path/to/TechShuLMS/boilerplates ./
```

### Step 3: Install Dependencies

Each boilerplate has its own dependencies. Check the boilerplate's README for specifics.

```bash
# Example for Authentication System
npm install @supabase/ssr @supabase/supabase-js zod sonner

# Example for Theme System
# No additional dependencies needed!

# Example for Rich Editor
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image
```

### Step 4: Set Up Environment Variables

Copy the `.env.example` from the boilerplate:

```bash
cp boilerplates/authentication/.env.example .env.local
```

Fill in your values:

```env
# Supabase (if using database features)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (if using AI features)
OPENAI_API_KEY=your_openai_key

# Email (if using email features)
BREVO_API_KEY=your_brevo_key
```

### Step 5: Run Database Migrations (If Needed)

If the boilerplate includes database schemas:

```bash
# Option 1: Using Supabase CLI
supabase db push

# Option 2: Using psql
psql -h your-db-host -U postgres -d your-db -f boilerplates/authentication/database/01_profiles_table.sql

# Option 3: Copy-paste SQL into Supabase Dashboard
# Go to SQL Editor and paste the contents
```

### Step 6: Import and Use

```tsx
// Example: Using Authentication
import { SignInForm } from '@/boilerplates/authentication/components/SignInForm'

export default function SignInPage() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1>Sign In</h1>
      <SignInForm />
    </div>
  )
}
```

## 🎨 Common Integration Patterns

### Pattern 1: Full Authentication Flow

```tsx
// 1. Wrap app with providers
// app/layout.tsx
import { ThemeProvider } from '@/boilerplates/theme-system/providers/ThemeProvider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

// 2. Create sign-in page
// app/auth/signin/page.tsx
import { SignInForm } from '@/boilerplates/authentication/components/SignInForm'

export default function SignInPage() {
  return <SignInForm />
}

// 3. Create protected page
// app/dashboard/page.tsx
import { createClient } from '@/boilerplates/authentication/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/auth/signin')
  
  return <div>Welcome {user.email}</div>
}
```

### Pattern 2: Theme + UI Components

```tsx
// 1. Set up theme provider
import { ThemeProvider } from '@/boilerplates/theme-system/providers/ThemeProvider'

// 2. Add theme toggle to header
import { ThemeToggle } from '@/boilerplates/theme-system/components/ThemeToggle'

function Header() {
  return (
    <header>
      <nav>
        <Logo />
        <ThemeToggle />
      </nav>
    </header>
  )
}

// 3. Use theme in components
import { useTheme } from '@/boilerplates/theme-system/providers/ThemeProvider'

function MyComponent() {
  const { theme } = useTheme()
  return <div>Current theme: {theme}</div>
}
```

### Pattern 3: File Upload + Storage

```tsx
// 1. Set up storage bucket (run once)
// See boilerplates/file-upload/database/storage_setup.sql

// 2. Use file upload component
import { FileUpload } from '@/boilerplates/file-upload/components/FileUpload'

function UploadPage() {
  return (
    <FileUpload
      bucket="uploads"
      onUpload={(url) => console.log('Uploaded:', url)}
      accept="image/*"
      maxSize={5 * 1024 * 1024}
    />
  )
}
```

## 🔧 Customization Guide

### Styling

All components use Tailwind CSS and can be customized:

```tsx
// Override with className
<SignInForm className="custom-styles" />

// Or modify the component directly
// Copy the component to your project and edit
```

### Configuration

Most boilerplates have config files:

```typescript
// boilerplates/authentication/lib/config.ts
export const authConfig = {
  redirectAfterSignIn: '/dashboard',
  redirectAfterSignOut: '/',
  requireEmailVerification: true,
  // ... customize as needed
}
```

### Database Schema

You can extend the database schemas:

```sql
-- Add custom columns to profiles table
ALTER TABLE profiles ADD COLUMN custom_field TEXT;

-- Add custom tables
CREATE TABLE custom_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  -- your fields
);
```

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Module not found"
```bash
# Solution: Install the missing dependency
npm install [package-name]
```

**Issue**: "Supabase client not configured"
```bash
# Solution: Check your .env.local file
# Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set
```

**Issue**: "Database table doesn't exist"
```bash
# Solution: Run the database migrations
psql -f boilerplates/[name]/database/*.sql
```

**Issue**: "RLS policy violation"
```bash
# Solution: Make sure RLS policies are applied
# Check boilerplates/[name]/database/02_rls_policies.sql
```

**Issue**: "Type errors"
```bash
# Solution: Generate Supabase types
npx supabase gen types typescript --project-id your-project-id > types/supabase.ts
```

### Getting Help

1. **Check the boilerplate's README** - Most issues are covered there
2. **Look at examples/** - Each boilerplate has usage examples
3. **Check the main TechShu LMS** - See how it's used in production
4. **Review the code** - All code is well-commented

## 📚 Learning Path

### Beginner Path (Start Here)

1. **Theme System** (15 min) - Easy, no database needed
2. **UI Components** (10 min) - Learn the component library
3. **Authentication** (30 min) - Add user login
4. **User Management** (20 min) - Manage user profiles

### Intermediate Path

1. **File Upload** (25 min) - Handle file uploads
2. **Search System** (30 min) - Add search functionality
3. **Email Service** (20 min) - Send emails
4. **Notification System** (30 min) - Real-time notifications

### Advanced Path

1. **Admin Dashboard** (60 min) - Full admin interface
2. **AI Integration** (40 min) - Add AI features
3. **Rich Text Editor** (45 min) - Advanced content editing
4. **Performance Optimization** (25 min) - Optimize your app

## 🎯 Best Practices

### 1. Start Small
Don't try to integrate everything at once. Start with one boilerplate and get it working.

### 2. Test Thoroughly
Always test the boilerplate in isolation before integrating into your main app.

### 3. Read the Documentation
Each boilerplate has detailed documentation. Read it before starting.

### 4. Customize Gradually
Get the boilerplate working first, then customize it to your needs.

### 5. Keep Dependencies Updated
Regularly update dependencies to get security fixes and new features.

### 6. Follow Security Best Practices
- Never expose service role keys to client
- Always use RLS policies
- Validate all user inputs
- Use environment variables for secrets

## 🚀 Next Steps

1. **Choose your first boilerplate** from the [Index](./BOILERPLATE_INDEX.md)
2. **Follow the Quick Start** above
3. **Check the examples/** folder in the boilerplate
4. **Customize** to your needs
5. **Build** something awesome!

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

Found a bug or want to improve a boilerplate?

1. Test your changes thoroughly
2. Update the documentation
3. Add examples if needed
4. Submit your improvements

## 📝 License

These boilerplates are extracted from TechShu LMS and are available for use in your projects.

---

**Ready to start?** Pick a boilerplate from the [Index](./BOILERPLATE_INDEX.md) and follow the Quick Start guide above!

**Questions?** Check the boilerplate's README or examples folder.

**Happy coding! 🎉**

