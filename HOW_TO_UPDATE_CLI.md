# 🔄 How to Update TechShu CLI

**Current npm version**: 1.2.0 ✅
**Latest version**: 1.2.0 (with back navigation!)

---

## 📦 For Users: How to Update Your Installed CLI

### Method 1: Quick Update (Recommended)

```bash
npm update -g @techshu/cli
```

**Verify the update**:
```bash
techshu --version
# Should show: 1.2.0
```

---

### Method 2: Force Reinstall (If update doesn't work)

```bash
# Step 1: Uninstall old version
npm uninstall -g @techshu/cli

# Step 2: Install latest version
npm install -g @techshu/cli

# Step 3: Verify
techshu --version
# Should show: 1.2.0
```

---

### Method 3: Install Specific Version

```bash
npm install -g @techshu/cli@1.2.0
```

---

## 🚀 For You (Publisher): How to Publish v1.2.0 to npm

### Step 1: Navigate to CLI Directory

```bash
cd boilerplates/cli
```

### Step 2: Verify Build

```bash
# Check that dist/index.js exists and is up to date
ls dist/index.js

# File should be ~28KB
```

### Step 3: Login to npm (if not already logged in)

```bash
npm login
```

**Enter your credentials**:
- Username: `techshu`
- Password: `TechShu@123`
- Email: (your email)

### Step 4: Publish to npm

```bash
npm publish --access public
```

**Expected output**:
```
+ @techshu/cli@1.2.0
```

### Step 5: Verify Publication

```bash
npm view @techshu/cli version
# Should show: 1.2.0
```

---

## ✅ After Publishing

### Test the Published Package

```bash
# In a different directory (not in the project)
npm install -g @techshu/cli

# Verify version
techshu --version
# Should show: 1.2.0

# Test interactive mode
techshu browse
# Should have back navigation options!
```

---

## 🔍 Troubleshooting

### Issue 1: "npm update" doesn't update

**Solution**: Use force reinstall
```bash
npm uninstall -g @techshu/cli
npm install -g @techshu/cli
```

### Issue 2: "Permission denied" error

**Solution**: Use sudo (Mac/Linux) or run as Administrator (Windows)
```bash
# Mac/Linux
sudo npm install -g @techshu/cli

# Windows (run PowerShell as Administrator)
npm install -g @techshu/cli
```

### Issue 3: Old version still showing

**Solution**: Clear npm cache
```bash
npm cache clean --force
npm uninstall -g @techshu/cli
npm install -g @techshu/cli
```

### Issue 4: "Package not found"

**Solution**: Check if published
```bash
npm view @techshu/cli versions
# Should show: [ '1.0.0', '1.1.0', '1.2.0' ]
```

---

## 📊 Version History

| Version | Date | Key Features |
|---------|------|--------------|
| **1.2.0** | 2025-01-10 | ✅ Back navigation, continuous session |
| **1.1.0** | 2025-01-10 | ✅ Interactive mode, beautiful formatting |
| **1.0.0** | 2025-01-09 | ✅ Initial release |

---

## 🎯 What's New in v1.2.0

### Major Features
- ✅ **Back navigation everywhere** - Go back at any step
- ✅ **Continuous session** - No need to restart CLI
- ✅ **Add multiple boilerplates** - Install many in one session
- ✅ **Better error recovery** - Retry on failures
- ✅ **Home navigation** - Jump to main menu anytime

### Navigation Options
```
Every screen now has:
🔙 Back button
🏠 Home/Main menu button
❌ Exit option
```

### Example Workflow
```bash
$ techshu browse

1. Browse → AI → rag-system → Install ✓
2. "Add another?" → Yes
3. Browse → Auth → authentication → Install ✓
4. "Add another?" → Yes
5. Search → "email" → email-service → Install ✓
6. "Add another?" → No, Exit

# All in ONE session!
```

---

## 📝 Quick Reference

### Check Current Version
```bash
techshu --version
```

### Check Latest Available Version
```bash
npm view @techshu/cli version
```

### Update to Latest
```bash
npm update -g @techshu/cli
```

### Install Specific Version
```bash
npm install -g @techshu/cli@1.2.0
```

### Uninstall
```bash
npm uninstall -g @techshu/cli
```

---

## 🎉 After Updating

### Try the New Features!

```bash
# Start interactive mode
techshu browse

# Notice the new options:
# - 🔙 Back buttons everywhere
# - 🏠 Home navigation
# - ➕ Add another after install
# - 🔄 Retry on errors
```

### Install Multiple Boilerplates
```bash
techshu browse

# Install as many as you want in one session!
# No need to restart the CLI
```

---

## 📞 Support

### Get Help
- 📖 Documentation: https://github.com/teachskillofskills-ai/techshu-boilerplates
- 🐛 Report Issues: https://github.com/teachskillofskills-ai/techshu-boilerplates/issues
- 💬 Discussions: https://github.com/teachskillofskills-ai/techshu-boilerplates/discussions

### Connect
- 💼 LinkedIn: https://in.linkedin.com/in/askneelnow
- 📧 Email: hi@indranil.in
- 🌐 Website: https://indranil.in

---

## 🚀 Publishing Checklist (For Maintainers)

Before publishing a new version:

- [ ] Update version in `package.json`
- [ ] Update version in `src/index.ts` (2 places)
- [ ] Build the CLI (`npm run build` or `npx tsc`)
- [ ] Test locally (`node dist/index.js --version`)
- [ ] Commit changes to GitHub
- [ ] Login to npm (`npm login`)
- [ ] Publish (`npm publish --access public`)
- [ ] Verify publication (`npm view @techshu/cli version`)
- [ ] Test installation (`npm install -g @techshu/cli`)
- [ ] Update documentation
- [ ] Create release notes
- [ ] Announce on social media

---

## 💡 Tips

### For Users
- Always check for updates before starting a new project
- Use `npm update -g @techshu/cli` regularly
- Report bugs and request features on GitHub

### For Maintainers
- Follow semantic versioning (MAJOR.MINOR.PATCH)
- Test thoroughly before publishing
- Keep changelog updated
- Announce major releases

---

*Created with ❤️ by [Indranil Banerjee](https://in.linkedin.com/in/askneelnow)*  
*Head of AI Transformation, INT TechShu*

📧 hi@indranil.in | 💼 [LinkedIn](https://in.linkedin.com/in/askneelnow) | 🌐 [indranil.in](https://indranil.in)

© 2025 TechShu - All Rights Reserved

