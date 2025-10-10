# 🧪 Manual Testing Instructions

**Step-by-step guide to manually test the TechShu CLI**

> 💡 **Important**: Follow these steps in order. Each step builds on the previous one.

---

## ⚙️ Prerequisites

Before you start, make sure you have:
- ✅ Node.js 16+ installed (`node --version`)
- ✅ npm installed (`npm --version`)
- ✅ Internet connection
- ✅ Terminal/Command Prompt access

---

## 🚀 Step 1: Build the CLI (5 minutes)

### 1.1: Navigate to CLI directory

```bash
cd boilerplates/cli
```

### 1.2: Install dependencies

```bash
npm install
```

**Expected output**:
```
added 150 packages in 15s
```

**If you see errors**:
- Check your internet connection
- Try `npm cache clean --force` then `npm install` again

### 1.3: Build TypeScript

```bash
npm run build
```

**Expected output**:
```
> @techshu/cli@1.0.0 build
> tsc
```

### 1.4: Verify build

```bash
# Windows
dir dist\index.js

# Linux/Mac
ls dist/index.js
```

**Expected**: File exists

**If file doesn't exist**:
- Check for TypeScript errors in the output
- Make sure `tsconfig.json` exists
- Try `npm run build` again

---

## 🔗 Step 2: Link CLI Globally (2 minutes)

### 2.1: Link the CLI

```bash
npm link
```

**Expected output**:
```
added 1 package in 1s

🎉 TechShu CLI installed successfully!

Created by: Indranil Banerjee
Head of AI Transformation, INT TechShu
LinkedIn: https://in.linkedin.com/in/askneelnow

Get started: techshu list
```

### 2.2: Verify installation

```bash
techshu --version
```

**Expected output**:
```
1.0.0
```

### 2.3: Check help

```bash
techshu --help
```

**Expected output**:
```
Usage: techshu [options] [command]

CLI tool to fetch TechShu boilerplates and components
Created by Indranil Banerjee - Head of AI Transformation, INT TechShu

Options:
  -V, --version      output the version number
  -h, --help         display help for command

Commands:
  list [options]     List all available boilerplates
  search <query>     Search for boilerplates
  info <boilerplate> Get detailed information about a boilerplate
  add <boilerplate>  Add a boilerplate to your project
  help [command]     display help for command
```

---

## ✅ Step 3: Test List Command (2 minutes)

### 3.1: List all boilerplates

```bash
techshu list
```

**Expected**:
- ✅ Spinner shows "Fetching boilerplates..."
- ✅ Success message: "Boilerplates loaded"
- ✅ Shows "TechShu Boilerplates v1.0.0"
- ✅ Shows categories (AI & INTELLIGENCE, ADMIN & MANAGEMENT, etc.)
- ✅ Shows boilerplate IDs and descriptions
- ✅ Shows "Total: 42 boilerplates"

**Screenshot what you see** ✅

### 3.2: Filter by category

```bash
techshu list --category "AI & Intelligence"
```

**Expected**:
- ✅ Only shows AI & Intelligence boilerplates
- ✅ Shows rag-system, embedding-service, etc.

### 3.3: Test short option

```bash
techshu list -c "Utilities"
```

**Expected**:
- ✅ Only shows Utilities boilerplates
- ✅ Shows authentication, file-upload, etc.

---

## 🔍 Step 4: Test Search Command (2 minutes)

### 4.1: Search by keyword

```bash
techshu search auth
```

**Expected**:
- ✅ Spinner shows "Searching..."
- ✅ Success message: "Search complete"
- ✅ Shows "Found X result(s):"
- ✅ Shows authentication boilerplate
- ✅ Shows admin-user-management boilerplate
- ✅ Shows category, files, and tags

**Screenshot what you see** ✅

### 4.2: Search for AI

```bash
techshu search AI
```

**Expected**:
- ✅ Shows rag-system, embedding-service, ai-testing, etc.

### 4.3: Search with no results

```bash
techshu search nonexistentboilerplate123
```

**Expected**:
- ✅ Shows "No results found"

---

## ℹ️ Step 5: Test Info Command (2 minutes)

### 5.1: Get info about authentication

```bash
techshu info authentication
```

**Expected**:
- ✅ Spinner shows "Fetching information..."
- ✅ Success message: "Information loaded"
- ✅ Shows "Authentication System v1.0.0"
- ✅ Shows description
- ✅ Shows category, path, files, components, lib
- ✅ Shows tags
- ✅ Shows dependencies
- ✅ Shows "To add: techshu add authentication"

**Screenshot what you see** ✅

### 5.2: Get info about RAG system

```bash
techshu info rag-system
```

**Expected**:
- ✅ Shows RAG system information
- ✅ Shows dependencies (openai, @supabase/supabase-js, etc.)

### 5.3: Test invalid boilerplate

```bash
techshu info nonexistent
```

**Expected**:
- ✅ Error message: "Boilerplate 'nonexistent' not found"

---

## 📥 Step 6: Test Add Command (10 minutes)

### 6.1: Create test project

```bash
# Go back to parent directory
cd ../..

# Create test directory
mkdir cli-test-project
cd cli-test-project

# Initialize npm project
npm init -y
```

### 6.2: Add authentication boilerplate

```bash
techshu add authentication
```

**Expected**:
- ✅ Spinner shows "Fetching boilerplate..."
- ✅ Spinner shows "Downloading Authentication System..."
- ✅ Spinner shows "Downloading <filename>..." for each file
- ✅ Success message: "Authentication System added successfully!"
- ✅ Shows "Location: ./src/authentication"
- ✅ Shows "Install dependencies:"
- ✅ Shows "npm install @supabase/supabase-js @supabase/auth-helpers-nextjs"
- ✅ Shows "Read the README: ./src/authentication/README.md"

**Screenshot what you see** ✅

### 6.3: Verify files were downloaded

```bash
# Windows
dir src\authentication

# Linux/Mac
ls -la src/authentication
```

**Expected files**:
- ✅ README.md
- ✅ components/ directory
- ✅ lib/ directory
- ✅ Other files depending on boilerplate

**Check README**:
```bash
# Windows
type src\authentication\README.md

# Linux/Mac
cat src/authentication/README.md
```

**Expected**:
- ✅ README content is visible
- ✅ Contains documentation about authentication

### 6.4: Test custom path

```bash
techshu add email-service --path ./lib
```

**Expected**:
- ✅ Downloads to ./lib/email-service/
- ✅ Success message shows correct path

**Verify**:
```bash
# Windows
dir lib\email-service

# Linux/Mac
ls -la lib/email-service
```

### 6.5: Test existing directory (should prompt)

```bash
techshu add authentication
```

**Expected**:
- ✅ Stops and asks: "Directory ./src/authentication already exists. Overwrite?"
- ✅ Shows [y/N] prompt

**Answer**: N (No)

**Expected**:
- ✅ Shows "Cancelled"
- ✅ Does not overwrite files

### 6.6: Test force overwrite

```bash
techshu add authentication --force
```

**Expected**:
- ✅ Does NOT prompt
- ✅ Overwrites files directly
- ✅ Success message

### 6.7: Test invalid boilerplate

```bash
techshu add nonexistent
```

**Expected**:
- ✅ Error message: "Boilerplate 'nonexistent' not found"

---

## 🧹 Step 7: Cleanup (2 minutes)

### 7.1: Remove test project

```bash
# Go back to parent directory
cd ..

# Remove test project
# Windows
rmdir /s /q cli-test-project

# Linux/Mac
rm -rf cli-test-project
```

### 7.2: Unlink CLI

```bash
npm unlink -g @techshu/cli
```

**Expected**:
- ✅ CLI is removed from global packages

### 7.3: Verify uninstall

```bash
techshu --version
```

**Expected**:
- ✅ Command not found error

---

## ✅ Test Results Checklist

Mark each test as you complete it:

### Build & Installation
- [ ] Dependencies installed successfully
- [ ] TypeScript build completed
- [ ] dist/index.js file created
- [ ] npm link worked
- [ ] techshu --version shows 1.0.0
- [ ] techshu --help shows all commands

### List Command
- [ ] techshu list shows all 42 boilerplates
- [ ] Categories are displayed correctly
- [ ] --category filter works
- [ ] -c short option works

### Search Command
- [ ] techshu search finds relevant boilerplates
- [ ] Shows correct number of results
- [ ] Shows category, files, and tags
- [ ] "No results found" for invalid search

### Info Command
- [ ] techshu info shows detailed information
- [ ] Shows all fields (name, description, category, etc.)
- [ ] Shows dependencies
- [ ] Error for invalid boilerplate

### Add Command
- [ ] techshu add downloads files successfully
- [ ] Files are created in correct location
- [ ] README.md is downloaded
- [ ] Components and lib directories created
- [ ] --path option works
- [ ] --force option works
- [ ] Prompts before overwriting
- [ ] Error for invalid boilerplate

### Cleanup
- [ ] Test project removed
- [ ] CLI unlinked successfully
- [ ] Command no longer available

---

## 📊 Test Summary

**Total Tests**: 30+  
**Expected Pass Rate**: 100%

**If any test fails**:
1. Note which test failed
2. Note the error message
3. Check the troubleshooting section in TEST_GUIDE.md
4. Report the issue on GitHub

---

## 🐛 Common Issues

### Issue: npm link fails

**Solution**:
```bash
# Run as administrator (Windows)
# Or use sudo (Linux/Mac)
sudo npm link
```

### Issue: Files not downloading

**Solution**:
1. Check internet connection
2. Check GitHub status
3. Try again in a few minutes

### Issue: Permission denied

**Solution**:
```bash
# Change directory permissions
chmod +w ./src

# Or run with sudo
sudo techshu add authentication
```

---

## 📝 Report Your Results

After testing, please report:

1. **OS**: Windows/Mac/Linux
2. **Node version**: `node --version`
3. **npm version**: `npm --version`
4. **Tests passed**: X/30
5. **Tests failed**: List which ones
6. **Screenshots**: Attach screenshots of key steps

**Report to**: hi@indranil.in or GitHub Issues

---

*Created with ❤️ by [Indranil Banerjee](https://in.linkedin.com/in/askneelnow)*  
*Head of AI Transformation, INT TechShu*

📧 hi@indranil.in | 💼 [LinkedIn](https://in.linkedin.com/in/askneelnow) | 🌐 [indranil.in](https://indranil.in)

© 2025 TechShu - All Rights Reserved

