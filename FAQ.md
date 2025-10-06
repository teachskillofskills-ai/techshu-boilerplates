# ❓ Frequently Asked Questions

## General Questions

### What are TechShu Boilerplates?

TechShu Boilerplates are production-ready, plug-and-play code templates for Next.js 14 + Supabase applications. They're extracted from a real LMS platform and include authentication, course management, AI features, admin panels, and more.

### Are they free to use?

Yes! All boilerplates are MIT licensed and free to use in both personal and commercial projects.

### Do I need to credit TechShu?

No, but we'd appreciate a star on GitHub! ⭐

### Can I modify the boilerplates?

Absolutely! They're designed to be customized for your specific needs.

### Are they production-ready?

Yes! All boilerplates are extracted from TechShu LMS, a production application serving real users.

---

## Installation & Setup

### How do I install a boilerplate?

Three methods:

**Method 1: CLI (Recommended)**
```bash
npm install -g @techshu/cli
techshu add email-service
```

**Method 2: API**
```bash
curl -o file.ts https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/email-service/lib/brevo-service.ts
```

**Method 3: Manual**
```bash
git clone https://github.com/teachskillofskills-ai/techshu-boilerplates.git
cp -r techshu-boilerplates/email-service ./my-project/
```

### What dependencies do I need?

Each boilerplate's README lists required dependencies. Generally:
- Next.js 14+
- React 18+
- TypeScript 5+
- Supabase (for most boilerplates)

### Do I need Supabase?

Most boilerplates use Supabase for:
- Authentication
- Database
- Storage
- Real-time features

But you can adapt them to use other backends.

### How do I set up environment variables?

1. Copy `.env.example` from the boilerplate
2. Rename to `.env.local`
3. Fill in your credentials

```bash
cp boilerplates/authentication/.env.example .env.local
```

### Do I need to run database migrations?

Yes, if the boilerplate includes a `database/` folder:

```bash
# Copy SQL files to your Supabase project
# Run them in the SQL editor
```

Or use Supabase CLI:
```bash
supabase db push
```

---

## Usage Questions

### Can I use multiple boilerplates together?

Yes! They're designed to work together. For example:

```bash
techshu add authentication
techshu add course-management
techshu add email-service
```

### How do I customize a boilerplate?

1. Add the boilerplate to your project
2. Modify the code to fit your needs
3. Update styles, text, logic as needed

Example:
```typescript
// Original
<Button>Submit</Button>

// Customized
<Button className="bg-blue-500">Send Application</Button>
```

### Can I use only part of a boilerplate?

Yes! You can cherry-pick specific components or functions:

```bash
# Get only the component you need
curl -o Button.tsx https://raw.githubusercontent.com/.../components/button.tsx
```

### How do I update a boilerplate?

```bash
# Re-fetch the boilerplate
techshu add email-service --force

# Or manually check for updates
git pull origin main
```

### Can I contribute improvements?

Yes! We welcome contributions:
1. Fork the repository
2. Make your changes
3. Submit a pull request

---

## Technical Questions

### What version of Next.js is required?

Next.js 14+ with App Router. Most boilerplates use:
- Server Components by default
- Client Components when needed
- Server Actions for mutations

### Do they work with Pages Router?

They're built for App Router, but you can adapt them to Pages Router with some modifications.

### What about TypeScript?

All boilerplates are written in TypeScript with full type safety.

### Can I use JavaScript instead?

Yes, but you'll need to remove type annotations:

```typescript
// TypeScript
function sendEmail(to: string, subject: string): Promise<void>

// JavaScript
function sendEmail(to, subject)
```

### Do they work with other databases?

They're built for Supabase (PostgreSQL), but you can adapt them to:
- MySQL
- MongoDB
- Prisma
- Any other database

You'll need to modify the database queries.

### Can I use them with other frameworks?

The React components can be used with:
- Remix
- Gatsby
- Create React App
- Vite

But you'll need to adapt server-side code.

---

## Supabase Questions

### Do I need a Supabase account?

Yes, for most boilerplates. Sign up at https://supabase.com (free tier available).

### How do I get Supabase credentials?

1. Create a project at https://supabase.com
2. Go to Settings → API
3. Copy:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (for server-side)

### What's the difference between anon key and service role key?

- **Anon Key**: Public, safe for client-side, respects RLS
- **Service Role Key**: Private, server-side only, bypasses RLS

### How do I set up Row Level Security (RLS)?

Each boilerplate with database schemas includes RLS policies:

```sql
-- From authentication/database/02_rls_policies.sql
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);
```

Run these in Supabase SQL Editor.

### Can I use Supabase Auth with social providers?

Yes! Enable in Supabase Dashboard → Authentication → Providers:

```typescript
await supabase.auth.signInWithOAuth({
  provider: 'google'
})
```

---

## AI Features Questions

### Do I need OpenAI API key?

For AI boilerplates, yes. Get one at https://platform.openai.com

### What AI models are supported?

The AI service includes fallback to 9 models:
- OpenAI GPT-4, GPT-3.5
- Google Gemini
- OpenRouter (7 models)

### How much do AI features cost?

Depends on usage:
- GPT-3.5: ~$0.002 per 1K tokens
- GPT-4: ~$0.03 per 1K tokens
- Gemini: Free tier available

### Can I use local AI models?

Yes! Modify the AI service to use:
- Ollama
- LM Studio
- LocalAI

---

## Email Service Questions

### What email provider is used?

Brevo (formerly Sendinblue). Free tier: 300 emails/day.

### Can I use other email providers?

Yes! Adapt the email service to use:
- SendGrid
- Mailgun
- AWS SES
- Resend

### How do I create email templates?

1. Create templates in Brevo dashboard
2. Get template ID
3. Use in code:

```typescript
await sendEmail({
  to: 'user@example.com',
  templateId: 1,
  params: { name: 'John' }
})
```

---

## Deployment Questions

### Can I deploy to Vercel?

Yes! All boilerplates are Vercel-ready:

```bash
vercel deploy
```

### What about other platforms?

They work on:
- Netlify
- AWS Amplify
- Railway
- Render
- Self-hosted

### Do I need environment variables in production?

Yes! Set them in your deployment platform:

**Vercel**:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
```

**Netlify**:
Site settings → Environment variables

---

## Pricing & Licensing

### How much does it cost?

**Free!** All boilerplates are MIT licensed.

### Can I use them in commercial projects?

Yes! No restrictions.

### Can I resell them?

You can use them in client projects, but you can't resell the boilerplates themselves as a product.

### Do you offer support?

Community support via:
- GitHub Issues
- GitHub Discussions
- Documentation

---

## Performance Questions

### Are they optimized?

Yes! They include:
- Server Components for better performance
- Lazy loading
- Image optimization
- Caching strategies
- Compression

### How do I improve performance?

1. Use Server Components where possible
2. Implement caching
3. Optimize images
4. Use CDN for static assets
5. Enable compression

---

## Security Questions

### Are they secure?

Yes! They follow best practices:
- Row Level Security (RLS)
- Input validation
- XSS prevention
- CSRF protection
- Secure authentication

### Should I review the code?

Yes! Always review code before using in production.

### How do I report security issues?

Email: security@techshu.com (or create a private security advisory on GitHub)

---

## Troubleshooting

### "Module not found" error

Install missing dependencies:
```bash
npm install [missing-package]
```

### "Supabase client not initialized"

Check environment variables:
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

### "RLS policy violation"

Check your RLS policies in Supabase. Make sure they allow the operation.

### "API rate limit exceeded"

You've hit GitHub's rate limit. Wait an hour or authenticate requests.

### Components not rendering

Make sure you're using the correct import:
```typescript
// Client Component
'use client'
import { Button } from '@/components/button'

// Server Component (default)
import { Button } from '@/components/button'
```

---

## Getting Help

### Where can I get help?

1. **Documentation**: Read the README for each boilerplate
2. **Examples**: Check [EXAMPLES.md](./EXAMPLES.md)
3. **Scenarios**: See [SCENARIOS.md](./SCENARIOS.md)
4. **Issues**: https://github.com/teachskillofskills-ai/techshu-boilerplates/issues
5. **Discussions**: https://github.com/teachskillofskills-ai/techshu-boilerplates/discussions

### How do I report a bug?

1. Go to GitHub Issues
2. Click "New Issue"
3. Describe the bug with:
   - What you expected
   - What happened
   - Steps to reproduce
   - Error messages

### How do I request a feature?

1. Go to GitHub Discussions
2. Create a new discussion in "Ideas"
3. Describe the feature you'd like

---

## Still have questions?

Ask in our [GitHub Discussions](https://github.com/teachskillofskills-ai/techshu-boilerplates/discussions)!

