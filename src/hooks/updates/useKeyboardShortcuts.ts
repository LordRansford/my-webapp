/**
 * Keyboard shortcuts hook for News and Updates
 * 
 * Provides keyboard navigation:
 * - / : Focus search
 * - j/k : Navigate items
 * - f : Focus filters
 * - e : Export
 * - ? : Show help
 */

import { useEffect, useCallback, useRef } from "react";

export interface KeyboardShortcutsConfig {
  onFocusSearch?: () => void;
  onFocusFilters?: () => void;
  onExport?: () => void;
  onShowHelp?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts(config: KeyboardShortcutsConfig) {
  const {
    onFocusSearch,
    onFocusFilters,
    onExport,
    onShowHelp,
    onNavigateNext,
    onNavigatePrev,
    enabled = true,
  } = config;

  const isInputFocused = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        isInputFocused.current ||
        (e.target instanceof HTMLElement &&
          (e.target.tagName === "INPUT" ||
            e.target.tagName === "TEXTAREA" ||
            e.target.isContentEditable))
      ) {
        return;
      }

      // Check for modifier keys (allow Ctrl/Cmd for browser shortcuts)
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      switch (e.key) {
        case "/":
          e.preventDefault();
          onFocusSearch?.();
          break;
        case "f":
          e.preventDefault();
          onFocusFilters?.();
          break;
        case "e":
          e.preventDefault();
          onExport?.();
          break;
        case "?":
          e.preventDefault();
          onShowHelp?.();
          break;
        case "j":
          e.preventDefault();
          onNavigateNext?.();
          break;
        case "k":
          e.preventDefault();
          onNavigatePrev?.();
          break;
      }
    };

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      isInputFocused.current =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, [enabled, onFocusSearch, onFocusFilters, onExport, onShowHelp, onNavigateNext, onNavigatePrev]);
}
