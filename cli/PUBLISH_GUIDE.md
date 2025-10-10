# 📦 Publishing Guide - TechShu CLI

**Complete guide to publish @techshu/cli to npm**

---

## ✅ Pre-Publishing Checklist

All items completed:

- [x] CLI code implemented and tested
- [x] All dependencies installed
- [x] TypeScript compiled successfully
- [x] All 6 tests passed (100% pass rate)
- [x] Documentation complete
- [x] package.json configured correctly
- [x] .npmignore configured
- [x] LICENSE file added
- [x] README.md complete

**Status**: ✅ **READY TO PUBLISH**

---

## 🚀 Publishing Steps

### Step 1: Create npm Account (If you don't have one)

1. Go to https://www.npmjs.com/signup
2. Fill in details:
   - **Username**: Choose a username
   - **Email**: hi@indranil.in (or your preferred email)
   - **Password**: Create a strong password
3. Verify your email address

### Step 2: Login to npm

Open Command Prompt (not PowerShell) and run:

```bash
cd C:\Users\indra\Downloads\DataTransfer_Home2Office\TechShuLMS\TechShuLMS\boilerplates\cli

npm login
```

You'll be prompted for:
- **Username**: Your npm username
- **Password**: Your npm password
- **Email**: hi@indranil.in

**Alternative**: Use `npm adduser` if `npm login` doesn't work.

### Step 3: Verify Login

```bash
npm whoami
```

**Expected output**: Your npm username

### Step 4: Publish the Package

```bash
npm publish --access public
```

**Why `--access public`?**
- Scoped packages (@techshu/cli) are private by default
- `--access public` makes it publicly available
- Free for public packages

**Expected output**:
```
+ @techshu/cli@1.0.0
```

### Step 5: Verify Publication

```bash
npm view @techshu/cli
```

**Expected**: Package information displayed

**Or visit**: https://www.npmjs.com/package/@techshu/cli

---

## 🧪 Post-Publishing Testing

### Test 1: Install Globally

```bash
npm install -g @techshu/cli
```

### Test 2: Run Commands

```bash
techshu --version
techshu list
techshu search auth
techshu add authentication
```

### Test 3: Verify in New Project

```bash
mkdir test-project
cd test-project
npm init -y
techshu add authentication
```

**Expected**: Files downloaded to `./src/authentication/`

---

## 📝 Alternative Publishing Method (If npm login fails)

### Using npm Token

1. **Generate token on npmjs.com**:
   - Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Click "Generate New Token"
   - Choose "Automation" or "Publish"
   - Copy the token

2. **Set token in .npmrc**:
   ```bash
   echo //registry.npmjs.org/:_authToken=YOUR_TOKEN_HERE > %USERPROFILE%\.npmrc
   ```

3. **Publish**:
   ```bash
   npm publish --access public
   ```

---

## 🔧 Troubleshooting

### Issue 1: "need auth" error

**Solution**: Run `npm login` or `npm adduser`

### Issue 2: "Package name already exists"

**Solution**: The package name is already taken. Change the name in `package.json`:
```json
{
  "name": "@your-username/cli"
}
```

### Issue 3: "403 Forbidden"

**Possible causes**:
- Not logged in: Run `npm login`
- No permission: Make sure you own the @techshu scope
- Package already published: Increment version in package.json

**Solution for scope ownership**:
If you don't own @techshu scope, either:
1. Create the scope on npmjs.com (Settings → Organizations → Create)
2. Or change package name to `@your-username/techshu-cli`

### Issue 4: "You must verify your email"

**Solution**: 
1. Check your email for verification link
2. Click the link
3. Try publishing again

---

## 📊 What Gets Published

The following files will be published to npm:

```
@techshu/cli@1.0.0
├── dist/
│   ├── index.js (compiled code)
│   ├── index.d.ts (type definitions)
│   └── index.js.map (source maps)
├── package.json
├── README.md
└── LICENSE
```

**Excluded** (via .npmignore):
- src/ (TypeScript source)
- tsconfig.json
- TEST_GUIDE.md
- MANUAL_TEST.md
- node_modules/

---

## 🎯 After Publishing

### Update Repository

1. **Add npm badge to README**:
   ```markdown
   [![npm version](https://badge.fury.io/js/%40techshu%2Fcli.svg)](https://www.npmjs.com/package/@techshu/cli)
   ```

2. **Create GitHub Release**:
   - Go to https://github.com/teachskillofskills-ai/techshu-boilerplates/releases/new
   - Tag: `v1.0.0`
   - Title: "TechShu CLI v1.0.0"
   - Description:
     ```markdown
     # 🚀 TechShu CLI v1.0.0
     
     First release of the TechShu CLI!
     
     ## Features
     - 📦 Install boilerplates with one command
     - 🔍 Search and discover boilerplates
     - 📊 View detailed information
     - ⚡ Fast and easy to use
     
     ## Installation
     ```bash
     npm install -g @techshu/cli
     ```
     
     ## Usage
     ```bash
     techshu list
     techshu add authentication
     ```
     
     See [CLI_USER_GUIDE.md](./CLI_USER_GUIDE.md) for complete documentation.
     ```

3. **Announce on LinkedIn**:
   ```
   🚀 Excited to announce TechShu CLI v1.0.0!
   
   Install 42 production-ready Next.js + Supabase boilerplates with one command:
   
   npm install -g @techshu/cli
   techshu add authentication
   
   ✅ 2 minutes instead of 30 minutes
   ✅ No manual copying
   ✅ No mistakes
   ✅ Production-ready code
   
   Try it now: npm install -g @techshu/cli
   
   GitHub: https://github.com/teachskillofskills-ai/techshu-boilerplates
   npm: https://www.npmjs.com/package/@techshu/cli
   
   #NextJS #Supabase #OpenSource #WebDev #CLI
   ```

---

## 📈 Monitoring

After publishing, monitor:

1. **npm downloads**: https://www.npmjs.com/package/@techshu/cli
2. **GitHub stars**: https://github.com/teachskillofskills-ai/techshu-boilerplates
3. **Issues**: https://github.com/teachskillofskills-ai/techshu-boilerplates/issues
4. **User feedback**: GitHub Discussions

---

## 🔄 Future Updates

To publish updates:

1. **Make changes** to the code
2. **Update version** in package.json:
   ```bash
   npm version patch  # 1.0.0 → 1.0.1
   npm version minor  # 1.0.0 → 1.1.0
   npm version major  # 1.0.0 → 2.0.0
   ```
3. **Build**:
   ```bash
   npm run build
   ```
4. **Publish**:
   ```bash
   npm publish
   ```

---

## ✅ Success Criteria

After publishing, verify:

- [ ] Package visible on npmjs.com
- [ ] Can install globally: `npm install -g @techshu/cli`
- [ ] Commands work: `techshu list`
- [ ] Files download: `techshu add authentication`
- [ ] README displays correctly on npm
- [ ] Version number is correct

---

## 🎊 You're Done!

Once published, users worldwide can install your CLI with:

```bash
npm install -g @techshu/cli
```

**Impact**:
- 🌍 Available to millions of developers
- ⚡ Saves 28 minutes per boilerplate
- 🎯 Professional tool in your portfolio
- 📈 Builds your authority in the space

---

*Created with ❤️ by [Indranil Banerjee](https://in.linkedin.com/in/askneelnow)*  
*Head of AI Transformation, INT TechShu*

📧 hi@indranil.in | 💼 [LinkedIn](https://in.linkedin.com/in/askneelnow) | 🌐 [indranil.in](https://indranil.in)

© 2025 TechShu - All Rights Reserved

