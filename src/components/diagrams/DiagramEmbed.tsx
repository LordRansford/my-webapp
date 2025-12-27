"use client";

import Image from "next/image";
import { ReactNode } from "react";

interface DiagramEmbedProps {
  src: string;
  alt: string;
  caption?: string;
  type?: "svg" | "png" | "jpg";
  width?: number;
  height?: number;
}

/**
 * Safe pattern for embedding exported diagrams (diagrams.net, Excalidraw, etc.)
 * Uses Next.js Image component for optimization and avoids iframes
 */
export default function DiagramEmbed({
  src,
  alt,
  caption,
  type = "svg",
  width,
  height,
}: DiagramEmbedProps) {
  // For SVG, we can use a regular img tag or inline SVG
  // For PNG/JPG, use Next.js Image component
  if (type === "svg") {
    return (
      <figure className="my-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center justify-center overflow-x-auto">
          <img
            src={src}
            alt={alt}
            className="max-w-full h-auto"
            style={{ maxHeight: "600px" }}
            loading="lazy"
          />
        </div>
        {caption && (
          <figcaption className="mt-4 border-t border-slate-100 px-2 pt-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  // For raster images, use Next.js Image
  return (
    <figure className="my-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-center justify-center overflow-x-auto">
        <Image
          src={src}
          alt={alt}
          width={width || 800}
          height={height || 600}
          className="max-w-full h-auto rounded-lg"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="mt-4 border-t border-slate-100 px-2 pt-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

