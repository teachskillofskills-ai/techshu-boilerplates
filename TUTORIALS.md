# 📖 Step-by-Step Tutorials

Complete tutorials for building real applications with TechShu Boilerplates.

---

## Table of Contents

1. [Tutorial 1: Build a Simple LMS in 30 Minutes](#tutorial-1-build-a-simple-lms-in-30-minutes)
2. [Tutorial 2: Add AI Tutor to Your App](#tutorial-2-add-ai-tutor-to-your-app)
3. [Tutorial 3: Build an Admin Dashboard](#tutorial-3-build-an-admin-dashboard)
4. [Tutorial 4: Implement Email Notifications](#tutorial-4-implement-email-notifications)
5. [Tutorial 5: Create a User Management System](#tutorial-5-create-a-user-management-system)

---

## Tutorial 1: Build a Simple LMS in 30 Minutes

### What You'll Build
A learning management system where users can browse courses, enroll, and track progress.

### Prerequisites
- Node.js 18+
- Supabase account
- Basic Next.js knowledge

### Step 1: Create Next.js Project (2 minutes)

```bash
npx create-next-app@latest my-lms
cd my-lms
```

Choose:
- ✅ TypeScript
- ✅ ESLint
- ✅ Tailwind CSS
- ✅ App Router
- ✅ `src/` directory

### Step 2: Install TechShu CLI (1 minute)

```bash
npm install -g @techshu/cli
```

### Step 3: Add Authentication (5 minutes)

```bash
# Add authentication boilerplate
techshu add authentication --path ./src/lib

# Install dependencies
npm install @supabase/supabase-js @supabase/ssr
```

**Create environment file** (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Run database migrations**:
1. Go to Supabase Dashboard → SQL Editor
2. Copy content from `src/lib/authentication/database/01_profiles_table.sql`
3. Run it
4. Copy content from `src/lib/authentication/database/02_rls_policies.sql`
5. Run it

**Create login page** (`src/app/login/page.tsx`):
```typescript
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/authentication/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      alert(error.message)
    } else {
      router.push('/dashboard')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>
        
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
          required
        />
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-2 border rounded"
          required
        />
        
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
```

### Step 4: Add Course Management (10 minutes)

```bash
# Add course management
techshu add course-management --path ./src

# Install dependencies
npm install lucide-react
```

**Create courses table in Supabase**:
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES profiles(id),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  course_id UUID REFERENCES courses(id),
  enrolled_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view published courses"
ON courses FOR SELECT
USING (published = true);

CREATE POLICY "Users can view their enrollments"
ON enrollments FOR SELECT
USING (auth.uid() = user_id);
```

**Create courses page** (`src/app/courses/page.tsx`):
```typescript
import { createClient } from '@/lib/authentication/lib/supabase/server'
import { OptimizedCourseCard } from '@/course-management/components/OptimizedCourseCard'

export default async function CoursesPage() {
  const supabase = createClient()
  
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Available Courses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses?.map(course => (
          <OptimizedCourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}
```

### Step 5: Add Progress Tracking (5 minutes)

```bash
techshu add progress-tracking --path ./src
```

**Create progress table**:
```sql
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  chapter_id UUID NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  UNIQUE(user_id, chapter_id)
);

ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
ON progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
ON progress FOR UPDATE
USING (auth.uid() = user_id);
```

**Add progress tracker to course page**:
```typescript
import { ProgressTracker } from '@/progress-tracking/components/ProgressTracker'

export default function CoursePage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Course Content</h1>
      <ProgressTracker courseId={params.id} />
    </div>
  )
}
```

### Step 6: Add Email Notifications (5 minutes)

```bash
techshu add email-service --path ./src/lib
npm install @getbrevo/brevo
```

**Add Brevo credentials to `.env.local`**:
```env
BREVO_API_KEY=your-brevo-api-key
SMTP_USERNAME=your-smtp-username
SMTP_PASSWORD=your-smtp-password
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=My LMS
```

**Send welcome email on enrollment**:
```typescript
import { sendEmail } from '@/lib/email-service/lib/brevo-service'

async function enrollStudent(courseId: string, userId: string) {
  // Enroll
  await supabase.from('enrollments').insert({
    course_id: courseId,
    user_id: userId
  })
  
  // Get user email
  const { data: profile } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .single()
  
  // Send email
  await sendEmail({
    to: profile.email,
    subject: 'Welcome to the course!',
    html: `
      <h1>You're enrolled!</h1>
      <p>Start learning now.</p>
    `
  })
}
```

### Step 7: Test Your LMS (2 minutes)

```bash
npm run dev
```

Visit:
- http://localhost:3000/login - Login page
- http://localhost:3000/courses - Browse courses
- http://localhost:3000/courses/[id] - Course detail with progress

### 🎉 Done!

You've built a functional LMS in 30 minutes with:
- ✅ User authentication
- ✅ Course browsing
- ✅ Enrollment
- ✅ Progress tracking
- ✅ Email notifications

**Time Saved**: 2-3 months of development

---

## Tutorial 2: Add AI Tutor to Your App

### What You'll Build
An AI-powered tutor that helps students with course content.

### Prerequisites
- Existing Next.js app
- OpenAI API key

### Step 1: Add AI Chat System (2 minutes)

```bash
techshu add ai-chat-system --path ./src
npm install openai
```

### Step 2: Configure OpenAI (1 minute)

Add to `.env.local`:
```env
OPENAI_API_KEY=your-openai-api-key
```

### Step 3: Create AI API Route (3 minutes)

Copy from `src/ai-chat-system/api/route.ts` to `src/app/api/ai-chat/route.ts`

### Step 4: Add AI Tutor Component (2 minutes)

```typescript
// app/courses/[id]/page.tsx
import { AdvancedAITutor } from '@/ai-chat-system/components/AdvancedAITutor'

export default function CoursePage({ params }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Course content */}
      <div className="col-span-2">
        <CourseContent />
      </div>
      
      {/* AI Tutor */}
      <div>
        <AdvancedAITutor
          courseId={params.id}
          context={{
            courseTitle: "React Basics",
            chapterContent: "Learn about React hooks..."
          }}
        />
      </div>
    </div>
  )
}
```

### Step 5: Test AI Tutor (1 minute)

Visit your course page and ask the AI tutor questions!

### 🎉 Done!

You've added an AI tutor in 10 minutes!

---

## Tutorial 3: Build an Admin Dashboard

### What You'll Build
A complete admin panel for managing users and content.

### Step 1: Add Admin Dashboard (2 minutes)

```bash
techshu add admin-dashboard --path ./src
techshu add user-management --path ./src
```

### Step 2: Create Admin Layout (3 minutes)

```typescript
// app/admin/layout.tsx
import { AdminSidebar } from '@/admin-dashboard/components/AdminSidebar'

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
```

### Step 3: Create Admin Pages (5 minutes)

**Users page** (`app/admin/users/page.tsx`):
```typescript
import { UserManagementTable } from '@/user-management/components/UserManagementTable'
import { createClient } from '@/lib/authentication/lib/supabase/server'

export default async function AdminUsersPage() {
  const supabase = createClient()
  
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <UserManagementTable users={users} />
    </div>
  )
}
```

### Step 4: Add Role Protection (5 minutes)

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request: Request) {
  const supabase = createServerClient(/* ... */)
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.redirect('/login')
  }
  
  // Check if admin
  if (request.url.includes('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profile.role !== 'admin') {
      return NextResponse.redirect('/dashboard')
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
```

### 🎉 Done!

You have a complete admin dashboard!

---

## Tutorial 4: Implement Email Notifications

### Step 1: Setup Brevo (5 minutes)

1. Sign up at https://www.brevo.com
2. Get API key from Settings → API Keys
3. Add to `.env.local`

### Step 2: Add Email Service (2 minutes)

```bash
techshu add email-service --path ./src/lib
npm install @getbrevo/brevo
```

### Step 3: Create Email Templates (5 minutes)

```typescript
// lib/email-templates.ts
export const welcomeEmail = (name: string) => `
  <h1>Welcome ${name}!</h1>
  <p>Thanks for joining our platform.</p>
`

export const courseEnrollmentEmail = (courseName: string) => `
  <h1>You're enrolled in ${courseName}!</h1>
  <p>Start learning now.</p>
`

export const completionEmail = (courseName: string) => `
  <h1>Congratulations!</h1>
  <p>You've completed ${courseName}!</p>
`
```

### Step 4: Send Emails (3 minutes)

```typescript
import { sendEmail } from '@/lib/email-service/lib/brevo-service'
import { welcomeEmail } from '@/lib/email-templates'

// On user signup
await sendEmail({
  to: user.email,
  subject: 'Welcome!',
  html: welcomeEmail(user.name)
})

// On course enrollment
await sendEmail({
  to: user.email,
  subject: 'Course Enrollment',
  html: courseEnrollmentEmail(course.title)
})
```

### 🎉 Done!

Email notifications are working!

---

## Tutorial 5: Create a User Management System

### Step 1: Add User Management (2 minutes)

```bash
techshu add user-management --path ./src
techshu add role-permission --path ./src
```

### Step 2: Create Users Table (3 minutes)

Already done if you added authentication!

### Step 3: Create User Management Page (5 minutes)

```typescript
// app/admin/users/page.tsx
import { UserManagementTable } from '@/user-management/components/UserManagementTable'
import { RoleManagementTable } from '@/role-permission/components/RoleManagementTable'

export default async function UsersPage() {
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
  
  return (
    <div>
      <h1>User Management</h1>
      <UserManagementTable users={users} />
      <RoleManagementTable />
    </div>
  )
}
```

### 🎉 Done!

You have a complete user management system!

---

## Next Steps

- Explore more boilerplates in [SCENARIOS.md](./SCENARIOS.md)
- See real-world examples in [EXAMPLES.md](./EXAMPLES.md)
- Check [FAQ.md](./FAQ.md) for common questions

---

## Need Help?

Ask in [GitHub Discussions](https://github.com/teachskillofskills-ai/techshu-boilerplates/discussions)!

