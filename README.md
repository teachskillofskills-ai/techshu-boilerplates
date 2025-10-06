# 🚀 TechShu Boilerplates

<div align="center">

**42 Production-Ready Boilerplates for Next.js 14 + Supabase Applications**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-green.svg)](https://supabase.com/)

*Save 6-12 months of development time with production-tested, plug-and-play boilerplates*

[Quick Start](#-quick-start) • [Documentation](#-documentation) • [Examples](#-examples) • [Contributing](./CONTRIBUTING.md)

</div>

---

## 📊 Overview

A comprehensive collection of **42 production-ready boilerplates** extracted from TechShu LMS. Each boilerplate includes:

- ✅ **203 source files** - Production-tested code
- ✅ **Complete documentation** - 200-300 lines per boilerplate
- ✅ **TypeScript throughout** - Full type safety
- ✅ **Next.js 14 compatible** - App Router ready
- ✅ **Supabase integrated** - Auth, DB, Storage
- ✅ **Security best practices** - RLS, validation, sanitization
- ✅ **Performance optimized** - Caching, lazy loading, compression

---

## 📦 Available Boilerplates (42)

### 🤖 AI & Intelligence (13)
| Boilerplate | Description | Files |
|-------------|-------------|-------|
| **[ai-service](./ai-service/)** | Multi-provider AI with 9-model fallback | 2 |
| **[ai-chat-system](./ai-chat-system/)** | Complete AI chat with session management | 5 |
| **[ai-course-generator](./ai-course-generator/)** | AI-powered course content generation | 3 |
| **[ai-notes-generator](./ai-notes-generator/)** | Automatic note generation | 4 |
| **[ai-content-enhancement](./ai-content-enhancement/)** | Rich text editor with AI | 4 |
| **[ai-chat-storage](./ai-chat-storage/)** | Optimized AI chat storage | 2 |
| **[voice-ai](./voice-ai/)** | Voice AI tutor with VAPI | 3 |
| **[rag-system](./rag-system/)** | Complete RAG with vector embeddings | 3 |
| **[embedding-service](./embedding-service/)** | Multi-provider embedding generation | 2 |
| **[chunking-service](./chunking-service/)** | Document chunking strategies | 1 |
| **[rag-evaluation](./rag-evaluation/)** | RAG quality metrics & testing | 1 |
| **[ai-testing](./ai-testing/)** | AI testing framework | 1 |
| **[ai-debugging](./ai-debugging/)** | AI debugging & monitoring tools | 1 |

### 👨‍💼 Admin & Management (8)
| Boilerplate | Description | Files |
|-------------|-------------|-------|
| **[admin-dashboard](./admin-dashboard/)** | Complete admin panel | 15 |
| **[user-management](./user-management/)** | User approval and management | 3 |
| **[database-admin-tools](./database-admin-tools/)** | Database management | 8 |
| **[analytics-dashboard](./analytics-dashboard/)** | Analytics and statistics | 2 |
| **[role-permission](./role-permission/)** | RBAC system | 4 |
| **[settings-management](./settings-management/)** | User settings | 8 |
| **[content-management](./content-management/)** | Content CMS | 7 |
| **[file-manager](./file-manager/)** | File browser | 8 |

### 📧 Communication (3)
| Boilerplate | Description | Files |
|-------------|-------------|-------|
| **[email-service](./email-service/)** | Production email with Brevo | 9 |
| **[notification-system](./notification-system/)** | Real-time notifications | 2 |
| **[realtime-chat](./realtime-chat/)** | Real-time chat | 2 |

### 📝 Content & Learning (6)
| Boilerplate | Description | Files |
|-------------|-------------|-------|
| **[rich-text-editor](./rich-text-editor/)** | TipTap editor | 2 |
| **[course-management](./course-management/)** | Complete LMS | 19 |
| **[assignment-system](./assignment-system/)** | Assignment management | 7 |
| **[progress-tracking](./progress-tracking/)** | Learning progress | 4 |
| **[notes-system](./notes-system/)** | Note-taking | 4 |
| **[bookmarks-system](./bookmarks-system/)** | Content bookmarks | 3 |

### 🎨 UI & Components (5)
| Boilerplate | Description | Files |
|-------------|-------------|-------|
| **[design-system](./design-system/)** | Design tokens & themes | 7 |
| **[navigation-system](./navigation-system/)** | Universal navigation | 2 |
| **[dashboard-components](./dashboard-components/)** | Dashboard UI | 9 |
| **[form-components](./form-components/)** | 31 shadcn/ui components | 32 |
| **[loading-error-states](./loading-error-states/)** | Loading & error states | 5 |

### 🛠️ Utilities (7)
| Boilerplate | Description | Files |
|-------------|-------------|-------|
| **[storage-optimization](./storage-optimization/)** | Optimized Supabase storage | 2 |
| **[pdf-generator](./pdf-generator/)** | PDF generation | 2 |
| **[seo-components](./seo-components/)** | SEO optimization | 2 |
| **[accessibility](./accessibility/)** | A11y utilities | 2 |
| **[authentication](./authentication/)** | Supabase auth | 4 |
| **[theme-system](./theme-system/)** | Theme & dark mode | 3 |
| **[file-upload](./file-upload/)** | File upload | 4 |

---

## 🎯 Quick Start

### Method 1: Use the CLI (Recommended) ⭐

```bash
# Install CLI globally
npm install -g @techshu/cli

# List available boilerplates
techshu list

# Search for boilerplates
techshu search email

# Add a boilerplate to your project
techshu add email-service

# Add to specific path
techshu add email-service --path ./src/lib
```

### Method 2: Use the API 🔌

```typescript
// Fetch registry
const response = await fetch('https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/registry.json');
const registry = await response.json();

// Fetch a specific component
const componentUrl = 'https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/email-service/lib/brevo-service.ts';
const code = await fetch(componentUrl).then(r => r.text());
```

**See [API.md](./API.md) for complete API documentation**

### Method 3: Manual Installation 📋

### 1. Choose Your Boilerplate
Browse the available boilerplates and select the one you need.

### 2. Copy the Boilerplate
```bash
# Copy the entire boilerplate folder to your project
cp -r boilerplates/authentication ./my-project/
```

### 3. Install Dependencies
Each boilerplate includes a `package.json` snippet with required dependencies:
```bash
npm install [dependencies from boilerplate]
```

### 4. Configure Environment Variables
Copy the `.env.example` from the boilerplate and add your credentials:
```bash
cp boilerplates/authentication/.env.example .env.local
```

### 5. Run Database Migrations
If the boilerplate includes database schemas:
```bash
# Apply the SQL migrations to your Supabase project
supabase db push
```

### 6. Import and Use
Follow the usage examples in each boilerplate's README.

## 📚 Documentation Structure

Each boilerplate includes:

```
boilerplate-name/
├── README.md              # Complete documentation
├── components/            # React components
├── lib/                   # Utilities and services
├── database/              # SQL schemas and migrations
│   ├── schema.sql        # Table definitions
│   ├── rls-policies.sql  # Row Level Security
│   └── functions.sql     # Database functions
├── types/                 # TypeScript types
├── examples/              # Usage examples
├── .env.example          # Environment variables template
└── package.json          # Required dependencies
```

## 🛠️ Tech Stack

All boilerplates are built with:
- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **State**: React Context, Hooks
- **Validation**: Zod
- **Icons**: Lucide React

## 🔧 Customization

Each boilerplate is designed to be easily customizable:

1. **Styling**: All components use Tailwind CSS classes that can be overridden
2. **Configuration**: Centralized config files for easy customization
3. **Types**: Full TypeScript support with exported types
4. **Hooks**: Reusable hooks that can be extended

## 📖 Best Practices

All boilerplates follow these best practices:

- ✅ **TypeScript strict mode** - No `any` types
- ✅ **Server Components by default** - Client components only when needed
- ✅ **Row Level Security** - All database tables have RLS policies
- ✅ **Error handling** - Comprehensive error boundaries and validation
- ✅ **Accessibility** - WCAG 2.1 AA compliant
- ✅ **Performance** - Optimized with lazy loading and caching
- ✅ **Security** - No secrets in client code, input validation
- ✅ **Testing ready** - Structured for easy unit and integration testing

## 🤝 Contributing

To add a new boilerplate:

1. Create a new folder in `boilerplates/`
2. Follow the documentation structure above
3. Include all necessary files and examples
4. Add entry to this README
5. Test the boilerplate in isolation

## 📝 License

These boilerplates are extracted from TechShu LMS and are available for use in your projects.

## 📚 Complete Documentation

### 🌟 NEW: Comprehensive Guides (Start Here!)

**Written from a user's perspective with real-world context, gotchas, and production patterns**

- 📖 **[USER_GUIDE.md](./USER_GUIDE.md)** - Complete guide for all skill levels
- 🎓 **[TUTORIALS_COMPREHENSIVE.md](./TUTORIALS_COMPREHENSIVE.md)** - Deep-dive step-by-step tutorials
- 🎯 **[SCENARIOS_COMPREHENSIVE.md](./SCENARIOS_COMPREHENSIVE.md)** - Real-world use cases with architecture & costs
- 💻 **[EXAMPLES_COMPREHENSIVE.md](./EXAMPLES_COMPREHENSIVE.md)** - Production-ready code examples

### 🚀 Getting Started
- **[QUICK_START.md](./QUICK_START.md)** - 5-minute quick start
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Complete getting started guide
- **[TUTORIALS.md](./TUTORIALS.md)** - Step-by-step tutorials

### 💡 Usage & Examples
- **[EXAMPLES.md](./EXAMPLES.md)** - Real-world code examples
- **[SCENARIOS.md](./SCENARIOS.md)** - Project scenarios (LMS, SaaS, E-commerce)
- **[BEST_PRACTICES.md](./BEST_PRACTICES.md)** - Best practices and patterns

### 🔌 API & Integration
- **[API.md](./API.md)** - Complete API reference
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Integration examples
- **[API_SYSTEM_OVERVIEW.md](./API_SYSTEM_OVERVIEW.md)** - System overview

### 🆘 Help & Support
- **[FAQ.md](./FAQ.md)** - Frequently asked questions
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[GitHub Issues](https://github.com/teachskillofskills-ai/techshu-boilerplates/issues)** - Report bugs
- **[GitHub Discussions](https://github.com/teachskillofskills-ai/techshu-boilerplates/discussions)** - Ask questions

### 📖 Reference
- **[OVERVIEW.md](./OVERVIEW.md)** - Complete overview
- **[HOW_TO_USE_IN_OTHER_PROJECTS.md](./HOW_TO_USE_IN_OTHER_PROJECTS.md)** - Usage guide
- **[INSTALL_ALL.md](./INSTALL_ALL.md)** - Installation guide

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

---

## 👨‍💻 Author

**Made with ❤️ by [Indranil Banerjee](https://in.linkedin.com/in/askneelnow)**
*Head of AI Transformation, INT TechShu*

Connect with me:
- 💼 [LinkedIn](https://in.linkedin.com/in/askneelnow)
- 🏢 [TechShu](https://techshu.com)
- 📧 Personal: hi@indranil.in
- 📧 Work: indranil.banerjee@intglobal.com

---

**© 2025 TechShu - Created by Indranil Banerjee**

