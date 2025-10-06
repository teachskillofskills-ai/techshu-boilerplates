# 📚 Complete Examples & Use Cases

This guide provides detailed, real-world examples of how to use TechShu boilerplates in your projects.

---

## Table of Contents

1. [Building a Complete LMS](#building-a-complete-lms)
2. [Building a SaaS Application](#building-a-saas-application)
3. [Building an E-commerce Platform](#building-an-e-commerce-platform)
4. [Building a Social Learning Platform](#building-a-social-learning-platform)
5. [Building an Internal Admin Tool](#building-an-internal-admin-tool)
6. [Individual Boilerplate Examples](#individual-boilerplate-examples)

---

## Building a Complete LMS

### Scenario
You're building a Learning Management System like Udemy or Coursera.

### Required Boilerplates
```bash
techshu add authentication
techshu add course-management
techshu add assignment-system
techshu add progress-tracking
techshu add ai-chat-system
techshu add email-service
techshu add payment-integration
```

### Step-by-Step Implementation

#### 1. Setup Authentication (15 minutes)

```bash
# Add authentication
techshu add authentication --path ./src/lib

# Install dependencies
npm install @supabase/supabase-js @supabase/ssr
```

**Create Supabase client** (`src/lib/supabase/client.ts`):
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Apply database migrations**:
```sql
-- Run the SQL from authentication/database/01_profiles_table.sql
-- Run the SQL from authentication/database/02_rls_policies.sql
```

**Create login page** (`app/login/page.tsx`):
```typescript
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (!error) {
      router.push('/dashboard')
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  )
}
```

#### 2. Add Course Management (30 minutes)

```bash
techshu add course-management --path ./src
```

**Create courses page** (`app/courses/page.tsx`):
```typescript
import { createClient } from '@/lib/supabase/server'
import { OptimizedCourseCard } from '@/components/OptimizedCourseCard'

export default async function CoursesPage() {
  const supabase = createClient()
  
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {courses?.map(course => (
        <OptimizedCourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
```

**Create course detail page** (`app/courses/[id]/page.tsx`):
```typescript
import { createClient } from '@/lib/supabase/server'
import { ChapterNavigation } from '@/components/ChapterNavigation'
import { EnrollmentButton } from '@/components/EnrollmentButton'
import { ProgressTracker } from '@/components/ProgressTracker'

export default async function CoursePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  const { data: course } = await supabase
    .from('courses')
    .select('*, modules(*, chapters(*))')
    .eq('id', params.id)
    .single()
  
  return (
    <div>
      <h1>{course.title}</h1>
      <EnrollmentButton courseId={course.id} />
      <ProgressTracker courseId={course.id} />
      <ChapterNavigation modules={course.modules} />
    </div>
  )
}
```

#### 3. Add AI Chat Tutor (20 minutes)

```bash
techshu add ai-chat-system --path ./src
npm install openai
```

**Add AI tutor to course page**:
```typescript
import { AdvancedAITutor } from '@/components/AdvancedAITutor'

export default function CoursePage() {
  return (
    <div>
      {/* Course content */}
      
      {/* AI Tutor */}
      <AdvancedAITutor
        courseId={courseId}
        chapterId={chapterId}
        context={{
          courseTitle: course.title,
          chapterContent: chapter.content
        }}
      />
    </div>
  )
}
```

#### 4. Add Email Notifications (15 minutes)

```bash
techshu add email-service --path ./src/lib
npm install @getbrevo/brevo
```

**Send welcome email on enrollment**:
```typescript
import { sendEmail } from '@/lib/email-service/lib/brevo-service'

async function enrollStudent(courseId: string, userId: string) {
  // Enroll student
  await supabase.from('enrollments').insert({
    course_id: courseId,
    user_id: userId
  })
  
  // Send welcome email
  await sendEmail({
    to: user.email,
    subject: 'Welcome to the course!',
    html: `<h1>You're enrolled!</h1><p>Start learning now.</p>`
  })
}
```

#### 5. Add Progress Tracking (10 minutes)

```bash
techshu add progress-tracking --path ./src
```

**Track chapter completion**:
```typescript
import { ProgressTracker } from '@/components/ProgressTracker'

export default function ChapterPage() {
  const handleComplete = async () => {
    await supabase.from('progress').upsert({
      user_id: userId,
      chapter_id: chapterId,
      completed: true,
      completed_at: new Date().toISOString()
    })
  }
  
  return (
    <div>
      <ProgressTracker courseId={courseId} />
      <button onClick={handleComplete}>Mark as Complete</button>
    </div>
  )
}
```

### Result
**Total Time**: ~90 minutes  
**What You Built**: Complete LMS with:
- User authentication
- Course browsing and enrollment
- Chapter navigation
- AI tutor
- Progress tracking
- Email notifications

**Time Saved**: 2-3 months of development

---

## Building a SaaS Application

### Scenario
You're building a SaaS product with user management, subscriptions, and admin panel.

### Required Boilerplates
```bash
techshu add authentication
techshu add admin-dashboard
techshu add user-management
techshu add role-permission
techshu add email-service
techshu add analytics-dashboard
techshu add settings-management
```

### Implementation

#### 1. Setup Authentication & User Management

```typescript
// app/admin/users/page.tsx
import { UserManagementTable } from '@/components/UserManagementTable'
import { createClient } from '@/lib/supabase/server'

export default async function UsersPage() {
  const supabase = createClient()
  
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  
  return <UserManagementTable users={users} />
}
```

#### 2. Add Role-Based Access Control

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
  
  // Check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (request.url.includes('/admin') && profile.role !== 'admin') {
    return NextResponse.redirect('/dashboard')
  }
  
  return NextResponse.next()
}
```

#### 3. Add Admin Dashboard

```typescript
// app/admin/page.tsx
import { AdminSidebar } from '@/components/AdminSidebar'
import { AdminMainContent } from '@/components/AdminMainContent'
import { DashboardStats } from '@/components/DashboardStats'

export default function AdminPage() {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1">
        <DashboardStats />
        <AdminMainContent />
      </main>
    </div>
  )
}
```

#### 4. Add Email Service for Notifications

```typescript
// lib/notifications.ts
import { sendEmail } from '@/lib/email-service/lib/brevo-service'

export async function sendUserWelcome(email: string, name: string) {
  await sendEmail({
    to: email,
    subject: 'Welcome to Our Platform!',
    html: `
      <h1>Welcome ${name}!</h1>
      <p>Thanks for signing up.</p>
    `
  })
}

export async function sendSubscriptionConfirmation(email: string, plan: string) {
  await sendEmail({
    to: email,
    subject: 'Subscription Confirmed',
    html: `
      <h1>You're subscribed to ${plan}!</h1>
      <p>Your subscription is now active.</p>
    `
  })
}
```

### Result
**Total Time**: ~2 hours  
**What You Built**: Complete SaaS with:
- User authentication
- Admin panel
- User management
- Role-based access
- Email notifications
- Analytics dashboard

**Time Saved**: 1-2 months

---

## Building an E-commerce Platform

### Scenario
You're building an online store with products, cart, and checkout.

### Required Boilerplates
```bash
techshu add authentication
techshu add file-upload
techshu add email-service
techshu add admin-dashboard
techshu add analytics-dashboard
```

### Implementation

#### 1. Product Management

```typescript
// app/admin/products/page.tsx
import { FileUploadManager } from '@/components/FileUploadManager'

export default function ProductsPage() {
  const handleProductCreate = async (formData: FormData) => {
    // Upload product images
    const imageUrls = await uploadProductImages(formData.getAll('images'))
    
    // Create product
    await supabase.from('products').insert({
      name: formData.get('name'),
      description: formData.get('description'),
      price: formData.get('price'),
      images: imageUrls
    })
  }
  
  return (
    <form onSubmit={handleProductCreate}>
      <input name="name" placeholder="Product Name" />
      <textarea name="description" placeholder="Description" />
      <input name="price" type="number" placeholder="Price" />
      <FileUploadManager
        bucket="products"
        onUploadComplete={(urls) => console.log(urls)}
      />
      <button type="submit">Create Product</button>
    </form>
  )
}
```

#### 2. Order Confirmation Emails

```typescript
// lib/orders.ts
import { sendEmail } from '@/lib/email-service/lib/brevo-service'

export async function sendOrderConfirmation(order: Order) {
  await sendEmail({
    to: order.customer_email,
    subject: `Order Confirmation #${order.id}`,
    html: `
      <h1>Thanks for your order!</h1>
      <p>Order #${order.id}</p>
      <ul>
        ${order.items.map(item => `
          <li>${item.name} x ${item.quantity} - $${item.price}</li>
        `).join('')}
      </ul>
      <p><strong>Total: $${order.total}</strong></p>
    `
  })
}
```

### Result
**Total Time**: ~3 hours  
**What You Built**: E-commerce platform with:
- Product management
- Image uploads
- Order processing
- Email confirmations
- Admin dashboard

**Time Saved**: 3-4 weeks

---

## Individual Boilerplate Examples

### Email Service Example

```typescript
import { sendEmail, sendBulkEmail } from '@/lib/email-service/lib/brevo-service'

// Send single email
await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome!',
  html: '<h1>Welcome to our platform!</h1>'
})

// Send bulk emails
await sendBulkEmail([
  { to: 'user1@example.com', subject: 'Newsletter', html: '...' },
  { to: 'user2@example.com', subject: 'Newsletter', html: '...' }
])

// Use template
await sendEmail({
  to: 'user@example.com',
  templateId: 1,
  params: {
    name: 'John',
    course: 'React Basics'
  }
})
```

### AI Service Example

```typescript
import { generateAIResponse } from '@/lib/ai-service/lib/service'

// Generate course content
const content = await generateAIResponse({
  prompt: 'Create a lesson about React hooks',
  context: 'This is for beginners',
  maxTokens: 1000
})

// Generate quiz questions
const quiz = await generateAIResponse({
  prompt: 'Create 5 multiple choice questions about React hooks',
  format: 'json'
})
```

### File Upload Example

```typescript
import { FileUploadManager } from '@/components/FileUploadManager'

export default function UploadPage() {
  return (
    <FileUploadManager
      bucket="assignments"
      maxSize={10 * 1024 * 1024} // 10MB
      allowedTypes={['pdf', 'docx', 'txt']}
      onUploadComplete={(urls) => {
        console.log('Uploaded files:', urls)
      }}
      onError={(error) => {
        console.error('Upload failed:', error)
      }}
    />
  )
}
```

---

## More Examples

See individual boilerplate READMEs for detailed examples:
- [Authentication Examples](./authentication/README.md)
- [Course Management Examples](./course-management/README.md)
- [Email Service Examples](./email-service/README.md)
- [AI Service Examples](./ai-service/README.md)

---

## Need Help?

- **Issues**: https://github.com/teachskillofskills-ai/techshu-boilerplates/issues
- **Discussions**: https://github.com/teachskillofskills-ai/techshu-boilerplates/discussions

---

## Author

**Created with ❤️ by [Indranil Banerjee](https://in.linkedin.com/in/askneelnow)**
*Head of AI Transformation, INT TechShu*

© 2025 TechShu - Created by Indranil Banerjee

