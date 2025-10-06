import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isAdmin, isSuperAdmin, isInstructor, hasRole, hasPermission } from './roles'

/**
 * Server-side admin route protection
 * Use this in server components or page components to protect admin routes
 */
export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  // Enhanced security checks
  if (authError || !user) {
    redirect('/auth/signin?next=/admin')
  }

  // Simple session validation - just check if user exists
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/signin?next=/admin')
  }

  const adminAccess = await isAdmin(user.id)
  if (!adminAccess) {
    redirect('/unauthorized')
  }

  return user
}

// Removed duplicate requireSuperAdmin function

/**
 * Server-side role-based route protection
 */
export async function requireRole(roleName: string, redirectPath = '/unauthorized') {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // Check if user has the specific role or higher privileges
  let roleAccess = false

  if (roleName === 'instructor') {
    // Instructors, admins, and super admins can access instructor routes
    roleAccess = await isInstructor(user.id)
  } else if (roleName === 'admin') {
    // Admins and super admins can access admin routes
    roleAccess = await isAdmin(user.id)
  } else if (roleName === 'super_admin') {
    // Only super admins can access super admin routes
    roleAccess = await isSuperAdmin(user.id)
  } else {
    // For other roles, check directly
    roleAccess = await hasRole(user.id, roleName)
  }

  if (!roleAccess) {
    redirect(redirectPath)
  }

  return user
}

/**
 * Server-side permission-based route protection
 */
export async function requirePermission(permissionName: string, redirectPath = '/unauthorized') {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  const permissionAccess = await hasPermission(user.id, permissionName)
  if (!permissionAccess) {
    redirect(redirectPath)
  }

  return user
}

/**
 * Server-side super admin route protection
 */
export async function requireSuperAdmin(redirectPath = '/unauthorized') {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  const superAdminAccess = await isSuperAdmin(user.id)
  if (!superAdminAccess) {
    redirect(redirectPath)
  }

  return user
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Check if current user is authenticated
 */
export async function requireAuth(redirectPath = '/auth/signin') {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(redirectPath)
  }

  return user
}
