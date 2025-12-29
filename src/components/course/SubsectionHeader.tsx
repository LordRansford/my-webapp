"use client";

import { ReactNode } from "react";
import EmojiIcon from "./EmojiIcon";

interface SubsectionHeaderProps {
  children: ReactNode;
  emoji?: string;
  id?: string;
  className?: string;
}

/**
 * Premium subsection header component for course pages.
 * Provides consistent h3 styling with proper hierarchy and optional emoji support.
 * 
 * Use emojis sparingly - only when they add clarity or visual interest.
 * 
 * @example
 * <SubsectionHeader emoji="⚠️">
 *   Important notice
 * </SubsectionHeader>
 */
export default function SubsectionHeader({
  children,
  emoji,
  id,
  className = "",
}: SubsectionHeaderProps) {
  return (
    <h3
      id={id}
      className={`text-[1.25rem] font-semibold text-slate-800 mb-3 mt-5 first:mt-0 leading-[1.4] dark:text-slate-200 ${className}`}
    >
      {emoji ? (
        <span className="flex items-center gap-2">
          <EmojiIcon
            emoji={emoji}
            label={`Subsection: ${typeof children === "string" ? children : "content subsection"}`}
            size="sm"
          />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </h3>
  );
}

