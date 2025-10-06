'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MoreHorizontal,
  Mail,
  Shield,
  UserX,
  UserCheck,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// Utility function to format dates consistently across server and client
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  // Use ISO date format to avoid locale differences
  return date.toISOString().split('T')[0] // Returns YYYY-MM-DD format
}

interface User {
  id: string
  full_name: string | null
  email: string
  approval_status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  roles?: {
    name: string
    display_name: string
  }[]
}

interface UserManagementTableProps {
  users: User[]
  currentPage: number
  totalPages: number
  searchParams: any
}

export function UserManagementTable({
  users,
  currentPage,
  totalPages,
  searchParams,
}: UserManagementTableProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const supabase = createClient()

  const updateUserStatus = async (userId: string, status: 'approved' | 'rejected') => {
    setIsUpdating(userId)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          approval_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (error) {
        console.error('Error updating user status:', error)
        alert('Failed to update user status')
      } else {
        // Refresh the page to show updated data
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating user status:', error)
      alert('Failed to update user status')
    } finally {
      setIsUpdating(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            Pending
          </Badge>
        )
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRoleBadges = (roles: User['roles']) => {
    if (!roles || roles.length === 0) {
      return (
        <Badge variant="outline" className="text-xs">
          User
        </Badge>
      )
    }

    return roles.map((role, index) => (
      <Badge
        key={index}
        variant={role.name === 'super_admin' ? 'destructive' : 'secondary'}
        className="text-xs"
      >
        {role.display_name || role.name}
      </Badge>
    ))
  }

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams()
    if (searchParams.search) params.set('search', searchParams.search)
    if (searchParams.filter) params.set('filter', searchParams.filter)
    params.set('page', page.toString())
    return `/admin/users?${params.toString()}`
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">
                      {user.full_name || 'No name provided'}
                    </div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </div>
                </TableCell>

                <TableCell>{getStatusBadge(user.approval_status)}</TableCell>

                <TableCell>
                  <div className="flex flex-wrap gap-1">{getRoleBadges(user.roles)}</div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(user.created_at)}</span>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        disabled={isUpdating === user.id}
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>

                      <DropdownMenuItem asChild>
                        <Link href={`/admin/users/${user.id}`}>View Details</Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link href={`mailto:${user.email}`}>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {user.approval_status === 'pending' && (
                        <>
                          <DropdownMenuItem
                            onClick={() => updateUserStatus(user.id, 'approved')}
                            disabled={isUpdating === user.id}
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Approve User
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => updateUserStatus(user.id, 'rejected')}
                            disabled={isUpdating === user.id}
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Reject User
                          </DropdownMenuItem>
                        </>
                      )}

                      {user.approval_status === 'approved' && (
                        <DropdownMenuItem
                          onClick={() => updateUserStatus(user.id, 'rejected')}
                          disabled={isUpdating === user.id}
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Suspend User
                        </DropdownMenuItem>
                      )}

                      {user.approval_status === 'rejected' && (
                        <DropdownMenuItem
                          onClick={() => updateUserStatus(user.id, 'approved')}
                          disabled={isUpdating === user.id}
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Reactivate User
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem asChild>
                        <Link href={`/admin/users/${user.id}/roles`}>
                          <Shield className="h-4 w-4 mr-2" />
                          Manage Roles
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center space-x-2">
            {currentPage > 1 && (
              <Button variant="outline" size="sm" asChild>
                <Link href={buildPageUrl(currentPage - 1)}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Link>
              </Button>
            )}

            {currentPage < totalPages && (
              <Button variant="outline" size="sm" asChild>
                <Link href={buildPageUrl(currentPage + 1)}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
