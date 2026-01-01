/**
 * ImagePlaceholder Component
 * 
 * Placeholder component for images while loading.
 * Provides skeleton/shimmer effect using design system tokens.
 */

"use client";

import { ReactNode } from "react";

interface ImagePlaceholderProps {
  /**
   * Aspect ratio (e.g., "16/9", "4/3", "1/1")
   */
  aspectRatio?: string;
  
  /**
   * Width in pixels
   */
  width?: number;
  
  /**
   * Height in pixels
   */
  height?: number;
  
  /**
   * Blur data URL for placeholder
   */
  blurDataURL?: string;
  
  /**
   * Show shimmer animation
   */
  shimmer?: boolean;
  
  /**
   * Additional className
   */
  className?: string;
  
  /**
   * Children to render inside placeholder
   */
  children?: ReactNode;
}

export function ImagePlaceholder({
  aspectRatio,
  width,
  height,
  blurDataURL,
  shimmer = true,
  className = "",
  children,
}: ImagePlaceholderProps) {
  const aspectRatioStyle = aspectRatio ? { aspectRatio } : undefined;
  const sizeStyle = width && height ? { width, height } : undefined;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        ...aspectRatioStyle,
        ...sizeStyle,
        backgroundColor: "var(--color-bg-tertiary)",
        backgroundImage: blurDataURL
          ? `url(${blurDataURL})`
          : shimmer
          ? "linear-gradient(90deg, var(--color-bg-tertiary) 0%, var(--color-surface) 50%, var(--color-bg-tertiary) 100%)"
          : undefined,
        backgroundSize: blurDataURL ? "cover" : shimmer ? "200% 100%" : undefined,
        backgroundPosition: blurDataURL ? "center" : shimmer ? "0% 0%" : undefined,
        animation: shimmer && !blurDataURL ? "shimmer 2s linear infinite" : undefined,
        filter: blurDataURL ? "blur(20px)" : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
