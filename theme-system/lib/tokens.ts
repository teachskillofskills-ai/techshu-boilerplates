/**
 * TechShu SkillHub Design Token System
 * Beautiful, configurable design tokens that generate harmonious color relationships
 */

export interface ColorPalette {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  950: string
}

export interface GradientDefinition {
  from: string
  via?: string
  to: string
  direction: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl'
}

export interface ContextTheme {
  name: string
  primary: ColorPalette
  secondary: ColorPalette
  gradients: {
    primary: GradientDefinition
    secondary: GradientDefinition
    subtle: GradientDefinition
    intense: GradientDefinition
  }
  backgrounds: {
    hero: GradientDefinition
    card: GradientDefinition
    section: GradientDefinition
  }
}

export interface DesignTokens {
  brand: {
    name: string
    version: string
  }
  contexts: {
    admin: ContextTheme
    learning: ContextTheme
    course: ContextTheme
    success: ContextTheme
    brand: ContextTheme
  }
  global: {
    borderRadius: {
      sm: string
      md: string
      lg: string
      xl: string
    }
    shadows: {
      sm: string
      md: string
      lg: string
      xl: string
    }
    spacing: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
    }
  }
}

// Beautiful color palettes generated from base colors
export const colorPalettes = {
  // Admin Context - Red/Orange harmony
  adminRed: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  } as ColorPalette,

  adminOrange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407',
  } as ColorPalette,

  // Learning Context - TechShu SkillHub Brand Colors
  learningPink: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#ff3968', // TechShu brand primary
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
    950: '#4c0519',
  } as ColorPalette,

  learningRose: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#ff6b47', // TechShu vibrant coral
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407',
  } as ColorPalette,

  // Course Context - Blue harmony
  courseBlue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  } as ColorPalette,

  courseIndigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  } as ColorPalette,

  // Success Context - Green harmony
  successEmerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22',
  } as ColorPalette,

  successTeal: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
    950: '#042f2e',
  } as ColorPalette,
}
