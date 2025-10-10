# 🧪 TechShu CLI Testing Guide

**Complete guide to test the CLI before publishing**

---

## 🚀 Quick Test (5 minutes)

### Step 1: Build the CLI

```bash
cd boilerplates/cli

# Install dependencies
npm install

# Build TypeScript
npm run build

# Verify build
ls dist/index.js  # Should exist
```

### Step 2: Test Locally

```bash
# Link the CLI globally for testing
npm link

# Test commands
techshu --version
techshu --help
techshu list
```

### Step 3: Test Adding a Boilerplate

```bash
# Create a test project
mkdir test-project
cd test-project
npm init -y

# Add a boilerplate
techshu add authentication

# Verify files were downloaded
ls src/authentication/  # Should contain files
```

### Step 4: Cleanup

```bash
# Unlink the CLI
npm unlink -g @techshu/cli

# Remove test project
cd ..
rm -rf test-project
```

---

## 🧪 Comprehensive Testing

### Test 1: Installation

**Test global installation**:
```bash
npm install -g @techshu/cli
techshu --version
# Expected: 1.0.0
```

**Test local installation**:
```bash
mkdir test-local
cd test-local
npm init -y
npm install --save-dev @techshu/cli
npx techshu --version
# Expected: 1.0.0
```

**Test npx (no installation)**:
```bash
npx @techshu/cli --version
# Expected: 1.0.0
```

---

### Test 2: List Command

**Test basic list**:
```bash
techshu list
```

**Expected output**:
```
✔ Boilerplates loaded

TechShu Boilerplates v1.0.0

AI & INTELLIGENCE
  rag-system - Complete RAG implementation with vector search
    Files: 15 | Components: 3 | Lib: 5
  embedding-service - Multi-provider embedding service
    Files: 8 | Components: 0 | Lib: 3
  ...

Total: 42 boilerplates
```

**Test category filter**:
```bash
techshu list --category "AI & Intelligence"
techshu list -c "Utilities"
```

**Expected**: Only boilerplates from that category

---

### Test 3: Search Command

**Test search by name**:
```bash
techshu search auth
```

**Expected output**:
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

**Test search by tag**:
```bash
techshu search AI
techshu search email
techshu search supabase
```

**Test no results**:
```bash
techshu search nonexistent
```

**Expected**: "No results found"

---

### Test 4: Info Command

**Test valid boilerplate**:
```bash
techshu info authentication
```

**Expected output**:
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

**Test invalid boilerplate**:
```bash
techshu info nonexistent
```

**Expected**: "Boilerplate 'nonexistent' not found"

---

### Test 5: Add Command

**Test basic add**:
```bash
mkdir test-add
cd test-add
npm init -y

techshu add authentication
```

**Expected**:
1. ✅ Spinner shows "Downloading Authentication System..."
2. ✅ Success message: "Authentication System added successfully!"
3. ✅ Shows location: "./src/authentication"
4. ✅ Shows dependencies to install
5. ✅ Files are downloaded to ./src/authentication/

**Verify files**:
```bash
ls src/authentication/
# Expected: README.md, components/, lib/, etc.

cat src/authentication/README.md
# Expected: Authentication documentation
```

**Test custom path**:
```bash
techshu add email-service --path ./lib
```

**Expected**: Files in ./lib/email-service/

**Test force overwrite**:
```bash
# Add again without force (should prompt)
techshu add authentication

# Add with force (should overwrite)
techshu add authentication --force
```

**Test invalid boilerplate**:
```bash
techshu add nonexistent
```

**Expected**: "Boilerplate 'nonexistent' not found"

---

## 🐛 Error Scenarios to Test

### Scenario 1: No Internet Connection

**Test**:
```bash
# Disconnect internet
techshu list
```

**Expected**: "Failed to fetch boilerplates" with network error

---

### Scenario 2: GitHub API Rate Limit

**Test**:
```bash
# Make 60+ requests in an hour
for i in {1..65}; do techshu list; done
```

**Expected**: Rate limit error with helpful message

---

### Scenario 3: Invalid Destination Path

**Test**:
```bash
techshu add authentication --path /root/no-permission
```

**Expected**: Permission denied error

---

### Scenario 4: Existing Files

**Test**:
```bash
# Add boilerplate
techshu add authentication

# Try to add again
techshu add authentication
```

**Expected**: Prompt "Directory already exists. Overwrite?"

---

## ✅ Acceptance Criteria

Before publishing, verify:

### Functionality
- [ ] `techshu --version` shows correct version
- [ ] `techshu --help` shows all commands
- [ ] `techshu list` shows all 42 boilerplates
- [ ] `techshu list -c "category"` filters correctly
- [ ] `techshu search <query>` finds relevant boilerplates
- [ ] `techshu info <id>` shows detailed information
- [ ] `techshu add <id>` downloads all files correctly
- [ ] `techshu add <id> --path <path>` uses custom path
- [ ] `techshu add <id> --force` overwrites existing files

### Error Handling
- [ ] Invalid boilerplate ID shows helpful error
- [ ] Network errors are caught and displayed
- [ ] Permission errors are handled gracefully
- [ ] Existing files prompt for confirmation

### User Experience
- [ ] Spinners show during long operations
- [ ] Success messages are clear and helpful
- [ ] Error messages are actionable
- [ ] Colors make output readable
- [ ] Progress is visible during downloads

### Documentation
- [ ] README.md is complete and accurate
- [ ] All commands are documented
- [ ] Examples work as shown
- [ ] Troubleshooting section is helpful

---

## 📊 Performance Benchmarks

### Expected Performance

| Command | Expected Time | Acceptable Time |
|---------|---------------|-----------------|
| `techshu list` | < 2 seconds | < 5 seconds |
| `techshu search` | < 2 seconds | < 5 seconds |
| `techshu info` | < 2 seconds | < 5 seconds |
| `techshu add` (small) | < 10 seconds | < 30 seconds |
| `techshu add` (large) | < 30 seconds | < 60 seconds |

**Test**:
```bash
time techshu list
time techshu search auth
time techshu info authentication
time techshu add authentication
```

---

## 🔍 Manual Testing Checklist

### Pre-Publish Checklist

- [ ] **Build succeeds**: `npm run build` completes without errors
- [ ] **No TypeScript errors**: `tsc --noEmit` passes
- [ ] **Dependencies installed**: `npm install` works
- [ ] **Package.json correct**: version, name, bin path
- [ ] **README complete**: all sections filled
- [ ] **Examples work**: all code examples tested
- [ ] **Links valid**: all URLs work

### Post-Publish Checklist

- [ ] **NPM package published**: visible on npmjs.com
- [ ] **Global install works**: `npm install -g @techshu/cli`
- [ ] **Commands work**: all commands tested
- [ ] **Files download**: boilerplates download correctly
- [ ] **Documentation accessible**: README visible on npm

---

## 🚀 Publishing Checklist

### Before Publishing

1. **Update version**:
```bash
npm version patch  # or minor, or major
```

2. **Build**:
```bash
npm run build
```

3. **Test locally**:
```bash
npm link
techshu list
techshu add authentication
npm unlink -g @techshu/cli
```

4. **Commit changes**:
```bash
git add .
git commit -m "chore: prepare CLI v1.0.0 for publish"
git push
```

### Publishing

```bash
# Login to npm (first time only)
npm login

# Publish
npm publish --access public

# Verify
npm view @techshu/cli
```

### After Publishing

1. **Test installation**:
```bash
npm install -g @techshu/cli
techshu --version
```

2. **Update documentation**:
- Update main README with npm install instructions
- Add badge: `[![npm version](https://badge.fury.io/js/%40techshu%2Fcli.svg)](https://www.npmjs.com/package/@techshu/cli)`

3. **Announce**:
- GitHub release
- LinkedIn post
- Documentation update

---

## 🐛 Known Issues & Workarounds

### Issue 1: PowerShell Execution Policy

**Problem**: `npm` commands fail with "running scripts is disabled"

**Workaround**:
```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or use cmd.exe instead of PowerShell
```

### Issue 2: GitHub API Rate Limit

**Problem**: Too many requests to GitHub API

**Workaround**:
- Use GitHub token for authentication
- Cache registry.json locally
- Implement exponential backoff

### Issue 3: Large Boilerplates Timeout

**Problem**: Large boilerplates take too long to download

**Workaround**:
- Increase timeout
- Show progress bar
- Download in parallel

---

*Created with ❤️ by [Indranil Banerjee](https://in.linkedin.com/in/askneelnow)*  
*Head of AI Transformation, INT TechShu*

📧 hi@indranil.in | 💼 [LinkedIn](https://in.linkedin.com/in/askneelnow) | 🌐 [indranil.in](https://indranil.in)

© 2025 TechShu - All Rights Reserved

