'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Shield,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Users,
  Globe,
  Database,
  Key,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'

interface MediaFile {
  id: string
  name: string
  original_name: string
  file_type: string
  mime_type: string
  file_size: number
  storage_path: string
  public_url?: string
  course_id?: string
  uploaded_by: string
  created_at: string
  updated_at: string
}

interface StorageBucket {
  id: string
  name: string
  public: boolean
  created_at?: string
  updated_at?: string
}

interface User {
  id: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

interface FilePermissionsProps {
  buckets: StorageBucket[]
  mediaFiles: MediaFile[]
  users: User[]
  userRole: string
}

export function FilePermissions({ buckets, mediaFiles, users, userRole }: FilePermissionsProps) {
  const [selectedBucket, setSelectedBucket] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const supabase = createClient()

  const selectedBucketData = buckets?.find(b => b.name === selectedBucket)
  const bucketFiles =
    mediaFiles?.filter(file => file.storage_path?.startsWith(selectedBucket)) || []

  const publicFiles = mediaFiles?.filter(file => file.public_url).length || 0
  const privateFiles = (mediaFiles?.length || 0) - publicFiles

  // Auto-select first bucket if none selected
  useState(() => {
    if (!selectedBucket && buckets && buckets.length > 0) {
      setSelectedBucket(buckets[0].name)
    }
  })

  const handleBucketPermissionChange = async (bucketName: string, isPublic: boolean) => {
    if (userRole !== 'super_admin') {
      toast.error('Only Super Admins can modify bucket permissions')
      return
    }

    setIsUpdating(true)
    try {
      // Note: This is a placeholder - actual bucket permission changes would require
      // Supabase Storage API calls or RLS policy updates
      toast.info('Bucket permission changes require backend configuration')

      // In a real implementation, you would:
      // 1. Update bucket policies via Supabase Storage API
      // 2. Update RLS policies for the bucket
      // 3. Refresh the bucket data
    } catch (error: any) {
      console.error('Error updating bucket permissions:', error)
      toast.error('Failed to update bucket permissions')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Permissions Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Public Files</p>
                <p className="text-2xl font-bold text-accent">{publicFiles}</p>
              </div>
              <Globe className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Private Files</p>
                <p className="text-2xl font-bold text-destructive">{privateFiles}</p>
              </div>
              <Lock className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Storage Buckets</p>
                <p className="text-2xl font-bold text-blue-600">{buckets.length}</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bucket Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Bucket Permissions
          </CardTitle>
          <CardDescription>Manage access permissions for storage buckets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Bucket Selector */}
            <div>
              <Label htmlFor="bucket-select">Select Bucket</Label>
              <select
                id="bucket-select"
                value={selectedBucket}
                onChange={e => setSelectedBucket(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select storage bucket"
              >
                <option value="">Select a bucket...</option>
                {buckets && buckets.length > 0 ? (
                  buckets.map(bucket => (
                    <option key={bucket.id || bucket.name} value={bucket.name}>
                      {bucket.name} ({bucket.public ? 'Public' : 'Private'})
                    </option>
                  ))
                ) : (
                  <option disabled>No buckets available</option>
                )}
              </select>
            </div>

            {/* Bucket Details */}
            {selectedBucketData && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bucket Info */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Bucket Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Name:</span>
                        <Badge variant="outline">{selectedBucketData.name}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Public Access:</span>
                        <Badge variant={selectedBucketData.public ? 'default' : 'secondary'}>
                          {selectedBucketData.public ? 'Public' : 'Private'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Files:</span>
                        <span className="font-medium">{bucketFiles.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Size Limit:</span>
                        <span className="font-medium">
                          {(selectedBucketData as any).file_size_limit
                            ? `${((selectedBucketData as any).file_size_limit / 1024 / 1024).toFixed(0)}MB`
                            : 'No limit'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Access Controls */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Access Controls</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Eye className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">Public Read</p>
                            <p className="text-sm text-muted-foreground">Anyone can view files</p>
                          </div>
                        </div>
                        <Switch
                          checked={selectedBucketData.public}
                          disabled={userRole !== 'super_admin' || isUpdating}
                          onCheckedChange={checked =>
                            handleBucketPermissionChange(selectedBucketData.name, checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Authenticated Upload</p>
                            <p className="text-sm text-gray-600">Logged-in users can upload</p>
                          </div>
                        </div>
                        <Switch checked={true} disabled />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Key className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-medium">Admin Management</p>
                            <p className="text-sm text-gray-600">Admins can manage all files</p>
                          </div>
                        </div>
                        <Switch checked={true} disabled />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Policies */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Security Policies</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900">Row Level Security (RLS)</p>
                        <p className="text-sm text-green-700">
                          Database-level security policies are active and enforced
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">MIME Type Validation</p>
                        <p className="text-sm text-blue-700">
                          Only allowed file types can be uploaded to this bucket
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <Key className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-purple-900">User-based Access</p>
                        <p className="text-sm text-purple-700">
                          Users can only manage their own uploaded files
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* User Access Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Access Management
          </CardTitle>
          <CardDescription>Manage file access permissions for users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* User List */}
            <div className="max-h-64 overflow-y-auto space-y-2">
              {users.slice(0, 10).map(user => {
                const userFiles = mediaFiles.filter(file => file.uploaded_by === user.id)

                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{user.full_name || 'Unknown User'}</p>
                      <p className="text-sm text-gray-600">{userFiles.length} files uploaded</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{'User'}</Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            {users.length > 10 && (
              <p className="text-sm text-gray-600 text-center">
                Showing first 10 users. Total: {users.length} users
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Security Recommendations
          </CardTitle>
          <CardDescription>Best practices for file security and access control</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Regular Access Review</p>
                <p className="text-sm text-blue-700">
                  Regularly review user permissions and remove access for inactive users
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Lock className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Private by Default</p>
                <p className="text-sm text-green-700">
                  Keep sensitive files in private buckets and only make public when necessary
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <Key className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-purple-900">Audit Trail</p>
                <p className="text-sm text-purple-700">
                  Monitor file access patterns and maintain logs of file operations
                </p>
              </div>
            </div>

            {userRole !== 'super_admin' && (
              <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-900">Limited Permissions</p>
                  <p className="text-sm text-orange-700">
                    Some security settings require Super Admin privileges to modify
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
