/**
 * Hook for managing bookmarked/favorite items
 */

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "news-updates-bookmarks";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBookmarks(new Set(JSON.parse(stored)));
      }
    } catch (error) {
      console.warn("Failed to load bookmarks:", error);
    }
  }, []);

  const toggleBookmark = useCallback(
    (itemId: string) => {
      setBookmarks((prev) => {
        const updated = new Set(prev);
        if (updated.has(itemId)) {
          updated.delete(itemId);
        } else {
          updated.add(itemId);
        }

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(updated)));
        } catch (error) {
          console.warn("Failed to save bookmarks:", error);
        }

        return updated;
      });
    },
    []
  );

  const isBookmarked = useCallback(
    (itemId: string) => {
      return bookmarks.has(itemId);
    },
    [bookmarks]
  );

  const clearBookmarks = useCallback(() => {
    setBookmarks(new Set());
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to clear bookmarks:", error);
    }
  }, []);

  return {
    bookmarks: Array.from(bookmarks),
    toggleBookmark,
    isBookmarked,
    clearBookmarks,
  };
}
