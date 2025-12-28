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
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed top-4 right-4 z-40 rounded-full border border-slate-200 bg-white p-2.5 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-colors"
          aria-label="Open accessibility settings"
          aria-expanded={isOpen}
        >
          <Settings className="h-5 w-5 text-slate-700" aria-hidden="true" />
        </button>
      )}

      {isOpen && (
        <div className="fixed top-4 right-4 z-40 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Accessibility</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              aria-label="Close accessibility settings"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-4">
            {/* High Contrast Toggle */}
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <Contrast className="h-4 w-4 text-slate-600" aria-hidden="true" />
                <span className="text-sm font-medium text-slate-900">High Contrast</span>
              </div>
              <input
                type="checkbox"
                checked={prefs.highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="rounded border-slate-300 text-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                aria-label="Toggle high contrast mode"
              />
            </label>

            {/* Reduced Motion Toggle */}
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <Move className="h-4 w-4 text-slate-600" aria-hidden="true" />
                <span className="text-sm font-medium text-slate-900">Reduce Motion</span>
              </div>
              <input
                type="checkbox"
                checked={prefs.reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="rounded border-slate-300 text-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                aria-label="Toggle reduced motion"
              />
            </label>

            {/* Read Aloud Section */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="h-4 w-4 text-slate-600" aria-hidden="true" />
                <span className="text-sm font-medium text-slate-900">Read Aloud</span>
              </div>
              <p className="text-xs text-slate-600 mb-2">
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

