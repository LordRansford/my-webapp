/**
 * Design System Helper Utilities
 * 
 * Type-safe utilities for working with the design system tokens.
 * These helpers ensure consistent usage and provide developer experience improvements.
 */

import { tokens } from "@/theme/tokens";

/**
 * Get spacing value by key
 */
export function getSpacing(key: keyof typeof tokens.spacing): string {
  return tokens.spacing[key];
}

/**
 * Get color value by category and key
 */
export function getColor(
  category: keyof typeof tokens.color,
  key: string
): string {
  const categoryColors = tokens.color[category] as Record<string, string>;
  return categoryColors[key] || "";
}

/**
 * Get typography value
 */
export function getTypography(
  property: keyof typeof tokens.typography,
  key: string
): string {
  const typographyProp = tokens.typography[property] as Record<string, string>;
  return typographyProp[key] || "";
}

/**
 * Calculate responsive spacing based on viewport
 */
export function responsiveSpacing(
  mobile: keyof typeof tokens.spacing,
  desktop: keyof typeof tokens.spacing
): string {
  return `clamp(${tokens.spacing[mobile]}, 2vw, ${tokens.spacing[desktop]})`;
}

/**
 * Get shadow by elevation level
 */
export function getShadow(elevation: 1 | 2 | 3 | 4 | 5): string {
  const shadowMap: Record<number, string> = {
    1: tokens.shadow.xs,
    2: tokens.shadow.sm,
    3: tokens.shadow.md,
    4: tokens.shadow.lg,
    5: tokens.shadow.xl,
  };
  return shadowMap[elevation] || tokens.shadow.md;
}

/**
 * Get transition by type
 */
export function getTransition(type: "fast" | "normal" | "slow"): string {
  return tokens.motion.transition[type];
}

/**
 * Type-safe spacing scale generator
 */
export function spacingScale(multiplier: number): string {
  const baseUnit = 0.25; // rem
  const value = baseUnit * multiplier;
  return `${value}rem`;
}

/**
 * Validate spacing is a multiple of 4px
 */
export function isValidSpacing(value: string): boolean {
  // Remove 'rem', 'px', 'var()' etc and check if divisible by 4px
  const numericValue = parseFloat(value);
  if (isNaN(numericValue)) {
    // Check if it's a CSS variable (valid)
    return value.startsWith("var(--");
  }
  // For rem values, check if they're multiples of 0.25rem (4px)
  // For px values, check if they're multiples of 4
  return numericValue % 0.25 === 0 || numericValue % 4 === 0;
}

/**
 * Get container max-width
 */
export function getContainerSize(
  size: keyof typeof tokens.spacing.container
): string {
  return tokens.spacing.container[size];
}

/**
 * Generate CSS custom property reference
 */
export function cssVar(category: string, key: string): string {
  return `var(--${category}-${key})`;
}

/**
 * Design system validation utilities
 */
export const DesignSystemValidator = {
  /**
   * Check if a color value uses design tokens
   */
  isTokenColor: (value: string): boolean => {
    return value.startsWith("var(--color-") || value.startsWith("var(--");
  },

  /**
   * Check if spacing uses design tokens
   */
  isTokenSpacing: (value: string): boolean => {
    return value.startsWith("var(--space-") || isValidSpacing(value);
  },

  /**
   * Check if typography uses design tokens
   */
  isTokenTypography: (value: string): boolean => {
    return (
      value.startsWith("var(--font-") ||
      value.startsWith("var(--line-height-") ||
      value.startsWith("var(--letter-spacing-")
    );
  },
};
