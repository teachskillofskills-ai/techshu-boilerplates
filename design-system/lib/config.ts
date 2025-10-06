/**
 * Design System Configuration
 * Easy configuration interface for customizing the entire design system
 */

import { ColorPalette } from './tokens'

export interface DesignSystemConfig {
  name: string
  version: string
  theme: 'vibrant' | 'professional' | 'minimal' | 'custom'
  contexts: {
    admin: ContextConfig
    learning: ContextConfig
    course: ContextConfig
    success: ContextConfig
    brand: ContextConfig
  }
}

export interface ContextConfig {
  name: string
  primaryColor: string
  secondaryColor?: string
  intensity: 'subtle' | 'medium' | 'vibrant'
  style: 'modern' | 'classic' | 'playful'
}

/**
 * Default configuration - Vibrant theme
 */
export const defaultConfig: DesignSystemConfig = {
  name: 'TechShu SkillHub',
  version: '2.0.0',
  theme: 'vibrant',
  contexts: {
    admin: {
      name: 'Admin',
      primaryColor: '#ef4444', // red-500
      secondaryColor: '#f97316', // orange-500
      intensity: 'vibrant',
      style: 'modern',
    },
    learning: {
      name: 'Learning',
      primaryColor: '#ec4899', // pink-500
      secondaryColor: '#f43f5e', // rose-500
      intensity: 'vibrant',
      style: 'modern',
    },
    course: {
      name: 'Course',
      primaryColor: '#3b82f6', // blue-500
      secondaryColor: '#6366f1', // indigo-500
      intensity: 'medium',
      style: 'modern',
    },
    success: {
      name: 'Success',
      primaryColor: '#10b981', // emerald-500
      secondaryColor: '#14b8a6', // teal-500
      intensity: 'medium',
      style: 'modern',
    },
    brand: {
      name: 'Brand',
      primaryColor: '#3b82f6', // blue-500
      secondaryColor: '#ec4899', // pink-500
      intensity: 'vibrant',
      style: 'modern',
    },
  },
}

/**
 * Professional theme configuration
 */
export const professionalConfig: DesignSystemConfig = {
  ...defaultConfig,
  theme: 'professional',
  contexts: {
    admin: {
      name: 'Admin',
      primaryColor: '#dc2626', // red-600
      secondaryColor: '#ea580c', // orange-600
      intensity: 'medium',
      style: 'classic',
    },
    learning: {
      name: 'Learning',
      primaryColor: '#db2777', // pink-600
      secondaryColor: '#e11d48', // rose-600
      intensity: 'medium',
      style: 'classic',
    },
    course: {
      name: 'Course',
      primaryColor: '#2563eb', // blue-600
      secondaryColor: '#4f46e5', // indigo-600
      intensity: 'medium',
      style: 'classic',
    },
    success: {
      name: 'Success',
      primaryColor: '#059669', // emerald-600
      secondaryColor: '#0d9488', // teal-600
      intensity: 'medium',
      style: 'classic',
    },
    brand: {
      name: 'Brand',
      primaryColor: '#2563eb', // blue-600
      secondaryColor: '#db2777', // pink-600
      intensity: 'medium',
      style: 'classic',
    },
  },
}

/**
 * Minimal theme configuration
 */
export const minimalConfig: DesignSystemConfig = {
  ...defaultConfig,
  theme: 'minimal',
  contexts: {
    admin: {
      name: 'Admin',
      primaryColor: '#374151', // gray-700
      secondaryColor: '#6b7280', // gray-500
      intensity: 'subtle',
      style: 'modern',
    },
    learning: {
      name: 'Learning',
      primaryColor: '#4f46e5', // indigo-600
      secondaryColor: '#6366f1', // indigo-500
      intensity: 'subtle',
      style: 'modern',
    },
    course: {
      name: 'Course',
      primaryColor: '#1f2937', // gray-800
      secondaryColor: '#374151', // gray-700
      intensity: 'subtle',
      style: 'modern',
    },
    success: {
      name: 'Success',
      primaryColor: '#059669', // emerald-600
      secondaryColor: '#10b981', // emerald-500
      intensity: 'subtle',
      style: 'modern',
    },
    brand: {
      name: 'Brand',
      primaryColor: '#1f2937', // gray-800
      secondaryColor: '#4f46e5', // indigo-600
      intensity: 'subtle',
      style: 'modern',
    },
  },
}

/**
 * Get configuration by theme name
 */
export function getConfigByTheme(theme: DesignSystemConfig['theme']): DesignSystemConfig {
  switch (theme) {
    case 'professional':
      return professionalConfig
    case 'minimal':
      return minimalConfig
    case 'vibrant':
    default:
      return defaultConfig
  }
}

/**
 * Generate color palette from hex color
 */
export function generatePaletteFromColor(hexColor: string): ColorPalette {
  // This is a simplified version - in a real implementation,
  // you'd use a color manipulation library like chroma.js or color2k
  const baseColor = hexColor.replace('#', '')

  // Generate shades (this is a simplified approach)
  const shades = {
    50: lighten(hexColor, 0.95),
    100: lighten(hexColor, 0.9),
    200: lighten(hexColor, 0.75),
    300: lighten(hexColor, 0.6),
    400: lighten(hexColor, 0.3),
    500: hexColor,
    600: darken(hexColor, 0.1),
    700: darken(hexColor, 0.2),
    800: darken(hexColor, 0.3),
    900: darken(hexColor, 0.4),
    950: darken(hexColor, 0.5),
  }

  return shades as ColorPalette
}

/**
 * Simple color manipulation functions
 * Note: In production, use a proper color manipulation library
 */
function lighten(color: string, amount: number): string {
  // Simplified lightening - in production use proper color manipulation
  return color // Placeholder
}

function darken(color: string, amount: number): string {
  // Simplified darkening - in production use proper color manipulation
  return color // Placeholder
}

/**
 * Validate configuration
 */
export function validateConfig(config: DesignSystemConfig): boolean {
  // Check required fields
  if (!config.name || !config.version || !config.theme) {
    return false
  }

  // Check contexts
  const requiredContexts = ['admin', 'learning', 'course', 'success', 'brand']
  for (const context of requiredContexts) {
    if (!config.contexts[context as keyof typeof config.contexts]) {
      return false
    }
  }

  return true
}

/**
 * Merge custom configuration with defaults
 */
export function mergeConfig(
  customConfig: Partial<DesignSystemConfig>,
  baseConfig: DesignSystemConfig = defaultConfig
): DesignSystemConfig {
  return {
    ...baseConfig,
    ...customConfig,
    contexts: {
      ...baseConfig.contexts,
      ...customConfig.contexts,
    },
  }
}
