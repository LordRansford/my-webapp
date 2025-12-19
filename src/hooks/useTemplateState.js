"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const cloneValue = (value) => JSON.parse(JSON.stringify(typeof value === "function" ? value() : value));

export function useTemplateState(storageKey, initialState) {
  const [state, setState] = useState(() => cloneValue(initialState));
  const [lastUpdated, setLastUpdated] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.data !== undefined) {
          setState(parsed.data);
        }
        if (parsed.lastUpdated) {
          setLastUpdated(parsed.lastUpdated);
        }
      } catch (error) {
        console.warn("Could not parse stored template state", error);
      }
    }
    setHydrated(true);
  }, [storageKey]);

  const persist = useCallback(
    (nextState, timestamp) => {
      if (typeof window === "undefined") return;
      const payload = {
        data: nextState,
        lastUpdated: timestamp,
      };
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    },
    [storageKey]
  );

  const updateState = useCallback(
    (updater) => {
      setState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        const timestamp = new Date().toISOString();
        setLastUpdated(timestamp);
        persist(next, timestamp);
        return next;
      });
    },
    [persist]
  );

  const resetState = useCallback(() => {
    const resetValue = cloneValue(initialState);
    const timestamp = new Date().toISOString();
    setState(resetValue);
    setLastUpdated(timestamp);
    persist(resetValue, timestamp);
  }, [initialState, persist]);

  const status = useMemo(
    () => ({
      hydrated,
      lastUpdated,
    }),
    [hydrated, lastUpdated]
  );

  return {
    state,
    updateState,
    resetState,
    ...status,
  };
}
