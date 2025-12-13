"use client";

export function getScrollProgress() {
  const doc = document.documentElement;
  const scrolled = doc.scrollTop;
  const height = doc.scrollHeight - doc.clientHeight;
  return height > 0 ? Math.min(100, Math.max(0, (scrolled / height) * 100)) : 0;
}
