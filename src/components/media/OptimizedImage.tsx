/**
 * OptimizedImage Component
 * 
 * High-DPI aware image wrapper around Next.js Image component.
 * Automatically handles srcset, quality optimization, responsive sizing,
 * error handling, and loading states for optimal performance and UX.
 * 
 * @example
 * ```tsx
 * <OptimizedImage
 *   src="/hero.jpg"
 *   alt="Hero image"
 *   width={1200}
 *   height={800}
 *   priority
 *   aspectRatio="16/9"
 * />
 * ```
 */

"use client";

import Image from "next/image";
import { ComponentProps, useState, useCallback } from "react";

interface OptimizedImageProps extends Omit<ComponentProps<typeof Image>, "quality" | "sizes"> {
  /**
   * Image quality (1-100). Default: 90 for optimal sharpness on high-DPI displays.
   */
  quality?: number;
  
  /**
   * Priority loading for LCP images. Set to true for above-the-fold images.
   */
  priority?: boolean;
  
  /**
   * Responsive sizes attribute for optimal image selection.
   * Auto-generated if not provided based on width.
   */
  sizes?: string;
  
  /**
   * Aspect ratio to prevent layout shift (e.g., "16/9", "4/3", "1/1").
   * Recommended for all images to improve CLS.
   */
  aspectRatio?: string;
  
  /**
   * Blur placeholder data URL for better loading experience.
   */
  blurDataURL?: string;
  
  /**
   * Fallback image source if main image fails to load.
   */
  fallbackSrc?: string;
  
  /**
   * Show loading skeleton while image loads.
   */
  showLoadingSkeleton?: boolean;
  
  /**
   * Callback when image fails to load.
   */
  onError?: () => void;
  
  /**
   * Callback when image successfully loads.
   */
  onLoad?: () => void;
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
  blurDataURL,
  fallbackSrc,
  showLoadingSkeleton = false,
  onError,
  onLoad,
  className = "",
  style,
  ...props
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(src);

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

  // Handle image load error
  const handleError = useCallback(() => {
    setImageError(true);
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setImageError(false);
    }
    onError?.();
  }, [fallbackSrc, currentSrc, onError]);

  // Handle successful image load
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  // If image failed and no fallback, show error state
  if (imageError && !fallbackSrc) {
    return (
      <div
        className={className}
        style={{
          ...aspectRatioStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--color-bg-tertiary)",
          color: "var(--color-text-muted)",
          minHeight: aspectRatio ? undefined : height ? `${height}px` : "200px",
          ...style,
        }}
        role="img"
        aria-label={alt || "Image failed to load"}
      >
        <span style={{ fontSize: "var(--font-size-sm)" }}>
          Image unavailable
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        ...aspectRatioStyle,
        width: "100%",
        ...style,
      }}
      className={className}
    >
      {showLoadingSkeleton && isLoading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "var(--color-bg-tertiary)",
            backgroundImage: blurDataURL
              ? `url(${blurDataURL})`
              : "linear-gradient(90deg, var(--color-bg-tertiary) 0%, var(--color-surface) 50%, var(--color-bg-tertiary) 100%)",
            backgroundSize: blurDataURL ? "cover" : "200% 100%",
            backgroundPosition: blurDataURL ? "center" : "0% 0%",
            animation: blurDataURL ? "none" : "shimmer 2s linear infinite",
            filter: blurDataURL ? "blur(20px)" : "none",
            transition: "opacity var(--duration-normal) var(--ease-out)",
            opacity: isLoading ? 1 : 0,
            pointerEvents: "none",
          }}
          aria-hidden="true"
        />
      )}
      <Image
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        sizes={responsiveSizes}
        blurDataURL={blurDataURL}
        placeholder={blurDataURL ? "blur" : undefined}
        onError={handleError}
        onLoad={handleLoad}
        style={{
          ...aspectRatioStyle,
          opacity: isLoading && showLoadingSkeleton ? 0 : 1,
          transition: "opacity var(--duration-normal) var(--ease-out)",
        }}
        {...props}
      />
    </div>
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
