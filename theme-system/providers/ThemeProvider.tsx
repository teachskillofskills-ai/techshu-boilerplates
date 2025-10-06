/**
 * Theme Provider - Standalone Version
 * 
 * A complete theme system with:
 * - Dark/Light/Auto modes
 * - Font size control
 * - Accessibility features
 * - Persistent preferences
 * - Database sync (optional)
 * 
 * @example
 * ```tsx
 * import { ThemeProvider, useTheme } from './providers/ThemeProvider'
 * 
 * // Wrap your app
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * 
 * // Use in components
 * const { theme, setTheme } = useTheme()
 * ```
 */

'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// Types
type Theme = 'light' | 'dark' | 'auto'
type FontSize = 'small' | 'medium' | 'large'

interface ThemeContextType {
  theme: Theme
  fontSize: FontSize
  reducedMotion: boolean
  highContrast: boolean
  compactMode: boolean
  setTheme: (theme: Theme) => void
  setFontSize: (fontSize: FontSize) => void
  setReducedMotion: (reduced: boolean) => void
  setHighContrast: (contrast: boolean) => void
  setCompactMode: (compact: boolean) => void
  loadUserPreferences: (userId: string) => void
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Storage utilities (can be replaced with your own)
const storage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  },
}

/**
 * Theme Provider Component
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [fontSize, setFontSizeState] = useState<FontSize>('medium')
  const [reducedMotion, setReducedMotionState] = useState(false)
  const [highContrast, setHighContrastState] = useState(false)
  const [compactMode, setCompactModeState] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  /**
   * Apply theme to document
   */
  const applyTheme = (newTheme: Theme) => {
    if (typeof window === 'undefined') return

    const root = document.documentElement

    if (newTheme === 'dark') {
      root.classList.add('dark')
      root.setAttribute('data-theme', 'dark')
    } else if (newTheme === 'light') {
      root.classList.remove('dark')
      root.setAttribute('data-theme', 'light')
    } else {
      // Auto theme - check system preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (isDark) {
        root.classList.add('dark')
        root.setAttribute('data-theme', 'dark')
      } else {
        root.classList.remove('dark')
        root.setAttribute('data-theme', 'light')
      }
    }
  }

  /**
   * Apply font size to document
   */
  const applyFontSize = (newFontSize: FontSize) => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    root.classList.remove('font-small', 'font-medium', 'font-large')
    root.classList.add(`font-${newFontSize}`)
    root.setAttribute('data-font-size', newFontSize)
  }

  /**
   * Apply reduced motion
   */
  const applyReducedMotion = (reduced: boolean) => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    if (reduced) {
      root.classList.add('reduce-motion')
      root.setAttribute('data-reduced-motion', 'true')
    } else {
      root.classList.remove('reduce-motion')
      root.removeAttribute('data-reduced-motion')
    }
  }

  /**
   * Apply high contrast
   */
  const applyHighContrast = (contrast: boolean) => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    if (contrast) {
      root.classList.add('high-contrast')
      root.setAttribute('data-high-contrast', 'true')
    } else {
      root.classList.remove('high-contrast')
      root.removeAttribute('data-high-contrast')
    }
  }

  /**
   * Apply compact mode
   */
  const applyCompactMode = (compact: boolean) => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    if (compact) {
      root.classList.add('compact-mode')
      root.setAttribute('data-compact-mode', 'true')
    } else {
      root.classList.remove('compact-mode')
      root.removeAttribute('data-compact-mode')
    }
  }

  /**
   * Set theme and persist
   */
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
    storage.setItem('theme-preference', newTheme)
  }

  /**
   * Set font size and persist
   */
  const setFontSize = (newFontSize: FontSize) => {
    setFontSizeState(newFontSize)
    applyFontSize(newFontSize)
    storage.setItem('font-size-preference', newFontSize)
  }

  /**
   * Set reduced motion and persist
   */
  const setReducedMotion = (reduced: boolean) => {
    setReducedMotionState(reduced)
    applyReducedMotion(reduced)
    storage.setItem('reduced-motion-preference', String(reduced))
  }

  /**
   * Set high contrast and persist
   */
  const setHighContrast = (contrast: boolean) => {
    setHighContrastState(contrast)
    applyHighContrast(contrast)
    storage.setItem('high-contrast-preference', String(contrast))
  }

  /**
   * Set compact mode and persist
   */
  const setCompactMode = (compact: boolean) => {
    setCompactModeState(compact)
    applyCompactMode(compact)
    storage.setItem('compact-mode-preference', String(compact))
  }

  /**
   * Load user preferences from database (optional)
   * Replace with your own database logic
   */
  const loadUserPreferences = async (userId: string) => {
    try {
      // TODO: Replace with your database call
      // Example with Supabase:
      // const { data } = await supabase
      //   .from('user_preferences')
      //   .select('*')
      //   .eq('user_id', userId)
      //   .single()
      //
      // if (data) {
      //   setTheme(data.theme || 'light')
      //   setFontSize(data.font_size || 'medium')
      //   setReducedMotion(data.reduced_motion || false)
      //   setHighContrast(data.high_contrast || false)
      //   setCompactMode(data.compact_mode || false)
      // }

      console.log('Load preferences for user:', userId)
    } catch (error) {
      console.error('Error loading user preferences:', error)
    }
  }

  /**
   * Initialize theme from storage or system preference
   */
  useEffect(() => {
    if (isInitialized) return

    const loadThemeSettings = () => {
      try {
        // Load from storage
        const savedTheme = storage.getItem('theme-preference') as Theme | null
        const savedFontSize = storage.getItem('font-size-preference') as FontSize | null
        const savedReducedMotion = storage.getItem('reduced-motion-preference') === 'true'
        const savedHighContrast = storage.getItem('high-contrast-preference') === 'true'
        const savedCompactMode = storage.getItem('compact-mode-preference') === 'true'

        // Apply theme
        if (savedTheme) {
          setThemeState(savedTheme)
          applyTheme(savedTheme)
        } else {
          // Default to light mode
          setThemeState('light')
          applyTheme('light')
        }

        // Apply font size
        if (savedFontSize) {
          setFontSizeState(savedFontSize)
          applyFontSize(savedFontSize)
        } else {
          applyFontSize('medium')
        }

        // Apply accessibility settings
        setReducedMotionState(savedReducedMotion)
        applyReducedMotion(savedReducedMotion)

        setHighContrastState(savedHighContrast)
        applyHighContrast(savedHighContrast)

        setCompactModeState(savedCompactMode)
        applyCompactMode(savedCompactMode)

        setIsInitialized(true)
      } catch (error) {
        console.warn('Failed to load theme settings:', error)
        // Fallback to defaults
        setThemeState('light')
        applyTheme('light')
        applyFontSize('medium')
        setIsInitialized(true)
      }
    }

    loadThemeSettings()
  }, [isInitialized])

  /**
   * Listen for system theme changes when in auto mode
   */
  useEffect(() => {
    if (theme !== 'auto' || typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      applyTheme('auto')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const value: ThemeContextType = {
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
    loadUserPreferences,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * Hook to use theme context
 * 
 * @throws Error if used outside ThemeProvider
 * 
 * @example
 * ```tsx
 * const { theme, setTheme } = useTheme()
 * ```
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Export types
export type { Theme, FontSize, ThemeContextType }

