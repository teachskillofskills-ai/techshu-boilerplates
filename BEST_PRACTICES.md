# 🎯 Best Practices

Guidelines for using TechShu Boilerplates effectively in your projects.

---

## Table of Contents

1. [Project Setup](#project-setup)
2. [Code Organization](#code-organization)
3. [Security](#security)
4. [Performance](#performance)
5. [Database](#database)
6. [API Usage](#api-usage)
7. [Deployment](#deployment)
8. [Maintenance](#maintenance)

---

## Project Setup

### ✅ DO: Use a Consistent Structure

```
my-app/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # Shared components
│   ├── lib/              # Boilerplates and utilities
│   │   ├── authentication/
│   │   ├── email-service/
│   │   └── ai-service/
│   └── types/            # TypeScript types
├── public/               # Static assets
└── .env.local           # Environment variables
```

### ✅ DO: Install Boilerplates in `src/lib/`

```bash
techshu add authentication --path ./src/lib
techshu add email-service --path ./src/lib
```

### ❌ DON'T: Mix boilerplate code with your app code

```typescript
// ❌ Bad
src/app/auth/login.tsx  // Your code
src/app/auth/supabase.ts  // Boilerplate code

// ✅ Good
src/app/auth/login.tsx  // Your code
src/lib/authentication/  // Boilerplate code
```

### ✅ DO: Keep `.env.example` Updated

```env
# .env.example
NEXT_PUBLIC_SUPABASE_URL=your-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-key-here
OPENAI_API_KEY=your-openai-key-here
BREVO_API_KEY=your-brevo-key-here
```

---

## Code Organization

### ✅ DO: Create Wrapper Functions

Instead of using boilerplate functions directly everywhere, create wrappers:

```typescript
// lib/email.ts
import { sendEmail as brevoSendEmail } from '@/lib/email-service/lib/brevo-service'

export async function sendEmail(options: EmailOptions) {
  // Add your custom logic
  console.log('Sending email to:', options.to)
  
  // Call boilerplate function
  return brevoSendEmail(options)
}
```

### ✅ DO: Extend Boilerplate Components

```typescript
// components/CustomButton.tsx
import { Button } from '@/lib/form-components/components/button'

export function CustomButton({ children, ...props }) {
  return (
    <Button
      className="bg-gradient-to-r from-blue-500 to-purple-500"
      {...props}
    >
      {children}
    </Button>
  )
}
```

### ✅ DO: Use TypeScript Properly

```typescript
// types/course.ts
import type { Database } from '@/lib/authentication/types/database'

export type Course = Database['public']['Tables']['courses']['Row']
export type CourseInsert = Database['public']['Tables']['courses']['Insert']
```

### ❌ DON'T: Modify Boilerplate Files Directly

```typescript
// ❌ Bad: Editing boilerplate file
// lib/authentication/lib/supabase/client.ts
export function createClient() {
  // Your custom code here
}

// ✅ Good: Create wrapper
// lib/supabase.ts
import { createClient as createSupabaseClient } from '@/lib/authentication/lib/supabase/client'

export function createClient() {
  const client = createSupabaseClient()
  // Your custom logic
  return client
}
```

---

## Security

### ✅ DO: Use Environment Variables

```typescript
// ✅ Good
const apiKey = process.env.OPENAI_API_KEY

// ❌ Bad
const apiKey = 'sk-1234567890'
```

### ✅ DO: Use Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view published courses"
ON courses FOR SELECT
USING (published = true);

CREATE POLICY "Instructors can edit own courses"
ON courses FOR UPDATE
USING (auth.uid() = instructor_id);
```

### ✅ DO: Validate User Input

```typescript
import { z } from 'zod'

const courseSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(1000),
  price: z.number().positive()
})

export async function createCourse(data: unknown) {
  // Validate
  const validated = courseSchema.parse(data)
  
  // Create course
  return supabase.from('courses').insert(validated)
}
```

### ✅ DO: Use Service Role Key Only on Server

```typescript
// ✅ Good: Server-side only
// app/api/admin/route.ts
import { createClient } from '@/lib/authentication/lib/supabase/server'

export async function GET() {
  const supabase = createClient()  // Uses service role key
  // ...
}

// ❌ Bad: Client-side
// app/admin/page.tsx
'use client'
const supabase = createClient()  // Never use service role on client!
```

### ✅ DO: Sanitize HTML Content

```typescript
import DOMPurify from 'isomorphic-dompurify'

const cleanHTML = DOMPurify.sanitize(userInput)
```

---

## Performance

### ✅ DO: Use Server Components by Default

```typescript
// ✅ Good: Server Component (default)
export default async function CoursesPage() {
  const courses = await getCourses()
  return <CourseList courses={courses} />
}

// Only use Client Components when needed
'use client'
export function InteractiveButton() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### ✅ DO: Implement Caching

```typescript
import { unstable_cache } from 'next/cache'

export const getCourses = unstable_cache(
  async () => {
    const { data } = await supabase.from('courses').select('*')
    return data
  },
  ['courses'],
  { revalidate: 3600 }  // Cache for 1 hour
)
```

### ✅ DO: Lazy Load Components

```typescript
import dynamic from 'next/dynamic'

const AITutor = dynamic(
  () => import('@/ai-chat-system/components/AdvancedAITutor'),
  { loading: () => <p>Loading AI Tutor...</p> }
)
```

### ✅ DO: Optimize Images

```typescript
import Image from 'next/image'

<Image
  src="/course-image.jpg"
  alt="Course"
  width={800}
  height={600}
  priority  // For above-the-fold images
/>
```

### ✅ DO: Use Streaming for AI Responses

```typescript
// Already implemented in ai-chat-system boilerplate
const stream = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [...],
  stream: true
})

for await (const chunk of stream) {
  // Stream to client
}
```

---

## Database

### ✅ DO: Use Indexes

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_progress_user_chapter ON progress(user_id, chapter_id);
```

### ✅ DO: Use Transactions

```typescript
const { data, error } = await supabase.rpc('enroll_student', {
  p_user_id: userId,
  p_course_id: courseId
})

// SQL function with transaction
CREATE OR REPLACE FUNCTION enroll_student(
  p_user_id UUID,
  p_course_id UUID
) RETURNS void AS $$
BEGIN
  -- Insert enrollment
  INSERT INTO enrollments (user_id, course_id)
  VALUES (p_user_id, p_course_id);
  
  -- Update course enrollment count
  UPDATE courses
  SET enrollment_count = enrollment_count + 1
  WHERE id = p_course_id;
END;
$$ LANGUAGE plpgsql;
```

### ✅ DO: Use Database Functions for Complex Logic

```sql
CREATE OR REPLACE FUNCTION calculate_course_progress(
  p_user_id UUID,
  p_course_id UUID
) RETURNS NUMERIC AS $$
DECLARE
  total_chapters INTEGER;
  completed_chapters INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_chapters
  FROM chapters
  WHERE course_id = p_course_id;
  
  SELECT COUNT(*) INTO completed_chapters
  FROM progress
  WHERE user_id = p_user_id
    AND chapter_id IN (
      SELECT id FROM chapters WHERE course_id = p_course_id
    )
    AND completed = true;
  
  RETURN (completed_chapters::NUMERIC / total_chapters * 100);
END;
$$ LANGUAGE plpgsql;
```

### ✅ DO: Clean Up Old Data

```sql
-- Delete old AI chat sessions (older than 30 days)
DELETE FROM ai_chat_sessions
WHERE created_at < NOW() - INTERVAL '30 days';
```

---

## API Usage

### ✅ DO: Implement Rate Limiting

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s')
})

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 })
  }
  
  // Process request
}
```

### ✅ DO: Handle Errors Gracefully

```typescript
try {
  const result = await generateAIResponse(prompt)
  return result
} catch (error) {
  if (error.code === 'rate_limit_exceeded') {
    return { error: 'Please try again in a moment' }
  }
  
  if (error.code === 'insufficient_quota') {
    return { error: 'Service temporarily unavailable' }
  }
  
  // Log error
  console.error('AI Error:', error)
  
  return { error: 'Something went wrong' }
}
```

### ✅ DO: Use Retry Logic

```typescript
async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url)
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

---

## Deployment

### ✅ DO: Use Environment-Specific Configs

```typescript
// config.ts
export const config = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  },
  
  ai: {
    enabled: process.env.ENABLE_AI === 'true',
    model: process.env.AI_MODEL || 'gpt-3.5-turbo'
  }
}
```

### ✅ DO: Set Up Monitoring

```typescript
// lib/monitoring.ts
export function logError(error: Error, context?: any) {
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service
    // Sentry, LogRocket, etc.
  } else {
    console.error(error, context)
  }
}
```

### ✅ DO: Use Health Checks

```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database
    await supabase.from('profiles').select('count').single()
    
    // Check AI service
    if (process.env.ENABLE_AI) {
      await openai.models.list()
    }
    
    return Response.json({ status: 'healthy' })
  } catch (error) {
    return Response.json({ status: 'unhealthy', error }, { status: 500 })
  }
}
```

---

## Maintenance

### ✅ DO: Keep Boilerplates Updated

```bash
# Check for updates
techshu update

# Re-fetch specific boilerplate
techshu add email-service --force
```

### ✅ DO: Document Your Customizations

```typescript
// lib/email.ts
/**
 * Custom email wrapper
 * 
 * Extends the email-service boilerplate with:
 * - Custom logging
 * - Error tracking
 * - Analytics
 */
export async function sendEmail(options: EmailOptions) {
  // Your customizations
}
```

### ✅ DO: Write Tests

```typescript
// __tests__/email.test.ts
import { sendEmail } from '@/lib/email'

describe('Email Service', () => {
  it('should send email successfully', async () => {
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test',
      html: '<p>Test</p>'
    })
    
    expect(result.success).toBe(true)
  })
})
```

### ✅ DO: Monitor Performance

```typescript
// lib/monitoring.ts
export async function trackPerformance(name: string, fn: () => Promise<any>) {
  const start = Date.now()
  
  try {
    const result = await fn()
    const duration = Date.now() - start
    
    console.log(`${name} took ${duration}ms`)
    
    return result
  } catch (error) {
    console.error(`${name} failed:`, error)
    throw error
  }
}

// Usage
await trackPerformance('Generate AI Response', () =>
  generateAIResponse(prompt)
)
```

---

## Summary

**Key Takeaways**:
1. Keep boilerplates in `src/lib/`
2. Create wrappers instead of modifying boilerplates
3. Use environment variables for secrets
4. Implement RLS for security
5. Use Server Components for performance
6. Cache expensive operations
7. Monitor and log errors
8. Keep boilerplates updated

---

## Need Help?

- **Examples**: [EXAMPLES.md](./EXAMPLES.md)
- **Tutorials**: [TUTORIALS.md](./TUTORIALS.md)
- **FAQ**: [FAQ.md](./FAQ.md)
- **Discussions**: https://github.com/teachskillofskills-ai/techshu-boilerplates/discussions

---

## Author

**Created with ❤️ by [Indranil Banerjee](https://in.linkedin.com/in/askneelnow)**
*Head of AI Transformation, INT TechShu*

© 2025 TechShu - Created by Indranil Banerjee

