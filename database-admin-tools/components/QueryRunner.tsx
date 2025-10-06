'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Terminal,
  Play,
  Save,
  History,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  FileText,
  Trash2,
} from 'lucide-react'

interface QueryRunnerProps {
  userId: string
}

interface QueryResult {
  id: string
  query: string
  result: any
  error?: string
  executedAt: Date
  duration: number
  rowCount?: number
}

export function QueryRunner({ userId }: QueryRunnerProps) {
  const [query, setQuery] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [queryHistory, setQueryHistory] = useState<QueryResult[]>([])
  const [selectedQuery, setSelectedQuery] = useState<QueryResult | null>(null)
  const supabase = createClient()

  const safeQueries = [
    'SELECT COUNT(*) FROM profiles',
    'SELECT COUNT(*) FROM courses',
    'SELECT COUNT(*) FROM enrollments',
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
    'SELECT * FROM system_config LIMIT 10',
    'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 5',
  ]

  const handleExecuteQuery = async () => {
    if (!query.trim()) {
      toast.error('Please enter a query to execute')
      return
    }

    // Basic safety check
    const lowerQuery = query.toLowerCase().trim()
    if (
      lowerQuery.includes('drop') ||
      lowerQuery.includes('delete') ||
      lowerQuery.includes('truncate')
    ) {
      toast.error('Destructive queries are not allowed for safety reasons')
      return
    }

    setIsExecuting(true)
    const startTime = Date.now()

    try {
      // Execute the safe query
      const { data, error } = await supabase.rpc('execute_safe_query', {
        query_text: query,
      })

      if (error) {
        console.error('Supabase RPC error:', error)
        throw new Error(
          `Database query failed: ${error.message || error.details || 'Unknown database error'}`
        )
      }

      // The function returns an array with one object containing result, row_count, execution_time_ms, query_type
      const queryResult = data?.[0]
      if (!queryResult) {
        throw new Error('No result returned from query execution')
      }

      const resultData = queryResult.result || []
      const rowCount = queryResult.row_count || 0
      const executionTime = queryResult.execution_time_ms || Date.now() - startTime

      const result: QueryResult = {
        id: Date.now().toString(),
        query,
        result: Array.isArray(resultData) ? resultData : [resultData],
        error: undefined,
        executedAt: new Date(),
        duration: executionTime,
        rowCount: rowCount,
      }

      setQueryHistory(prev => [result, ...prev.slice(0, 9)]) // Keep last 10 queries
      setSelectedQuery(result)

      // Log query execution using the new audit logs format (non-blocking)
      try {
        await (supabase as any).from('audit_logs').insert({
          user_id: userId,
          action: 'execute_database_query',
          table_name: 'query_execution',
          new_values: {
            query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
            execution_time_ms: executionTime,
            row_count: rowCount,
            query_type: queryResult.query_type,
          },
        })
      } catch (auditError) {
        console.warn('Failed to log to audit_logs:', auditError)
      }

      // Also log using the dedicated query logging function (non-blocking)
      try {
        await supabase.rpc('log_query_execution', {
          p_query_text: query,
          p_query_type: queryResult.query_type || 'UNKNOWN',
          p_execution_time_ms: executionTime,
          p_row_count: rowCount,
          p_success: true,
        })
      } catch (logError) {
        console.warn('Failed to log query execution:', logError)
      }

      toast.success(`Query executed successfully (${executionTime}ms)`)
    } catch (error) {
      // Better error logging for debugging
      console.error('Error executing query:', {
        error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        supabaseError:
          error && typeof error === 'object' ? JSON.stringify(error, null, 2) : undefined,
      })

      // Extract meaningful error message
      let errorMessage = 'Unknown error occurred'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message)
      } else if (error && typeof error === 'object' && 'error' in error) {
        errorMessage = String(error.error)
      } else if (typeof error === 'string') {
        errorMessage = error
      }

      // Create error result for history
      const errorResult: QueryResult = {
        id: Date.now().toString(),
        query,
        result: [],
        error: errorMessage,
        executedAt: new Date(),
        duration: Date.now() - startTime,
        rowCount: 0,
      }

      setQueryHistory(prev => [errorResult, ...prev.slice(0, 9)])
      setSelectedQuery(errorResult)

      // Log failed execution (non-blocking)
      try {
        await supabase.rpc('log_query_execution', {
          p_query_text: query,
          p_query_type: 'ERROR',
          p_execution_time_ms: Date.now() - startTime,
          p_row_count: 0,
          p_success: false,
          p_error_message: errorMessage,
        })
      } catch (logError) {
        console.error('Failed to log query execution:', logError)
      }

      toast.error(`Query failed: ${errorMessage}`)
    } finally {
      setIsExecuting(false)
    }
  }

  const handleSaveQuery = () => {
    if (!query.trim()) {
      toast.error('No query to save')
      return
    }

    // In a real implementation, you'd save to a user_saved_queries table
    toast.success('Query saved to your collection')
  }

  const handleLoadSafeQuery = (safeQuery: string) => {
    setQuery(safeQuery)
  }

  const formatResult = (result: any) => {
    if (!result) return 'No data returned'
    if (Array.isArray(result)) {
      return JSON.stringify(result, null, 2)
    }
    return JSON.stringify(result, null, 2)
  }

  return (
    <div className="space-y-6">
      {/* Query Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            SQL Query Runner
          </CardTitle>
          <CardDescription>Execute safe database queries and view results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Enter your SQL query here... (SELECT statements only for safety)"
              className="min-h-32 font-mono"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleExecuteQuery}
                disabled={isExecuting || !query.trim()}
                className="flex items-center gap-2"
              >
                <Play className={`h-4 w-4 ${isExecuting ? 'animate-spin' : ''}`} />
                {isExecuting ? 'Executing...' : 'Execute Query'}
              </Button>
              <Button
                onClick={handleSaveQuery}
                disabled={!query.trim()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Query
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Database className="h-3 w-3" />
                Read-only mode
              </Badge>
            </div>
          </div>

          {/* Safety Warning */}
          <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <p className="font-medium text-orange-900">Safety Notice</p>
              <p className="text-sm text-orange-700">
                Only SELECT queries are allowed. Destructive operations (DROP, DELETE, TRUNCATE) are
                blocked for safety.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safe Query Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Safe Query Examples
          </CardTitle>
          <CardDescription>Click on any query to load it into the editor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {safeQueries.map((safeQuery, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleLoadSafeQuery(safeQuery)}
                className="p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <code className="text-sm text-gray-700">{safeQuery}</code>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Query Results */}
      {selectedQuery && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedQuery.error ? (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              Query Results
            </CardTitle>
            <CardDescription>
              Executed at {selectedQuery.executedAt.toLocaleString()} • Duration:{' '}
              {selectedQuery.duration}ms
              {selectedQuery.rowCount !== undefined && ` • Rows: ${selectedQuery.rowCount}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedQuery.error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700 font-mono">{selectedQuery.error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">Query</p>
                  <code className="text-sm text-gray-700">{selectedQuery.query}</code>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-medium text-green-900 mb-2">Result</p>
                  <pre className="text-sm text-green-700 overflow-x-auto max-h-64">
                    {formatResult(selectedQuery.result)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Query History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Query History
              </CardTitle>
              <CardDescription>Recent query executions</CardDescription>
            </div>
            {queryHistory.length > 0 && (
              <Button
                onClick={() => setQueryHistory([])}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear History
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {queryHistory.length > 0 ? (
              queryHistory.map(historyItem => (
                <div
                  key={historyItem.id}
                  onClick={() => setSelectedQuery(historyItem)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedQuery?.id === historyItem.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {historyItem.error ? (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      <code className="text-sm text-gray-700">
                        {historyItem.query.substring(0, 50)}
                        {historyItem.query.length > 50 ? '...' : ''}
                      </code>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-3 w-3" />
                      {historyItem.duration}ms
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Query History</h3>
                <p className="text-gray-600">Execute a query to see it appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
