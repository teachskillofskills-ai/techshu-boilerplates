import { createBrowserClient } from '@supabase/ssr'
import { Database } from './supabase-types'
import { createOptimizedClient } from './optimized-client'

export function createClient() {
  // Use optimized client for better cookie management
  return createOptimizedClient({
    enableCookieCompression: true,
    maxCookieSize: 4096,
    useSessionStorage: true,
    enableTokenRefresh: true,
  })
}

// Legacy function for backward compatibility
export function createLegacyClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
