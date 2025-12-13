"use client";

// Utility to normalise headings; currently expects an array of {id,title,depth}
export function buildToc(headings = []) {
  return headings.map((h) => ({
    id: h.id,
    title: h.title,
    depth: h.depth,
  }));
}
