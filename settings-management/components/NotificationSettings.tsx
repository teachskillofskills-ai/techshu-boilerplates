'use client'

import { useState, useEffect } from 'react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Save } from 'lucide-react'

interface NotificationSettingsProps {
  userId: string
}

interface NotificationPreferences {
  email_notifications: boolean
  course_reminders: boolean
  achievement_notifications: boolean
  marketing_emails: boolean
  push_notifications: boolean
  weekly_digest: boolean
}

export function NotificationSettings({ userId }: NotificationSettingsProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_notifications: true,
    course_reminders: true,
    achievement_notifications: true,
    marketing_emails: false,
    push_notifications: true,
    weekly_digest: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadPreferences()
  }, [userId])

  const loadPreferences = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await (supabase as any)
        .from('user_preferences')
        .select('notification_preferences')
        .eq('user_id', userId)
        .single()

      if (data?.notification_preferences) {
        setPreferences(data.notification_preferences)
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const savePreferences = async () => {
    setIsSaving(true)
    try {
      const { error } = await (supabase as any).from('user_preferences').upsert({
        user_id: userId,
        notification_preferences: preferences,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast.success('Notification preferences saved!')
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast.error('Failed to save preferences. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Email Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Receive email updates about your courses
            </p>
          </div>
          <Switch
            checked={preferences.email_notifications}
            onCheckedChange={checked => updatePreference('email_notifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Course Reminders</h4>
            <p className="text-sm text-muted-foreground">Get reminded about incomplete lessons</p>
          </div>
          <Switch
            checked={preferences.course_reminders}
            onCheckedChange={checked => updatePreference('course_reminders', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Achievement Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Be notified when you unlock achievements
            </p>
          </div>
          <Switch
            checked={preferences.achievement_notifications}
            onCheckedChange={checked => updatePreference('achievement_notifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Push Notifications</h4>
            <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
          </div>
          <Switch
            checked={preferences.push_notifications}
            onCheckedChange={checked => updatePreference('push_notifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Weekly Digest</h4>
            <p className="text-sm text-muted-foreground">Get a weekly summary of your progress</p>
          </div>
          <Switch
            checked={preferences.weekly_digest}
            onCheckedChange={checked => updatePreference('weekly_digest', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Marketing Emails</h4>
            <p className="text-sm text-muted-foreground">
              Receive updates about new courses and features
            </p>
          </div>
          <Switch
            checked={preferences.marketing_emails}
            onCheckedChange={checked => updatePreference('marketing_emails', checked)}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={savePreferences} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  )
}
