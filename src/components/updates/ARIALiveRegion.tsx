/**
 * ARIA Live Region component for screen reader announcements
 */

import React, { memo, useEffect, useRef } from "react";

interface ARIALiveRegionProps {
  message: string;
  priority?: "polite" | "assertive";
  className?: string;
}

const ARIALiveRegion = memo(function ARIALiveRegion({
  message,
  priority = "polite",
  className = "",
}: ARIALiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message && regionRef.current) {
      // Clear and set message to trigger announcement
      regionRef.current.textContent = "";
      setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = message;
        }
      }, 100);
    }
  }, [message]);

  return (
    <div
      ref={regionRef}
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className={`sr-only ${className}`}
    >
      {message}
    </div>
  );
});

export default ARIALiveRegion;
