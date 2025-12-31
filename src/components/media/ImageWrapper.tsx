/**
 * ImageWrapper Component
 * 
 * Fallback wrapper for images that handles SVG, blur placeholders,
 * and ensures proper aspect ratios to prevent layout shift.
 */

"use client";

import { ReactNode } from "react";
import { OptimizedImage, OptimizedImageFill } from "./OptimizedImage";

interface ImageWrapperProps {
  /**
   * Image source (URL or path)
   */
  src: string;
  
  /**
   * Alt text for accessibility
   */
  alt?: string;
  
  /**
   * Image width
   */
  width?: number;
  
  /**
   * Image height
   */
  height?: number;
  
  /**
   * Aspect ratio (e.g., "16/9", "4/3", "1/1")
   */
  aspectRatio?: string;
  
  /**
   * Use fill mode for responsive containers
   */
  fill?: boolean;
  
  /**
   * Priority loading
   */
  priority?: boolean;
  
  /**
   * Additional className
   */
  className?: string;
  
  /**
   * Caption to display below image
   */
  caption?: ReactNode;
  
  /**
   * Blur placeholder data URL
   */
  blurDataURL?: string;
}

export function ImageWrapper({
  src,
  alt = "",
  width,
  height,
  aspectRatio,
  fill = false,
  priority = false,
  className = "",
  caption,
  blurDataURL,
}: ImageWrapperProps) {
  // Handle SVG images - prefer inline SVG
  if (src.endsWith(".svg") || src.startsWith("data:image/svg+xml")) {
    return (
      <figure className={className}>
        <div
          style={{
            aspectRatio: aspectRatio || (width && height ? `${width}/${height}` : "16/9"),
            width: fill ? "100%" : width,
            height: fill ? "100%" : height,
          }}
          className="flex items-center justify-center"
        >
          <img
            src={src}
            alt={alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            loading={priority ? "eager" : "lazy"}
          />
        </div>
        {caption && <figcaption className="text-sm text-muted mt-2">{caption}</figcaption>}
      </figure>
    );
  }

  // Use OptimizedImage for raster images
  const ImageComponent = fill ? OptimizedImageFill : OptimizedImage;

  return (
    <figure className={className}>
      <ImageComponent
        src={src}
        alt={alt}
        width={width}
        height={height}
        aspectRatio={aspectRatio || (width && height ? `${width}/${height}` : undefined)}
        priority={priority}
        blurDataURL={blurDataURL}
        placeholder={blurDataURL ? "blur" : undefined}
      />
      {caption && (
        <figcaption className="text-sm text-muted mt-2" style={{ marginTop: "var(--space-2)" }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
