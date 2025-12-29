/**
 * Custom hook for managing security habit planner state with localStorage persistence
 * Based on useHabitPlanner but adapted for cybersecurity-specific habits
 */

import { useState, useEffect, useCallback } from "react";
import { SecurityHabit } from "./SecurityHabitLibrary";

export interface SecurityHabitEntry {
  habitId: string;
  customHabit?: string;
  customGuardrail?: string;
  startDate: string; // ISO date string
  completedDates: string[]; // Array of ISO date strings
  notes: string;
}

export interface SecurityHabitPlannerState {
  selectedHabit: SecurityHabit | null;
  customHabit: string;
  customGuardrail: string;
  entries: SecurityHabitEntry[];
  currentStreak: number;
  longestStreak: number;
}

const STORAGE_KEY = "security-habit-planner";

/**
 * Get start of week (Monday) for a given date
 */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

/**
 * Format date as ISO string (YYYY-MM-DD)
 */
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Check if two dates are consecutive days
 */
function isConsecutiveDay(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

/**
 * Calculate streak from completed dates
 */
function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;

  const sorted = [...completedDates].sort((a, b) => b.localeCompare(a));
  let streak = 1;
  const today = formatDate(new Date());
  const yesterday = formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000));

  // Check if streak is still active (completed today or yesterday)
  if (sorted[0] !== today && sorted[0] !== yesterday) {
    return 0; // Streak broken
  }

  // Count consecutive days
  for (let i = 1; i < sorted.length; i++) {
    if (isConsecutiveDay(sorted[i - 1], sorted[i])) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Load state from localStorage
 */
function loadState(): SecurityHabitPlannerState {
  if (typeof window === "undefined") {
    return {
      selectedHabit: null,
      customHabit: "",
      customGuardrail: "",
      entries: [],
      currentStreak: 0,
      longestStreak: 0,
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Calculate streaks from entries
      const allCompletedDates = parsed.entries.flatMap((entry: SecurityHabitEntry) => entry.completedDates);
      const currentStreak = calculateStreak(allCompletedDates);
      const longestStreak = Math.max(
        currentStreak,
        parsed.longestStreak || 0,
        ...parsed.entries.map((entry: SecurityHabitEntry) => {
          const streak = calculateStreak(entry.completedDates);
          return streak;
        })
      );

      return {
        ...parsed,
        currentStreak,
        longestStreak,
      };
    }
  } catch (error) {
    console.error("Failed to load security habit planner state:", error);
  }

  return {
    selectedHabit: null,
    customHabit: "",
    customGuardrail: "",
    entries: [],
    currentStreak: 0,
    longestStreak: 0,
  };
}

/**
 * Save state to localStorage
 */
function saveState(state: SecurityHabitPlannerState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save security habit planner state:", error);
  }
}

export function useSecurityHabitPlanner() {
  const [state, setState] = useState<SecurityHabitPlannerState>(loadState);

  // Load state on mount
  useEffect(() => {
    setState(loadState());
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  const selectHabit = useCallback((habit: SecurityHabit | null) => {
    setState((prev) => ({
      ...prev,
      selectedHabit: habit,
      customHabit: habit ? "" : prev.customHabit,
      customGuardrail: habit ? "" : prev.customGuardrail,
    }));
  }, []);

  const setCustomHabit = useCallback((customHabit: string) => {
    setState((prev) => ({
      ...prev,
      customHabit,
      selectedHabit: customHabit ? null : prev.selectedHabit,
    }));
  }, []);

  const setCustomGuardrail = useCallback((customGuardrail: string) => {
    setState((prev) => ({
      ...prev,
      customGuardrail,
    }));
  }, []);

  const startHabit = useCallback(() => {
    const today = formatDate(new Date());
    const habitId = state.selectedHabit?.id || `custom-${Date.now()}`;
    const customHabit = state.selectedHabit ? undefined : state.customHabit;
    const customGuardrail = state.selectedHabit
      ? undefined
      : state.customGuardrail || undefined;
    const guardrail = state.selectedHabit?.guardrail || customGuardrail;

    // Check if entry already exists
    const existingIndex = state.entries.findIndex(
      (entry) => entry.habitId === habitId && entry.customHabit === customHabit
    );

    if (existingIndex >= 0) {
      // Update existing entry
      setState((prev) => {
        const newEntries = [...prev.entries];
        newEntries[existingIndex] = {
          ...newEntries[existingIndex],
          startDate: today,
          customGuardrail: guardrail,
        };
        const allCompletedDates = newEntries.flatMap((entry) => entry.completedDates);
        const currentStreak = calculateStreak(allCompletedDates);
        const longestStreak = Math.max(
          prev.longestStreak,
          currentStreak,
          ...newEntries.map((entry) => calculateStreak(entry.completedDates))
        );
        return {
          ...prev,
          entries: newEntries,
          currentStreak,
          longestStreak,
        };
      });
    } else {
      // Create new entry
      setState((prev) => {
        const newEntry: SecurityHabitEntry = {
          habitId,
          customHabit,
          customGuardrail: guardrail,
          startDate: today,
          completedDates: [],
          notes: "",
        };
        const newEntries = [...prev.entries, newEntry];
        return {
          ...prev,
          entries: newEntries,
        };
      });
    }
  }, [state.selectedHabit, state.customHabit, state.customGuardrail, state.entries]);

  const markCompleted = useCallback((entryIndex: number) => {
    const today = formatDate(new Date());
    setState((prev) => {
      const newEntries = [...prev.entries];
      const entry = newEntries[entryIndex];
      if (!entry.completedDates.includes(today)) {
        entry.completedDates = [...entry.completedDates, today].sort((a, b) => b.localeCompare(a));
      }
      const allCompletedDates = newEntries.flatMap((e) => e.completedDates);
      const currentStreak = calculateStreak(allCompletedDates);
      const longestStreak = Math.max(
        prev.longestStreak,
        currentStreak,
        ...newEntries.map((e) => calculateStreak(e.completedDates))
      );
      return {
        ...prev,
        entries: newEntries,
        currentStreak,
        longestStreak,
      };
    });
  }, []);

  const unmarkCompleted = useCallback((entryIndex: number, date: string) => {
    setState((prev) => {
      const newEntries = [...prev.entries];
      const entry = newEntries[entryIndex];
      entry.completedDates = entry.completedDates.filter((d) => d !== date);
      const allCompletedDates = newEntries.flatMap((e) => e.completedDates);
      const currentStreak = calculateStreak(allCompletedDates);
      const longestStreak = Math.max(
        prev.longestStreak,
        currentStreak,
        ...newEntries.map((e) => calculateStreak(e.completedDates))
      );
      return {
        ...prev,
        entries: newEntries,
        currentStreak,
        longestStreak,
      };
    });
  }, []);

  const updateNotes = useCallback((entryIndex: number, notes: string) => {
    setState((prev) => {
      const newEntries = [...prev.entries];
      newEntries[entryIndex].notes = notes;
      return {
        ...prev,
        entries: newEntries,
      };
    });
  }, []);

  const deleteEntry = useCallback((entryIndex: number) => {
    setState((prev) => {
      const newEntries = prev.entries.filter((_, i) => i !== entryIndex);
      const allCompletedDates = newEntries.flatMap((entry) => entry.completedDates);
      const currentStreak = calculateStreak(allCompletedDates);
      const longestStreak = Math.max(
        prev.longestStreak,
        currentStreak,
        ...newEntries.map((entry) => calculateStreak(entry.completedDates))
      );
      return {
        ...prev,
        entries: newEntries,
        currentStreak,
        longestStreak,
      };
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      selectedHabit: null,
      customHabit: "",
      customGuardrail: "",
      entries: [],
      currentStreak: 0,
      longestStreak: 0,
    });
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const getCurrentWeekDates = useCallback((): string[] => {
    const weekStart = getWeekStart(new Date());
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      dates.push(formatDate(date));
    }
    return dates;
  }, []);

  const getActiveEntry = useCallback((): SecurityHabitEntry | null => {
    if (state.entries.length === 0) return null;
    // Return the most recently started entry
    const sorted = [...state.entries].sort((a, b) => b.startDate.localeCompare(a.startDate));
    return sorted[0];
  }, [state.entries]);

  return {
    state,
    selectHabit,
    setCustomHabit,
    setCustomGuardrail,
    startHabit,
    markCompleted,
    unmarkCompleted,
    updateNotes,
    deleteEntry,
    reset,
    getCurrentWeekDates,
    getActiveEntry,
  };
}

