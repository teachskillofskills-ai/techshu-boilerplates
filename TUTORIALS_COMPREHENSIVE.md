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

*Created with ❤️ by [Indranil Banerjee](https://in.linkedin.com/in/askneelnow)*  
*Head of AI Transformation, INT TechShu*

📧 hi@indranil.in | 💼 [LinkedIn](https://in.linkedin.com/in/askneelnow) | 🌐 [indranil.in](https://indranil.in)

