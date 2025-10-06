# 🚀 TechShu Boilerplates API

## Overview

The TechShu Boilerplates API allows developers to programmatically fetch boilerplates, components, and utilities for their projects. The API is built on top of GitHub's raw content delivery, making it fast, reliable, and free.

---

## Base URL

```
https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main
```

---

## Authentication

No authentication required. The API is public and free to use.

---

## Endpoints

### 1. Get Registry

Get the complete registry of all available boilerplates.

**Endpoint**: `/registry.json`

**Method**: `GET`

**Response**:
```json
{
  "name": "TechShu Boilerplates",
  "version": "1.0.0",
  "boilerplates": [...],
  "stats": {...}
}
```

**Example**:
```bash
curl https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/registry.json
```

---

### 2. Get Boilerplate README

Get the README for a specific boilerplate.

**Endpoint**: `/{boilerplate-id}/README.md`

**Method**: `GET`

**Parameters**:
- `boilerplate-id` (required): The ID of the boilerplate

**Example**:
```bash
curl https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/email-service/README.md
```

---

### 3. Get Component

Get a specific component file.

**Endpoint**: `/{boilerplate-id}/components/{component-name}.tsx`

**Method**: `GET`

**Parameters**:
- `boilerplate-id` (required): The ID of the boilerplate
- `component-name` (required): The name of the component

**Example**:
```bash
curl https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/email-service/lib/brevo-service.ts
```

---

### 4. Get Library File

Get a specific library file.

**Endpoint**: `/{boilerplate-id}/lib/{file-name}.ts`

**Method**: `GET`

**Parameters**:
- `boilerplate-id` (required): The ID of the boilerplate
- `file-name` (required): The name of the file

**Example**:
```bash
curl https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/design-system/lib/tokens.ts
```

---

## Usage Examples

### JavaScript/TypeScript

```typescript
// Fetch registry
const response = await fetch('https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/registry.json');
const registry = await response.json();

// List all boilerplates
registry.boilerplates.forEach(bp => {
  console.log(`${bp.id}: ${bp.description}`);
});

// Fetch a specific component
const componentUrl = 'https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/email-service/lib/brevo-service.ts';
const componentCode = await fetch(componentUrl).then(r => r.text());

// Save to file
const fs = require('fs');
fs.writeFileSync('./brevo-service.ts', componentCode);
```

### Python

```python
import requests
import json

# Fetch registry
response = requests.get('https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/registry.json')
registry = response.json()

# List all boilerplates
for bp in registry['boilerplates']:
    print(f"{bp['id']}: {bp['description']}")

# Fetch a specific component
component_url = 'https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/email-service/lib/brevo-service.ts'
component_code = requests.get(component_url).text

# Save to file
with open('brevo-service.ts', 'w') as f:
    f.write(component_code)
```

### cURL

```bash
# Get registry
curl -o registry.json https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/registry.json

# Get a component
curl -o brevo-service.ts https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/email-service/lib/brevo-service.ts

# Get entire boilerplate (using git sparse-checkout)
git clone --depth 1 --filter=blob:none --sparse https://github.com/teachskillofskills-ai/techshu-boilerplates.git
cd techshu-boilerplates
git sparse-checkout set email-service
```

---

## CLI Tool

For easier usage, install our CLI tool:

```bash
npm install -g @techshu/cli
```

### CLI Commands

```bash
# List all boilerplates
techshu list

# Search for boilerplates
techshu search email

# Get info about a boilerplate
techshu info email-service

# Add a boilerplate to your project
techshu add email-service

# Add to specific path
techshu add email-service --path ./src/lib

# Force overwrite
techshu add email-service --force
```

---

## Response Formats

### Registry Response

```json
{
  "name": "TechShu Boilerplates",
  "version": "1.0.0",
  "description": "Production-ready boilerplates for Next.js 14 + Supabase",
  "repository": "https://github.com/teachskillofskills-ai/techshu-boilerplates",
  "boilerplates": [
    {
      "id": "email-service",
      "name": "Email Service",
      "category": "communication",
      "version": "1.0.0",
      "description": "Production-ready email service with Brevo",
      "tags": ["email", "brevo", "templates"],
      "files": 9,
      "components": 0,
      "lib": 3,
      "dependencies": ["@getbrevo/brevo"],
      "path": "email-service",
      "readme": "https://raw.githubusercontent.com/..."
    }
  ],
  "stats": {
    "totalBoilerplates": 36,
    "totalFiles": 203,
    "totalComponents": 131
  }
}
```

---

## Rate Limits

GitHub raw content has the following limits:
- **Unauthenticated**: 60 requests per hour per IP
- **Authenticated**: 5,000 requests per hour

For higher limits, authenticate your requests with a GitHub token.

---

## Versioning

The API follows semantic versioning. The current version is `1.0.0`.

To fetch a specific version:
```
https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/v1.0.0/registry.json
```

---

## Error Handling

### 404 Not Found
The requested resource doesn't exist.

```json
{
  "error": "Not Found",
  "message": "The requested boilerplate or file does not exist"
}
```

### 403 Forbidden
Rate limit exceeded.

```json
{
  "error": "Rate Limit Exceeded",
  "message": "You have exceeded the GitHub API rate limit"
}
```

---

## Best Practices

1. **Cache the registry** - Don't fetch it on every request
2. **Use specific versions** - Pin to a specific version for stability
3. **Handle errors gracefully** - Check for 404s and rate limits
4. **Authenticate requests** - Use a GitHub token for higher limits
5. **Use the CLI** - For development, use the CLI tool

---

## Integration Examples

### Next.js API Route

```typescript
// app/api/boilerplates/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const response = await fetch(
    'https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/registry.json'
  );
  const data = await response.json();
  
  return NextResponse.json(data);
}
```

### React Hook

```typescript
import { useState, useEffect } from 'react';

export function useBoilerplates() {
  const [boilerplates, setBoilerplates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/registry.json')
      .then(r => r.json())
      .then(data => {
        setBoilerplates(data.boilerplates);
        setLoading(false);
      });
  }, []);
  
  return { boilerplates, loading };
}
```

---

## Support

- **Documentation**: https://github.com/teachskillofskills-ai/techshu-boilerplates
- **Issues**: https://github.com/teachskillofskills-ai/techshu-boilerplates/issues
- **Discussions**: https://github.com/teachskillofskills-ai/techshu-boilerplates/discussions

---

## License

MIT License - Free to use in commercial and personal projects.

