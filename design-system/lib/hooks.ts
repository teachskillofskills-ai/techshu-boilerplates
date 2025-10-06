/**
 * Design System React Hooks
 * Easy-to-use hooks for accessing design tokens and generating styles
 */

import { useMemo } from 'react'
import { ContextTheme, DesignTokens } from './tokens'
import { GradientGenerator, GradientType } from './gradients'
import { generateDesignTokens, getTheme } from './themes'

export type ContextName = 'admin' | 'learning' | 'course' | 'success' | 'brand'

/**
 * Hook to access design tokens
 */
export function useDesignTokens(): DesignTokens {
  return useMemo(() => generateDesignTokens(), [])
}

/**
 * Hook to access a specific theme context
 */
export function useTheme(context: ContextName): ContextTheme {
  return useMemo(() => getTheme(context), [context])
}

/**
 * Hook to generate gradient styles
 */
export function useGradient(
  context: ContextName,
  type: GradientType = 'primary'
): {
  className: string
  style: React.CSSProperties
} {
  const theme = useTheme(context)

  return useMemo(() => {
    let gradient

    if (type === 'hero' || type === 'card') {
      gradient = theme.backgrounds[type]
    } else {
      gradient = theme.gradients[type]
    }

    return {
      className: GradientGenerator.toCSSClass(gradient),
      style: GradientGenerator.toCSSStyle(gradient),
    }
  }, [theme, type])
}

/**
 * Hook to get context colors
 */
export function useContextColors(context: ContextName) {
  const theme = useTheme(context)

  return useMemo(
    () => ({
      primary: theme.primary,
      secondary: theme.secondary,
      // Commonly used color shortcuts
      main: theme.primary[500],
      light: theme.primary[100],
      dark: theme.primary[700],
      contrast: '#ffffff',
    }),
    [theme]
  )
}

/**
 * Hook to generate button styles for a context
 */
export function useButtonStyles(context: ContextName) {
  const gradient = useGradient(context, 'primary')
  const colors = useContextColors(context)

  return useMemo(
    () => ({
      primary: {
        ...gradient.style,
        color: '#ffffff',
        border: 'none',
        boxShadow: `0 4px 15px ${colors.primary[500]}40`,
        transition: 'all 0.2s ease',
        ':hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px ${colors.primary[500]}60`,
        },
      },
      secondary: {
        backgroundColor: colors.light,
        color: colors.dark,
        border: `1px solid ${colors.primary[200]}`,
        ':hover': {
          backgroundColor: colors.primary[50],
          borderColor: colors.primary[300],
        },
      },
      outline: {
        backgroundColor: 'transparent',
        color: colors.main,
        border: `2px solid ${colors.main}`,
        ':hover': {
          backgroundColor: colors.main,
          color: '#ffffff',
        },
      },
    }),
    [gradient, colors]
  )
}

/**
 * Hook to generate card styles for a context
 */
export function useCardStyles(context: ContextName) {
  const cardGradient = useGradient(context, 'card')
  const colors = useContextColors(context)

  return useMemo(
    () => ({
      background: cardGradient.style,
      border: `1px solid ${colors.primary[200]}`,
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      ':hover': {
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        transform: 'translateY(-2px)',
      },
    }),
    [cardGradient, colors]
  )
}

/**
 * Hook to generate hero section styles
 */
export function useHeroStyles(context: ContextName) {
  const heroGradient = useGradient(context, 'hero')

  return useMemo(
    () => ({
      background: heroGradient.style,
      color: '#ffffff',
      padding: '4rem 2rem',
      borderRadius: '1rem',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      '::before': {
        content: '""',
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.1)',
        zIndex: 1,
      },
      '> *': {
        position: 'relative' as const,
        zIndex: 2,
      },
    }),
    [heroGradient]
  )
}

/**
 * Hook to generate responsive gradient classes
 */
export function useResponsiveGradient(context: ContextName, type: GradientType = 'primary') {
  const gradient = useGradient(context, type)

  return useMemo(
    () => ({
      mobile: gradient.className,
      tablet: gradient.className.replace('to-r', 'to-br'),
      desktop: gradient.className.replace('to-r', 'to-br'),
    }),
    [gradient]
  )
}

/**
 * Hook to generate theme-aware text colors
 */
export function useTextColors(context: ContextName) {
  const colors = useContextColors(context)

  return useMemo(
    () => ({
      primary: colors.main,
      secondary: colors.primary[600],
      muted: colors.primary[400],
      light: colors.primary[300],
      contrast: '#ffffff',
      onPrimary: '#ffffff',
      onSecondary: colors.primary[700],
    }),
    [colors]
  )
}

/**
 * Hook to generate animation styles with context colors
 */
export function useAnimationStyles(context: ContextName) {
  const colors = useContextColors(context)

  return useMemo(
    () => ({
      pulse: {
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        backgroundColor: colors.primary[100],
      },
      bounce: {
        animation: 'bounce 1s infinite',
        color: colors.main,
      },
      glow: {
        boxShadow: `0 0 20px ${colors.primary[500]}60`,
        animation: 'glow 2s ease-in-out infinite alternate',
      },
    }),
    [colors]
  )
}
