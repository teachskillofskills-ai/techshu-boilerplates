# 🚀 How to Use Boilerplates in Other Projects

## Complete Guide for Plug-and-Play Integration

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Step-by-Step Integration](#step-by-step-integration)
3. [Framework-Specific Guides](#framework-specific-guides)
4. [Common Scenarios](#common-scenarios)
5. [Troubleshooting](#troubleshooting)

---

## 🎯 Quick Start

### 3-Step Integration

```bash
# 1. Choose a boilerplate
cd boilerplates/email-service

# 2. Copy to your project
cp -r . /path/to/your-project/src/lib/email

# 3. Follow the README
cat README.md
```

---

## 📖 Step-by-Step Integration

### Step 1: Choose Your Boilerplate

Browse the boilerplates directory:

```bash
cd boilerplates/
ls -la

# You'll see:
# - email-service/
# - design-system/
# - ai-service/
# - user-management/
# - etc.
```

### Step 2: Read the README

Every boilerplate has a comprehensive README:

```bash
cd email-service/
cat README.md

# README includes:
# - Features list
# - Installation instructions
# - Quick start guide
# - API reference
# - Examples
# - Troubleshooting
```

### Step 3: Check Dependencies

Look for the "Installation" section in README:

```markdown
## 📦 Installation

npm install brevo date-fns
```

### Step 4: Copy Files to Your Project

```bash
# Copy entire boilerplate
cp -r boilerplates/email-service /path/to/your-project/src/lib/

# Or copy specific files
cp boilerplates/email-service/lib/brevo-service.ts /path/to/your-project/src/lib/
```

### Step 5: Install Dependencies

```bash
cd /path/to/your-project
npm install brevo date-fns
```

### Step 6: Configure Environment Variables

```bash
# Add to .env.local
echo "BREVO_API_KEY=your_api_key_here" >> .env.local
```

### Step 7: Import and Use

```typescript
import { BrevoEmailService } from '@/lib/email/brevo-service'

const emailService = new BrevoEmailService(process.env.BREVO_API_KEY!)

await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Welcome!',
  html: '<h1>Welcome to our app!</h1>'
})
```

### Step 8: Test

```bash
# Run your project
npm run dev

# Test the feature
```

---

## 🎨 Framework-Specific Guides

### Next.js 14 (App Router) ✅ Direct Copy

**Perfect Match!** These boilerplates were extracted from a Next.js 14 App Router project.

```bash
# 1. Copy boilerplate
cp -r boilerplates/authentication /path/to/nextjs-project/src/lib/

# 2. Install dependencies
npm install @supabase/supabase-js

# 3. Add environment variables
echo "NEXT_PUBLIC_SUPABASE_URL=your_url" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key" >> .env.local

# 4. Use in your app
# app/login/page.tsx
import { SignInForm } from '@/lib/authentication/components/SignInForm'

export default function LoginPage() {
  return <SignInForm />
}
```

### Next.js 13 (Pages Router) ⚠️ Minor Adjustments

```bash
# 1. Copy boilerplate
cp -r boilerplates/user-management /path/to/nextjs-project/src/

# 2. Adjust file structure
# Move app/ routes to pages/
# Move app/api/ to pages/api/

# 3. Update imports
# Change: import { ... } from '@/app/...'
# To: import { ... } from '@/pages/...'

# 4. Adjust data fetching
# Replace Server Components with getServerSideProps or getStaticProps
```

### React (Vite) ⚠️ Adjust Server Code

```bash
# 1. Copy client components only
cp -r boilerplates/dashboard-components/components /path/to/react-project/src/

# 2. Remove server-side code
# Delete files with 'use server'
# Remove server actions

# 3. Replace with API calls
# Before (Server Action):
# await updateUser(userId, data)

# After (API Call):
# await fetch('/api/users/' + userId, {
#   method: 'PUT',
#   body: JSON.stringify(data)
# })

# 4. Create API endpoints
# Create Express/Fastify backend
# Implement the same logic
```

### React (Create React App) ⚠️ Adjust Server Code

Same as Vite, plus:

```bash
# Adjust imports
# Change: import { ... } from '@/...'
# To: import { ... } from '../...'

# Or configure path aliases in jsconfig.json
```

### Vue 3 📝 Use as Reference

```bash
# 1. Read the README
cat boilerplates/email-service/README.md

# 2. Understand the API
# - What functions are needed
# - What parameters they take
# - What they return

# 3. Implement in Vue
# Create composables/email.ts
export function useEmail() {
  const sendEmail = async (options) => {
    // Implement using the README as guide
  }
  
  return { sendEmail }
}

# 4. Use in components
<script setup>
import { useEmail } from '@/composables/email'

const { sendEmail } = useEmail()
</script>
```

### Svelte 📝 Use as Reference

```bash
# 1. Read the README
# 2. Create Svelte stores
# 3. Implement logic in stores
# 4. Use in components
```

### Angular 📝 Use as Reference

```bash
# 1. Read the README
# 2. Create services
# 3. Implement logic in services
# 4. Inject in components
```

---

## 💡 Common Scenarios

### Scenario 1: Building a New SaaS App

```bash
# Copy these boilerplates
cp -r boilerplates/authentication ./src/lib/
cp -r boilerplates/user-management ./src/components/
cp -r boilerplates/email-service ./src/lib/
cp -r boilerplates/notification-system ./src/components/
cp -r boilerplates/design-system ./src/lib/
cp -r boilerplates/dashboard-components ./src/components/

# Install dependencies
npm install @supabase/supabase-js brevo lucide-react

# Configure environment
# Add all required env vars

# Start building!
```

### Scenario 2: Adding AI Features to Existing App

```bash
# Copy AI boilerplates
cp -r boilerplates/ai-service ./src/lib/
cp -r boilerplates/ai-chat-system ./src/components/

# Install dependencies
npm install openai

# Add API key
echo "OPENAI_API_KEY=your_key" >> .env.local

# Use in your app
import { AIService } from '@/lib/ai-service/service'
```

### Scenario 3: Building an Admin Dashboard

```bash
# Copy admin boilerplates
cp -r boilerplates/admin-dashboard ./src/app/admin
cp -r boilerplates/user-management ./src/components/
cp -r boilerplates/analytics-dashboard ./src/components/
cp -r boilerplates/database-admin-tools ./src/components/

# Install dependencies
npm install recharts @tanstack/react-table

# Build admin panel
```

### Scenario 4: Adding Email Functionality

```bash
# Copy email boilerplate
cp -r boilerplates/email-service ./src/lib/email

# Install Brevo
npm install brevo

# Configure
echo "BREVO_API_KEY=your_key" >> .env.local

# Use
import { BrevoEmailService } from '@/lib/email/brevo-service'
```

### Scenario 5: Building a Learning Platform

```bash
# Copy learning boilerplates
cp -r boilerplates/course-management ./src/components/
cp -r boilerplates/assignment-system ./src/components/
cp -r boilerplates/progress-tracking ./src/components/
cp -r boilerplates/rich-text-editor ./src/components/
cp -r boilerplates/ai-course-generator ./src/lib/

# Install dependencies
npm install @tiptap/react @tiptap/starter-kit openai

# Build LMS
```

---

## 🔧 Customization Guide

### Adjusting for Your Database

If not using Supabase:

```typescript
// Before (Supabase)
const { data } = await supabase
  .from('users')
  .select('*')

// After (Prisma)
const data = await prisma.user.findMany()

// After (MongoDB)
const data = await User.find()

// After (SQL)
const data = await db.query('SELECT * FROM users')
```

### Adjusting for Your Auth

If not using Supabase Auth:

```typescript
// Before (Supabase)
const { data: { user } } = await supabase.auth.getUser()

// After (NextAuth)
const session = await getServerSession(authOptions)
const user = session?.user

// After (Clerk)
const { userId } = auth()
const user = await clerkClient.users.getUser(userId)

// After (Auth0)
const user = await getSession(req, res)
```

### Adjusting Styling

If not using Tailwind:

```tsx
// Before (Tailwind)
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">

// After (CSS Modules)
<div className={styles.container}>

// After (Styled Components)
<Container>

// After (Material-UI)
<Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
```

---

## 🐛 Troubleshooting

### Issue: Import Errors

```bash
# Error: Cannot find module '@/lib/...'

# Solution 1: Configure path aliases
# tsconfig.json or jsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

# Solution 2: Use relative imports
# Change: import { ... } from '@/lib/...'
# To: import { ... } from '../lib/...'
```

### Issue: Missing Dependencies

```bash
# Error: Cannot find module 'brevo'

# Solution: Install dependencies
npm install brevo

# Check README for all dependencies
```

### Issue: Environment Variables Not Working

```bash
# Error: process.env.BREVO_API_KEY is undefined

# Solution 1: Check .env.local exists
ls -la .env.local

# Solution 2: Restart dev server
npm run dev

# Solution 3: Check variable name
# Next.js: Use NEXT_PUBLIC_ prefix for client-side
NEXT_PUBLIC_SUPABASE_URL=...
```

### Issue: TypeScript Errors

```bash
# Error: Type errors

# Solution 1: Install type definitions
npm install -D @types/node

# Solution 2: Check tsconfig.json
# Ensure "strict": true

# Solution 3: Add type annotations
const data: User[] = await getUsers()
```

### Issue: Server Components Not Working

```bash
# Error: You're importing a component that needs useState

# Solution: Add 'use client' directive
'use client'

import { useState } from 'react'
```

---

## 📚 Examples

### Example 1: Complete Integration

```bash
# 1. Create new Next.js project
npx create-next-app@latest my-app

# 2. Copy boilerplates
cd my-app
cp -r ../TechShuLMS/boilerplates/authentication ./src/lib/
cp -r ../TechShuLMS/boilerplates/email-service ./src/lib/

# 3. Install dependencies
npm install @supabase/supabase-js brevo

# 4. Configure environment
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
BREVO_API_KEY=your_key
EOF

# 5. Create login page
mkdir -p src/app/login
cat > src/app/login/page.tsx << EOF
import { SignInForm } from '@/lib/authentication/components/SignInForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignInForm />
    </div>
  )
}
EOF

# 6. Run
npm run dev
```

### Example 2: Selective Integration

```bash
# Only copy what you need
cp boilerplates/design-system/lib/tokens.ts ./src/lib/
cp boilerplates/design-system/lib/themes.ts ./src/lib/

# Use in your components
import { colorPalettes } from '@/lib/tokens'
```

---

## 🎯 Best Practices

1. **Always read the README first**
2. **Test in development before production**
3. **Customize for your needs**
4. **Keep documentation updated**
5. **Version control your changes**
6. **Share improvements with team**

---

## 🎊 Summary

**You can use these boilerplates in:**
- ✅ Next.js 14 (App Router) - Direct copy
- ✅ Next.js 13 (Pages Router) - Minor adjustments
- ✅ React (Vite/CRA) - Adjust server code
- ✅ Vue 3 - Use as reference
- ✅ Svelte - Use as reference
- ✅ Angular - Use as reference
- ✅ Any JavaScript/TypeScript project

**What you get:**
- ✅ Production-ready code
- ✅ Comprehensive documentation
- ✅ Security best practices
- ✅ Performance optimizations
- ✅ Months of development time saved

**Start building amazing apps today! 🚀**

