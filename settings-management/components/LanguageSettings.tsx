'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Save, Globe } from 'lucide-react'
import { optimizedStorage } from '@/lib/storage/optimized-storage'

interface LanguageSettingsProps {
  userId: string
}

interface LanguagePreferences {
  language: string
  timezone: string
  date_format: string
  number_format: string
  currency: string
}

export function LanguageSettings({ userId }: LanguageSettingsProps) {
  const [preferences, setPreferences] = useState<LanguagePreferences>({
    language: 'en-US',
    timezone: 'UTC-8',
    date_format: 'MM/DD/YYYY',
    number_format: 'US',
    currency: 'USD',
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
        .select('language_preferences')
        .eq('user_id', userId)
        .single()

      if (data?.language_preferences) {
        setPreferences(data.language_preferences)
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updatePreference = <K extends keyof LanguagePreferences>(
    key: K,
    value: LanguagePreferences[K]
  ) => {
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
        language_preferences: preferences,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      // Apply language settings immediately
      await applyLanguageSettings()

      toast.success('Language preferences saved!')
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast.error('Failed to save preferences. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const applyLanguageSettings = async () => {
    // Set document language
    document.documentElement.lang = preferences.language.split('-')[0]

    // Store in optimized storage for immediate application
    await optimizedStorage.setItem('userLanguage', preferences.language, 'important')
    await optimizedStorage.setItem('userTimezone', preferences.timezone, 'important')
    await optimizedStorage.setItem('userDateFormat', preferences.date_format, 'important')
    await optimizedStorage.setItem('userNumberFormat', preferences.number_format, 'important')
    await optimizedStorage.setItem('userCurrency', preferences.currency, 'important')
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
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Language
          </h4>
          <Select
            value={preferences.language}
            onValueChange={value => updatePreference('language', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-US">English (US)</SelectItem>
              <SelectItem value="en-GB">English (UK)</SelectItem>
              <SelectItem value="es-ES">Spanish</SelectItem>
              <SelectItem value="fr-FR">French</SelectItem>
              <SelectItem value="de-DE">German</SelectItem>
              <SelectItem value="zh-CN">Chinese (Simplified)</SelectItem>
              <SelectItem value="ja-JP">Japanese</SelectItem>
              <SelectItem value="ko-KR">Korean</SelectItem>
              <SelectItem value="pt-BR">Portuguese (Brazil)</SelectItem>
              <SelectItem value="it-IT">Italian</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h4 className="font-medium mb-2">Time Zone</h4>
          <Select
            value={preferences.timezone}
            onValueChange={value => updatePreference('timezone', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC-12">UTC-12 (Baker Island)</SelectItem>
              <SelectItem value="UTC-8">UTC-8 (Pacific Time)</SelectItem>
              <SelectItem value="UTC-5">UTC-5 (Eastern Time)</SelectItem>
              <SelectItem value="UTC+0">UTC+0 (GMT)</SelectItem>
              <SelectItem value="UTC+1">UTC+1 (Central European Time)</SelectItem>
              <SelectItem value="UTC+5:30">UTC+5:30 (India Standard Time)</SelectItem>
              <SelectItem value="UTC+8">UTC+8 (China Standard Time)</SelectItem>
              <SelectItem value="UTC+9">UTC+9 (Japan Standard Time)</SelectItem>
              <SelectItem value="UTC+10">UTC+10 (Australian Eastern Time)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h4 className="font-medium mb-2">Date Format</h4>
          <Select
            value={preferences.date_format}
            onValueChange={value => updatePreference('date_format', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US)</SelectItem>
              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (UK)</SelectItem>
              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
              <SelectItem value="DD.MM.YYYY">DD.MM.YYYY (German)</SelectItem>
              <SelectItem value="DD/MM/YY">DD/MM/YY (Short)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h4 className="font-medium mb-2">Number Format</h4>
          <Select
            value={preferences.number_format}
            onValueChange={value => updatePreference('number_format', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">1,234.56 (US)</SelectItem>
              <SelectItem value="EU">1.234,56 (European)</SelectItem>
              <SelectItem value="IN">1,23,456.78 (Indian)</SelectItem>
              <SelectItem value="CH">1&apos;234.56 (Swiss)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h4 className="font-medium mb-2">Currency</h4>
          <Select
            value={preferences.currency}
            onValueChange={value => updatePreference('currency', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
              <SelectItem value="JPY">JPY (¥)</SelectItem>
              <SelectItem value="CNY">CNY (¥)</SelectItem>
              <SelectItem value="INR">INR (₹)</SelectItem>
              <SelectItem value="CAD">CAD (C$)</SelectItem>
              <SelectItem value="AUD">AUD (A$)</SelectItem>
            </SelectContent>
          </Select>
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
