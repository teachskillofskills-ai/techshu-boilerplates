# 🔧 Troubleshooting Guide

Common issues and solutions when using TechShu Boilerplates.

---

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Authentication Issues](#authentication-issues)
3. [Database Issues](#database-issues)
4. [API Issues](#api-issues)
5. [Build & Deployment Issues](#build--deployment-issues)
6. [Performance Issues](#performance-issues)

---

## Installation Issues

### Issue: "Module not found" Error

**Error**:
```
Module not found: Can't resolve '@/lib/authentication'
```

**Solution**:
1. Check if boilerplate was installed correctly:
```bash
ls src/lib/authentication
```

2. Verify `tsconfig.json` has correct paths:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

3. Restart dev server:
```bash
npm run dev
```

---

### Issue: Missing Dependencies

**Error**:
```
Module not found: Can't resolve '@supabase/supabase-js'
```

**Solution**:
Install missing dependencies:
```bash
npm install @supabase/supabase-js @supabase/ssr
```

Check each boilerplate's README for required dependencies.

---

### Issue: CLI Installation Fails

**Error**:
```
npm ERR! 404 Not Found - GET https://registry.npmjs.org/@techshu/cli
```

**Solution**:
The CLI hasn't been published to npm yet. Use boilerplates directly:

```bash
# Method 1: Git sparse checkout
git clone --depth 1 --filter=blob:none --sparse https://github.com/teachskillofskills-ai/techshu-boilerplates.git
cd techshu-boilerplates
git sparse-checkout set email-service

# Method 2: Direct download
curl -o file.ts https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/email-service/lib/brevo-service.ts
```

---

## Authentication Issues

### Issue: "Supabase client not initialized"

**Error**:
```
Error: Supabase client not initialized
```

**Solution**:
1. Check environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

2. Restart dev server after adding env vars:
```bash
npm run dev
```

3. Verify Supabase project is active in dashboard

---

### Issue: "Invalid JWT" or "JWT expired"

**Error**:
```
Error: Invalid JWT token
```

**Solution**:
1. Clear browser cookies and localStorage
2. Log out and log in again
3. Check if Supabase project keys are correct
4. Verify JWT expiry settings in Supabase Dashboard → Authentication → Settings

---

### Issue: "User not authenticated"

**Error**:
```
Error: User not authenticated
```

**Solution**:
1. Check if user is logged in:
```typescript
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user)
```

2. Verify authentication middleware:
```typescript
// middleware.ts
export async function middleware(request: Request) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.redirect('/login')
  }
  
  return NextResponse.next()
}
```

3. Check if session is being persisted:
```typescript
// Make sure you're using the correct Supabase client
import { createClient } from '@/lib/authentication/lib/supabase/client'
```

---

## Database Issues

### Issue: "RLS policy violation"

**Error**:
```
Error: new row violates row-level security policy
```

**Solution**:
1. Check RLS policies in Supabase Dashboard → Database → Policies

2. Verify user has permission:
```sql
-- Example: Allow users to insert their own data
CREATE POLICY "Users can insert own data"
ON table_name FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

3. For admin operations, use service role key (server-side only):
```typescript
import { createClient } from '@/lib/authentication/lib/supabase/server'

const supabase = createClient()  // Uses service role key
```

---

### Issue: "Relation does not exist"

**Error**:
```
Error: relation "courses" does not exist
```

**Solution**:
1. Run database migrations:
   - Go to Supabase Dashboard → SQL Editor
   - Copy SQL from boilerplate's `database/` folder
   - Run it

2. Verify table exists:
```sql
SELECT * FROM information_schema.tables
WHERE table_name = 'courses';
```

3. Check if you're connected to correct database

---

### Issue: "Column does not exist"

**Error**:
```
Error: column "instructor_id" does not exist
```

**Solution**:
1. Check table schema:
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'courses';
```

2. Add missing column:
```sql
ALTER TABLE courses
ADD COLUMN instructor_id UUID REFERENCES profiles(id);
```

3. Update TypeScript types if needed

---

## API Issues

### Issue: "OpenAI API Error"

**Error**:
```
Error: Incorrect API key provided
```

**Solution**:
1. Verify API key in `.env.local`:
```env
OPENAI_API_KEY=sk-...
```

2. Check if key is valid at https://platform.openai.com/api-keys

3. Verify you have credits/quota

4. Check if API is being called from server-side:
```typescript
// ✅ Good: Server-side
// app/api/ai/route.ts
export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY  // Server-side only
}

// ❌ Bad: Client-side
'use client'
const apiKey = process.env.OPENAI_API_KEY  // Won't work!
```

---

### Issue: "Rate limit exceeded"

**Error**:
```
Error: Rate limit exceeded
```

**Solution**:
1. Implement rate limiting:
```typescript
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s')
})
```

2. Add retry logic with exponential backoff:
```typescript
async function retryWithBackoff(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)))
    }
  }
}
```

3. Use AI service fallback (already implemented in ai-service boilerplate)

---

### Issue: "Email not sending"

**Error**:
```
Error: Failed to send email
```

**Solution**:
1. Check Brevo credentials:
```env
BREVO_API_KEY=xkeysib-...
SMTP_USERNAME=...
SMTP_PASSWORD=...
FROM_EMAIL=noreply@yourdomain.com
```

2. Verify sender email is verified in Brevo

3. Check Brevo dashboard for errors

4. Test connection:
```typescript
import { testConnection } from '@/lib/email-service/examples/test-connection'

await testConnection()
```

5. Check spam folder

---

## Build & Deployment Issues

### Issue: Build Fails with Type Errors

**Error**:
```
Type error: Property 'id' does not exist on type 'never'
```

**Solution**:
1. Generate Supabase types:
```bash
npx supabase gen types typescript --project-id your-project-id > src/types/database.ts
```

2. Update imports:
```typescript
import type { Database } from '@/types/database'

type Course = Database['public']['Tables']['courses']['Row']
```

3. Run type check:
```bash
npm run type-check
```

---

### Issue: Environment Variables Not Working in Production

**Error**:
```
Error: NEXT_PUBLIC_SUPABASE_URL is undefined
```

**Solution**:
1. Add environment variables in deployment platform:

**Vercel**:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
```

**Netlify**:
Site settings → Environment variables

2. Verify variables are prefixed correctly:
   - `NEXT_PUBLIC_*` for client-side
   - No prefix for server-side only

3. Redeploy after adding variables

---

### Issue: "Module not found" in Production

**Error**:
```
Module not found: Can't resolve '@/lib/authentication'
```

**Solution**:
1. Check if files are included in build:
```bash
ls .next/server/app
```

2. Verify `.gitignore` doesn't exclude boilerplates:
```gitignore
# ❌ Don't ignore
# src/lib/

# ✅ Do ignore
node_modules/
.env.local
```

3. Check `next.config.js` for any exclusions

---

## Performance Issues

### Issue: Slow Page Load

**Problem**: Pages take too long to load

**Solution**:
1. Use Server Components:
```typescript
// ✅ Good: Server Component
export default async function Page() {
  const data = await getData()
  return <div>{data}</div>
}

// ❌ Bad: Client Component fetching data
'use client'
export default function Page() {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetchData().then(setData)
  }, [])
}
```

2. Implement caching:
```typescript
import { unstable_cache } from 'next/cache'

const getData = unstable_cache(
  async () => {
    return await supabase.from('courses').select('*')
  },
  ['courses'],
  { revalidate: 3600 }
)
```

3. Lazy load components:
```typescript
import dynamic from 'next/dynamic'

const AITutor = dynamic(() => import('@/components/AITutor'), {
  loading: () => <p>Loading...</p>
})
```

---

### Issue: Large Bundle Size

**Problem**: JavaScript bundle is too large

**Solution**:
1. Analyze bundle:
```bash
npm run build
```

2. Use dynamic imports:
```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'))
```

3. Remove unused boilerplates

4. Tree-shake dependencies:
```typescript
// ✅ Good: Import only what you need
import { Button } from '@/components/button'

// ❌ Bad: Import everything
import * as Components from '@/components'
```

---

### Issue: Slow AI Responses

**Problem**: AI takes too long to respond

**Solution**:
1. Use streaming (already implemented):
```typescript
const stream = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',  // Faster than GPT-4
  stream: true
})
```

2. Reduce max tokens:
```typescript
maxTokens: 500  // Instead of 2000
```

3. Use faster models:
```typescript
model: 'gpt-3.5-turbo'  // Instead of 'gpt-4'
```

4. Implement caching for common queries

---

## Still Having Issues?

### 1. Check Documentation
- [README.md](./README.md)
- [EXAMPLES.md](./EXAMPLES.md)
- [FAQ.md](./FAQ.md)
- [TUTORIALS.md](./TUTORIALS.md)

### 2. Search Existing Issues
https://github.com/teachskillofskills-ai/techshu-boilerplates/issues

### 3. Ask for Help
https://github.com/teachskillofskills-ai/techshu-boilerplates/discussions

### 4. Report a Bug
https://github.com/teachskillofskills-ai/techshu-boilerplates/issues/new

---

## Debug Checklist

Before asking for help, try these:

- [ ] Restart dev server
- [ ] Clear browser cache and cookies
- [ ] Check environment variables
- [ ] Verify dependencies are installed
- [ ] Check Supabase dashboard for errors
- [ ] Look at browser console for errors
- [ ] Check server logs
- [ ] Verify database migrations ran
- [ ] Test with minimal reproduction
- [ ] Update to latest boilerplate version

---

## Getting Better Error Messages

Enable detailed error logging:

```typescript
// next.config.js
module.exports = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true
    }
  }
}
```

```typescript
// lib/error-handler.ts
export function handleError(error: unknown) {
  if (error instanceof Error) {
    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    })
  }
}
```

---

## Author

**Created with ❤️ by [Indranil Banerjee](https://in.linkedin.com/in/askneelnow)**
*Head of AI Transformation, INT TechShu*

© 2025 TechShu - Created by Indranil Banerjee

