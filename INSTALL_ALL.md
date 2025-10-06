# 🚀 Complete Installation Guide

## Quick Install - All Boilerplates

This guide will help you install all 33 boilerplates with their dependencies.

---

## 📦 Installation Methods

### Method 1: Install All Dependencies (Recommended)

```bash
# Navigate to boilerplates directory
cd boilerplates

# Install all dependencies for all boilerplates
npm install --save \
  @supabase/supabase-js \
  openai \
  brevo \
  lucide-react \
  recharts \
  @tanstack/react-table \
  @tiptap/react \
  @tiptap/starter-kit \
  @tiptap/extension-link \
  @tiptap/extension-image \
  @tiptap/extension-code-block-lowlight \
  jspdf \
  html2canvas \
  date-fns \
  zod \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-select \
  @radix-ui/react-tabs \
  @radix-ui/react-toast \
  class-variance-authority \
  clsx \
  tailwind-merge

# Install dev dependencies
npm install --save-dev \
  @types/react \
  @types/node \
  typescript \
  tailwindcss \
  postcss \
  autoprefixer
```

### Method 2: Install Per Boilerplate

Each boilerplate has its own `package.json`. Install dependencies as needed:

```bash
# Example: AI Chat System
cd boilerplates/ai-chat-system
npm install

# Example: Email Service
cd boilerplates/email-service
npm install
```

### Method 3: Copy to Your Project

```bash
# Copy boilerplate to your project
cp -r boilerplates/ai-chat-system /path/to/your-project/src/lib/

# Install dependencies in your project
cd /path/to/your-project
npm install openai lucide-react @supabase/supabase-js
```

---

## 🔧 Configuration

### 1. Environment Variables

Create `.env.local` in your project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_key

# OpenRouter (for AI fallback)
OPENROUTER_API_KEY=your_openrouter_key

# Google Gemini (optional)
GOOGLE_GEMINI_API_KEY=your_gemini_key

# Brevo Email
BREVO_API_KEY=your_brevo_key

# VAPI Voice AI (optional)
VAPI_API_KEY=your_vapi_key
VAPI_ASSISTANT_ID=your_assistant_id
```

### 2. Tailwind CSS Configuration

Add to your `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    // Add boilerplates if copied to your project
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Add your custom colors
      },
    },
  },
  plugins: [],
}
```

### 3. TypeScript Configuration

Ensure your `tsconfig.json` has path aliases:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/app/*": ["./app/*"]
    }
  }
}
```

---

## 📚 Boilerplate-Specific Setup

### AI Chat System

```bash
# 1. Copy files
cp -r boilerplates/ai-chat-system ./src/lib/chat

# 2. Install dependencies
npm install openai lucide-react

# 3. Add environment variables
echo "OPENAI_API_KEY=your_key" >> .env.local

# 4. Use in your app
import { AdvancedAITutor } from '@/lib/chat/components/AdvancedAITutor'
```

### Email Service

```bash
# 1. Copy files
cp -r boilerplates/email-service ./src/lib/email

# 2. Install dependencies
npm install brevo

# 3. Add environment variables
echo "BREVO_API_KEY=your_key" >> .env.local

# 4. Use in your app
import { BrevoEmailService } from '@/lib/email/brevo-service'
```

### Design System

```bash
# 1. Copy files
cp -r boilerplates/design-system ./src/lib/design

# 2. No additional dependencies needed

# 3. Use in your app
import { colorPalettes } from '@/lib/design/tokens'
import { useTheme } from '@/lib/design/hooks'
```

### Course Management

```bash
# 1. Copy files
cp -r boilerplates/course-management ./src/components/courses

# 2. Install dependencies
npm install @supabase/supabase-js lucide-react zod

# 3. Set up database (see database/ folder)

# 4. Use in your app
import { CourseCreationForm } from '@/components/courses/CourseCreationForm'
```

### Admin Dashboard

```bash
# 1. Copy files
cp -r boilerplates/admin-dashboard ./src/app/admin

# 2. Install dependencies
npm install recharts @tanstack/react-table

# 3. Set up authentication middleware

# 4. Access at /admin
```

---

## 🗄️ Database Setup

Many boilerplates require database tables. Run the SQL migrations:

```bash
# Connect to your Supabase project
# Run migrations from database/ folders

# Example: User Management
psql -h your-db-host -U postgres -d your-db < boilerplates/user-management/database/schema.sql

# Or use Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Copy SQL from database/ folder
# 3. Run the query
```

---

## ✅ Verification

Test each boilerplate after installation:

```bash
# Start your development server
npm run dev

# Test features:
# - AI Chat: Visit /test-chat
# - Email: Send a test email
# - Design System: Check theme switching
# - Course Management: Create a test course
```

---

## 🐛 Troubleshooting

### Import Errors

```bash
# Error: Cannot find module '@/lib/...'

# Solution: Check tsconfig.json path aliases
# Ensure baseUrl and paths are configured correctly
```

### Missing Dependencies

```bash
# Error: Cannot find module 'openai'

# Solution: Install the dependency
npm install openai
```

### Environment Variables Not Working

```bash
# Error: process.env.OPENAI_API_KEY is undefined

# Solution 1: Check .env.local exists
ls -la .env.local

# Solution 2: Restart dev server
npm run dev

# Solution 3: Use NEXT_PUBLIC_ prefix for client-side
NEXT_PUBLIC_SUPABASE_URL=...
```

### TypeScript Errors

```bash
# Error: Type errors

# Solution: Install type definitions
npm install -D @types/node @types/react

# Ensure tsconfig.json has strict: true
```

---

## 📖 Next Steps

1. **Read individual READMEs** - Each boilerplate has detailed documentation
2. **Check examples/** - See working code examples
3. **Review database/** - Understand database schemas
4. **Test in development** - Verify everything works
5. **Customize** - Adapt to your needs
6. **Deploy** - Push to production

---

## 🎯 Quick Start Checklist

- [ ] Install dependencies
- [ ] Configure environment variables
- [ ] Set up Tailwind CSS
- [ ] Configure TypeScript
- [ ] Run database migrations
- [ ] Copy boilerplates to project
- [ ] Test in development
- [ ] Read individual READMEs
- [ ] Customize for your needs
- [ ] Deploy to production

---

## 💡 Pro Tips

1. **Start small** - Don't install everything at once
2. **Test thoroughly** - Verify each boilerplate works
3. **Read docs** - Each README has important details
4. **Customize** - Adapt to your project's needs
5. **Version control** - Commit changes incrementally
6. **Share** - Help your team use these boilerplates

---

**You're all set! Start building amazing applications! 🚀**

