/**
 * Supabase Server Client
 * 
 * Server-side client for use in:
 * - Server Components
 * - Server Actions
 * - API Routes
 * - Middleware
 * 
 * @example
 * ```tsx
 * import { createClient } from './lib/supabase/server'
 * 
 * export default async function Page() {
 *   const supabase = await createClient()
 *   const { data } = await supabase.from('users').select()
 *   return <div>{data}</div>
 * }
 * ```
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

/**
 * Create a Supabase server client
 * 
 * This client automatically handles cookies for session management
 * and works in Server Components, Server Actions, and API Routes
 * 
 * @returns Configured Supabase server client
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // Handle cookie setting errors in middleware
            // This can happen when cookies are set in middleware
          }
        },
      },
    }
  )
}

/**
 * Create a Supabase admin client with service role key
 * 
 * ⚠️ WARNING: Only use this in server-side code!
 * Never expose the service role key to the client
 * 
 * Use cases:
 * - Admin operations
 * - Bypassing RLS
 * - User management
 * - Bulk operations
 * 
 * @example
 * ```tsx
 * const supabase = createAdminClient()
 * await supabase.auth.admin.createUser({ email, password })
 * ```
 */
export function createAdminClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      cookies: {
        getAll() {
          return []
        },
        setAll() {
          // No-op for admin client
        },
      },
    }
  )
}

/**
 * Get the current user from the server
 * 
 * @returns User object or null if not authenticated
 * 
 * @example
 * ```tsx
 * const user = await getUser()
 * if (!user) redirect('/signin')
 * ```
 */
export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Get the current session from the server
 * 
 * @returns Session object or null if not authenticated
 * 
 * @example
 * ```tsx
 * const session = await getSession()
 * if (!session) redirect('/signin')
 * ```
 */
export async function getSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

/**
 * Get user profile with additional data
 * 
 * @param userId - Optional user ID (defaults to current user)
 * @returns User profile or null
 * 
 * @example
 * ```tsx
 * const profile = await getUserProfile()
 * console.log(profile?.full_name)
 * ```
 */
export async function getUserProfile(userId?: string) {
  const supabase = await createClient()
  
  // Get user ID if not provided
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    userId = user.id
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return profile
}

/**
 * Check if user has a specific role
 * 
 * @param role - Role name to check
 * @param userId - Optional user ID (defaults to current user)
 * @returns Boolean indicating if user has the role
 * 
 * @example
 * ```tsx
 * const isAdmin = await hasRole('admin')
 * if (!isAdmin) redirect('/unauthorized')
 * ```
 */
export async function hasRole(role: string, userId?: string): Promise<boolean> {
  const supabase = await createClient()
  
  // Get user ID if not provided
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false
    userId = user.id
  }

  const { data, error } = await supabase
    .from('user_roles')
    .select('role:roles(name)')
    .eq('user_id', userId)
    .eq('roles.name', role)
    .single()

  if (error) return false
  return !!data
}

/**
 * Get all roles for a user
 * 
 * @param userId - Optional user ID (defaults to current user)
 * @returns Array of role names
 * 
 * @example
 * ```tsx
 * const roles = await getUserRoles()
 * console.log(roles) // ['admin', 'instructor']
 * ```
 */
export async function getUserRoles(userId?: string): Promise<string[]> {
  const supabase = await createClient()
  
  // Get user ID if not provided
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
    userId = user.id
  }

  const { data, error } = await supabase
    .from('user_roles')
    .select('role:roles(name)')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching roles:', error)
    return []
  }

  return data.map((item: any) => item.role.name)
}

/**
 * Require authentication - throws error if not authenticated
 * 
 * @throws Error if user is not authenticated
 * 
 * @example
 * ```tsx
 * export default async function ProtectedPage() {
 *   await requireAuth()
 *   return <div>Protected content</div>
 * }
 * ```
 */
export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

/**
 * Require specific role - throws error if user doesn't have role
 * 
 * @param role - Required role name
 * @throws Error if user doesn't have the role
 * 
 * @example
 * ```tsx
 * export default async function AdminPage() {
 *   await requireRole('admin')
 *   return <div>Admin content</div>
 * }
 * ```
 */
export async function requireRole(role: string) {
  const user = await requireAuth()
  const hasRequiredRole = await hasRole(role, user.id)
  
  if (!hasRequiredRole) {
    throw new Error(`Role '${role}' required`)
  }
  
  return user
}

/**
 * Type exports for convenience
 */
export type { Database }
export type { User, Session } from '@supabase/supabase-js'

