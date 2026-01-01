/**
 * Design System Validators
 * 
 * Runtime validation utilities for ensuring design system compliance.
 * These can be used in development to catch violations early.
 */

import { tokens } from "@/theme/tokens";
import type { SpacingKey, ShadowElevation, RadiusKey } from "@/types/design-system";

/**
 * Validate spacing value is a multiple of 4px
 */
export function validateSpacing(value: string | number): boolean {
  if (typeof value === "number") {
    return value % 4 === 0;
  }
  
  // Check if it's a CSS variable (always valid)
  if (value.startsWith("var(--")) {
    return true;
  }
  
  // Parse rem or px values
  const numericValue = parseFloat(value);
  if (isNaN(numericValue)) {
    return false;
  }
  
  // For rem values, check if they're multiples of 0.25rem (4px)
  if (value.includes("rem")) {
    return numericValue % 0.25 === 0;
  }
  
  // For px values, check if they're multiples of 4
  if (value.includes("px")) {
    return numericValue % 4 === 0;
  }
  
  return false;
}

/**
 * Validate color uses design tokens
 */
export function validateColor(value: string): boolean {
  // CSS variables are always valid
  if (value.startsWith("var(--")) {
    return true;
  }
  
  // Warn about hardcoded colors in development
  if (process.env.NODE_ENV === "development") {
    console.warn(
      `[Design System] Hardcoded color detected: "${value}". ` +
      `Consider using a design token like var(--color-text-primary)`
    );
  }
  
  return false;
}

/**
 * Validate elevation value
 */
export function validateElevation(value: number): value is ShadowElevation {
  return value >= 1 && value <= 5;
}

/**
 * Validate radius key
 */
export function validateRadius(value: string): value is RadiusKey {
  return value in tokens.radius;
}

/**
 * Validate spacing key
 */
export function validateSpacingKey(value: string): value is SpacingKey {
  return value in tokens.spacing;
}

/**
 * Comprehensive design system validator
 */
export const DesignSystemValidator = {
  spacing: validateSpacing,
  color: validateColor,
  elevation: validateElevation,
  radius: validateRadius,
  spacingKey: validateSpacingKey,
  
  /**
   * Validate a complete style object
   */
  validateStyles: (styles: React.CSSProperties): {
    valid: boolean;
    violations: Array<{ property: string; value: string; message: string }>;
  } => {
    const violations: Array<{ property: string; value: string; message: string }> = [];
    
    // Check spacing properties
    const spacingProps = ["padding", "margin", "gap", "paddingTop", "paddingBottom", 
                         "paddingLeft", "paddingRight", "marginTop", "marginBottom",
                         "marginLeft", "marginRight", "top", "bottom", "left", "right"];
    
    for (const prop of spacingProps) {
      const value = styles[prop as keyof typeof styles];
      if (value && typeof value === "string" && !validateSpacing(value)) {
        violations.push({
          property: prop,
          value: String(value),
          message: `Spacing value "${value}" is not a multiple of 4px. Use design tokens like var(--space-4).`,
        });
      }
    }
    
    // Check color properties
    const colorProps = ["color", "backgroundColor", "borderColor"];
    for (const prop of colorProps) {
      const value = styles[prop as keyof typeof styles];
      if (value && typeof value === "string" && !validateColor(value)) {
        violations.push({
          property: prop,
          value: String(value),
          message: `Color value "${value}" should use a design token like var(--color-text-primary).`,
        });
      }
    }
    
    return {
      valid: violations.length === 0,
      violations,
    };
  },
};

/**
 * Development-only hook for validating component styles
 */
export function useDesignSystemValidation(componentName: string) {
  if (process.env.NODE_ENV !== "development") {
    return () => {}; // No-op in production
  }
  
  return (styles: React.CSSProperties) => {
    const result = DesignSystemValidator.validateStyles(styles);
    if (!result.valid) {
      console.warn(
        `[Design System] ${componentName} has design system violations:`,
        result.violations
      );
    }
  };
}
