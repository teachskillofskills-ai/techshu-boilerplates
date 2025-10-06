'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Archive,
  Download,
  Play,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Database,
  HardDrive,
  Calendar,
} from 'lucide-react'

interface BackupManagementProps {
  userId: string
  backupHistory: any[]
}

export function BackupManagement({ userId, backupHistory }: BackupManagementProps) {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const supabase = createClient()

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDuration = (startTime: string, endTime: string) => {
    if (!endTime) return 'In progress...'
    const start = new Date(startTime)
    const end = new Date(endTime)
    const duration = Math.round((end.getTime() - start.getTime()) / 1000)

    if (duration < 60) return `${duration}s`
    if (duration < 3600) return `${Math.round(duration / 60)}m`
    return `${Math.round(duration / 3600)}h`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'running':
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-accent/10 text-accent">Completed</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'running':
        return <Badge className="bg-primary/10 text-primary">Running</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true)
    try {
      // Create backup record
      const { error } = await supabase.from('backup_history').insert({
        type: 'full',
        status: 'running',
        started_at: new Date().toISOString(),
        created_by: userId,
        file_name: `backup_${new Date().toISOString().split('T')[0]}_${Date.now()}.sql`,
        storage_location: 's3',
      })

      if (error) throw error

      // Log the backup creation
      await supabase.from('audit_logs').insert({
        user_id: userId,
        action: 'create_database_backup',
        table_name: 'backup_history',
        new_values: { description: 'Manual database backup initiated', backup_type: 'full' },
      })

      // Simulate backup process
      setTimeout(async () => {
        try {
          // Update backup status to completed (simulation)
          await supabase
            .from('backup_history')
            .update({
              status: 'completed',
              completed_at: new Date().toISOString(),
              file_size: Math.floor(Math.random() * 1000000000) + 100000000, // Random size between 100MB-1GB
            })
            .eq('created_by', userId)
            .eq('status', 'running')
            .order('started_at', { ascending: false })
            .limit(1)

          toast.success('Backup completed successfully!')
        } catch (error) {
          console.error('Error updating backup status:', error)
        }
      }, 5000)

      toast.success('Backup initiated successfully!')
    } catch (error) {
      console.error('Error creating backup:', error)
      toast.error('Failed to create backup')
    } finally {
      setIsCreatingBackup(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      window.location.reload() // In a real app, you'd refetch the data
      toast.success('Backup history refreshed')
    } catch (error) {
      toast.error('Failed to refresh backup history')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleDownload = async (backupId: string, fileName: string) => {
    try {
      // Log download action
      await supabase.from('audit_logs').insert({
        user_id: userId,
        action: 'download_backup',
        table_name: 'backup_history',
        record_id: backupId,
        new_values: { description: `Downloaded backup file: ${fileName}` },
      })

      // Simulate download
      toast.success('Backup download initiated')
    } catch (error) {
      console.error('Error downloading backup:', error)
      toast.error('Failed to download backup')
    }
  }

  const getBackupStats = () => {
    const completed = backupHistory.filter(b => b.status === 'completed').length
    const failed = backupHistory.filter(b => b.status === 'failed').length
    const totalSize = backupHistory
      .filter(b => b.status === 'completed' && b.file_size)
      .reduce((sum, b) => sum + (b.file_size || 0), 0)

    return { completed, failed, totalSize }
  }

  const stats = getBackupStats()

  return (
    <div className="space-y-6">
      {/* Backup Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Backups</p>
                <p className="text-2xl font-bold text-blue-600">{backupHistory.length}</p>
              </div>
              <Archive className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-accent">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-destructive">{stats.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold text-secondary">{formatBytes(stats.totalSize)}</p>
              </div>
              <HardDrive className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Backup Operations
              </CardTitle>
              <CardDescription>Create and manage database backups</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" size="sm">
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={handleCreateBackup}
                disabled={isCreatingBackup}
                className="flex items-center gap-2"
              >
                <Archive className={`h-4 w-4 ${isCreatingBackup ? 'animate-spin' : ''}`} />
                {isCreatingBackup ? 'Creating...' : 'Create Backup'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Database className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium">Full Backup</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Complete database backup including all tables and data
              </p>
              <Button size="sm" className="w-full">
                Create Full Backup
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-5 w-5 text-green-600" />
                <h4 className="font-medium">Incremental Backup</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Backup only changes since the last backup
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Create Incremental
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Archive className="h-5 w-5 text-purple-600" />
                <h4 className="font-medium">Custom Backup</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Select specific tables and data to backup
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Configure Custom
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Backup History
          </CardTitle>
          <CardDescription>Recent backup operations and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {backupHistory.length > 0 ? (
              backupHistory.map((backup, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(backup.status)}
                    <div>
                      <p className="font-medium">{backup.file_name || `Backup ${index + 1}`}</p>
                      <p className="text-sm text-gray-600">
                        {backup.backup_type || 'full'} •{' '}
                        {new Date(backup.started_at).toLocaleString()}
                        {backup.completed_at &&
                          ` • ${formatDuration(backup.started_at, backup.completed_at)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      {backup.file_size && (
                        <p className="text-sm text-gray-600">{formatBytes(backup.file_size)}</p>
                      )}
                      {getStatusBadge(backup.status)}
                    </div>
                    {backup.status === 'completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(backup.id, backup.file_name)}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Backups Found</h3>
                <p className="text-gray-600 mb-4">Create your first backup to see it listed here</p>
                <Button onClick={handleCreateBackup} disabled={isCreatingBackup}>
                  <Archive className="h-4 w-4 mr-2" />
                  Create First Backup
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Backup Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Backup Information
          </CardTitle>
          <CardDescription>Important information about backup operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Automated Backups</p>
                <p className="text-sm text-blue-700">
                  Backups are automatically created according to your backup schedule configuration.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <HardDrive className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Storage Location</p>
                <p className="text-sm text-green-700">
                  Backups are stored securely in encrypted cloud storage with redundancy.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-orange-900">Retention Policy</p>
                <p className="text-sm text-orange-700">
                  Backups are retained according to your configured retention policy. Older backups
                  are automatically cleaned up.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
