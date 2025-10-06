'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Search,
  Filter,
  Edit,
  Trash2,
  UserPlus,
  Crown,
  Shield,
  GraduationCap,
  User,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface UserRole {
  user_id: string
  roles: {
    id: string
    name: string
    description: string
  }
  profiles: {
    id: string
    full_name: string
    email: string
    created_at: string
  }
}

interface Role {
  id: string
  name: string
  description: string
}

interface RoleManagementTableProps {
  userRoles: UserRole[]
  roles: Role[]
}

export function RoleManagementTable({ userRoles, roles }: RoleManagementTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()

  // Group users by user_id to handle multiple roles per user
  const usersMap = new Map()
  userRoles.forEach(ur => {
    if (!usersMap.has(ur.user_id)) {
      usersMap.set(ur.user_id, {
        ...ur.profiles,
        roles: [],
      })
    }
    usersMap.get(ur.user_id).roles.push(ur.roles)
  })

  const users = Array.from(usersMap.values())

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole =
      roleFilter === 'all' || user.roles.some((role: any) => role.name === roleFilter)
    return matchesSearch && matchesRole
  })

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'super_admin':
        return Crown
      case 'admin':
        return Shield
      case 'instructor':
        return GraduationCap
      case 'student':
        return User
      default:
        return User
    }
  }

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'super_admin':
        return 'bg-destructive/10 text-destructive'
      case 'admin':
        return 'bg-primary/10 text-primary'
      case 'instructor':
        return 'bg-accent/10 text-accent'
      case 'student':
        return 'bg-muted text-muted-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const updateUserRole = async (userId: string, newRoleId: string) => {
    setIsLoading(true)
    try {
      // Remove existing roles for this user
      await supabase.from('user_roles').delete().eq('user_id', userId)

      // Add new role
      const { error } = await supabase.from('user_roles').insert({
        user_id: userId,
        role_id: newRoleId,
      })

      if (error) throw error

      toast.success('User role updated successfully')
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error updating user role:', error)
      toast.error('Failed to update user role')
    } finally {
      setIsLoading(false)
    }
  }

  const removeUserRole = async (userId: string, roleId: string) => {
    if (!confirm('Are you sure you want to remove this role?')) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role_id', roleId)

      if (error) throw error

      toast.success('Role removed successfully')
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error removing user role:', error)
      toast.error('Failed to remove role')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles.map(role => (
              <SelectItem key={role.id} value={role.name}>
                {role.name.replace('_', ' ').toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {user.full_name
                            ?.split(' ')
                            .map((n: string) => n[0])
                            .join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.full_name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role: any) => {
                        const Icon = getRoleIcon(role.name)
                        return (
                          <Badge
                            key={role.id}
                            className={`${getRoleColor(role.name)} flex items-center gap-1`}
                          >
                            <Icon className="h-3 w-3" />
                            {role.name.replace('_', ' ')}
                          </Badge>
                        )
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Select
                        onValueChange={roleId => updateUserRole(user.id, roleId)}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Change role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map(role => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name.replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">
            {searchTerm || roleFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'No users have been assigned roles yet'}
          </p>
        </div>
      )}
    </div>
  )
}
