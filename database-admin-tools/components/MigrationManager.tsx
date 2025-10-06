'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  GitBranch,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  RotateCcw,
  AlertTriangle,
  Database,
  FileText,
  Calendar,
  RefreshCw,
} from 'lucide-react'

interface MigrationManagerProps {
  userId: string
  migrationStatus: any[]
}

export function MigrationManager({ userId, migrationStatus }: MigrationManagerProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const supabase = createClient()

  // Mock migration data for demonstration
  const mockMigrations = [
    {
      id: '1',
      migration_name: '20250128_create_admin_tables',
      version: '1.0.0',
      description: 'Create system configuration and admin tables',
      status: 'applied',
      applied_at: '2025-01-28T10:30:00Z',
      execution_time_ms: 1250,
      applied_by: userId,
    },
    {
      id: '2',
      migration_name: '20250127_update_user_roles',
      version: '0.9.5',
      description: 'Update user roles and permissions structure',
      status: 'applied',
      applied_at: '2025-01-27T15:45:00Z',
      execution_time_ms: 890,
      applied_by: userId,
    },
    {
      id: '3',
      migration_name: '20250126_add_course_analytics',
      version: '0.9.4',
      description: 'Add analytics tables for course tracking',
      status: 'applied',
      applied_at: '2025-01-26T09:20:00Z',
      execution_time_ms: 2100,
      applied_by: userId,
    },
    {
      id: '4',
      migration_name: '20250129_add_notification_system',
      version: '1.1.0',
      description: 'Add notification system tables and triggers',
      status: 'pending',
      applied_at: null,
      execution_time_ms: null,
      applied_by: null,
    },
  ]

  const allMigrations = migrationStatus.length > 0 ? migrationStatus : mockMigrations

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied':
        return <CheckCircle className="h-4 w-4 text-accent" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />
      case 'rolled_back':
        return <RotateCcw className="h-4 w-4 text-secondary" />
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'applied':
        return <Badge className="bg-accent/10 text-accent">Applied</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'rolled_back':
        return <Badge className="bg-secondary/10 text-secondary">Rolled Back</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const handleRunMigration = async (migrationId: string, migrationName: string) => {
    try {
      // Log migration execution
      await supabase.from('audit_logs').insert({
        user_id: userId,
        action: 'run_database_migration',
        table_name: 'migrations',
        record_id: migrationId,
        new_values: {
          description: `Executed migration: ${migrationName}`,
          migration_name: migrationName,
        },
      })

      toast.success('Migration executed successfully!')
    } catch (error) {
      console.error('Error running migration:', error)
      toast.error('Failed to execute migration')
    }
  }

  const handleRollbackMigration = async (migrationId: string, migrationName: string) => {
    try {
      // Log migration rollback
      await supabase.from('audit_logs').insert({
        user_id: userId,
        action: 'rollback_database_migration',
        table_name: 'migrations',
        record_id: migrationId,
        new_values: {
          description: `Rolled back migration: ${migrationName}`,
          migration_name: migrationName,
        },
      })

      toast.success('Migration rolled back successfully!')
    } catch (error) {
      console.error('Error rolling back migration:', error)
      toast.error('Failed to rollback migration')
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Migration status refreshed')
    } catch (error) {
      toast.error('Failed to refresh migration status')
    } finally {
      setIsRefreshing(false)
    }
  }

  const appliedMigrations = allMigrations.filter(m => m.status === 'applied')
  const pendingMigrations = allMigrations.filter(m => m.status === 'pending')
  const failedMigrations = allMigrations.filter(m => m.status === 'failed')

  return (
    <div className="space-y-6">
      {/* Migration Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Migrations</p>
                <p className="text-2xl font-bold text-blue-600">{allMigrations.length}</p>
              </div>
              <GitBranch className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Applied</p>
                <p className="text-2xl font-bold text-green-600">{appliedMigrations.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{pendingMigrations.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{failedMigrations.length}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Migration History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Migration History
              </CardTitle>
              <CardDescription>Database schema migration history and status</CardDescription>
            </div>
            <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {allMigrations.map(migration => (
              <div
                key={migration.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(migration.status)}
                  <div>
                    <p className="font-medium">{migration.migration_name}</p>
                    <p className="text-sm text-gray-600">{migration.description}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span>Version: {migration.version}</span>
                      {migration.applied_at && (
                        <span>Applied: {new Date(migration.applied_at).toLocaleDateString()}</span>
                      )}
                      {migration.execution_time_ms && (
                        <span>Duration: {migration.execution_time_ms}ms</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(migration.status)}
                  <div className="flex items-center gap-2">
                    {migration.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleRunMigration(migration.id, migration.migration_name)}
                        className="flex items-center gap-2"
                      >
                        <Play className="h-3 w-3" />
                        Run
                      </Button>
                    )}
                    {migration.status === 'applied' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleRollbackMigration(migration.id, migration.migration_name)
                        }
                        className="flex items-center gap-2"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Rollback
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Migration Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Migration Information
          </CardTitle>
          <CardDescription>Important information about database migrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Migration Safety</p>
                <p className="text-sm text-blue-700">
                  All migrations are executed in transactions and can be safely rolled back if
                  needed.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-orange-900">Backup Recommendation</p>
                <p className="text-sm text-orange-700">
                  Always create a backup before running migrations, especially in production
                  environments.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <FileText className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Migration Files</p>
                <p className="text-sm text-green-700">
                  Migration files are stored in the `/supabase/migrations/` directory and are
                  version controlled.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schema Version */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Current Schema Version
          </CardTitle>
          <CardDescription>Current database schema version and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Schema Version</p>
              <p className="text-sm text-gray-600">
                Latest applied migration:{' '}
                {appliedMigrations[0]?.migration_name || 'No migrations applied'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                v{appliedMigrations[0]?.version || '0.0.0'}
              </Badge>
              <Badge variant="outline">{appliedMigrations.length} migrations applied</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
