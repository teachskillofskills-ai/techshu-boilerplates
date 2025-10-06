'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DatabaseOverview } from './DatabaseOverview'
import { TableManagement } from './TableManagement'
import { BackupManagement } from './BackupManagement'
import { QueryRunner } from './QueryRunner'
import { PerformanceMonitor } from './PerformanceMonitor'
import { MigrationManager } from './MigrationManager'
import {
  Database,
  Table,
  Archive,
  Terminal,
  Activity,
  GitBranch,
  Server,
  HardDrive,
  Users,
  Clock,
} from 'lucide-react'

interface DatabaseManagementContainerProps {
  userId: string
  tables: any[]
  dbStats: any
  recentOperations: any[]
  backupHistory: any[]
  migrationStatus: any[]
  performanceMetrics: any[]
  storageUsage: any[]
  activeConnections: any[]
}

type DatabaseTab = 'overview' | 'tables' | 'backup' | 'query' | 'performance' | 'migrations'

const tabs = [
  {
    id: 'overview' as DatabaseTab,
    name: 'Overview',
    icon: Database,
    description: 'Database status and statistics',
  },
  {
    id: 'tables' as DatabaseTab,
    name: 'Tables',
    icon: Table,
    description: 'Table management and schema',
  },
  {
    id: 'backup' as DatabaseTab,
    name: 'Backup',
    icon: Archive,
    description: 'Backup and restore operations',
  },
  {
    id: 'query' as DatabaseTab,
    name: 'Query Runner',
    icon: Terminal,
    description: 'Execute database queries',
  },
  {
    id: 'performance' as DatabaseTab,
    name: 'Performance',
    icon: Activity,
    description: 'Performance monitoring',
  },
  {
    id: 'migrations' as DatabaseTab,
    name: 'Migrations',
    icon: GitBranch,
    description: 'Database migrations',
  },
]

export function DatabaseManagementContainer({
  userId,
  tables,
  dbStats,
  recentOperations,
  backupHistory,
  migrationStatus,
  performanceMetrics,
  storageUsage,
  activeConnections,
}: DatabaseManagementContainerProps) {
  const [activeTab, setActiveTab] = useState<DatabaseTab>('overview')

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const getTotalRows = () => {
    return tables.reduce((total, table) => total + (table.row_count || 0), 0)
  }

  const getTotalSize = () => {
    return storageUsage.reduce((total, table) => total + (table.size_bytes || 0), 0)
  }

  return (
    <div className="space-y-6">
      {/* Database Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tables</p>
                <p className="text-2xl font-bold text-blue-600">{tables.length}</p>
              </div>
              <Table className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Rows</p>
                <p className="text-2xl font-bold text-green-600">{formatNumber(getTotalRows())}</p>
              </div>
              <Database className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Database Size</p>
                <p className="text-2xl font-bold text-purple-600">{formatBytes(getTotalSize())}</p>
              </div>
              <HardDrive className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Connections</p>
                <p className="text-2xl font-bold text-orange-600">{activeConnections.length}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Database Health Status
          </CardTitle>
          <CardDescription>Current database performance and health metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <p className="font-medium text-green-900">Connection Pool</p>
                <p className="text-sm text-green-700">{activeConnections.length} active</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Healthy</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <p className="font-medium text-blue-900">Query Performance</p>
                <p className="text-sm text-blue-700">
                  {performanceMetrics.length > 0 ? 'Monitoring' : 'No data'}
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Normal</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div>
                <p className="font-medium text-purple-900">Last Backup</p>
                <p className="text-sm text-purple-700">
                  {backupHistory.length > 0
                    ? new Date(backupHistory[0].created_at).toLocaleDateString()
                    : 'No backups'}
                </p>
              </div>
              <Badge
                className={
                  backupHistory.length > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-orange-100 text-orange-800'
                }
              >
                {backupHistory.length > 0 ? 'Recent' : 'Overdue'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Management Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Database Management</CardTitle>
          <CardDescription>
            Comprehensive database administration and monitoring tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={value => setActiveTab(value as DatabaseTab)}>
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
              <TabsContent value="overview">
                <DatabaseOverview
                  userId={userId}
                  tables={tables}
                  dbStats={dbStats}
                  storageUsage={storageUsage}
                  activeConnections={activeConnections}
                />
              </TabsContent>

              <TabsContent value="tables">
                <TableManagement userId={userId} tables={tables} storageUsage={storageUsage} />
              </TabsContent>

              <TabsContent value="backup">
                <BackupManagement userId={userId} backupHistory={backupHistory} />
              </TabsContent>

              <TabsContent value="query">
                <QueryRunner userId={userId} />
              </TabsContent>

              <TabsContent value="performance">
                <PerformanceMonitor
                  userId={userId}
                  performanceMetrics={performanceMetrics}
                  activeConnections={activeConnections}
                />
              </TabsContent>

              <TabsContent value="migrations">
                <MigrationManager userId={userId} migrationStatus={migrationStatus} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Database Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Database Operations
          </CardTitle>
          <CardDescription>Latest database operations and administrative actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOperations.length > 0 ? (
              recentOperations.slice(0, 5).map((operation, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {operation.operation_type || 'Database Operation'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {operation.description || 'No description available'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {new Date(operation.created_at).toLocaleString()}
                    </p>
                    <Badge variant={operation.status === 'success' ? 'default' : 'destructive'}>
                      {operation.status || 'unknown'}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Operations</h3>
                <p className="text-gray-600">
                  Database operations will appear here when available.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
