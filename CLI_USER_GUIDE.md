# 🚀 TechShu CLI - Complete User Guide

**The easiest way to use TechShu Boilerplates in your projects**

**✨ Version 1.1.0** - Now with interactive mode, beautiful formatting, and helpful guidance!

> 💡 **Why use the CLI?** Instead of manually copying files from GitHub, the CLI downloads everything with one command, sets up the structure, and tells you exactly what to do next. **Now with interactive browse mode for beginners!**

---

## 📦 Installation

### Option 1: Global Installation (Recommended)

Install once, use everywhere:

```bash
npm install -g @techshu/cli
```

**Verify installation**:
```bash
techshu --version
# Output: 1.1.0
```

### Option 2: Use Without Installing (npx)

No installation needed:

```bash
npx @techshu/cli list
npx @techshu/cli add authentication
```

### Option 3: Local Installation (Project-specific)

Install in your project:

```bash
npm install --save-dev @techshu/cli
```

**Use with npx**:
```bash
npx techshu list
```

---

## 🎯 Quick Start (2 minutes)

### 🌟 NEW! Interactive Mode (Perfect for Beginners)

The easiest way to get started:

```bash
techshu browse
```

**What happens**:
1. Beautiful welcome banner appears
2. Choose from:
   - 🔍 Browse by category
   - 🔎 Search boilerplates
   - 📋 View all boilerplates
3. Select a boilerplate with arrow keys
4. View details and confirm
5. Choose installation path
6. Done! Files downloaded with progress tracking

**Perfect for**:
- First-time users
- Exploring what's available
- Guided installation experience

### Classic Mode (For Experienced Users)

#### Step 1: See What's Available

```bash
techshu list
```

You'll see all 42 boilerplates organized by category with beautiful formatting.

#### Step 2: Find What You Need

```bash
# Search for authentication
techshu search auth

# Search for AI features
techshu search AI

# Search for email
techshu search email
```

#### Step 3: Get Details

```bash
techshu info authentication
```

You'll see a beautiful box with:
- What it does
- What files it includes
- What dependencies you need
- How to install it

#### Step 4: Add to Your Project

```bash
techshu add authentication
```

That's it! The CLI will:
1. ✅ Download all files with progress tracking
2. ✅ Create the directory structure
3. ✅ Show success celebration 🎉
4. ✅ Tell you what dependencies to install
5. ✅ Show you where to find the README
6. ✅ Give you helpful tips

---

## 📚 Complete Command Reference

### `techshu browse` 🎯 NEW!

**Interactive mode** - Browse and add boilerplates with guided experience.

```bash
techshu browse
```

**Features**:
- Browse by category
- Search functionality
- Interactive selection with arrow keys
- View details before installing
- Confirmation prompts
- Guided installation

**Perfect for**: Beginners, exploring, guided experience

---

### `techshu list`

**What it does**: Shows all available boilerplates

**Usage**:
```bash
# Show all boilerplates
techshu list

# Filter by category
techshu list --category "AI & Intelligence"
techshu list -c "Utilities"
```

**Example output**:
```
✔ Boilerplates loaded

TechShu Boilerplates v1.0.0

AI & INTELLIGENCE
  rag-system - Complete RAG implementation with vector search
    Files: 15 | Components: 3 | Lib: 5
  
  embedding-service - Multi-provider embedding service
    Files: 8 | Components: 0 | Lib: 3

UTILITIES
  authentication - Complete authentication system with Supabase
    Files: 25 | Components: 8 | Lib: 5

Total: 42 boilerplates
```

---

### `techshu search <query>`

**What it does**: Finds boilerplates matching your search

**Usage**:
```bash
techshu search auth
techshu search email
techshu search AI
techshu search course
```

**Example output**:
```
✔ Search complete

Found 2 result(s):

  authentication - Complete authentication system with Supabase
    Category: Utilities | Files: 25
    Tags: auth, supabase, login, signup

  admin-user-management - User management for admins
    Category: Admin & Management | Files: 18
    Tags: admin, users, management
```

---

### `techshu info <boilerplate>`

**What it does**: Shows detailed information about a boilerplate

**Usage**:
```bash
techshu info authentication
techshu info rag-system
techshu info email-service
```

**Example output**:
```
✔ Information loaded

Authentication System v1.0.0

Complete authentication system with Supabase Auth

Category: Utilities
Path: authentication

Files: 25
Components: 8
Lib files: 5

Tags: auth, supabase, login, signup, password-reset

Dependencies:
  - @supabase/supabase-js
  - @supabase/auth-helpers-nextjs

To add: techshu add authentication
```

---

### `techshu add <boilerplate>`

**What it does**: Downloads and installs a boilerplate in your project

**Usage**:
```bash
# Add to default location (./src)
techshu add authentication

# Add to custom path
techshu add authentication --path ./lib
techshu add authentication -p ./app/components

# Force overwrite existing files
techshu add authentication --force
techshu add authentication -f
```

**What happens**:
1. Downloads all files from GitHub
2. Creates directory structure
3. Copies components, lib files, examples, database schemas
4. Shows you what dependencies to install
5. Points you to the README

**Example output**:
```
⠹ Downloading Authentication System...
✔ Authentication System added successfully!

Location: ./src/authentication

Install dependencies:
  npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

Read the README: ./src/authentication/README.md
```

---

## 🎓 Real-World Examples

### Example 1: Building a Learning Management System

```bash
# Create your Next.js project
npx create-next-app@latest my-lms
cd my-lms

# Add authentication
techshu add authentication

# Add course management
techshu add course-management

# Add progress tracking
techshu add progress-tracking

# Add email notifications
techshu add email-service

# Install all dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs react-hook-form zod

# Start development
npm run dev
```

**Time saved**: 2-3 weeks of development

---

### Example 2: Adding AI Features to Existing App

```bash
# Navigate to your project
cd my-existing-app

# Add RAG system
techshu add rag-system --path ./src/lib

# Add embedding service
techshu add embedding-service --path ./src/lib

# Add AI testing
techshu add ai-testing --path ./src/lib

# Install dependencies
npm install openai @supabase/supabase-js pgvector

# Follow the README for setup
cat src/lib/rag-system/README.md
```

**Time saved**: 1-2 weeks of development

---

### Example 3: Building an Admin Dashboard

```bash
# Add admin components
techshu add admin-dashboard

# Add user management
techshu add admin-user-management

# Add analytics
techshu add analytics-dashboard

# Install dependencies
npm install recharts date-fns

# Customize the components
# Edit src/admin-dashboard/components/...
```

**Time saved**: 1 week of development

---

## 🔧 Advanced Usage

### Custom Installation Path

By default, boilerplates are installed to `./src/<boilerplate-id>`.

**Change the path**:
```bash
# Install to ./lib
techshu add authentication --path ./lib

# Install to ./app/components
techshu add ui-components --path ./app/components

# Install to current directory
techshu add authentication --path .
```

---

### Force Overwrite

If a boilerplate already exists, the CLI will ask before overwriting.

**Skip the prompt**:
```bash
techshu add authentication --force
```

**Use case**: Updating to the latest version

---

### Batch Installation

Install multiple boilerplates at once:

```bash
# Create a script
cat > install-boilerplates.sh << 'EOF'
#!/bin/bash
techshu add authentication
techshu add course-management
techshu add email-service
techshu add admin-dashboard
EOF

# Make it executable
chmod +x install-boilerplates.sh

# Run it
./install-boilerplates.sh
```

---

## 🐛 Troubleshooting

### Problem: "Command not found: techshu"

**Cause**: CLI not installed or not in PATH

**Solution**:
```bash
# If installed globally
npm install -g @techshu/cli

# Or use npx
npx @techshu/cli list

# Check if it's installed
npm list -g @techshu/cli
```

---

### Problem: "Boilerplate not found"

**Cause**: Incorrect boilerplate ID

**Solution**:
```bash
# List all boilerplates to find the correct ID
techshu list

# Or search for it
techshu search <keyword>
```

---

### Problem: "Failed to fetch boilerplates"

**Cause**: Network issue or GitHub is down

**Solution**:
1. Check your internet connection
2. Try again in a few minutes
3. Check GitHub status: https://www.githubstatus.com/

---

### Problem: "Directory already exists"

**Cause**: Boilerplate already installed

**Solution**:
```bash
# Use --force to overwrite
techshu add authentication --force

# Or choose a different path
techshu add authentication --path ./src/lib/auth
```

---

### Problem: "Permission denied"

**Cause**: No write permission

**Solution**:
```bash
# Linux/Mac: Run with sudo
sudo techshu add authentication

# Or change directory permissions
chmod +w ./src

# Windows: Run as Administrator
```

---

## 💡 Pro Tips

### Tip 1: Check Before Installing

Always run `techshu info <boilerplate>` before adding to see:
- What files will be downloaded
- What dependencies you'll need
- What the boilerplate does

### Tip 2: Read the README

Every boilerplate has a detailed README with:
- Setup instructions
- Usage examples
- Configuration options
- Troubleshooting

### Tip 3: Install Dependencies Immediately

After adding a boilerplate, install dependencies right away:
```bash
techshu add authentication
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### Tip 4: Customize Gradually

Don't modify everything at once:
1. Use the boilerplate as-is first
2. Understand how it works
3. Then customize to your needs

### Tip 5: Keep Updated

Check for updates regularly:
```bash
# Update the CLI
npm update -g @techshu/cli

# Re-download boilerplates to get latest version
techshu add authentication --force
```

---

## 📊 What Gets Downloaded?

When you run `techshu add <boilerplate>`, you get:

### File Structure
```
src/<boilerplate-id>/
├── README.md              # Documentation
├── components/            # React components
│   ├── Component1.tsx
│   └── Component2.tsx
├── lib/                   # Utilities & services
│   ├── service.ts
│   └── utils.ts
├── hooks/                 # Custom React hooks
│   └── useHook.ts
├── api/                   # API routes
│   └── route.ts
├── database/              # SQL schemas & migrations
│   ├── schema.sql
│   └── rls-policies.sql
└── examples/              # Usage examples
    └── example.tsx
```

### What's Included
- ✅ All source code
- ✅ TypeScript types
- ✅ Database schemas
- ✅ Example usage
- ✅ Documentation
- ✅ Configuration files

---

## 🎯 Next Steps

1. **Explore boilerplates**: `techshu list`
2. **Find what you need**: `techshu search <keyword>`
3. **Add to your project**: `techshu add <boilerplate>`
4. **Read the README**: Check the downloaded README.md
5. **Install dependencies**: Run the npm install command shown
6. **Start building**: Follow the examples in the README

---

## 🆘 Need Help?

- 📧 **Email**: hi@indranil.in
- 💼 **LinkedIn**: [Indranil Banerjee](https://in.linkedin.com/in/askneelnow)
- 🐛 **Issues**: [GitHub Issues](https://github.com/teachskillofskills-ai/techshu-boilerplates/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/teachskillofskills-ai/techshu-boilerplates/discussions)

---

*Created with ❤️ by [Indranil Banerjee](https://in.linkedin.com/in/askneelnow)*  
*Head of AI Transformation, INT TechShu*

📧 hi@indranil.in | 💼 [LinkedIn](https://in.linkedin.com/in/askneelnow) | 🌐 [indranil.in](https://indranil.in)

© 2025 TechShu - All Rights Reserved

