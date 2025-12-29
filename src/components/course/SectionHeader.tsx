"use client";

import { ReactNode } from "react";

interface SectionHeaderProps {
  children: ReactNode;
  subtitle?: string;
  id?: string;
  className?: string;
}

/**
 * Premium section header component for course overview pages.
 * Provides consistent styling with optional subtitle support.
 */
export default function SectionHeader({ children, subtitle, id, className = "" }: SectionHeaderProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h2
        id={id}
        className="text-2xl font-bold text-slate-900 mb-2 relative pb-3 border-b-2 border-slate-200 dark:text-slate-100 dark:border-slate-700"
      >
        {children}
      </h2>
      {subtitle && (
        <p className="text-base text-slate-600 mt-2 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}

