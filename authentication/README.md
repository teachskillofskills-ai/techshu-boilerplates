# 🔐 Authentication System Boilerplate

A complete, production-ready authentication system with Supabase Auth, including email/password, OAuth providers, password reset, email verification, and session management.

## ✨ Features

- ✅ Email/Password authentication
- ✅ OAuth providers (Google, GitHub, etc.)
- ✅ Password reset flow
- ✅ Email verification
- ✅ Session management with optimized cookies
- ✅ Protected routes with middleware
- ✅ User profile management
- ✅ Role-based access control (RBAC)
- ✅ Server and client-side auth utilities
- ✅ Automatic profile creation
- ✅ Session monitoring and refresh

## 📦 Installation

### 1. Install Dependencies

```bash
npm install @supabase/ssr @supabase/supabase-js zod sonner
```

### 2. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Database Setup

Run the SQL migrations in order:

```bash
# 1. Create profiles table
psql -f database/01_profiles_table.sql

# 2. Create RLS policies
psql -f database/02_rls_policies.sql

# 3. Create auth triggers
psql -f database/03_auth_triggers.sql

# 4. Create roles and permissions (optional)
psql -f database/04_roles_permissions.sql
```

## 🗄️ Database Schema

### Tables Created

1. **profiles** - User profile information
2. **user_roles** - User role assignments
3. **roles** - Available roles
4. **permissions** - Role permissions

### Key Features

- Automatic profile creation on signup
- Row Level Security (RLS) enabled
- Cascade deletes for data integrity
- Indexed for performance

## 📁 File Structure

```
authentication/
├── README.md
├── components/
│   ├── SignInForm.tsx          # Email/password sign in
│   ├── SignUpForm.tsx          # User registration
│   ├── OAuthButtons.tsx        # Social login buttons
│   ├── PasswordResetForm.tsx   # Password reset request
│   ├── UpdatePasswordForm.tsx  # New password form
│   ├── SignOutButton.tsx       # Sign out component
│   └── ProtectedRoute.tsx      # Route protection wrapper
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   ├── middleware.ts       # Auth middleware
│   │   └── types.ts            # TypeScript types
│   ├── auth/
│   │   ├── client.tsx          # Client-side auth utilities
│   │   ├── server.ts           # Server-side auth utilities
│   │   ├── roles.ts            # RBAC utilities
│   │   └── session-monitor.ts  # Session monitoring
│   └── validation/
│       └── auth-schemas.ts     # Zod validation schemas
├── database/
│   ├── 01_profiles_table.sql
│   ├── 02_rls_policies.sql
│   ├── 03_auth_triggers.sql
│   └── 04_roles_permissions.sql
├── middleware.ts               # Next.js middleware
├── examples/
│   ├── basic-usage.tsx
│   ├── protected-page.tsx
│   ├── server-component.tsx
│   └── api-route.ts
└── .env.example
```

## 🚀 Quick Start

### 1. Basic Sign In Page

```tsx
import { SignInForm } from '@/boilerplates/authentication/components/SignInForm'
import { OAuthButtons } from '@/boilerplates/authentication/components/OAuthButtons'

export default function SignInPage() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>
      <SignInForm />
      <div className="my-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
      </div>
      <OAuthButtons />
    </div>
  )
}
```

### 2. Protected Route

```tsx
import { createClient } from '@/boilerplates/authentication/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  return <div>Protected content for {user.email}</div>
}
```

### 3. Get Current User (Client)

```tsx
'use client'

import { useUser } from '@/boilerplates/authentication/lib/auth/client'

export function UserProfile() {
  const { user, profile, loading } = useUser()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not authenticated</div>

  return (
    <div>
      <h2>{profile?.full_name || user.email}</h2>
      <p>Role: {profile?.role}</p>
    </div>
  )
}
```

### 4. Check Permissions

```tsx
import { checkPermission } from '@/boilerplates/authentication/lib/auth/roles'

export async function AdminButton() {
  const canManageUsers = await checkPermission('manage_users')

  if (!canManageUsers) return null

  return <button>Manage Users</button>
}
```

## 🔒 Security Features

### Row Level Security (RLS)

All tables have RLS policies that ensure:
- Users can only read their own profile
- Users can update their own profile
- Only admins can manage roles
- Service role can bypass for admin operations

### Session Security

- PKCE flow for OAuth
- Secure cookie storage
- Automatic token refresh
- Session monitoring
- XSS protection

### Input Validation

All forms use Zod schemas for validation:

```typescript
import { signInSchema } from '@/boilerplates/authentication/lib/validation/auth-schemas'

const result = signInSchema.safeParse(formData)
if (!result.success) {
  // Handle validation errors
}
```

## 🎨 Customization

### Styling

All components use Tailwind CSS and can be customized:

```tsx
<SignInForm 
  className="custom-class"
  buttonVariant="primary"
  showRememberMe={true}
/>
```

### OAuth Providers

Configure in Supabase Dashboard:
1. Go to Authentication > Providers
2. Enable desired providers
3. Add OAuth credentials
4. Update redirect URLs

### Email Templates

Customize in Supabase Dashboard:
1. Go to Authentication > Email Templates
2. Edit templates for:
   - Confirmation email
   - Password reset
   - Magic link
   - Email change

## 📊 User Flow Diagrams

### Sign Up Flow
```
User fills form → Validate input → Create account → Send verification email → Redirect to verify page
```

### Sign In Flow
```
User enters credentials → Validate → Check credentials → Create session → Redirect to dashboard
```

### Password Reset Flow
```
Request reset → Send email → Click link → Enter new password → Update password → Redirect to sign in
```

## 🧪 Testing

### Test User Creation

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, serviceRoleKey)

const { data, error } = await supabase.auth.admin.createUser({
  email: 'test@example.com',
  password: 'test123',
  email_confirm: true
})
```

### Test Protected Routes

```typescript
// Test that unauthenticated users are redirected
// Test that authenticated users can access
// Test role-based access
```

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Invalid login credentials"
- Check email is verified
- Verify password is correct
- Check Supabase logs

**Issue**: "Session not found"
- Clear cookies
- Check middleware configuration
- Verify environment variables

**Issue**: "RLS policy violation"
- Check RLS policies are applied
- Verify user has correct role
- Check service role key for admin operations

## 📚 API Reference

### Client Functions

```typescript
// Get current user
const { user, profile } = useUser()

// Sign in
await signIn(email, password)

// Sign up
await signUp(email, password, metadata)

// Sign out
await signOut()

// Reset password
await resetPassword(email)

// Update password
await updatePassword(newPassword)
```

### Server Functions

```typescript
// Get user (server)
const user = await getUser()

// Check permission
const hasPermission = await checkPermission('permission_name')

// Get user role
const role = await getUserRole(userId)
```

## 🔄 Migration from Other Auth Systems

### From NextAuth

1. Export users from NextAuth
2. Import to Supabase using admin API
3. Update session handling
4. Replace auth hooks

### From Firebase Auth

1. Export users from Firebase
2. Create users in Supabase
3. Update auth calls
4. Migrate OAuth providers

## 📈 Performance

- Optimized cookie storage (< 4KB)
- Session caching
- Lazy loading of profile data
- Efficient RLS queries

## 🎯 Next Steps

1. ✅ Set up authentication
2. ⬜ Add user profile page
3. ⬜ Implement role management
4. ⬜ Add OAuth providers
5. ⬜ Customize email templates
6. ⬜ Add two-factor authentication (2FA)

## 📖 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

**Need help?** Check the examples folder for complete implementations.

