"use client";

import { ReactNode } from "react";

export type EmojiSize = "sm" | "md" | "lg";

interface EmojiIconProps {
  emoji: string;
  label: string;
  size?: EmojiSize;
  className?: string;
}

/**
 * Accessible emoji icon component for course pages.
 * 
 * Provides consistent emoji rendering with proper accessibility support.
 * All emojis must have descriptive aria-labels for screen readers.
 * 
 * @example
 * <EmojiIcon emoji="🧠" label="AI course section" size="md" />
 */
export default function EmojiIcon({
  emoji,
  label,
  size = "md",
  className = "",
}: EmojiIconProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-block ${sizeClasses[size]} leading-none select-none ${className}`}
    >
      {emoji}
    </span>
  );
}

