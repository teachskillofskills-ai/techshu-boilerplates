'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserCheck, UserX, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface User {
  id: string
  full_name: string | null
  email: string
  approval_status: string
}

interface UserApprovalActionsProps {
  users: User[]
}

export function UserApprovalActions({ users }: UserApprovalActionsProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const supabase = createClient()

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    )
  }

  const selectAllUsers = () => {
    setSelectedUsers(users.map(user => user.id))
  }

  const clearSelection = () => {
    setSelectedUsers([])
  }

  const bulkUpdateStatus = async (status: 'approved' | 'rejected') => {
    if (selectedUsers.length === 0) return

    setIsProcessing(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          approval_status: status,
          updated_at: new Date().toISOString(),
        })
        .in('id', selectedUsers)

      if (error) {
        console.error('Error updating users:', error)
        alert('Failed to update users')
      } else {
        alert(`Successfully ${status} ${selectedUsers.length} users`)
        // Refresh the page to show updated data
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating users:', error)
      alert('Failed to update users')
    } finally {
      setIsProcessing(false)
    }
  }

  const sendBulkEmail = async () => {
    if (selectedUsers.length === 0) return

    const selectedEmails = users
      .filter(user => selectedUsers.includes(user.id))
      .map(user => user.email)
      .join(',')

    window.open(`mailto:${selectedEmails}?subject=Account Update&body=Hello,`)
  }

  return (
    <div className="space-y-6">
      {/* User Selection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Select Users</h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={selectAllUsers}>
              Select All ({users.length})
            </Button>
            <Button variant="outline" size="sm" onClick={clearSelection}>
              Clear Selection
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(user => (
            <div
              key={user.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedUsers.includes(user.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleUserSelection(user.id)}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-4 h-4 border-2 rounded ${
                    selectedUsers.includes(user.id)
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedUsers.includes(user.id) && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {user.full_name || 'No name provided'}
                  </div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedUsers.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-900 font-medium">
                {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
              </span>
              <Badge variant="secondary">{selectedUsers.length} selected</Badge>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      <div>
        <h3 className="text-lg font-medium mb-4">Bulk Actions</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="admin"
            onClick={() => bulkUpdateStatus('approved')}
            disabled={selectedUsers.length === 0 || isProcessing}
            className="h-20 flex-col"
          >
            <UserCheck className="h-6 w-6 mb-2" />
            <span>Approve Selected</span>
            {selectedUsers.length > 0 && (
              <span className="text-xs opacity-80">({selectedUsers.length} users)</span>
            )}
          </Button>

          <Button
            onClick={() => bulkUpdateStatus('rejected')}
            disabled={selectedUsers.length === 0 || isProcessing}
            variant="destructive"
            className="h-20 flex-col"
          >
            <UserX className="h-6 w-6 mb-2" />
            <span>Reject Selected</span>
            {selectedUsers.length > 0 && (
              <span className="text-xs opacity-80">({selectedUsers.length} users)</span>
            )}
          </Button>

          <Button
            onClick={sendBulkEmail}
            disabled={selectedUsers.length === 0}
            variant="outline"
            className="h-20 flex-col"
          >
            <Mail className="h-6 w-6 mb-2" />
            <span>Email Selected</span>
            {selectedUsers.length > 0 && (
              <span className="text-xs opacity-80">({selectedUsers.length} users)</span>
            )}
          </Button>
        </div>
      </div>

      {/* Processing State */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-900">Processing users...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
