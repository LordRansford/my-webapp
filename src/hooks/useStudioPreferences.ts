/**
 * React Hook for Studio Preferences
 * 
 * Provides client-side access to user preferences with automatic sync.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import type { StudioPreferences } from "@/lib/studios/userPreferences";

export function useStudioPreferences() {
  const { data: session } = useSession();
  const [preferences, setPreferences] = useState<StudioPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    async function fetchPreferences() {
      try {
        const response = await fetch("/api/account/settings/studios");
        if (!response.ok) {
          throw new Error("Failed to fetch preferences");
        }
        const data = await response.json();
        setPreferences(data.preferences);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load preferences");
      } finally {
        setLoading(false);
      }
    }

    fetchPreferences();
  }, [session?.user?.id]);

  const updatePreferences = useCallback(
    async (updates: Partial<Omit<StudioPreferences, "userId" | "updatedAt">>) => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch("/api/account/settings/studios", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ updates }),
        });

        if (!response.ok) {
          throw new Error("Failed to update preferences");
        }

        const data = await response.json();
        setPreferences(data.preferences);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update preferences");
        throw err;
      }
    },
    [session?.user?.id]
  );

  const updateToolDefaults = useCallback(
    async (toolId: string, defaults: Record<string, any>) => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch("/api/account/settings/studios", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolId, toolDefaults: defaults }),
        });

        if (!response.ok) {
          throw new Error("Failed to update tool defaults");
        }

        const data = await response.json();
        setPreferences(data.preferences);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update tool defaults");
        throw err;
      }
    },
    [session?.user?.id]
  );

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    updateToolDefaults,
  };
}
