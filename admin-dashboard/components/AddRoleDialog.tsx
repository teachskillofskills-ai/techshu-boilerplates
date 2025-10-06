'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { LoadingButton } from '@/components/ui/LoadingButton'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

interface Permission {
  id: string
  name: string
  description: string | null
}

interface AddRoleDialogProps {
  permissions: Permission[]
}

export function AddRoleDialog({ permissions }: AddRoleDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedPermissions: [] as string[],
  })

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Role name is required')
      return
    }

    setIsLoading(true)
    try {
      // Create the role
      const { data: role, error: roleError } = await supabase
        .from('roles')
        .insert({
          name: formData.name.toLowerCase().replace(/\s+/g, '_'),
          description: formData.description,
        })
        .select()
        .single()

      if (roleError) throw roleError

      // Add permissions to the role
      if (formData.selectedPermissions.length > 0) {
        const rolePermissions = formData.selectedPermissions.map(permissionId => ({
          role_id: role.id,
          permission_id: permissionId,
        }))

        const { error: permissionsError } = await supabase
          .from('role_permissions')
          .insert(rolePermissions)

        if (permissionsError) throw permissionsError
      }

      toast.success('Role created successfully!')
      setFormData({
        name: '',
        description: '',
        selectedPermissions: [],
      })
      setOpen(false)
      // Refresh the page to show the new role
      window.location.reload()
    } catch (error) {
      console.error('Error creating role:', error)
      toast.error('Failed to create role')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedPermissions: checked
        ? [...prev.selectedPermissions, permissionId]
        : prev.selectedPermissions.filter(id => id !== permissionId),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Role
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>Create a new role and assign permissions to it</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="role-name">Role Name</Label>
              <Input
                id="role-name"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Content Manager"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="role-description">Description</Label>
              <Textarea
                id="role-description"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this role can do..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label>Permissions</Label>
              <div className="mt-2 space-y-3 max-h-60 overflow-y-auto border rounded-md p-3">
                {permissions.map(permission => (
                  <div key={permission.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={permission.id}
                      checked={formData.selectedPermissions.includes(permission.id)}
                      onCheckedChange={checked =>
                        handlePermissionChange(permission.id, checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <Label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                        {permission.name}
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        {permission.description || 'No description available'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <LoadingButton type="submit" loadingText="Creating..." disabled={!formData.name.trim()}>
              Create Role
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
