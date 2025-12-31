/**
 * OptimizedImage Component
 * 
 * High-DPI aware image wrapper around Next.js Image component.
 * Automatically handles srcset, quality optimization, and responsive sizing.
 */

"use client";

import Image from "next/image";
import { ComponentProps } from "react";

interface OptimizedImageProps extends Omit<ComponentProps<typeof Image>, "quality" | "sizes"> {
  /**
   * Image quality (1-100). Default: 90 for optimal sharpness.
   */
  quality?: number;
  
  /**
   * Priority loading for LCP images
   */
  priority?: boolean;
  
  /**
   * Responsive sizes attribute
   */
  sizes?: string;
  
  /**
   * Aspect ratio to prevent layout shift
   */
  aspectRatio?: string;
}

export function OptimizedImage({
  src,
  alt = "",
  width,
  height,
  quality = 90,
  priority = false,
  sizes,
  aspectRatio,
  className = "",
  style,
  ...props
}: OptimizedImageProps) {
  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || (() => {
    if (width && typeof width === "number") {
      if (width <= 640) return "100vw";
      if (width <= 1024) return "50vw";
      return "33vw";
    }
    return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
  })();

  // Calculate aspect ratio if provided
  const aspectRatioStyle = aspectRatio ? { aspectRatio } : undefined;

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={quality}
      priority={priority}
      sizes={responsiveSizes}
      className={className}
      style={{
        ...aspectRatioStyle,
        ...style,
      }}
      {...props}
    />
  );
}

/**
 * OptimizedImage with fill (for responsive containers)
 */
interface OptimizedImageFillProps extends Omit<ComponentProps<typeof Image>, "quality" | "sizes" | "fill"> {
  quality?: number;
  priority?: boolean;
  sizes?: string;
  aspectRatio?: string;
}

export function OptimizedImageFill({
  src,
  alt = "",
  quality = 90,
  priority = false,
  sizes,
  aspectRatio,
  className = "",
  style,
  ...props
}: OptimizedImageFillProps) {
  const responsiveSizes = sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
  const aspectRatioStyle = aspectRatio ? { aspectRatio } : undefined;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      quality={quality}
      priority={priority}
      sizes={responsiveSizes}
      className={className}
      style={{
        objectFit: "cover",
        ...aspectRatioStyle,
        ...style,
      }}
      {...props}
    />
  );
}
