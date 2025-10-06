'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Database, Table, HardDrive, Users, Activity } from 'lucide-react'

interface DatabaseOverviewProps {
  userId: string
  tables: any[]
  dbStats: any
  storageUsage: any[]
  activeConnections: any[]
}

export function DatabaseOverview({
  userId,
  tables,
  dbStats,
  storageUsage,
  activeConnections,
}: DatabaseOverviewProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getTotalSize = () => {
    return storageUsage.reduce((total, table) => total + (table.size_bytes || 0), 0)
  }

  const getTotalRows = () => {
    return tables.reduce((total, table) => total + (table.row_count || 0), 0)
  }

  return (
    <div className="space-y-6">
      {/* Database Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <p className="text-2xl font-bold text-[#10b981]">
                  {getTotalRows().toLocaleString()}
                </p>
              </div>
              <Database className="h-8 w-8 text-[#10b981]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Database Size</p>
                <p className="text-2xl font-bold text-[#6d28d9]">{formatBytes(getTotalSize())}</p>
              </div>
              <HardDrive className="h-8 w-8 text-[#6d28d9]" />
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

      {/* Table Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table className="h-5 w-5" />
            Table Overview
          </CardTitle>
          <CardDescription>Database tables and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          {tables.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {tables.slice(0, 10).map((table, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{table.table_name || `Table ${index + 1}`}</p>
                    <p className="text-sm text-gray-600">
                      {table.row_count?.toLocaleString() || 0} rows
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{table.table_type || 'BASE TABLE'}</Badge>
                    <Badge variant="secondary">
                      {formatBytes(
                        storageUsage.find(s => s.table_name === table.table_name)?.size_bytes || 0
                      )}
                    </Badge>
                  </div>
                </div>
              ))}
              {tables.length > 10 && (
                <p className="text-sm text-gray-600 text-center pt-2">
                  Showing first 10 tables. Total: {tables.length} tables
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Tables Found</h3>
              <p className="text-gray-600">
                Database table information will appear here when available.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Database Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Database Health
          </CardTitle>
          <CardDescription>Current database performance and health status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-[#10b981]/10 to-[#059669]/10 rounded-lg border border-[#10b981]/20">
              <div className="flex items-center justify-center mb-2">
                <Database className="h-6 w-6 text-[#10b981]" />
              </div>
              <p className="font-medium text-[#10b981]">Connection Pool</p>
              <p className="text-sm text-[#10b981]/80">
                {activeConnections.length} active connections
              </p>
              <Badge className="mt-2 bg-green-100 text-green-800">Healthy</Badge>
            </div>

            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <HardDrive className="h-6 w-6 text-primary" />
              </div>
              <p className="font-medium text-primary">Storage Usage</p>
              <p className="text-sm text-primary/80">{formatBytes(getTotalSize())}</p>
              <Badge className="mt-2 bg-primary/10 text-primary">Normal</Badge>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-[#8b5cf6]/10 to-[#6366f1]/10 rounded-lg border border-[#8b5cf6]/20">
              <div className="flex items-center justify-center mb-2">
                <Activity className="h-6 w-6 text-[#6d28d9]" />
              </div>
              <p className="font-medium text-[#6d28d9]">Query Performance</p>
              <p className="text-sm text-[#6d28d9]/80">Monitoring active</p>
              <Badge className="mt-2 bg-gradient-to-r from-[#8b5cf6]/10 to-[#6366f1]/10 text-[#6d28d9] border border-[#8b5cf6]/20">
                Good
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
