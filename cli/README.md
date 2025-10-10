# 🚀 TechShu CLI

**The fastest way to add production-ready boilerplates to your project**

> 💡 **One command, instant boilerplates**: No copy-paste, no manual setup. Just `techshu add` and you're done.

---

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g @techshu/cli
```

### Local Installation

```bash
npm install --save-dev @techshu/cli
```

### Use Without Installing (npx)

```bash
npx @techshu/cli list
```

---

## 🎯 Quick Start

```bash
# List all available boilerplates
techshu list

# Search for a boilerplate
techshu search authentication

# Get info about a boilerplate
techshu info authentication

# Add a boilerplate to your project
techshu add authentication

# Add to a specific path
techshu add authentication --path ./src/lib

# Force overwrite existing files
techshu add authentication --force
```

---

## 📚 Commands

### `techshu list`

List all available boilerplates.

```bash
# List all boilerplates
techshu list

# Filter by category
techshu list --category "AI & Intelligence"
techshu list -c "Admin & Management"
```

**Output**:
```
TechShu Boilerplates v1.0.0

AI & INTELLIGENCE
  rag-system - Complete RAG implementation with vector search
    Files: 15 | Components: 3 | Lib: 5
  embedding-service - Multi-provider embedding service
    Files: 8 | Components: 0 | Lib: 3
  ...

Total: 42 boilerplates
```

---

### `techshu search <query>`

Search for boilerplates by name, description, or tags.

```bash
# Search by keyword
techshu search auth
techshu search email
techshu search AI
```

**Output**:
```
Found 3 result(s):

  authentication - Complete authentication system with Supabase
    Category: Utilities | Files: 25
    Tags: auth, supabase, login, signup

  admin-user-management - User management for admins
    Category: Admin & Management | Files: 18
    Tags: admin, users, management
```

---

### `techshu info <boilerplate>`

Get detailed information about a specific boilerplate.

```bash
techshu info authentication
techshu info rag-system
```

**Output**:
```
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

Add a boilerplate to your project.

```bash
# Add to default location (./src)
techshu add authentication

# Add to custom path
techshu add authentication --path ./lib
techshu add authentication -p ./app/lib

# Force overwrite existing files
techshu add authentication --force
techshu add authentication -f
```

**What happens**:
1. ✅ Downloads all boilerplate files from GitHub
2. ✅ Creates directory structure
3. ✅ Copies all components, lib files, examples
4. ✅ Shows installation instructions
5. ✅ Lists required dependencies

**Output**:
```
✔ Authentication System added successfully!

Location: ./src/authentication

Install dependencies:
  npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

Read the README: ./src/authentication/README.md
```

---

## 🎓 Usage Examples

### Example 1: Building an LMS

```bash
# Add authentication
techshu add authentication

# Add course management
techshu add course-management

# Add progress tracking
techshu add progress-tracking

# Add email service
techshu add email-service

# Install all dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs react-hook-form zod
```

### Example 2: Adding AI Features

```bash
# Add RAG system
techshu add rag-system

# Add embedding service
techshu add embedding-service

# Add AI testing
techshu add ai-testing

# Install dependencies
npm install openai @supabase/supabase-js pgvector
```

### Example 3: Building Admin Dashboard

```bash
# Add admin dashboard
techshu add admin-dashboard

# Add user management
techshu add admin-user-management

# Add analytics
techshu add analytics-dashboard

# Install dependencies
npm install recharts date-fns
```

---

## 🔧 Configuration

### Custom Registry URL

You can use a custom registry URL by setting an environment variable:

```bash
export TECHSHU_REGISTRY_URL=https://your-custom-registry.com/registry.json
```

### Custom Base URL

```bash
export TECHSHU_BASE_URL=https://your-custom-base.com
```

---

## 🐛 Troubleshooting

### Issue: "Boilerplate not found"

**Cause**: The boilerplate ID is incorrect or doesn't exist.

**Solution**:
```bash
# List all boilerplates to find the correct ID
techshu list

# Search for the boilerplate
techshu search <keyword>
```

---

### Issue: "Failed to fetch boilerplates"

**Cause**: Network issue or GitHub is down.

**Solution**:
1. Check your internet connection
2. Try again in a few minutes
3. Check GitHub status: https://www.githubstatus.com/

---

### Issue: "Directory already exists"

**Cause**: The destination directory already has files.

**Solution**:
```bash
# Use --force to overwrite
techshu add authentication --force

# Or choose a different path
techshu add authentication --path ./src/lib/auth
```

---

### Issue: "Permission denied"

**Cause**: No write permission in the destination directory.

**Solution**:
```bash
# Run with sudo (Linux/Mac)
sudo techshu add authentication

# Or change directory permissions
chmod +w ./src
```

---

## 📖 API Reference

### Registry Format

The CLI fetches boilerplates from a JSON registry:

```json
{
  "name": "TechShu Boilerplates",
  "version": "1.0.0",
  "boilerplates": [
    {
      "id": "authentication",
      "name": "Authentication System",
      "category": "Utilities",
      "version": "1.0.0",
      "description": "Complete authentication system",
      "tags": ["auth", "supabase"],
      "files": 25,
      "components": 8,
      "lib": 5,
      "path": "authentication",
      "dependencies": ["@supabase/supabase-js"]
    }
  ]
}
```

---

## 🤝 Contributing

Found a bug? Have a feature request?

1. **Report bugs**: [GitHub Issues](https://github.com/teachskillofskills-ai/techshu-boilerplates/issues)
2. **Request features**: [GitHub Discussions](https://github.com/teachskillofskills-ai/techshu-boilerplates/discussions)
3. **Submit PRs**: Fork, create branch, submit PR

---

## 📝 License

MIT License - See [LICENSE](./LICENSE) for details

---

## 👨‍💻 Author

**Indranil Banerjee**  
*Head of AI Transformation, INT TechShu*

- 📧 Email: hi@indranil.in
- 💼 LinkedIn: [askneelnow](https://in.linkedin.com/in/askneelnow)
- 🌐 Website: [indranil.in](https://indranil.in)

---

## 🙏 Acknowledgments

Built with:
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Chalk](https://github.com/chalk/chalk) - Terminal styling
- [Ora](https://github.com/sindresorhus/ora) - Spinners
- [Inquirer](https://github.com/SBoudrias/Inquirer.js) - Interactive prompts
- [Axios](https://github.com/axios/axios) - HTTP client

---

*Created with ❤️ by [Indranil Banerjee](https://in.linkedin.com/in/askneelnow)*

© 2025 TechShu - All Rights Reserved

