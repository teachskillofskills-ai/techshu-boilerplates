@echo off
echo.
echo ========================================
echo   TechShu CLI - npm Publishing Script
echo ========================================
echo.
echo Created by: Indranil Banerjee
echo Head of AI Transformation, INT TechShu
echo.
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Checking if logged in to npm...
echo.
npm whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo You are not logged in to npm.
    echo.
    echo Please login now...
    echo.
    echo Your credentials:
    echo   Username: techshu
    echo   Password: TechShu@123
    echo   Email: hi@indranil.in
    echo.
    echo A browser window will open. Please login there.
    echo.
    pause
    npm login
    echo.
    if %errorlevel% neq 0 (
        echo.
        echo ERROR: npm login failed!
        echo Please try again manually: npm login
        echo.
        pause
        exit /b 1
    )
) else (
    echo Already logged in as:
    npm whoami
    echo.
)

echo [2/3] Publishing to npm...
echo.
npm publish --access public
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Publishing failed!
    echo.
    echo Please check the error above and try again.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! Package Published!
echo ========================================
echo.
echo Your package is now live at:
echo https://www.npmjs.com/package/@techshu/cli
echo.
echo [3/3] Verifying publication...
echo.
npm view @techshu/cli
echo.
echo ========================================
echo   Next Steps:
echo ========================================
echo.
echo 1. Create GitHub Release:
echo    https://github.com/teachskillofskills-ai/techshu-boilerplates/releases/new
echo.
echo 2. Test installation:
echo    npm install -g @techshu/cli
echo    techshu --version
echo.
echo 3. Announce on LinkedIn!
echo.
echo See PUBLISH_NOW.md for complete checklist.
echo.
echo ========================================
echo   Congratulations!
echo ========================================
echo.
pause

