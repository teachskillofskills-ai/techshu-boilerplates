'use client'

import { useState, useEffect } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { LoadingButton } from '@/components/ui/LoadingButton'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Settings, Plus, Trash2, Edit } from 'lucide-react'

interface Permission {
  id: string
  name: string
  description: string | null
  created_at: string
}

export function PermissionsDialog() {
  const [open, setOpen] = useState(false)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  const supabase = createClient()

  useEffect(() => {
    if (open) {
      loadPermissions()
    }
  }, [open])

  const loadPermissions = async () => {
    try {
      const { data, error } = await supabase.from('permissions').select('*').order('name')

      if (error) throw error
      setPermissions(data || [])
    } catch (error) {
      console.error('Error loading permissions:', error)
      toast.error('Failed to load permissions')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Permission name is required')
      return
    }

    setIsLoading(true)
    try {
      if (editingPermission) {
        // Update existing permission
        const { error } = await supabase
          .from('permissions')
          .update({
            name: formData.name,
            description: formData.description,
          })
          .eq('id', editingPermission.id)

        if (error) throw error
        toast.success('Permission updated successfully!')
      } else {
        // Create new permission
        const { error } = await supabase.from('permissions').insert({
          name: formData.name,
          description: formData.description,
        })

        if (error) throw error
        toast.success('Permission created successfully!')
      }

      setFormData({ name: '', description: '' })
      setEditingPermission(null)
      loadPermissions()
    } catch (error) {
      console.error('Error saving permission:', error)
      toast.error('Failed to save permission')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission)
    setFormData({
      name: permission.name,
      description: permission.description || '',
    })
  }

  const handleDelete = async (permission: Permission) => {
    if (!confirm(`Are you sure you want to delete the "${permission.name}" permission?`)) {
      return
    }

    try {
      const { error } = await supabase.from('permissions').delete().eq('id', permission.id)

      if (error) throw error
      toast.success('Permission deleted successfully!')
      loadPermissions()
    } catch (error) {
      console.error('Error deleting permission:', error)
      toast.error('Failed to delete permission')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', description: '' })
    setEditingPermission(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Permissions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Permissions</DialogTitle>
          <DialogDescription>Create, edit, and delete system permissions</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Permission Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {editingPermission ? 'Edit Permission' : 'Create Permission'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="permission-name">Permission Name</Label>
                <Input
                  id="permission-name"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., course:write"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="permission-description">Description</Label>
                <Textarea
                  id="permission-description"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this permission allows..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3">
                <LoadingButton
                  type="submit"
                  loadingText={editingPermission ? 'Updating...' : 'Creating...'}
                  disabled={!formData.name.trim()}
                >
                  {editingPermission ? 'Update' : 'Create'} Permission
                </LoadingButton>

                {editingPermission && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Permissions List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Existing Permissions</h3>
              <Badge variant="outline">{permissions.length} permissions</Badge>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {permissions.map(permission => (
                <div key={permission.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{permission.name}</h4>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(permission)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(permission)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">{permission.description}</p>
                  <p className="text-xs text-gray-400">
                    Created: {new Date(permission.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}

              {permissions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No permissions found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
