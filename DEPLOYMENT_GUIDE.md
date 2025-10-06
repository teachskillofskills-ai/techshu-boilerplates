# 🚀 Deployment Guide - Make Your Boilerplates Live

## Step-by-Step Guide to Deploy Your Boilerplate Repository

---

## 📋 Table of Contents

1. [Create GitHub Repository](#1-create-github-repository)
2. [Share with Your Team](#2-share-with-your-team)
3. [Use in Projects](#3-use-in-projects)
4. [Publish as npm Packages](#4-publish-as-npm-packages)

---

## 1. Create GitHub Repository

### Option A: Using GitHub Website (Easiest)

#### Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Fill in details:
   - **Repository name**: `techshu-boilerplates` (or your choice)
   - **Description**: "36 production-ready boilerplates for Next.js applications"
   - **Visibility**: 
     - ✅ **Private** (for internal team use)
     - ⚠️ **Public** (if you want to share with community)
3. **DO NOT** initialize with README (we already have one)
4. Click **"Create repository"**

#### Step 2: Initialize Git Locally

Open PowerShell in your boilerplates directory:

```powershell
# Navigate to boilerplates directory
cd C:\Users\indra\Downloads\DataTransfer_Home2Office\TechShuLMS\TechShuLMS\boilerplates

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: 36 production-ready boilerplates"

# Add remote (replace with your actual URL)
git remote add origin https://github.com/YOUR-USERNAME/techshu-boilerplates.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### Step 3: Verify on GitHub

1. Go to your repository URL
2. You should see all 36 boilerplates
3. Check that README.md displays properly

### Option B: Using GitHub Desktop (Visual)

1. Download GitHub Desktop: https://desktop.github.com/
2. Install and sign in
3. Click **"Add"** → **"Add existing repository"**
4. Select your boilerplates folder
5. Click **"Publish repository"**
6. Choose name and visibility
7. Click **"Publish"**

---

## 2. Share with Your Team

### Method 1: Give Team Access (Private Repo)

#### On GitHub:

1. Go to your repository
2. Click **"Settings"** tab
3. Click **"Collaborators and teams"** (left sidebar)
4. Click **"Add people"** or **"Add teams"**
5. Enter team member's GitHub username
6. Choose permission level:
   - **Read**: Can view and clone
   - **Write**: Can push changes
   - **Admin**: Full control
7. Click **"Add"**

#### Team Members Can Then:

```bash
# Clone the repository
git clone https://github.com/YOUR-ORG/techshu-boilerplates.git

# Navigate to it
cd techshu-boilerplates

# Browse boilerplates
ls
```

### Method 2: Create Organization (Recommended for Teams)

1. Go to https://github.com/organizations/new
2. Create organization (e.g., "teachskillofskills-ai")
3. Add team members
4. Transfer repository to organization:
   - Go to repo **Settings**
   - Scroll to **"Danger Zone"**
   - Click **"Transfer ownership"**
   - Enter organization name

### Method 3: Share as ZIP (No GitHub Account Needed)

```powershell
# Create a ZIP file
Compress-Archive -Path "C:\Users\indra\Downloads\DataTransfer_Home2Office\TechShuLMS\TechShuLMS\boilerplates" -DestinationPath "techshu-boilerplates.zip"

# Share via:
# - Email
# - Google Drive
# - Dropbox
# - Internal file server
```

---

## 3. Use in Projects

### Method 1: Clone and Copy (Recommended)

```bash
# Team member clones the repo
git clone https://github.com/YOUR-ORG/techshu-boilerplates.git

# Navigate to their project
cd /path/to/their-project

# Copy specific boilerplate
cp -r ../techshu-boilerplates/email-service ./src/lib/

# Install dependencies
npm install brevo

# Configure
echo "BREVO_API_KEY=your_key" >> .env.local

# Use it!
```

### Method 2: Git Submodule (Advanced)

```bash
# In your project
git submodule add https://github.com/YOUR-ORG/techshu-boilerplates.git lib/boilerplates

# Update submodule
git submodule update --remote

# Use boilerplates
import { BrevoEmailService } from './lib/boilerplates/email-service/lib/brevo-service'
```

### Method 3: Direct Download

1. Go to repository on GitHub
2. Click **"Code"** → **"Download ZIP"**
3. Extract ZIP
4. Copy needed boilerplates to project

---

## 4. Publish as npm Packages

### Option A: Publish Individual Packages

#### Step 1: Prepare Package

```bash
# Navigate to a boilerplate
cd boilerplates/email-service

# Ensure package.json exists and is correct
cat package.json

# Should have:
# - name: "@your-org/email-service"
# - version: "1.0.0"
# - main: "lib/brevo-service.ts"
# - files: ["lib", "components", "README.md"]
```

#### Step 2: Create npm Account

1. Go to https://www.npmjs.com/signup
2. Create account
3. Verify email

#### Step 3: Login to npm

```bash
npm login
# Enter username, password, email
```

#### Step 4: Publish

```bash
# For scoped package (recommended)
npm publish --access public

# For unscoped package
npm publish
```

#### Step 5: Install in Projects

```bash
# Others can now install
npm install @your-org/email-service

# Use it
import { BrevoEmailService } from '@your-org/email-service'
```

### Option B: Create Monorepo (Publish All at Once)

#### Step 1: Set Up Monorepo

```bash
# In boilerplates directory
npm init -y

# Install lerna or turborepo
npm install -D lerna

# Initialize lerna
npx lerna init
```

#### Step 2: Configure lerna.json

```json
{
  "packages": [
    "email-service",
    "ai-service",
    "design-system",
    "*"
  ],
  "version": "1.0.0"
}
```

#### Step 3: Publish All

```bash
npx lerna publish
```

### Option C: Private npm Registry (For Internal Use)

#### Using GitHub Packages:

1. Create `.npmrc` in each boilerplate:

```
@your-org:registry=https://npm.pkg.github.com
```

2. Update package.json:

```json
{
  "name": "@your-org/email-service",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

3. Publish:

```bash
npm publish
```

4. Team installs:

```bash
# Create .npmrc in their project
echo "@your-org:registry=https://npm.pkg.github.com" >> .npmrc

# Install
npm install @your-org/email-service
```

---

## 📝 Additional Setup Files

### Create .gitignore

```bash
# In boilerplates directory
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/

# Misc
.DS_Store
*.log
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
EOF
```

### Create LICENSE

```bash
# MIT License (most permissive)
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2025 TechShu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
```

### Create CONTRIBUTING.md

```bash
cat > CONTRIBUTING.md << 'EOF'
# Contributing to TechShu Boilerplates

## How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Guidelines

- Follow existing code style
- Update README if needed
- Test your changes
- Keep commits focused and atomic

## Questions?

Open an issue or contact the maintainers.
EOF
```

---

## 🎯 Quick Start Commands

### Complete Setup (Copy & Paste)

```powershell
# Navigate to boilerplates
cd C:\Users\indra\Downloads\DataTransfer_Home2Office\TechShuLMS\TechShuLMS\boilerplates

# Create .gitignore
@"
node_modules/
.env
.env.local
*.log
.DS_Store
"@ | Out-File -FilePath .gitignore -Encoding utf8

# Initialize git
git init
git add .
git commit -m "Initial commit: 36 production-ready boilerplates"

# Add remote (REPLACE WITH YOUR URL)
git remote add origin https://github.com/YOUR-USERNAME/techshu-boilerplates.git

# Push
git branch -M main
git push -u origin main
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Repository is visible on GitHub
- [ ] All 36 boilerplates are present
- [ ] README displays correctly
- [ ] Team members can clone
- [ ] Files are not corrupted
- [ ] .gitignore is working
- [ ] LICENSE file is present

---

## 🆘 Troubleshooting

### Issue: "Permission denied (publickey)"

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub
# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add at: https://github.com/settings/keys
```

### Issue: "Repository not found"

- Check repository URL is correct
- Verify you have access
- Try HTTPS instead of SSH

### Issue: "Large files"

```bash
# If files are too large, use Git LFS
git lfs install
git lfs track "*.pdf"
git add .gitattributes
```

---

## 🎊 You're Done!

Your boilerplates are now:
- ✅ On GitHub
- ✅ Accessible to team
- ✅ Ready to use
- ✅ Version controlled

**Start building amazing projects! 🚀**

