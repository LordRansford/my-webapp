/**
 * Design System Type Definitions
 * 
 * TypeScript types for the design system to ensure type safety
 * and provide better developer experience.
 */

import { tokens } from "@/theme/tokens";

/**
 * Spacing scale keys
 */
export type SpacingKey = keyof typeof tokens.spacing;

/**
 * Color category keys
 */
export type ColorCategory = keyof typeof tokens.color;

/**
 * Typography property keys
 */
export type TypographyProperty = keyof typeof tokens.typography;

/**
 * Shadow elevation levels
 */
export type ShadowElevation = 1 | 2 | 3 | 4 | 5;

/**
 * Border radius keys
 */
export type RadiusKey = keyof typeof tokens.radius;

/**
 * Motion duration keys
 */
export type MotionDuration = keyof typeof tokens.motion.duration;

/**
 * Motion easing keys
 */
export type MotionEasing = keyof typeof tokens.motion.easing;

/**
 * Component props that accept design system values
 */
export interface DesignSystemProps {
  /**
   * Spacing value using design tokens
   */
  spacing?: SpacingKey;
  
  /**
   * Color using design tokens
   */
  color?: string;
  
  /**
   * Typography size using design tokens
   */
  fontSize?: keyof typeof tokens.typography.fontSize;
  
  /**
   * Shadow elevation
   */
  elevation?: ShadowElevation;
  
  /**
   * Border radius
   */
  radius?: RadiusKey;
}

/**
 * Responsive design system values
 */
export interface ResponsiveDesignValue<T> {
  mobile?: T;
  tablet?: T;
  desktop?: T;
}

/**
 * Design system theme configuration
 */
export interface DesignSystemTheme {
  spacing: typeof tokens.spacing;
  colors: typeof tokens.color;
  typography: typeof tokens.typography;
  shadows: typeof tokens.shadow;
  motion: typeof tokens.motion;
  radius: typeof tokens.radius;
}

/**
 * Utility type for extracting CSS variable names
 */
export type CSSVariable<T extends string> = `var(--${T})`;

/**
 * Design token reference type
 */
export type TokenReference = 
  | CSSVariable<`space-${string}`>
  | CSSVariable<`color-${string}`>
  | CSSVariable<`font-${string}`>
  | CSSVariable<`shadow-${string}`>
  | CSSVariable<`radius-${string}`>
  | CSSVariable<`duration-${string}`>
  | CSSVariable<`ease-${string}`>;
