/**
 * Dynamic Theme Generation System
 * Creates beautiful, contextual themes from design tokens
 */

import { ContextTheme, DesignTokens } from './tokens'
import { GradientGenerator } from './gradients'
import { colorPalettes } from './tokens'

/**
 * Generate complete design system from base configuration
 */
export function generateDesignTokens(): DesignTokens {
  return {
    brand: {
      name: 'TechShu SkillHub',
      version: '2.0.0',
    },
    contexts: {
      admin: createAdminTheme(),
      learning: createLearningTheme(),
      course: createCourseTheme(),
      success: createSuccessTheme(),
      brand: createBrandTheme(),
    },
    global: {
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
      shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
      },
    },
  }
}

/**
 * Admin Theme - Red/Orange harmony for administrative functions
 */
function createAdminTheme(): ContextTheme {
  const primary = colorPalettes.adminRed
  const secondary = colorPalettes.adminOrange

  return {
    name: 'Admin',
    primary,
    secondary,
    gradients: GradientGenerator.createContextGradients(primary, secondary),
    backgrounds: {
      hero: GradientGenerator.createTriadicGradient(primary, secondary, primary, 'to-br'),
      card: GradientGenerator.createMonochromaticGradient(primary, 'light', 'to-b'),
      section: GradientGenerator.createHarmoniousGradient(primary, secondary, 'subtle', 'to-r'),
    },
  }
}

/**
 * Learning Theme - Pink/Rose harmony for learning actions
 */
function createLearningTheme(): ContextTheme {
  const primary = colorPalettes.learningPink
  const secondary = colorPalettes.learningRose

  return {
    name: 'Learning',
    primary,
    secondary,
    gradients: GradientGenerator.createContextGradients(primary, secondary),
    backgrounds: {
      hero: GradientGenerator.createTriadicGradient(primary, secondary, primary, 'to-br'),
      card: GradientGenerator.createMonochromaticGradient(primary, 'light', 'to-b'),
      section: GradientGenerator.createHarmoniousGradient(primary, secondary, 'subtle', 'to-r'),
    },
  }
}

/**
 * Course Theme - TechShu SkillHub brand colors for course content
 */
function createCourseTheme(): ContextTheme {
  const primary = colorPalettes.learningPink // TechShu #ff3968
  const secondary = colorPalettes.learningRose // TechShu coral #ff6b47

  return {
    name: 'Course',
    primary,
    secondary,
    gradients: GradientGenerator.createContextGradients(primary, secondary),
    backgrounds: {
      hero: GradientGenerator.createTriadicGradient(
        colorPalettes.learningPink, // TechShu pink
        colorPalettes.learningRose, // TechShu coral
        colorPalettes.courseIndigo, // Innovation purple
        'to-br'
      ),
      card: GradientGenerator.createMonochromaticGradient(
        colorPalettes.courseBlue,
        'light',
        'to-b'
      ), // Keep light blue for cards
      section: GradientGenerator.createHarmoniousGradient(primary, secondary, 'subtle', 'to-r'),
    },
  }
}

/**
 * Success Theme - Green harmony for completion states
 */
function createSuccessTheme(): ContextTheme {
  const primary = colorPalettes.successEmerald
  const secondary = colorPalettes.successTeal

  return {
    name: 'Success',
    primary,
    secondary,
    gradients: GradientGenerator.createContextGradients(primary, secondary),
    backgrounds: {
      hero: GradientGenerator.createTriadicGradient(primary, secondary, primary, 'to-br'),
      card: GradientGenerator.createMonochromaticGradient(primary, 'light', 'to-b'),
      section: GradientGenerator.createHarmoniousGradient(primary, secondary, 'subtle', 'to-r'),
    },
  }
}

/**
 * Brand Theme - TechShu SkillHub brand colors for brand elements
 */
function createBrandTheme(): ContextTheme {
  const primary = colorPalettes.learningPink // TechShu #ff3968
  const secondary = colorPalettes.learningRose // TechShu coral #ff6b47

  return {
    name: 'Brand',
    primary,
    secondary,
    gradients: GradientGenerator.createContextGradients(primary, secondary),
    backgrounds: {
      hero: GradientGenerator.createTriadicGradient(
        colorPalettes.learningPink, // TechShu pink
        colorPalettes.learningRose, // TechShu coral
        colorPalettes.courseIndigo, // Innovation purple
        'to-br'
      ),
      card: GradientGenerator.createMonochromaticGradient(primary, 'light', 'to-b'),
      section: GradientGenerator.createHarmoniousGradient(primary, secondary, 'subtle', 'to-r'),
    },
  }
}

/**
 * Get theme by context name
 */
export function getTheme(context: keyof DesignTokens['contexts']): ContextTheme {
  const tokens = generateDesignTokens()
  return tokens.contexts[context]
}

/**
 * Generate CSS variables from design tokens
 */
export function generateCSSVariables(tokens: DesignTokens): Record<string, string> {
  const variables: Record<string, string> = {}

  // Generate context-specific variables
  Object.entries(tokens.contexts).forEach(([contextName, theme]) => {
    // Primary palette
    Object.entries(theme.primary).forEach(([shade, color]) => {
      variables[`--${contextName}-primary-${shade}`] = color
    })

    // Secondary palette
    Object.entries(theme.secondary).forEach(([shade, color]) => {
      variables[`--${contextName}-secondary-${shade}`] = color
    })

    // Gradient variables
    Object.entries(theme.gradients).forEach(([gradientName, gradient]) => {
      variables[`--${contextName}-gradient-${gradientName}-from`] = gradient.from
      if (gradient.via) {
        variables[`--${contextName}-gradient-${gradientName}-via`] = gradient.via
      }
      variables[`--${contextName}-gradient-${gradientName}-to`] = gradient.to
      variables[`--${contextName}-gradient-${gradientName}-direction`] = gradient.direction
    })
  })

  return variables
}

/**
 * Apply CSS variables to document
 */
export function applyCSSVariables(tokens: DesignTokens): void {
  const variables = generateCSSVariables(tokens)
  const root = document.documentElement

  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })
}
