# Contributing to TechShu Boilerplates

Thank you for your interest in contributing to TechShu Boilerplates! This document provides guidelines for contributing to this project.

## 🎯 How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists in the [Issues](../../issues) section
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment details

### Suggesting New Boilerplates

We welcome suggestions for new boilerplates! Please:

1. Open an issue with the `enhancement` label
2. Describe the boilerplate purpose
3. Explain the use case
4. List key features it should have

### Contributing Code

#### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR-USERNAME/techshu-boilerplates.git
cd techshu-boilerplates
```

#### 2. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

#### 3. Make Your Changes

- Follow the existing code style
- Keep changes focused and atomic
- Test your changes thoroughly
- Update documentation if needed

#### 4. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with a clear message
git commit -m "feat: add new email template boilerplate"

# Or for fixes
git commit -m "fix: correct authentication flow in auth boilerplate"
```

**Commit Message Format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

#### 5. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Reference any related issues
- List of changes made
- Screenshots if applicable

## 📋 Boilerplate Guidelines

When creating or updating boilerplates:

### Structure

Each boilerplate should have:

```
boilerplate-name/
├── README.md              # Comprehensive documentation
├── package.json          # Dependencies (if applicable)
├── components/           # React components
├── lib/                  # Core logic and services
├── hooks/                # Custom React hooks (if applicable)
├── api/                  # API routes (if applicable)
├── database/             # SQL schemas (if applicable)
├── examples/             # Usage examples (if applicable)
└── .env.example         # Environment variables (if applicable)
```

### README Requirements

Each boilerplate README must include:

1. **Title and Description**
2. **Features List**
3. **Installation Instructions**
4. **Quick Start Guide**
5. **Configuration**
6. **API Reference**
7. **Examples**
8. **Troubleshooting**
9. **License**

### Code Quality

- ✅ Use TypeScript
- ✅ Follow Next.js 14 best practices
- ✅ Include proper error handling
- ✅ Add comments for complex logic
- ✅ Use meaningful variable names
- ✅ Keep functions small and focused
- ✅ Follow security best practices

### Testing

- Test your boilerplate in a real project
- Verify all dependencies install correctly
- Check that examples work as documented
- Test edge cases and error scenarios

## 🔍 Code Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited

## 🎨 Style Guide

### TypeScript

```typescript
// Use explicit types
export interface EmailConfig {
  apiKey: string;
  fromEmail: string;
  fromName: string;
}

// Use async/await over promises
async function sendEmail(config: EmailConfig): Promise<void> {
  // Implementation
}

// Use descriptive names
const isEmailValid = validateEmail(email);
```

### React Components

```typescript
// Use functional components
export function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // Implementation
}

// Use proper prop types
interface MyComponentProps {
  prop1: string;
  prop2: number;
}
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `EmailService.tsx`)
- Utilities: `camelCase.ts` (e.g., `emailHelpers.ts`)
- Types: `PascalCase.ts` (e.g., `EmailTypes.ts`)

## 📝 Documentation

- Keep documentation up to date
- Use clear, concise language
- Include code examples
- Add screenshots where helpful
- Update CHANGELOG.md for significant changes

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

All contributors will be recognized in the project. Thank you for helping make TechShu Boilerplates better!

## 📞 Questions?

If you have questions:
- Open an issue with the `question` label
- Contact the maintainers
- Check existing documentation

---

**Thank you for contributing! 🎉**

