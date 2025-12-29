"use client";

import { ReactNode } from "react";
import EmojiIcon from "./EmojiIcon";

export type SectionHeaderVariant = "guide" | "practice" | "content";

interface SectionHeaderProps {
  children: ReactNode;
  variant?: SectionHeaderVariant;
  emoji?: string;
  subtitle?: string;
  id?: string;
  className?: string;
}

/**
 * Premium section header component for course pages.
 * Provides consistent h2 styling with variants for different section types.
 * 
 * Variants:
 * - guide: Instructional sections (e.g., "How to use this track")
 * - practice: Practice/activity sections (e.g., "Quick practice")
 * - content: Main content sections (default)
 * 
 * @example
 * <SectionHeader variant="guide" emoji="📚">
 *   How to use this track
 * </SectionHeader>
 */
export default function SectionHeader({
  children,
  variant = "content",
  emoji,
  subtitle,
  id,
  className = "",
}: SectionHeaderProps) {
  // Variant-specific styling
  const variantStyles = {
    guide: {
      fontWeight: "font-semibold",
      borderColor: "border-indigo-200 dark:border-indigo-700",
      textColor: "text-slate-900 dark:text-slate-100",
    },
    practice: {
      fontWeight: "font-bold",
      borderColor: "border-amber-200 dark:border-amber-700",
      textColor: "text-slate-900 dark:text-slate-100",
    },
    content: {
      fontWeight: "font-semibold",
      borderColor: "border-slate-200 dark:border-slate-700",
      textColor: "text-slate-900 dark:text-slate-100",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`mb-6 ${className}`}>
      <h2
        id={id}
        className={`text-[1.75rem] ${styles.fontWeight} ${styles.textColor} mb-2 relative pb-3 border-b-2 ${styles.borderColor} leading-[1.3]`}
      >
        <span className="flex items-center gap-2">
          {emoji && (
            <EmojiIcon
              emoji={emoji}
              label={`Section: ${typeof children === "string" ? children : "content section"}`}
              size="md"
            />
          )}
          <span>{children}</span>
        </span>
      </h2>
      {subtitle && (
        <p className="text-base text-slate-600 mt-2 dark:text-slate-400 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

