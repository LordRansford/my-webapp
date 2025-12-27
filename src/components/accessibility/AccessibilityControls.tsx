"use client";

import { useState } from "react";
import { useAccessibility } from "./AccessibilityProvider";
import { Settings, Contrast, Move, Volume2, X } from "lucide-react";
import ReadAloudControls from "./ReadAloudControls";

export default function AccessibilityControls() {
  const { prefs, setHighContrast, setReducedMotion } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-40 rounded-full bg-[var(--accent)] p-3 text-white shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
        aria-label="Open accessibility settings"
        aria-expanded={isOpen}
      >
        <Settings className="h-5 w-5" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-40 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-[color:var(--line)] bg-[var(--surface)] p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--text-body)]">Accessibility</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-[var(--text-muted)] hover:bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
              aria-label="Close accessibility settings"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-4">
            {/* High Contrast Toggle */}
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <Contrast className="h-4 w-4 text-[var(--text-muted)]" aria-hidden="true" />
                <span className="text-sm font-medium text-[var(--text-body)]">High Contrast</span>
              </div>
              <input
                type="checkbox"
                checked={prefs.highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="rounded border-[color:var(--line)] text-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
                aria-label="Toggle high contrast mode"
              />
            </label>

            {/* Reduced Motion Toggle */}
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <Move className="h-4 w-4 text-[var(--text-muted)]" aria-hidden="true" />
                <span className="text-sm font-medium text-[var(--text-body)]">Reduce Motion</span>
              </div>
              <input
                type="checkbox"
                checked={prefs.reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="rounded border-[color:var(--line)] text-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
                aria-label="Toggle reduced motion"
              />
            </label>

            {/* Read Aloud Section */}
            <div className="pt-2 border-t border-[color:var(--line)]">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="h-4 w-4 text-[var(--text-muted)]" aria-hidden="true" />
                <span className="text-sm font-medium text-[var(--text-body)]">Read Aloud</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mb-2">
                Uses browser SpeechSynthesis. Free, privacy-preserving, no data sent to servers.
              </p>
            </div>
          </div>
        </div>
      )}

      <ReadAloudControls />
    </>
  );
}

