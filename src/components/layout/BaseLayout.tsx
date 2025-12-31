/**
 * BaseLayout Component
 * 
 * Base layout component that enforces the visual design system.
 * All pages should inherit from this component to ensure consistent
 * typography, spacing, colors, and visual quality.
 */

"use client";

import { ReactNode } from "react";

interface BaseLayoutProps {
  children: ReactNode;
  className?: string;
}

export function BaseLayout({ children, className = "" }: BaseLayoutProps) {
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
  elevation?: 1 | 2 | 3 | 4 | 5;
}

export function Card({ children, className = "", elevation = 3 }: CardProps) {
  const elevationClass = `elevation-${elevation}`;
  
  return (
    <div
      className={`card ${elevationClass} ${className}`}
      style={{
        background: "var(--color-surface)",
        border: "var(--border-width-sm) solid var(--color-border-primary)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-5)",
      }}
    >
      {children}
    </div>
  );
}
