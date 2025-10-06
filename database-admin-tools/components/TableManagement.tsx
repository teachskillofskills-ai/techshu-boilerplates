'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Table,
  Database,
  Search,
  RefreshCw,
  BarChart3,
  HardDrive,
  Users,
  Key,
  Eye,
  Settings,
} from 'lucide-react'

interface TableManagementProps {
  userId: string
  tables: any[]
  storageUsage: any[]
}

export function TableManagement({ userId, tables, storageUsage }: TableManagementProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const supabase = createClient()

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

  const getTableSize = (tableName: string) => {
    const usage = storageUsage.find(s => s.table_name === tableName)
    return usage?.size_bytes || 0
  }

  const filteredTables = tables.filter(
    table =>
      table.table_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      table.table_type?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // Log the refresh action
      await supabase.from('audit_logs').insert({
        user_id: userId,
        action: 'refresh_table_info',
        table_name: 'table_management',
        new_values: { description: 'Refreshed database table information' },
      })

      // Simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success('Table information refreshed')
      window.location.reload() // In a real app, you'd refetch the data
    } catch (error) {
      console.error('Error refreshing table info:', error)
      toast.error('Failed to refresh table information')
    } finally {
      setIsRefreshing(false)
    }
  }

  const getTotalRows = () => {
    return tables.reduce((total, table) => total + (table.row_count || 0), 0)
  }

  const getTotalSize = () => {
    return storageUsage.reduce((total, usage) => total + (usage.size_bytes || 0), 0)
  }

  return (
    <div className="space-y-6">
      {/* Table Statistics */}
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
                <p className="text-sm text-gray-600">Total Size</p>
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
                <p className="text-sm text-gray-600">User Tables</p>
                <p className="text-2xl font-bold text-orange-600">
                  {tables.filter(t => !t.table_name?.startsWith('auth.')).length}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Table className="h-5 w-5" />
                Database Tables
              </CardTitle>
              <CardDescription>
                Manage and monitor database tables and their properties
              </CardDescription>
            </div>
            <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tables by name or type..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tables List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredTables.length > 0 ? (
              filteredTables.map((table, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedTable === table.table_name
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() =>
                    setSelectedTable(selectedTable === table.table_name ? null : table.table_name)
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Table className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{table.table_name || `Table ${index + 1}`}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(table.row_count || 0)} rows •{' '}
                          {formatBytes(getTableSize(table.table_name))}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{table.table_type || 'BASE TABLE'}</Badge>
                      {table.table_name?.includes('auth') && (
                        <Badge variant="secondary">System</Badge>
                      )}
                      {table.table_name?.includes('public') && (
                        <Badge className="bg-accent/10 text-accent">Public</Badge>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedTable === table.table_name && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">Rows</p>
                            <p className="text-sm text-gray-600">
                              {formatNumber(table.row_count || 0)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <HardDrive className="h-4 w-4 text-purple-600" />
                          <div>
                            <p className="text-sm font-medium">Size</p>
                            <p className="text-sm text-gray-600">
                              {formatBytes(getTableSize(table.table_name))}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Key className="h-4 w-4 text-orange-600" />
                          <div>
                            <p className="text-sm font-medium">Type</p>
                            <p className="text-sm text-gray-600">
                              {table.table_type || 'BASE TABLE'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <Button size="sm" variant="outline" className="flex items-center gap-2">
                          <Eye className="h-3 w-3" />
                          View Schema
                        </Button>
                        <Button size="sm" variant="outline" className="flex items-center gap-2">
                          <BarChart3 className="h-3 w-3" />
                          Analyze
                        </Button>
                        <Button size="sm" variant="outline" className="flex items-center gap-2">
                          <Settings className="h-3 w-3" />
                          Settings
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Table className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No Tables Found' : 'No Tables Available'}
                </h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? 'Try adjusting your search criteria'
                    : 'Database table information will appear here when available'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Table Categories
          </CardTitle>
          <CardDescription>Tables organized by category and purpose</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium">User Tables</h4>
              </div>
              <div className="space-y-2">
                {tables
                  .filter(
                    t =>
                      t.table_name?.includes('profiles') ||
                      t.table_name?.includes('users') ||
                      t.table_name?.includes('roles')
                  )
                  .map((table, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">{table.table_name}</span>
                      <span className="text-gray-600 ml-2">
                        ({formatNumber(table.row_count || 0)} rows)
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Database className="h-5 w-5 text-green-600" />
                <h4 className="font-medium">Content Tables</h4>
              </div>
              <div className="space-y-2">
                {tables
                  .filter(
                    t =>
                      t.table_name?.includes('courses') ||
                      t.table_name?.includes('chapters') ||
                      t.table_name?.includes('media')
                  )
                  .map((table, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">{table.table_name}</span>
                      <span className="text-gray-600 ml-2">
                        ({formatNumber(table.row_count || 0)} rows)
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Settings className="h-5 w-5 text-purple-600" />
                <h4 className="font-medium">System Tables</h4>
              </div>
              <div className="space-y-2">
                {tables
                  .filter(
                    t =>
                      t.table_name?.includes('system') ||
                      t.table_name?.includes('config') ||
                      t.table_name?.includes('audit')
                  )
                  .map((table, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">{table.table_name}</span>
                      <span className="text-gray-600 ml-2">
                        ({formatNumber(table.row_count || 0)} rows)
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
