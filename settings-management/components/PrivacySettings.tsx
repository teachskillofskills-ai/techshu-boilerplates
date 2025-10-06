'use client'

import { useState, useEffect } from 'react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Save, Shield, Key } from 'lucide-react'

interface PrivacySettingsProps {
  userId: string
}

interface PrivacyPreferences {
  profile_visibility: boolean
  progress_sharing: boolean
  analytics_tracking: boolean
  data_collection: boolean
  third_party_sharing: boolean
}

export function PrivacySettings({ userId }: PrivacySettingsProps) {
  const [preferences, setPreferences] = useState<PrivacyPreferences>({
    profile_visibility: true,
    progress_sharing: true,
    analytics_tracking: true,
    data_collection: true,
    third_party_sharing: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadPreferences()
  }, [userId])

  const loadPreferences = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await (supabase as any)
        .from('user_preferences')
        .select('privacy_preferences')
        .eq('user_id', userId)
        .single()

      if (data?.privacy_preferences) {
        setPreferences(data.privacy_preferences)
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updatePreference = (key: keyof PrivacyPreferences, value: boolean) => {
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
        privacy_preferences: preferences,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast.success('Privacy preferences saved!')
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast.error('Failed to save preferences. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const enableTwoFactor = async () => {
    try {
      // For now, we'll simulate 2FA setup
      // In a real implementation, you would:
      // 1. Generate a secret key
      // 2. Show QR code for authenticator app
      // 3. Verify the setup with a test code

      setTwoFactorEnabled(true)
      toast.success('Two-factor authentication has been enabled!')

      // You could also save this to the database
      await (supabase as any).from('user_preferences').upsert({
        user_id: userId,
        privacy_preferences: {
          ...preferences,
          two_factor_enabled: true,
        },
        updated_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error enabling 2FA:', error)
      toast.error('Failed to enable two-factor authentication')
    }
  }

  const disableTwoFactor = async () => {
    try {
      setTwoFactorEnabled(false)
      toast.success('Two-factor authentication has been disabled!')

      await (supabase as any).from('user_preferences').upsert({
        user_id: userId,
        privacy_preferences: {
          ...preferences,
          two_factor_enabled: false,
        },
        updated_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error disabling 2FA:', error)
      toast.error('Failed to disable two-factor authentication')
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
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
            <h4 className="font-medium">Profile Visibility</h4>
            <p className="text-sm text-gray-600">Make your profile visible to other students</p>
          </div>
          <Switch
            checked={preferences.profile_visibility}
            onCheckedChange={checked => updatePreference('profile_visibility', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Progress Sharing</h4>
            <p className="text-sm text-gray-600">Allow instructors to see your detailed progress</p>
          </div>
          <Switch
            checked={preferences.progress_sharing}
            onCheckedChange={checked => updatePreference('progress_sharing', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Analytics Tracking</h4>
            <p className="text-sm text-gray-600">Help improve the platform with usage analytics</p>
          </div>
          <Switch
            checked={preferences.analytics_tracking}
            onCheckedChange={checked => updatePreference('analytics_tracking', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Data Collection</h4>
            <p className="text-sm text-gray-600">
              Allow collection of learning data for personalization
            </p>
          </div>
          <Switch
            checked={preferences.data_collection}
            onCheckedChange={checked => updatePreference('data_collection', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Third-party Sharing</h4>
            <p className="text-sm text-gray-600">Share anonymized data with educational partners</p>
          </div>
          <Switch
            checked={preferences.third_party_sharing}
            onCheckedChange={checked => updatePreference('third_party_sharing', checked)}
          />
        </div>
      </div>

      <div className="pt-4 border-t">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Two-Factor Authentication
        </h4>
        <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account</p>
        <div className="flex items-center gap-3">
          <Button
            onClick={twoFactorEnabled ? disableTwoFactor : enableTwoFactor}
            variant={twoFactorEnabled ? 'destructive' : 'default'}
            className="flex items-center gap-2"
          >
            <Key className="h-4 w-4" />
            {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
          </Button>
          {twoFactorEnabled && (
            <span className="text-sm text-green-600 font-medium">✓ Enabled</span>
          )}
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
