"use client";

import { OptimizedImage } from "@/components/media/OptimizedImage";

export function NoteImage({ src, alt = "", caption, width = 1200, height = 800 }) {
  const aspectRatio = width && height ? `${width}/${height}` : "16/9";
  
  return (
    <figure className="panel">
      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        aspectRatio={aspectRatio}
        quality={90}
        priority={false}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
        className="rounded-lg"
        style={{ width: "100%", height: "auto" }}
      />
      {caption && (
        <figcaption className="muted" style={{ marginTop: "var(--space-2)" }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function NoteVideo({ src, caption }) {
  return (
    <figure className="panel">
      <video controls style={{ width: "100%", borderRadius: "12px" }}>
        <source src={src} />
        Your browser does not support the video tag.
      </video>
      {caption && (
        <figcaption className="muted" style={{ marginTop: "0.4rem" }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
