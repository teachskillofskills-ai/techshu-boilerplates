# 📖 Comprehensive Step-by-Step Tutorials

**Production-Ready Tutorials from a Developer's Perspective**

> 💡 **My Promise to You**: I've built these exact features dozens of times. I'll show you not just the happy path, but the gotchas, the "why" behind decisions, and the production-ready patterns that actually work.

---

## 🎯 Tutorial Philosophy

### What Makes These Different?

**Most tutorials teach you to build toys. These teach you to build products.**

- ✅ **Real-world complexity**: Handle edge cases, errors, loading states
- ✅ **Production patterns**: Security, performance, scalability
- ✅ **User experience**: Not just functionality, but delightful UX
- ✅ **Maintainability**: Code you won't hate in 6 months

### How to Use These Tutorials

1. **Read the "Why"** sections - Understanding beats memorization
2. **Type the code** - Don't copy-paste (muscle memory matters)
3. **Break things** - Change values, see what breaks, learn why
4. **Deploy it** - Real learning happens in production

---

## 📚 Tutorial Index

### 🌱 Beginner Track (Start Here!)

**Tutorial 1: Your First App - Simple LMS** (30 min)
- Build a learning platform from scratch
- Authentication, courses, progress tracking
- **Skills**: Next.js basics, Supabase, TechShu CLI

**Tutorial 2: Add AI Superpowers** (45 min)
- Implement RAG-powered Q&A system
- Vector embeddings and semantic search
- **Skills**: OpenAI API, pgvector, RAG architecture

**Tutorial 3: Professional Admin Dashboard** (40 min)
- Build a complete admin interface
- User management, analytics, content moderation
- **Skills**: Data tables, charts, RBAC

### 🚀 Intermediate Track

**Tutorial 4: Production Email System** (35 min)
- Transactional emails with templates
- Brevo integration, tracking, analytics
- **Skills**: Email best practices, deliverability

**Tutorial 5: User Management System** (50 min)
- Approval workflows, role management
- Audit logs, activity tracking
- **Skills**: State machines, complex workflows

**Tutorial 6: Real-time Features** (45 min)
- Live chat with AI assistant
- Presence indicators, typing status
- **Skills**: Supabase Realtime, WebSockets

### 🏆 Advanced Track

**Tutorial 7: Production RAG System** (90 min)
- Complete RAG with evaluation
- Chunking strategies, embedding optimization
- **Skills**: Advanced AI, testing, monitoring

**Tutorial 8: Multi-tenant SaaS** (120 min)
- Organization management, team features
- Billing, usage tracking, limits
- **Skills**: SaaS architecture, Stripe integration

**Tutorial 9: AI Quality Assurance** (60 min)
- Testing AI systems, evaluation metrics
- Regression detection, A/B testing
- **Skills**: AI testing, RAGAS, LLM evaluation

---

## 🚀 Tutorial 1: Your First App - Simple LMS

### 🎯 What We're Building

**A real learning management system** that:
- Lets students browse and enroll in courses
- Tracks progress through chapters and modules
- Provides AI-powered help when students get stuck
- Sends email notifications for important events
- Has a clean, professional UI

**Why this matters**: This is the foundation. Master this, and you can build almost anything.

### 📊 What You'll Learn

**Technical Skills**:
- Next.js 14 App Router architecture
- Supabase authentication and database
- Row Level Security (RLS) for data protection
- Server and Client Components
- TypeScript best practices

**Product Skills**:
- User flow design
- Error handling and loading states
- Responsive design
- Accessibility basics

### 📋 Prerequisites

**Required Knowledge**:
- ✅ JavaScript/TypeScript basics
- ✅ React fundamentals (components, hooks, state)
- ✅ Basic understanding of databases
- ✅ Command line comfort

**Required Tools**:
- ✅ Node.js 18+ ([Download](https://nodejs.org/))
- ✅ VS Code or similar editor
- ✅ Git installed
- ✅ Supabase account (free tier is fine)

**Time Investment**:
- First time: 45-60 minutes
- With experience: 20-30 minutes

---

### 🏗️ Architecture Overview

**Before we code**, let's understand what we're building:

```
┌─────────────────────────────────────────────────────────┐
│                     User's Browser                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Login Page  │  │   Courses    │  │  Dashboard   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓ ↑
┌─────────────────────────────────────────────────────────┐
│                    Next.js Server                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  API Routes  │  │  Server      │  │  Middleware  │ │
│  │              │  │  Components  │  │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓ ↑
┌─────────────────────────────────────────────────────────┐
│                   Supabase Backend                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  PostgreSQL  │  │     Auth     │  │   Storage    │ │
│  │   Database   │  │              │  │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Key Concepts**:
- **Client Components**: Interactive UI (buttons, forms)
- **Server Components**: Data fetching, secure operations
- **API Routes**: Backend logic, external API calls
- **Supabase**: Database, auth, file storage

---

### 📦 Step 1: Project Setup (5 minutes)

#### 1.1: Create Next.js Project

```bash
# Create new Next.js app
npx create-next-app@latest my-lms

# Navigate into project
cd my-lms
```

**Interactive prompts** - Choose these:
```
✔ Would you like to use TypeScript? › Yes
✔ Would you like to use ESLint? › Yes  
✔ Would you like to use Tailwind CSS? › Yes
✔ Would you like to use `src/` directory? › Yes
✔ Would you like to use App Router? › Yes
✔ Would you like to customize the default import alias? › No
```

**Why these choices?**

| Choice | Why? |
|--------|------|
| TypeScript | Catches 80% of bugs before runtime |
| ESLint | Enforces code quality standards |
| Tailwind | 10x faster UI development |
| src/ directory | Cleaner project structure |
| App Router | Modern Next.js with server components |

#### 1.2: Verify Installation

```bash
# Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

**✅ Success**: You should see the Next.js welcome page  
**❌ Error**: Check Node.js version with `node --version` (need 18+)

#### 1.3: Clean Up Boilerplate

Let's remove the default content:

```bash
# Remove default page content
rm src/app/page.tsx

# Create a clean starting point
touch src/app/page.tsx
```

Add this to `src/app/page.tsx`:
```typescript
export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold">My LMS</h1>
      <p className="mt-4 text-gray-600">Let's build something amazing!</p>
    </main>
  )
}
```

**Refresh your browser** - you should see your clean slate.

---

### 🛠️ Step 2: Install TechShu CLI (2 minutes)

#### 2.1: Install Globally

```bash
npm install -g @techshu/cli
```

**Troubleshooting**:
- **Mac/Linux permission error**: Use `sudo npm install -g @techshu/cli`
- **Windows permission error**: Run terminal as Administrator
- **npm not found**: Install Node.js first

#### 2.2: Verify Installation

```bash
techshu --version
# Should output: @techshu/cli v1.0.0 (or similar)

techshu list
# Should show available boilerplates
```

#### 2.3: Understand the CLI

**What does it do?**
- ✅ Downloads boilerplate code
- ✅ Installs dependencies
- ✅ Sets up configuration
- ✅ Provides usage examples

**Common commands**:
```bash
techshu list                    # Show all boilerplates
techshu search <term>           # Search boilerplates
techshu add <name>              # Add a boilerplate
techshu add <name> --path ./src # Add to specific location
```

---

### 🔐 Step 3: Authentication Setup (10 minutes)

**Why start with auth?** Because:
1. Almost every app needs it
2. It's the foundation for user-specific features
3. Security is easier to add early than retrofit later

#### 3.1: Add Authentication Boilerplate

```bash
# Add authentication
techshu add authentication --path ./src/lib

# Install dependencies
npm install @supabase/supabase-js @supabase/ssr
```

**What just happened?**
```
src/lib/authentication/
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser client
│   │   ├── server.ts          # Server client
│   │   └── middleware.ts      # Auth middleware
│   └── hooks/
│       └── useUser.ts         # Get current user
├── database/
│   ├── 01_profiles_table.sql  # User profiles
│   └── 02_rls_policies.sql    # Security policies
└── README.md                   # Documentation
```

#### 3.2: Create Supabase Project

**Step-by-step**:

1. Go to [supabase.com](https://supabase.com/)
2. Click "Start your project" → "Sign in with GitHub"
3. Click "New Project"
4. Fill in:
   - **Organization**: Create new or select existing
   - **Name**: `my-lms`
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free (perfect for development)
5. Click "Create new project"

**⏱️ Wait time**: ~2 minutes while Supabase provisions your database

**What you're getting**:
- PostgreSQL database with 500MB storage
- Authentication with email, OAuth, magic links
- File storage with 1GB
- Realtime subscriptions
- Auto-generated REST API

#### 3.3: Get API Keys

Once your project shows "Project is ready":

1. Click **Settings** (gear icon in sidebar)
2. Click **API** in settings menu
3. You'll see:

```
Project URL
https://abcdefghijklmnop.supabase.co
```

```
Project API keys
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Security Note**:
- `anon public`: Safe to use in browser (has RLS protection)
- `service_role`: NEVER expose in browser (bypasses RLS)

#### 3.4: Configure Environment Variables

Create `.env.local` in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-service-key
```

**Replace** `your-project-id`, `your-anon-key`, and `your-service-key` with YOUR actual values.

**Understanding environment variables**:
- `NEXT_PUBLIC_*`: Available in browser (client-side)
- No prefix: Only available on server (secure)
- `.env.local`: Never committed to git (already in `.gitignore`)

**Restart your dev server** after adding env variables:
```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

---

**🎉 Checkpoint**: You now have:
- ✅ Next.js project running
- ✅ TechShu CLI installed
- ✅ Authentication boilerplate added
- ✅ Supabase project created
- ✅ Environment variables configured

**Next**: We'll create the database tables and build the login page!

---

### 📝 Step 5: Add Course Management (10 minutes)

Now let's add the ability to create and manage courses.

#### 5.1: Add Course Management Boilerplate

```bash
techshu add course-management --path ./src/lib

# Install additional dependencies
npm install react-hook-form zod
```

#### 5.2: Run Course Database Migrations

In Supabase SQL Editor, run these migrations:

1. `src/lib/course-management/database/01_courses_table.sql`
2. `src/lib/course-management/database/02_modules_table.sql`
3. `src/lib/course-management/database/03_chapters_table.sql`
4. `src/lib/course-management/database/04_rls_policies.sql`

**What did we create?**
- `courses` table: Store course information
- `modules` table: Group chapters into modules
- `chapters` table: Individual lessons
- RLS policies: Instructors can only edit their own courses

#### 5.3: Create Course Creation Page

Create `src/app/dashboard/courses/new/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/authentication/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function NewCoursePage() {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError('You must be logged in to create a course')
        return
      }

      // Create course
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          title,
          description,
          instructor_id: user.id,
          published: false,
        })
        .select()
        .single()

      if (courseError) throw courseError

      // Redirect to course edit page
      router.push(`/dashboard/courses/${course.id}/edit`)

    } catch (err) {
      console.error('Error creating course:', err)
      setError('Failed to create course. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Create New Course</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Course Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Introduction to Web Development"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Course Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Learn the fundamentals of web development..."
            rows={6}
            required
            disabled={loading}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Course'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
```

#### 5.4: Create Course List Page

Create `src/app/dashboard/courses/page.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/authentication/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  published: boolean
  created_at: string
}

export default function CoursesPage() {
  const router = useRouter()
  const supabase = createClient()

  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setCourses(data || [])
    } catch (err) {
      console.error('Error fetching courses:', err)
      setError('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Button onClick={() => router.push('/dashboard/courses/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't created any courses yet.</p>
          <Button onClick={() => router.push('/dashboard/courses/new')}>
            Create Your First Course
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/dashboard/courses/${course.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    course.published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {course.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-3">
                {course.description}
              </p>
              <div className="mt-4 text-xs text-gray-500">
                Created {new Date(course.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

### 🎉 Checkpoint: What You've Built

At this point, you have:
- ✅ A working Next.js application
- ✅ User authentication (login/signup)
- ✅ Course creation functionality
- ✅ Course listing page
- ✅ Database with proper security (RLS)
- ✅ Professional UI with Tailwind CSS

**Test it out**:
1. Sign up for an account
2. Create a course
3. View your courses list
4. Try creating another course

---

### 📚 What's Next?

**Tutorial 2**: Add AI-powered Q&A with RAG
**Tutorial 3**: Build an admin dashboard
**Tutorial 4**: Implement email notifications

---

*Created with ❤️ by [Indranil Banerjee](https://in.linkedin.com/in/askneelnow)*
*Head of AI Transformation, INT TechShu*

📧 hi@indranil.in | 💼 [LinkedIn](https://in.linkedin.com/in/askneelnow) | 🌐 [indranil.in](https://indranil.in)

