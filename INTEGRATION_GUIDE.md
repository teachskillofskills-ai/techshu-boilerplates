# 🔌 Integration Guide

## How to Integrate TechShu Boilerplates into Your Project

This guide shows you how to programmatically fetch and use TechShu boilerplates in your projects.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Using the CLI](#using-the-cli)
3. [Using the API](#using-the-api)
4. [Integration Methods](#integration-methods)
5. [Advanced Usage](#advanced-usage)
6. [CI/CD Integration](#cicd-integration)

---

## Quick Start

### Method 1: CLI Tool (Recommended)

```bash
# Install CLI globally
npm install -g @techshu/cli

# List available boilerplates
techshu list

# Add a boilerplate to your project
techshu add email-service
```

### Method 2: Direct API

```bash
# Fetch a component directly
curl -o email-service.ts https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/email-service/lib/brevo-service.ts
```

### Method 3: Git Sparse Checkout

```bash
# Clone only specific boilerplate
git clone --depth 1 --filter=blob:none --sparse https://github.com/teachskillofskills-ai/techshu-boilerplates.git
cd techshu-boilerplates
git sparse-checkout set email-service
```

---

## Using the CLI

### Installation

```bash
npm install -g @techshu/cli
```

### Commands

#### List All Boilerplates

```bash
techshu list
```

Output:
```
TechShu Boilerplates v1.0.0

AI & INTELLIGENCE
  ai-service - Multi-provider AI service with 9-model fallback
    Files: 2 | Components: 0 | Lib: 2
  
  email-service - Production-ready email service with Brevo
    Files: 9 | Components: 0 | Lib: 3

Total: 36 boilerplates
```

#### Search Boilerplates

```bash
techshu search email
```

#### Get Boilerplate Info

```bash
techshu info email-service
```

Output:
```
Email Service v1.0.0

Production-ready email service with Brevo integration

Category: communication
Path: email-service

Files: 9
Components: 0
Lib files: 3

Tags: email, brevo, templates, transactional

Dependencies:
  - @getbrevo/brevo

To add: techshu add email-service
```

#### Add Boilerplate

```bash
# Add to default location (./src)
techshu add email-service

# Add to custom location
techshu add email-service --path ./lib

# Force overwrite existing files
techshu add email-service --force
```

---

## Using the API

### Fetch Registry

```typescript
const REGISTRY_URL = 'https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/registry.json';

async function getBoilerplates() {
  const response = await fetch(REGISTRY_URL);
  const registry = await response.json();
  return registry.boilerplates;
}
```

### Fetch Specific Component

```typescript
async function fetchComponent(boilerplateId: string, componentPath: string) {
  const url = `https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/${boilerplateId}/${componentPath}`;
  const response = await fetch(url);
  return await response.text();
}

// Usage
const code = await fetchComponent('email-service', 'lib/brevo-service.ts');
```

### Download Entire Boilerplate

```typescript
import fs from 'fs-extra';
import path from 'path';

async function downloadBoilerplate(boilerplateId: string, destPath: string) {
  const BASE_URL = 'https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main';
  
  // Get registry to find boilerplate
  const registry = await fetch(`${BASE_URL}/registry.json`).then(r => r.json());
  const boilerplate = registry.boilerplates.find(b => b.id === boilerplateId);
  
  if (!boilerplate) {
    throw new Error(`Boilerplate ${boilerplateId} not found`);
  }
  
  // Download README
  const readme = await fetch(`${BASE_URL}/${boilerplate.path}/README.md`).then(r => r.text());
  await fs.writeFile(path.join(destPath, 'README.md'), readme);
  
  // Download other files (you'd need to implement directory listing)
  // This is a simplified example
}
```

---

## Integration Methods

### 1. Build-Time Integration

Fetch boilerplates during build time and include them in your project.

**package.json**:
```json
{
  "scripts": {
    "prebuild": "techshu add email-service --path ./src/lib",
    "build": "next build"
  }
}
```

### 2. Runtime Integration

Fetch components at runtime (useful for dynamic loading).

```typescript
// app/api/fetch-component/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { boilerplateId, componentPath } = await request.json();
  
  const url = `https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/${boilerplateId}/${componentPath}`;
  const code = await fetch(url).then(r => r.text());
  
  return NextResponse.json({ code });
}
```

### 3. Development Integration

Use during development for quick prototyping.

```bash
# Add boilerplate to your project
techshu add email-service

# Install dependencies
npm install @getbrevo/brevo

# Start using
import { sendEmail } from './src/email-service/lib/brevo-service';
```

### 4. Monorepo Integration

Integrate into a monorepo structure.

```bash
# Add to packages directory
techshu add email-service --path ./packages/email

# Add to apps directory
techshu add admin-dashboard --path ./apps/admin
```

---

## Advanced Usage

### Custom Fetcher

Create a custom fetcher with caching:

```typescript
import { LRUCache } from 'lru-cache';

const cache = new LRUCache<string, string>({
  max: 100,
  ttl: 1000 * 60 * 60, // 1 hour
});

async function fetchWithCache(url: string) {
  const cached = cache.get(url);
  if (cached) return cached;
  
  const response = await fetch(url);
  const data = await response.text();
  
  cache.set(url, data);
  return data;
}

// Usage
const code = await fetchWithCache(
  'https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/email-service/lib/brevo-service.ts'
);
```

### Batch Download

Download multiple boilerplates at once:

```typescript
async function batchDownload(boilerplateIds: string[], destPath: string) {
  const promises = boilerplateIds.map(id => 
    downloadBoilerplate(id, path.join(destPath, id))
  );
  
  await Promise.all(promises);
}

// Usage
await batchDownload(['email-service', 'ai-service', 'authentication'], './src/lib');
```

### Selective Component Download

Download only specific components:

```typescript
async function downloadComponents(
  boilerplateId: string,
  components: string[],
  destPath: string
) {
  const BASE_URL = 'https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main';
  
  for (const component of components) {
    const url = `${BASE_URL}/${boilerplateId}/components/${component}.tsx`;
    const code = await fetch(url).then(r => r.text());
    await fs.writeFile(path.join(destPath, `${component}.tsx`), code);
  }
}

// Usage
await downloadComponents(
  'form-components',
  ['button', 'input', 'dialog'],
  './src/components/ui'
);
```

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Fetch Boilerplates

on:
  push:
    branches: [main]

jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install TechShu CLI
        run: npm install -g @techshu/cli
      
      - name: Fetch Boilerplates
        run: |
          techshu add email-service --path ./src/lib
          techshu add authentication --path ./src/lib
      
      - name: Commit Changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add .
          git commit -m "Update boilerplates" || echo "No changes"
          git push
```

### Vercel

```json
{
  "buildCommand": "npm run fetch-boilerplates && npm run build",
  "scripts": {
    "fetch-boilerplates": "techshu add email-service --path ./src/lib"
  }
}
```

### Docker

```dockerfile
FROM node:18-alpine

# Install TechShu CLI
RUN npm install -g @techshu/cli

# Fetch boilerplates
RUN techshu add email-service --path /app/src/lib

# Copy your app
COPY . /app
WORKDIR /app

# Build
RUN npm install && npm run build
```

---

## Best Practices

1. **Version Pinning**: Pin to specific versions for stability
   ```bash
   techshu add email-service@1.0.0
   ```

2. **Caching**: Cache fetched components to reduce API calls

3. **Error Handling**: Always handle fetch errors gracefully

4. **Documentation**: Document which boilerplates you're using

5. **Updates**: Regularly check for updates
   ```bash
   techshu update
   ```

6. **Testing**: Test boilerplates in your environment before deploying

---

## Troubleshooting

### Rate Limit Exceeded

If you hit GitHub's rate limit, authenticate your requests:

```typescript
const response = await fetch(url, {
  headers: {
    'Authorization': `token ${process.env.GITHUB_TOKEN}`
  }
});
```

### Component Not Found

Check if the component exists in the registry:

```bash
techshu info <boilerplate-id>
```

### Installation Fails

Clear npm cache and reinstall:

```bash
npm cache clean --force
npm install -g @techshu/cli
```

---

## Support

- **Documentation**: [GitHub Repository](https://github.com/teachskillofskills-ai/techshu-boilerplates)
- **Issues**: [Report Issues](https://github.com/teachskillofskills-ai/techshu-boilerplates/issues)
- **Discussions**: [Community Discussions](https://github.com/teachskillofskills-ai/techshu-boilerplates/discussions)

---

## License

MIT License - Free to use in commercial and personal projects.

