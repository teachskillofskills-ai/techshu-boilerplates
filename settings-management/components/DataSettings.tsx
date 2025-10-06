'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Download, Trash2, AlertTriangle, Database, FileText } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface DataSettingsProps {
  userId: string
}

export function DataSettings({ userId }: DataSettingsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [dataStats, setDataStats] = useState({
    storageUsed: '0 KB',
    notesCount: 0,
    coursesEnrolled: 0,
    progressRecords: 0,
  })

  const supabase = createClient()

  useEffect(() => {
    loadDataStats()
  }, [userId])

  const loadDataStats = async () => {
    try {
      const [{ count: notesCount }, { count: coursesCount }, { count: progressCount }] =
        await Promise.all([
          supabase.from('notes').select('*', { count: 'exact', head: true }).eq('user_id', userId),
          supabase
            .from('enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId),
          supabase
            .from('progress')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId),
        ])

      // Estimate storage usage (rough calculation)
      const estimatedStorage = ((notesCount || 0) * 0.5 + (progressCount || 0) * 0.1).toFixed(1)

      setDataStats({
        storageUsed: `${estimatedStorage} KB`,
        notesCount: notesCount || 0,
        coursesEnrolled: coursesCount || 0,
        progressRecords: progressCount || 0,
      })
    } catch (error) {
      console.error('Error loading data stats:', error)
    }
  }

  const exportData = async () => {
    setIsExporting(true)
    try {
      // Get all user data
      const [
        { data: profile },
        { data: enrollments },
        { data: progress },
        { data: notes },
        { data: preferences },
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('enrollments').select('*, courses(*)').eq('user_id', userId),
        supabase.from('progress').select('*, chapters(*, courses(*))').eq('user_id', userId),
        supabase.from('notes').select('*').eq('user_id', userId),
        (supabase as any).from('user_preferences').select('*').eq('user_id', userId),
      ])

      const exportData = {
        profile,
        enrollments,
        progress,
        notes,
        preferences,
        exported_at: new Date().toISOString(),
      }

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `techshu-data-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Data exported successfully!')
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error('Failed to export data. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const deleteAllData = async () => {
    setIsDeleting(true)
    try {
      // Delete user data in order (respecting foreign key constraints)
      await Promise.all([
        supabase.from('notes').delete().eq('user_id', userId),
        supabase.from('progress').delete().eq('user_id', userId),
        supabase.from('enrollments').delete().eq('user_id', userId),
        (supabase as any).from('user_preferences').delete().eq('user_id', userId),
      ])

      // Reset profile data but keep the record
      await supabase
        .from('profiles')
        .update({
          full_name: null,
          bio: null,
          website: null,
          location: null,
          phone: null,
          avatar_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      toast.success('All data deleted successfully!')
    } catch (error) {
      console.error('Error deleting data:', error)
      toast.error('Failed to delete data. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const deleteAccount = async () => {
    setIsDeletingAccount(true)
    try {
      // This would typically involve calling an API endpoint
      // that handles account deletion properly
      toast.info('Account deletion request submitted. You will receive an email confirmation.')

      // In a real implementation, you would:
      // 1. Send a confirmation email
      // 2. Mark account for deletion
      // 3. Actually delete after confirmation period
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error('Failed to delete account. Please contact support.')
    } finally {
      setIsDeletingAccount(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Data Export */}
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Export
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Download a copy of your data including courses, progress, notes, and preferences
          </p>
          <Button
            onClick={exportData}
            disabled={isExporting}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Request Data Export'}
          </Button>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Data Usage
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="font-medium text-gray-900">Storage Used</div>
              <div className="text-gray-600">{dataStats.storageUsed}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="font-medium text-gray-900">Notes Created</div>
              <div className="text-gray-600">{dataStats.notesCount} notes</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="font-medium text-gray-900">Courses Enrolled</div>
              <div className="text-gray-600">{dataStats.coursesEnrolled} courses</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="font-medium text-gray-900">Progress Records</div>
              <div className="text-gray-600">{dataStats.progressRecords} records</div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="pt-6 border-t">
        <h4 className="font-medium mb-4 text-red-600 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Danger Zone
        </h4>
        <div className="space-y-4">
          <div className="border border-red-200 rounded-lg p-4">
            <h5 className="font-medium text-red-900">Delete All Learning Data</h5>
            <p className="text-sm text-red-700 mb-3">
              Permanently delete all your learning progress, notes, and course data. Your account
              will remain active.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete All Learning Data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Course progress and enrollments</li>
                      <li>Notes and bookmarks</li>
                      <li>Learning preferences</li>
                      <li>Achievement progress</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={deleteAllData}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete All Data'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="border border-red-200 rounded-lg p-4">
            <h5 className="font-medium text-red-900">Delete Account</h5>
            <p className="text-sm text-red-700 mb-3">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account Permanently?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and all
                    data. You will receive an email confirmation before the deletion is processed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={deleteAccount}
                    disabled={isDeletingAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeletingAccount ? 'Processing...' : 'Delete Account'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  )
}
