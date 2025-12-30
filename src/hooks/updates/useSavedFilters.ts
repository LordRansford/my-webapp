/**
 * Hook for saving and loading filter preferences
 */

import { useState, useEffect, useCallback } from "react";

export interface SavedFilter {
  id: string;
  name: string;
  topics: string[];
  sources: string[];
  timeWindow: string;
  severity: string;
  createdAt: string;
}

const STORAGE_KEY = "news-updates-saved-filters";

export function useSavedFilters() {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedFilters(JSON.parse(stored));
      }
    } catch (error) {
      console.warn("Failed to load saved filters:", error);
    }
  }, []);

  const saveFilter = useCallback(
    (filter: Omit<SavedFilter, "id" | "createdAt">) => {
      const newFilter: SavedFilter = {
        ...filter,
        id: `filter-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      const updated = [...savedFilters, newFilter];
      setSavedFilters(updated);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.warn("Failed to save filter:", error);
      }

      return newFilter.id;
    },
    [savedFilters]
  );

  const deleteFilter = useCallback(
    (id: string) => {
      const updated = savedFilters.filter((f) => f.id !== id);
      setSavedFilters(updated);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.warn("Failed to delete filter:", error);
      }
    },
    [savedFilters]
  );

  const loadFilter = useCallback(
    (id: string): SavedFilter | undefined => {
      return savedFilters.find((f) => f.id === id);
    },
    [savedFilters]
  );

  return {
    savedFilters,
    saveFilter,
    deleteFilter,
    loadFilter,
  };
}
