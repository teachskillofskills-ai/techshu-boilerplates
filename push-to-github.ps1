# Push TechShu Boilerplates to GitHub
# Run this after creating the repository on GitHub

Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         Push TechShu Boilerplates to GitHub                 ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
$currentPath = Get-Location
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: Not in a git repository" -ForegroundColor Red
    Write-Host "   Please run this from the boilerplates directory" -ForegroundColor Yellow
    exit
}

Write-Host "✅ Git repository found" -ForegroundColor Green
Write-Host ""

# Ask for repository URL
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║                  IMPORTANT: Create Repository First          ║" -ForegroundColor Yellow
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
Write-Host ""
Write-Host "Before continuing, create the repository on GitHub:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1 (Organization - Recommended):" -ForegroundColor Cyan
Write-Host "  https://github.com/organizations/teachskillofskills-ai/repositories/new" -ForegroundColor White
Write-Host ""
Write-Host "Option 2 (Personal Account):" -ForegroundColor Cyan
Write-Host "  https://github.com/new" -ForegroundColor White
Write-Host ""
Write-Host "Repository settings:" -ForegroundColor Cyan
Write-Host "  - Name: techshu-boilerplates" -ForegroundColor White
Write-Host "  - Description: 36 production-ready boilerplates for Next.js 14 + Supabase" -ForegroundColor White
Write-Host "  - Visibility: Public (recommended) or Private" -ForegroundColor White
Write-Host "  - DO NOT initialize with README, .gitignore, or license" -ForegroundColor White
Write-Host ""

$continue = Read-Host "Have you created the repository on GitHub? (y/n)"
if ($continue -ne "y") {
    Write-Host ""
    Write-Host "⏸️  Paused. Create the repository first, then run this script again." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Great! Now enter your repository URL:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Examples:" -ForegroundColor Gray
Write-Host "  https://github.com/teachskillofskills-ai/techshu-boilerplates.git" -ForegroundColor Gray
Write-Host "  https://github.com/indranilbanerjee/techshu-boilerplates.git" -ForegroundColor Gray
Write-Host ""

$repoUrl = Read-Host "Repository URL"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "❌ No URL provided" -ForegroundColor Red
    exit
}

# Validate URL format
if ($repoUrl -notmatch "^https://github\.com/.+/.+\.git$") {
    Write-Host "⚠️  URL format looks unusual. Expected format:" -ForegroundColor Yellow
    Write-Host "   https://github.com/USERNAME/REPO.git" -ForegroundColor Gray
    Write-Host ""
    $confirmUrl = Read-Host "Continue anyway? (y/n)"
    if ($confirmUrl -ne "y") {
        exit
    }
}

Write-Host ""
Write-Host "🔗 Adding remote..." -ForegroundColor Cyan

# Check if remote already exists
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "⚠️  Remote 'origin' already exists: $existingRemote" -ForegroundColor Yellow
    $updateRemote = Read-Host "Update to new URL? (y/n)"
    if ($updateRemote -eq "y") {
        git remote set-url origin $repoUrl
        Write-Host "✅ Remote updated" -ForegroundColor Green
    } else {
        Write-Host "❌ Cancelled" -ForegroundColor Red
        exit
    }
} else {
    git remote add origin $repoUrl
    Write-Host "✅ Remote added" -ForegroundColor Green
}

Write-Host ""
Write-Host "🌿 Setting main branch..." -ForegroundColor Cyan
git branch -M main
Write-Host "✅ Branch set to main" -ForegroundColor Green

Write-Host ""
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  You may be asked to authenticate" -ForegroundColor Yellow
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
    
    # Extract repo URL without .git
    $webUrl = $repoUrl -replace "\.git$", ""
    Write-Host "📍 Repository URL: $webUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Visit your repository: $webUrl" -ForegroundColor White
    Write-Host "2. Add team members (Settings → Collaborators)" -ForegroundColor White
    Write-Host "3. Add topics: nextjs, react, typescript, supabase, boilerplate" -ForegroundColor White
    Write-Host "4. Star your own repo ⭐" -ForegroundColor White
    Write-Host "5. Share with your team!" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 See DEPLOYMENT_GUIDE.md for more options" -ForegroundColor Cyan
    Write-Host ""
    
    # Ask if they want to open in browser
    $openBrowser = Read-Host "Open repository in browser? (y/n)"
    if ($openBrowser -eq "y") {
        Start-Process $webUrl
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ Push failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "1. Authentication failed - Set up GitHub credentials" -ForegroundColor White
    Write-Host "2. Repository doesn't exist - Create it on GitHub first" -ForegroundColor White
    Write-Host "3. No permission - Check repository access" -ForegroundColor White
    Write-Host ""
    Write-Host "Try:" -ForegroundColor Cyan
    Write-Host "  git push -u origin main" -ForegroundColor White
    Write-Host ""
    Write-Host "Or see PUSH_TO_GITHUB.md for troubleshooting" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

