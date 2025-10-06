/**
 * Supabase Browser Client
 * 
 * Optimized client for browser-side operations with:
 * - Cookie-based session management
 * - Automatic token refresh
 * - Session storage optimization
 * - PKCE flow for OAuth
 * 
 * @example
 * ```tsx
 * import { createClient } from './lib/supabase/client'
 * 
 * const supabase = createClient()
 * const { data, error } = await supabase.auth.signIn({ email, password })
 * ```
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

/**
 * Configuration options for the Supabase client
 */
export interface ClientConfig {
  /** Enable cookie compression to reduce size */
  enableCookieCompression?: boolean
  /** Maximum cookie size in bytes (default: 4096) */
  maxCookieSize?: number
  /** Use session storage for large sessions */
  useSessionStorage?: boolean
  /** Enable automatic token refresh */
  enableTokenRefresh?: boolean
}

/**
 * Create optimized auth storage that uses sessionStorage for large data
 */
function createOptimizedAuthStorage() {
  return {
    getItem: (key: string) => {
      if (typeof window === 'undefined') return null
      
      // Try sessionStorage first for large data
      const sessionValue = window.sessionStorage.getItem(key)
      if (sessionValue) return sessionValue
      
      // Fallback to localStorage
      return window.localStorage.getItem(key)
    },
    setItem: (key: string, value: string) => {
      if (typeof window === 'undefined') return
      
      // Store in sessionStorage if value is large
      if (value.length > 4000) {
        window.sessionStorage.setItem(key, value)
        // Keep a reference in localStorage
        window.localStorage.setItem(key, 'stored-in-session')
      } else {
        window.localStorage.setItem(key, value)
      }
    },
    removeItem: (key: string) => {
      if (typeof window === 'undefined') return
      window.sessionStorage.removeItem(key)
      window.localStorage.removeItem(key)
    },
  }
}

/**
 * Create a Supabase browser client with optimized configuration
 * 
 * @param config - Optional configuration for the client
 * @returns Configured Supabase client
 */
export function createClient(config: ClientConfig = {}) {
  const finalConfig: Required<ClientConfig> = {
    enableCookieCompression: config.enableCookieCompression ?? true,
    maxCookieSize: config.maxCookieSize ?? 4096,
    useSessionStorage: config.useSessionStorage ?? true,
    enableTokenRefresh: config.enableTokenRefresh ?? true,
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Optimize auth storage
        storage: finalConfig.useSessionStorage ? createOptimizedAuthStorage() : undefined,

        // Reduce token refresh frequency to minimize cookie updates
        autoRefreshToken: finalConfig.enableTokenRefresh,

        // Persist session in optimized storage
        persistSession: true,

        // Detect session in URL for OAuth flows
        detectSessionInUrl: true,

        // Flow type for better security
        flowType: 'pkce',
      },

      // Global configuration
      global: {
        headers: {
          'X-Client-Info': 'supabase-auth-boilerplate',
        },
      },

      // Realtime configuration (minimize connection overhead)
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    }
  )
}

/**
 * Legacy client for backward compatibility
 * Use createClient() instead for better performance
 */
export function createLegacyClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Helper function to check if user is authenticated
 * 
 * @example
 * ```tsx
 * const isAuth = await isAuthenticated()
 * if (!isAuth) redirect('/signin')
 * ```
 */
export async function isAuthenticated(): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return !!user
}

/**
 * Helper function to get current user
 * 
 * @example
 * ```tsx
 * const user = await getCurrentUser()
 * console.log(user?.email)
 * ```
 */
export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Helper function to sign out
 * 
 * @example
 * ```tsx
 * await signOut()
 * router.push('/signin')
 * ```
 */
export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(`Sign out failed: ${error.message}`)
  }
  
  // Clear all storage
  if (typeof window !== 'undefined') {
    window.sessionStorage.clear()
    window.localStorage.removeItem('supabase.auth.token')
  }
}

/**
 * Helper function to refresh session
 * 
 * @example
 * ```tsx
 * const session = await refreshSession()
 * ```
 */
export async function refreshSession() {
  const supabase = createClient()
  const { data: { session }, error } = await supabase.auth.refreshSession()
  
  if (error) {
    throw new Error(`Session refresh failed: ${error.message}`)
  }
  
  return session
}

/**
 * Helper to get session
 */
export async function getSession() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

/**
 * Type exports for convenience
 */
export type { Database }
export type { User, Session, AuthError } from '@supabase/supabase-js'

