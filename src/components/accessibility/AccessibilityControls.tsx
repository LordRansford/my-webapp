"use client";

import { useState } from "react";
import { useAccessibility } from "./AccessibilityProvider";
import { Settings, Contrast, Move, Volume2, X, Play } from "lucide-react";
import ReadAloudControls from "./ReadAloudControls";

function PremiumToggle({ checked, onChange, label, icon: Icon, description }: { checked: boolean; onChange: (checked: boolean) => void; label: string; icon: any; description?: string }) {
  return (
    <div className="group">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-full flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-3.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
          checked
            ? "border-sky-500 bg-gradient-to-br from-sky-50 to-blue-50 shadow-md"
            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
        }`}
        aria-pressed={checked}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-200 ${
              checked
                ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg"
                : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
            }`}
          >
            <Icon className={`h-5 w-5 ${checked ? "text-white" : "text-slate-600"}`} aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-sm font-semibold ${checked ? "text-sky-900" : "text-slate-900"}`}>{label}</div>
            {description && (
              <div className={`text-xs mt-0.5 ${checked ? "text-sky-700" : "text-slate-600"}`}>{description}</div>
            )}
          </div>
        </div>
        <div
          className={`relative flex-shrink-0 inline-flex h-6 w-11 items-center rounded-full border-2 transition-all duration-200 ${
            checked
              ? "border-sky-500 bg-gradient-to-r from-sky-500 to-blue-600 shadow-md"
              : "border-slate-300 bg-slate-200"
          }`}
          aria-hidden="true"
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200 ${
              checked ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </div>
      </button>
    </div>
  );
}

export default function AccessibilityControls() {
  const { prefs, setHighContrast, setReducedMotion } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="safe-top-right fixed z-50 flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-110 focus:outline-none focus:ring-4 focus:ring-sky-300 focus:ring-offset-2 transition-all duration-200"
          aria-label="Open accessibility settings"
          aria-expanded={isOpen}
        >
          <Settings className="h-6 w-6" aria-hidden="true" />
        </button>
      )}

      {isOpen && (
        <div className="safe-top-right fixed z-50 w-96 max-w-[calc(100vw-2rem)] rounded-2xl border-2 border-slate-200 bg-white shadow-2xl backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-gradient-to-r from-sky-50 to-blue-50 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md">
                <Settings className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Accessibility</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-slate-600 hover:bg-white/80 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-colors"
              aria-label="Close accessibility settings"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {/* High Contrast Toggle */}
            <PremiumToggle
              checked={prefs.highContrast}
              onChange={setHighContrast}
              label="High Contrast"
              icon={Contrast}
              description="Enhanced color contrast for better visibility"
            />

            {/* Reduced Motion Toggle */}
            <PremiumToggle
              checked={prefs.reducedMotion}
              onChange={setReducedMotion}
              label="Reduce Motion"
              icon={Move}
              description="Minimize animations and transitions"
            />

            {/* Read Aloud Section */}
            <div className="pt-3 border-t-2 border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
                  <Volume2 className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Read Aloud</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Browser SpeechSynthesis • Free • Privacy-preserving
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ReadAloudControls />
    </>
  );
}

