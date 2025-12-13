"use client";

import { useEffect, useState } from "react";

export default function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      const value = height > 0 ? Math.min(100, Math.max(0, (scrolled / height) * 100)) : 0;
      setProgress(value);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="sticky top-0 z-30 h-1.5 w-full bg-transparent">
      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
        aria-label="Page progress"
      />
    </div>
  );
}
