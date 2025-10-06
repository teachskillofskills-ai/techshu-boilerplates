import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/supabase-types'

type UserRole = Database['public']['Tables']['roles']['Row']
type UserPermission = Database['public']['Tables']['permissions']['Row']

export interface UserWithRoles {
  id: string
  email: string
  roles: UserRole[]
  permissions: UserPermission[]
}

/**
 * Get user with their roles and permissions
 */
export async function getUserWithRoles(userId: string): Promise<UserWithRoles | null> {
  const supabase = await createClient()

  // Get user basic info
  const { data: user } = await supabase.auth.admin.getUserById(userId)
  if (!user.user) return null

  // Get user role IDs
  const { data: userRoleData } = await supabase
    .from('user_roles')
    .select('role_id')
    .eq('user_id', userId)

  if (!userRoleData || userRoleData.length === 0) {
    return {
      id: user.user.id,
      email: user.user.email || '',
      roles: [],
      permissions: [],
    }
  }

  const roleIds = userRoleData.map(ur => ur.role_id)

  // Get role details
  const { data: rolesData } = await supabase.from('roles').select('*').in('id', roleIds)

  const roles = rolesData || []

  // Get permission IDs through role_permissions
  const { data: rolePermissionsData } = await supabase
    .from('role_permissions')
    .select('permission_id')
    .in('role_id', roleIds)

  const permissionIds = rolePermissionsData?.map(rp => rp.permission_id) || []

  // Get permission details
  const { data: permissionsData } = await supabase
    .from('permissions')
    .select('*')
    .in('id', permissionIds)

  const permissions = permissionsData || []

  return {
    id: user.user.id,
    email: user.user.email || '',
    roles,
    permissions,
  }
}

/**
 * Check if user has a specific role
 */
export async function hasRole(userId: string, roleName: string): Promise<boolean> {
  const supabase = await createClient()

  // Get user role IDs
  const { data: userRoleData } = await supabase
    .from('user_roles')
    .select('role_id')
    .eq('user_id', userId)

  if (!userRoleData || userRoleData.length === 0) return false

  const roleIds = userRoleData.map(ur => ur.role_id)

  // Check if any of the roles match the role name
  const { data: roleData } = await supabase
    .from('roles')
    .select('id')
    .in('id', roleIds)
    .eq('name', roleName)
    .single()

  return !!roleData
}

/**
 * Check if user has a specific permission
 */
export async function hasPermission(userId: string, permissionName: string): Promise<boolean> {
  const supabase = await createClient()

  // Get user role IDs
  const { data: userRoleData } = await supabase
    .from('user_roles')
    .select('role_id')
    .eq('user_id', userId)

  if (!userRoleData || userRoleData.length === 0) return false

  const roleIds = userRoleData.map(ur => ur.role_id)

  // Get permission IDs for these roles
  const { data: rolePermissionsData } = await supabase
    .from('role_permissions')
    .select('permission_id')
    .in('role_id', roleIds)

  if (!rolePermissionsData || rolePermissionsData.length === 0) return false

  const permissionIds = rolePermissionsData.map(rp => rp.permission_id)

  // Check if any permission matches the permission name
  const { data: permissionData } = await supabase
    .from('permissions')
    .select('id')
    .in('id', permissionIds)
    .eq('name', permissionName)
    .single()

  return !!permissionData
}

/**
 * Check if user is admin (has admin or super_admin role)
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const adminCheck = await hasRole(userId, 'admin')
  const superAdminCheck = await hasRole(userId, 'super_admin')
  return adminCheck || superAdminCheck
}

/**
 * Check if user is super admin
 */
export async function isSuperAdmin(userId: string): Promise<boolean> {
  return await hasRole(userId, 'super_admin')
}

/**
 * Check if user is instructor
 */
export async function isInstructor(userId: string): Promise<boolean> {
  const instructorCheck = await hasRole(userId, 'instructor')
  const adminCheck = await isAdmin(userId)
  return instructorCheck || adminCheck
}

/**
 * Role hierarchy constants
 */
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
  STUDENT: 'student',
} as const

export const PERMISSIONS = {
  // User management
  USER_READ: 'user:read',
  USER_WRITE: 'user:write',
  USER_DELETE: 'user:delete',

  // Role management
  ROLE_READ: 'role:read',
  ROLE_WRITE: 'role:write',
  ROLE_DELETE: 'role:delete',

  // Course management
  COURSE_READ: 'course:read',
  COURSE_WRITE: 'course:write',
  COURSE_DELETE: 'course:delete',
  COURSE_PUBLISH: 'course:publish',

  // Content management
  CONTENT_READ: 'content:read',
  CONTENT_WRITE: 'content:write',
  CONTENT_DELETE: 'content:delete',

  // System administration
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_LOGS: 'system:logs',
} as const
