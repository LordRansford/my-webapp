"use client";

import Image from "next/image";

export function NoteImage({ src, alt = "", caption, width = 1200, height = 800 }) {
  return (
    <figure className="panel">
      <Image src={src} alt={alt} width={width} height={height} style={{ width: "100%", height: "auto", borderRadius: "12px" }} />
      {caption && (
        <figcaption className="muted" style={{ marginTop: "0.4rem" }}>
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
