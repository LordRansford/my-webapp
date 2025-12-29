"use client";

import { ReactNode } from "react";

interface SubsectionHeaderProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

/**
 * Premium subsection header component for course overview pages.
 * Provides consistent h3 styling with proper hierarchy.
 */
export default function SubsectionHeader({ children, id, className = "" }: SubsectionHeaderProps) {
  return (
    <h3
      id={id}
      className={`text-xl font-semibold text-slate-800 mb-3 mt-6 first:mt-0 ${className} dark:text-slate-200`}
    >
      {children}
    </h3>
  );
}

