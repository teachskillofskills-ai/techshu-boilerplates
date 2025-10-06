'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileBrowser } from './FileBrowser'
import { StorageAnalytics } from './StorageAnalytics'
import { BulkFileOperations } from './BulkFileOperations'
import { FilePermissions } from './FilePermissions'
import { StorageCleanup } from './StorageCleanup'
import { FileUploadManager } from './FileUploadManager'
import {
  FolderOpen,
  BarChart3,
  Settings,
  Shield,
  Trash2,
  Upload,
  HardDrive,
  Files,
  Users,
  Database,
} from 'lucide-react'

interface FileManagerContainerProps {
  userId: string
  userRole: string
  buckets: any[]
  mediaFiles: any[]
  users: any[]
  courses: any[]
}

type FileManagerTab = 'browser' | 'analytics' | 'bulk' | 'permissions' | 'cleanup' | 'upload'

const tabs = [
  {
    id: 'browser' as FileManagerTab,
    name: 'File Browser',
    icon: FolderOpen,
    description: 'Browse and manage all files',
  },
  {
    id: 'analytics' as FileManagerTab,
    name: 'Storage Analytics',
    icon: BarChart3,
    description: 'Storage usage and statistics',
  },
  {
    id: 'upload' as FileManagerTab,
    name: 'Upload Manager',
    icon: Upload,
    description: 'Advanced file upload tools',
  },
  {
    id: 'bulk' as FileManagerTab,
    name: 'Bulk Operations',
    icon: Settings,
    description: 'Batch file operations',
  },
  {
    id: 'permissions' as FileManagerTab,
    name: 'Permissions',
    icon: Shield,
    description: 'File access control',
  },
  {
    id: 'cleanup' as FileManagerTab,
    name: 'Storage Cleanup',
    icon: Trash2,
    description: 'Find and remove unused files',
  },
]

export function FileManagerContainer({
  userId,
  userRole,
  buckets,
  mediaFiles,
  users,
  courses,
}: FileManagerContainerProps) {
  const [activeTab, setActiveTab] = useState<FileManagerTab>('browser')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  // Calculate storage statistics
  const totalFiles = mediaFiles.length
  const totalSize = mediaFiles.reduce((sum, file) => sum + (file.file_size || 0), 0)
  const bucketStats = buckets.map(bucket => {
    const bucketFiles = mediaFiles.filter(file => file.storage_path?.startsWith(bucket.name))
    return {
      ...bucket,
      fileCount: bucketFiles.length,
      totalSize: bucketFiles.reduce((sum, file) => sum + (file.file_size || 0), 0),
    }
  })

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Files</p>
                <p className="text-2xl font-bold text-blue-600">{totalFiles}</p>
              </div>
              <Files className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Storage</p>
                <p className="text-2xl font-bold text-green-600">{formatBytes(totalSize)}</p>
              </div>
              <HardDrive className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Storage Buckets</p>
                <p className="text-2xl font-bold text-purple-600">{buckets.length}</p>
              </div>
              <Database className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-orange-600">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bucket Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Buckets Overview</CardTitle>
          <CardDescription>Overview of all storage buckets and their usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bucketStats.map(bucket => (
              <div key={bucket.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{bucket.name}</h4>
                  <Badge variant={bucket.public ? 'default' : 'secondary'}>
                    {bucket.public ? 'Public' : 'Private'}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Files:</span>
                    <span className="font-medium">{bucket.fileCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="font-medium">{formatBytes(bucket.totalSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Limit:</span>
                    <span className="font-medium">
                      {bucket.file_size_limit ? formatBytes(bucket.file_size_limit) : 'No limit'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main File Manager Interface */}
      <Card>
        <CardHeader>
          <CardTitle>File Management</CardTitle>
          <CardDescription>Comprehensive file management and administration tools</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={value => setActiveTab(value as FileManagerTab)}>
            <TabsList className="grid w-full grid-cols-6">
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.name}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            <div className="mt-6">
              <TabsContent value="browser">
                <FileBrowser
                  userId={userId}
                  userRole={userRole}
                  buckets={buckets}
                  mediaFiles={mediaFiles}
                  users={users}
                  courses={courses}
                  selectedFiles={selectedFiles}
                  onSelectionChange={setSelectedFiles}
                />
              </TabsContent>

              <TabsContent value="analytics">
                <StorageAnalytics
                  buckets={bucketStats}
                  mediaFiles={mediaFiles}
                  users={users}
                  courses={courses}
                />
              </TabsContent>

              <TabsContent value="upload">
                <FileUploadManager
                  userId={userId}
                  buckets={buckets}
                  courses={courses}
                  onUploadComplete={() => {
                    // Force refresh by reloading the page
                    setTimeout(() => window.location.reload(), 1000)
                  }}
                />
              </TabsContent>

              <TabsContent value="bulk">
                <BulkFileOperations
                  selectedFiles={selectedFiles}
                  mediaFiles={mediaFiles}
                  buckets={buckets}
                  courses={courses}
                  onSelectionChange={setSelectedFiles}
                />
              </TabsContent>

              <TabsContent value="permissions">
                <FilePermissions
                  buckets={buckets}
                  mediaFiles={mediaFiles}
                  users={users}
                  userRole={userRole}
                />
              </TabsContent>

              <TabsContent value="cleanup">
                <StorageCleanup
                  buckets={buckets}
                  mediaFiles={mediaFiles}
                  courses={courses}
                  userId={userId}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
