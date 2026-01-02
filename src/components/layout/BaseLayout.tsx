/**
 * BaseLayout Component
 * 
 * Base layout component that enforces the visual design system.
 * All pages should inherit from this component to ensure consistent
 * typography, spacing, colors, and visual quality.
 */

"use client";

import { ReactNode } from "react";
import type { ShadowElevation, RadiusKey } from "@/types/design-system";

interface BaseLayoutProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function BaseLayout({ children, className = "", title, description }: BaseLayoutProps) {
  // Note: title and description are accepted for compatibility but metadata should be set via generateMetadata in App Router
  return (
    <div
      className={className}
      style={{
        // Ensure design system tokens are applied
        fontFamily: "var(--font-body)",
        color: "var(--color-text-primary)",
        lineHeight: "var(--line-height-relaxed)",
        letterSpacing: "var(--letter-spacing-normal)",
      }}
    >
      {children}
    </div>
  );
}

/**
 * PageContainer - Standard page wrapper with consistent spacing
 */
interface PageContainerProps {
  children: ReactNode;
  maxWidth?: string;
  className?: string;
}

export function PageContainer({
  children,
  maxWidth = "1200px",
  className = "",
}: PageContainerProps) {
  return (
    <div
      className={className}
      style={{
        maxWidth,
        width: "100%",
        margin: "0 auto",
        padding: "var(--space-10) var(--space-6) var(--space-16)",
      }}
    >
      {children}
    </div>
  );
}

/**
 * Section - Standard section wrapper with consistent spacing
 */
interface SectionProps {
  children: ReactNode;
  className?: string;
  gap?: string;
}

export function Section({ children, className = "", gap = "var(--space-8)" }: SectionProps) {
  return (
    <section
      className={className}
      style={{
        marginTop: "var(--space-8)",
        marginBottom: "var(--space-8)",
        display: "grid",
        gap,
      }}
    >
      {children}
    </section>
  );
}

/**
 * Card - Standard card component using design system tokens
 */
interface CardProps {
  children: ReactNode;
  className?: string;
  elevation?: ShadowElevation;
  /**
   * Border radius using design tokens
   */
  radius?: RadiusKey;
  /**
   * Custom padding (uses design tokens)
   */
  padding?: string;
  /**
   * Hover effect enabled
   */
  hover?: boolean;
}

export function Card({ 
  children, 
  className = "", 
  elevation = 3,
  radius = "lg",
  padding = "var(--space-5)",
  hover = true,
}: CardProps) {
  const elevationClass = `elevation-${elevation}`;
  const radiusValue = `var(--radius-${radius})`;
  
  return (
    <div
      className={`card ${elevationClass} ${className}`}
      style={{
        background: "var(--color-surface)",
        border: "var(--border-width-sm) solid var(--color-border-primary)",
        borderRadius: radiusValue,
        padding,
        transition: hover 
          ? "var(--transition-transform), var(--transition-shadow), var(--transition-border)"
          : undefined,
        cursor: hover ? "pointer" : undefined,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Stack - Vertical stack with consistent spacing
 */
interface StackProps {
  children: ReactNode;
  gap?: string;
  className?: string;
  align?: "start" | "center" | "end" | "stretch";
}

export function Stack({ 
  children, 
  gap = "var(--space-4)",
  className = "",
  align = "stretch",
}: StackProps) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap,
        alignItems: align === "stretch" ? "stretch" : align,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Inline - Horizontal layout with consistent spacing
 */
interface InlineProps {
  children: ReactNode;
  gap?: string;
  className?: string;
  align?: "start" | "center" | "end" | "baseline";
  wrap?: boolean;
}

export function Inline({ 
  children, 
  gap = "var(--space-4)",
  className = "",
  align = "start",
  wrap = false,
}: InlineProps) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "row",
        gap,
        alignItems: align,
        flexWrap: wrap ? "wrap" : "nowrap",
      }}
    >
      {children}
    </div>
  );
}

/**
 * Grid - Responsive grid layout with design system spacing
 * 
 * Uses CSS Grid with responsive column configuration.
 * For responsive breakpoints, use the object syntax with mobile/tablet/desktop keys.
 * 
 * Note: For enhanced responsive behavior, consider using the ResponsiveGrid component
 * from "./Grid" which uses CSS classes for better performance.
 */
interface GridProps {
  children: ReactNode;
  columns?: number | { mobile?: number; tablet?: number; desktop?: number };
  gap?: string;
  className?: string;
}

export function Grid({ 
  children, 
  columns = 1,
  gap = "var(--space-4)",
  className = "",
}: GridProps) {
  // Determine column count based on type
  const gridColumns = typeof columns === "number"
    ? columns
    : columns.mobile || 1;

  // For responsive grids, use data attributes with CSS
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
    gap,
  };

  // Add data attributes for CSS-based responsive handling
  const responsiveAttrs = typeof columns === "object" ? {
    "data-grid-mobile": String(columns.mobile || 1),
    "data-grid-tablet": String(columns.tablet || columns.mobile || 2),
    "data-grid-desktop": String(columns.desktop || columns.tablet || columns.mobile || 3),
  } : {};

  return (
    <div
      className={className}
      style={gridStyle}
      {...responsiveAttrs}
    >
      {children}
    </div>
  );
}
