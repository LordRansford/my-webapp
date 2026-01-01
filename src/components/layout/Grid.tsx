/**
 * Grid Component
 * 
 * Responsive grid layout component with design system spacing.
 * Provides enhanced responsive behavior using CSS classes from grid-utilities.css.
 * 
 * @example
 * ```tsx
 * <Grid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="var(--space-6)">
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </Grid>
 * ```
 */

"use client";

import { ReactNode } from "react";

interface GridProps {
  children: ReactNode;
  columns?: number | { mobile?: number; tablet?: number; desktop?: number };
  gap?: string;
  className?: string;
  /**
   * Minimum column width for auto-fit behavior
   */
  minColumnWidth?: string;
}

export function ResponsiveGrid({ 
  children, 
  columns = 1,
  gap = "var(--space-4)",
  className = "",
  minColumnWidth,
}: GridProps) {
  // Handle auto-fit behavior
  if (minColumnWidth) {
    return (
      <div
        className={`grid-auto-fit ${className}`}
        style={{
          gap,
          gridTemplateColumns: `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))`,
        }}
      >
        {children}
      </div>
    );
  }

  // Handle fixed column count
  if (typeof columns === "number") {
    return (
      <div
        className={className}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap,
        }}
      >
        {children}
      </div>
    );
  }

  // Handle responsive columns using data attributes and CSS classes
  const mobileCols = columns.mobile || 1;
  const tabletCols = columns.tablet || columns.mobile || 2;
  const desktopCols = columns.desktop || columns.tablet || columns.mobile || 3;

  return (
    <div
      className={className}
      style={{ gap }}
      data-grid-mobile={String(mobileCols)}
      data-grid-tablet={String(tabletCols)}
      data-grid-desktop={String(desktopCols)}
    >
      {children}
    </div>
  );
}

// Export as Grid for convenience
export { ResponsiveGrid as Grid };
