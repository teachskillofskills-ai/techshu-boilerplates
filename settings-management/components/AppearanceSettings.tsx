'use client'

import { useState, useEffect } from 'react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/providers/ThemeProvider'
import { toast } from 'sonner'
import { Save, Sun, Moon, Monitor } from 'lucide-react'
import { useOptimizedUserPreferences } from '@/hooks/useOptimizedStorage'
import { optimizedStorage } from '@/lib/storage/optimized-storage'

interface AppearanceSettingsProps {
  userId: string
}

interface AppearancePreferences {
  theme: 'light' | 'dark' | 'auto'
  font_size: 'small' | 'medium' | 'large'
  reduced_motion: boolean
  high_contrast: boolean
  compact_mode: boolean
}

export function AppearanceSettings({ userId }: AppearanceSettingsProps) {
  const {
    theme,
    fontSize,
    reducedMotion,
    highContrast,
    compactMode,
    setTheme,
    setFontSize,
    setReducedMotion,
    setHighContrast,
    setCompactMode,
  } = useTheme()

  const [preferences, setPreferences] = useState<AppearancePreferences>({
    theme: theme || 'auto',
    font_size: fontSize || 'medium',
    reduced_motion: reducedMotion || false,
    high_contrast: highContrast || false,
    compact_mode: compactMode || false,
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
        .select('appearance_preferences')
        .eq('user_id', userId)
        .single()

      if (data?.appearance_preferences) {
        setPreferences({
          theme: data.appearance_preferences.theme || 'light',
          font_size: data.appearance_preferences.font_size || 'medium',
          reduced_motion: data.appearance_preferences.reduced_motion || false,
          high_contrast: data.appearance_preferences.high_contrast || false,
          compact_mode: data.appearance_preferences.compact_mode || false,
        })
      } else {
        // Set default preferences if none exist
        setPreferences({
          theme: 'light',
          font_size: 'medium',
          reduced_motion: false,
          high_contrast: false,
          compact_mode: false,
        })
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updatePreference = <K extends keyof AppearancePreferences>(
    key: K,
    value: AppearancePreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const savePreferences = async () => {
    setIsSaving(true)
    try {
      // Apply changes immediately to the theme context
      setTheme(preferences.theme)
      setFontSize(preferences.font_size)
      setReducedMotion(preferences.reduced_motion)
      setHighContrast(preferences.high_contrast)
      setCompactMode(preferences.compact_mode)

      // Save to optimized storage (automatically chooses best storage method)
      await optimizedStorage.setItem('user-preferences', preferences, 'important')

      // TODO: Save to database when user_preferences table is created
      // Optimized storage provides better performance than localStorage

      toast.success('Appearance preferences saved!')
    } catch (error: any) {
      console.error('Error saving preferences:', error)
      toast.error(`Failed to save preferences: ${error.message || 'Unknown error'}`)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-3">Theme</h4>
          <div className="grid grid-cols-3 gap-3">
            <div
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                preferences.theme === 'light'
                  ? 'border-primary bg-primary/10'
                  : 'hover:border-muted-foreground/30'
              }`}
              onClick={() => updatePreference('theme', 'light')}
            >
              <div className="w-full h-8 bg-background border rounded mb-2 flex items-center justify-center">
                <Sun className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-center">Light</p>
            </div>
            <div
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                preferences.theme === 'dark'
                  ? 'border-primary bg-primary/10'
                  : 'hover:border-muted-foreground/30'
              }`}
              onClick={() => updatePreference('theme', 'dark')}
            >
              <div className="w-full h-8 bg-foreground rounded mb-2 flex items-center justify-center">
                <Moon className="h-4 w-4 text-background" />
              </div>
              <p className="text-sm text-center">Dark</p>
            </div>
            <div
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                preferences.theme === 'auto'
                  ? 'border-primary bg-primary/10'
                  : 'hover:border-muted-foreground/30'
              }`}
              onClick={() => updatePreference('theme', 'auto')}
            >
              <div className="w-full h-8 bg-gradient-to-r from-background to-foreground rounded mb-2 flex items-center justify-center">
                <Monitor className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-center">Auto</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Font Size</h4>
          <Select
            value={preferences.font_size}
            onValueChange={(value: 'small' | 'medium' | 'large') =>
              updatePreference('font_size', value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Reduced Motion</h4>
            <p className="text-sm text-gray-600">Minimize animations and transitions</p>
          </div>
          <Switch
            checked={preferences.reduced_motion}
            onCheckedChange={checked => updatePreference('reduced_motion', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">High Contrast</h4>
            <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
          </div>
          <Switch
            checked={preferences.high_contrast}
            onCheckedChange={checked => updatePreference('high_contrast', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Compact Mode</h4>
            <p className="text-sm text-muted-foreground">
              Reduce spacing for more content on screen
            </p>
          </div>
          <Switch
            checked={preferences.compact_mode}
            onCheckedChange={checked => updatePreference('compact_mode', checked)}
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
