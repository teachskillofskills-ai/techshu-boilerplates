/**
 * Beautiful Gradient Generation System
 * Creates harmonious gradients dynamically based on design tokens
 */

import { ColorPalette, GradientDefinition } from './tokens'

export type GradientType = 'primary' | 'secondary' | 'subtle' | 'intense' | 'hero' | 'card'
export type GradientDirection =
  | 'to-r'
  | 'to-l'
  | 'to-t'
  | 'to-b'
  | 'to-br'
  | 'to-bl'
  | 'to-tr'
  | 'to-tl'

/**
 * Generate beautiful gradients from color palettes
 */
export class GradientGenerator {
  /**
   * Create a harmonious gradient between two color palettes
   */
  static createHarmoniousGradient(
    fromPalette: ColorPalette,
    toPalette: ColorPalette,
    intensity: 'subtle' | 'medium' | 'intense' = 'medium',
    direction: GradientDirection = 'to-r'
  ): GradientDefinition {
    const intensityMap = {
      subtle: { from: 100, via: 200, to: 300 },
      medium: { from: 400, via: 500, to: 600 },
      intense: { from: 600, via: 700, to: 800 },
    }

    const colors = intensityMap[intensity]

    return {
      from: fromPalette[colors.from as keyof ColorPalette],
      via: toPalette[colors.via as keyof ColorPalette],
      to: toPalette[colors.to as keyof ColorPalette],
      direction,
    }
  }

  /**
   * Create a monochromatic gradient within a single palette
   */
  static createMonochromaticGradient(
    palette: ColorPalette,
    range: 'light' | 'medium' | 'dark' = 'medium',
    direction: GradientDirection = 'to-r'
  ): GradientDefinition {
    const rangeMap = {
      light: { from: 200, to: 400 },
      medium: { from: 400, to: 600 },
      dark: { from: 600, to: 800 },
    }

    const colors = rangeMap[range]

    return {
      from: palette[colors.from as keyof ColorPalette],
      to: palette[colors.to as keyof ColorPalette],
      direction,
    }
  }

  /**
   * Create a three-color gradient for maximum visual impact
   */
  static createTriadicGradient(
    palette1: ColorPalette,
    palette2: ColorPalette,
    palette3: ColorPalette,
    direction: GradientDirection = 'to-r'
  ): GradientDefinition {
    return {
      from: palette1[500],
      via: palette2[400],
      to: palette3[600],
      direction,
    }
  }

  /**
   * Generate CSS class string from gradient definition
   */
  static toCSSClass(gradient: GradientDefinition): string {
    const { from, via, to, direction } = gradient

    if (via) {
      return `bg-gradient-${direction} from-[${from}] via-[${via}] to-[${to}]`
    }

    return `bg-gradient-${direction} from-[${from}] to-[${to}]`
  }

  /**
   * Generate CSS style object from gradient definition
   */
  static toCSSStyle(gradient: GradientDefinition): React.CSSProperties {
    const { from, via, to, direction } = gradient

    const directionMap = {
      'to-r': 'to right',
      'to-l': 'to left',
      'to-t': 'to top',
      'to-b': 'to bottom',
      'to-br': 'to bottom right',
      'to-bl': 'to bottom left',
      'to-tr': 'to top right',
      'to-tl': 'to top left',
    }

    const gradientDirection = directionMap[direction]

    if (via) {
      return {
        background: `linear-gradient(${gradientDirection}, ${from}, ${via}, ${to})`,
      }
    }

    return {
      background: `linear-gradient(${gradientDirection}, ${from}, ${to})`,
    }
  }

  /**
   * Create context-specific gradients
   */
  static createContextGradients(primaryPalette: ColorPalette, secondaryPalette: ColorPalette) {
    return {
      // Primary action gradient (buttons, CTAs)
      primary: this.createHarmoniousGradient(primaryPalette, secondaryPalette, 'medium', 'to-r'),

      // Secondary action gradient (less prominent actions)
      secondary: this.createMonochromaticGradient(primaryPalette, 'light', 'to-r'),

      // Subtle background gradient
      subtle: this.createHarmoniousGradient(primaryPalette, secondaryPalette, 'subtle', 'to-br'),

      // Intense gradient for hero sections
      intense: this.createHarmoniousGradient(primaryPalette, secondaryPalette, 'intense', 'to-br'),

      // Hero background gradient
      hero: this.createTriadicGradient(primaryPalette, secondaryPalette, primaryPalette, 'to-br'),

      // Card background gradient
      card: this.createMonochromaticGradient(primaryPalette, 'light', 'to-b'),
    }
  }
}

/**
 * Utility functions for gradient manipulation
 */
export const gradientUtils = {
  /**
   * Adjust gradient opacity
   */
  withOpacity(gradient: GradientDefinition, opacity: number): GradientDefinition {
    const addOpacity = (color: string) => {
      if (color.startsWith('#')) {
        const alpha = Math.round(opacity * 255)
          .toString(16)
          .padStart(2, '0')
        return `${color}${alpha}`
      }
      return color
    }

    return {
      ...gradient,
      from: addOpacity(gradient.from),
      via: gradient.via ? addOpacity(gradient.via) : undefined,
      to: addOpacity(gradient.to),
    }
  },

  /**
   * Reverse gradient direction
   */
  reverse(gradient: GradientDefinition): GradientDefinition {
    return {
      from: gradient.to,
      via: gradient.via,
      to: gradient.from,
      direction: gradient.direction,
    }
  },
}
