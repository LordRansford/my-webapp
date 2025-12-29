"use client";

import { ReactNode } from "react";

interface BodyTextProps {
  children: ReactNode;
  className?: string;
}

/**
 * Premium body text component for course pages.
 * Provides consistent paragraph styling with optimal readability.
 * 
 * Features:
 * - 16px base font size (WCAG AA compliant)
 * - 1.7 line height for optimal reading
 * - High contrast colours
 * - Refined letter spacing
 * - Subtle text shadow in dark mode for depth
 * 
 * @example
 * <BodyText>
 *   This is the main content of the course section.
 * </BodyText>
 */
export default function BodyText({ children, className = "" }: BodyTextProps) {
  return (
    <p
      className={`text-base leading-[1.7] text-slate-700 mb-4 tracking-[0.01em] dark:text-slate-300 dark:[text-shadow:0_1px_2px_rgba(0,0,0,0.1)] ${className}`}
    >
      {children}
    </p>
  );
}

