# TechShu Boilerplates - GitHub Repository Setup Script
# Run this script to set up your boilerplates as a GitHub repository

Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     TechShu Boilerplates - Repository Setup Wizard          ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify we're in the right directory
$currentPath = Get-Location
Write-Host "📍 Current directory: $currentPath" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Is this the boilerplates directory? (y/n)"
if ($confirm -ne "y") {
    Write-Host "❌ Please navigate to the boilerplates directory first" -ForegroundColor Red
    Write-Host "   cd C:\Users\indra\Downloads\DataTransfer_Home2Office\TechShuLMS\TechShuLMS\boilerplates"
    exit
}

# Step 2: Create .gitignore
Write-Host ""
Write-Host "📝 Creating .gitignore..." -ForegroundColor Cyan

$gitignoreContent = @"
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/

# Environment
.env
.env.local
.env.*.local

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*.sublime-*

# Temporary
*.tmp
*.temp
"@

$gitignoreContent | Out-File -FilePath ".gitignore" -Encoding utf8
Write-Host "✅ .gitignore created" -ForegroundColor Green

# Step 3: Create LICENSE
Write-Host ""
Write-Host "📝 Creating LICENSE..." -ForegroundColor Cyan

$licenseContent = @"
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
"@

$licenseContent | Out-File -FilePath "LICENSE" -Encoding utf8
Write-Host "✅ LICENSE created" -ForegroundColor Green

# Step 4: Initialize Git
Write-Host ""
Write-Host "🔧 Initializing Git repository..." -ForegroundColor Cyan

try {
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
} catch {
    Write-Host "❌ Git initialization failed. Is Git installed?" -ForegroundColor Red
    Write-Host "   Download from: https://git-scm.com/download/win"
    exit
}

# Step 5: Add files
Write-Host ""
Write-Host "📦 Adding files to Git..." -ForegroundColor Cyan

git add .
Write-Host "✅ Files added" -ForegroundColor Green

# Step 6: Create commit
Write-Host ""
Write-Host "💾 Creating initial commit..." -ForegroundColor Cyan

git commit -m "Initial commit: 36 production-ready boilerplates

- 36 complete boilerplates with source files
- 203 total source files
- Comprehensive documentation
- Production-tested code
- Ready for team use"

Write-Host "✅ Initial commit created" -ForegroundColor Green

# Step 7: Get GitHub repository URL
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║                    IMPORTANT STEP                            ║" -ForegroundColor Yellow
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
Write-Host ""
Write-Host "Before continuing, you need to:" -ForegroundColor Yellow
Write-Host "1. Go to https://github.com/new" -ForegroundColor White
Write-Host "2. Create a new repository named: techshu-boilerplates" -ForegroundColor White
Write-Host "3. Choose Private or Public" -ForegroundColor White
Write-Host "4. DO NOT initialize with README" -ForegroundColor White
Write-Host "5. Click 'Create repository'" -ForegroundColor White
Write-Host ""

$continue = Read-Host "Have you created the GitHub repository? (y/n)"
if ($continue -ne "y") {
    Write-Host ""
    Write-Host "⏸️  Setup paused. Run this script again after creating the repository." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Your local repository is ready. When you're ready:" -ForegroundColor Cyan
    Write-Host "1. Create GitHub repository" -ForegroundColor White
    Write-Host "2. Run this script again" -ForegroundColor White
    exit
}

# Step 8: Add remote
Write-Host ""
Write-Host "🔗 Adding GitHub remote..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Enter your GitHub repository URL:" -ForegroundColor Yellow
Write-Host "Example: https://github.com/teachskillofskills-ai/techshu-boilerplates.git" -ForegroundColor Gray
Write-Host ""

$repoUrl = Read-Host "Repository URL"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "❌ No URL provided" -ForegroundColor Red
    exit
}

try {
    git remote add origin $repoUrl
    Write-Host "✅ Remote added" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Remote might already exist, trying to update..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
    Write-Host "✅ Remote updated" -ForegroundColor Green
}

# Step 9: Set main branch
Write-Host ""
Write-Host "🌿 Setting main branch..." -ForegroundColor Cyan

git branch -M main
Write-Host "✅ Main branch set" -ForegroundColor Green

# Step 10: Push to GitHub
Write-Host ""
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  You may be asked to authenticate with GitHub" -ForegroundColor Yellow
Write-Host ""

try {
    git push -u origin main
    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                    SUCCESS! 🎉                               ║" -ForegroundColor Green
    Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ Your boilerplates are now on GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Repository URL: $repoUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Visit your repository on GitHub" -ForegroundColor White
    Write-Host "2. Add team members (Settings → Collaborators)" -ForegroundColor White
    Write-Host "3. Share the repository URL with your team" -ForegroundColor White
    Write-Host "4. Team members can clone: git clone $repoUrl" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 See DEPLOYMENT_GUIDE.md for more options" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "❌ Push failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "1. Authentication failed - Set up GitHub credentials" -ForegroundColor White
    Write-Host "2. Repository doesn't exist - Create it on GitHub first" -ForegroundColor White
    Write-Host "3. No permission - Check repository access" -ForegroundColor White
    Write-Host ""
    Write-Host "Try:" -ForegroundColor Cyan
    Write-Host "git push -u origin main" -ForegroundColor White
    Write-Host ""
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

