"use client";

import { createContext, useContext, useMemo, useState, useEffect, ReactNode } from "react";

export interface AccessibilityPreferences {
  highContrast: boolean;
  reducedMotion: boolean;
  readAloudEnabled: boolean;
  readAloudHighlight: boolean;
  readAloudVoice?: string;
  readAloudRate?: number;
  readAloudPitch?: number;
  // Premium feature flag (not enabled)
  neuralTTSEnabled: boolean;
}

const defaultPrefs: AccessibilityPreferences = {
  highContrast: false,
  reducedMotion: false,
  readAloudEnabled: false,
  readAloudHighlight: true,
  readAloudRate: 1.0,
  readAloudPitch: 1.0,
  neuralTTSEnabled: false, // Feature flag stub - not enabled
};

const STORAGE_KEY = "rn_accessibility_prefs_v1";

export interface AccessibilityContextValue {
  prefs: AccessibilityPreferences;
  setHighContrast: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  setReadAloudEnabled: (enabled: boolean) => void;
  setReadAloudHighlight: (enabled: boolean) => void;
  setReadAloudVoice: (voice: string) => void;
  setReadAloudRate: (rate: number) => void;
  setReadAloudPitch: (pitch: number) => void;
  // Premium feature (stub only)
  setNeuralTTSEnabled: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<AccessibilityPreferences>(defaultPrefs);

  // Load persisted preferences on mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setPrefs({ ...defaultPrefs, ...parsed });
      } else {
        // Check system preferences
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        setPrefs((p) => ({ ...p, reducedMotion: prefersReducedMotion }));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Listen to system reduced motion preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefs((p) => ({ ...p, reducedMotion: e.matches }));
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Persist preferences when they change
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Ignore storage errors
    }
  }, [prefs]);

  // Apply high contrast class to document
  useEffect(() => {
    if (prefs.highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [prefs.highContrast]);

  // Apply reduced motion class to document
  useEffect(() => {
    if (prefs.reducedMotion) {
      document.documentElement.classList.add("reduced-motion");
    } else {
      document.documentElement.classList.remove("reduced-motion");
    }
  }, [prefs.reducedMotion]);

  const setHighContrast = (enabled: boolean) => {
    setPrefs((p) => ({ ...p, highContrast: enabled }));
  };

  const setReducedMotion = (enabled: boolean) => {
    setPrefs((p) => ({ ...p, reducedMotion: enabled }));
  };

  const setReadAloudEnabled = (enabled: boolean) => {
    setPrefs((p) => ({ ...p, readAloudEnabled: enabled }));
  };

  const setReadAloudHighlight = (enabled: boolean) => {
    setPrefs((p) => ({ ...p, readAloudHighlight: enabled }));
  };

  const setReadAloudVoice = (voice: string) => {
    setPrefs((p) => ({ ...p, readAloudVoice: voice }));
  };

  const setReadAloudRate = (rate: number) => {
    setPrefs((p) => ({ ...p, readAloudRate: Math.max(0.5, Math.min(2.0, rate)) }));
  };

  const setReadAloudPitch = (pitch: number) => {
    setPrefs((p) => ({ ...p, readAloudPitch: Math.max(0.5, Math.min(2.0, pitch)) }));
  };

  const setNeuralTTSEnabled = (enabled: boolean) => {
    // Feature flag stub - not enabled in free tier
    setPrefs((p) => ({ ...p, neuralTTSEnabled: false }));
  };

  const value = useMemo(
    () => ({
      prefs,
      setHighContrast,
      setReducedMotion,
      setReadAloudEnabled,
      setReadAloudHighlight,
      setReadAloudVoice,
      setReadAloudRate,
      setReadAloudPitch,
      setNeuralTTSEnabled,
    }),
    [prefs]
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return context;
}

