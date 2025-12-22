import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  CPDSectionKey,
  CPDState,
  CPDTrackId,
  addActivityEntry,
  getInitialCPDState,
  getTotalsForTrack,
  saveCPDState,
  upsertSection,
} from "@/lib/cpd";

export function useCPD() {
  // SSR/hydration safety: start with a deterministic empty state, then hydrate from storage on mount.
  // This avoids server/client mismatches when localStorage has existing progress.
  const [state, setState] = useState<CPDState>(() => ({ version: 1, sections: [], activity: [] }));
  const { data: session, status } = useSession();
  const isAuthed = Boolean(session?.user?.id);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fresh = getInitialCPDState();
    setState(fresh);
  }, []);

  // When signed in, load server-backed progress (falls back to local state if none).
  useEffect(() => {
    if (!isAuthed) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/progress/cpd", { method: "GET" });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        if (data?.state) {
          setState(data.state);
          saveCPDState(data.state);
        } else {
          // No server state yet: push local state up so progress persists across devices.
          await fetch("/api/progress/cpd", {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ state }),
          });
        }
      } catch {
        // Keep local-only if offline or server unavailable.
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed, status]);

  const updateSection = useCallback(
    (input: CPDSectionKey & { completed?: boolean; minutesDelta?: number; note?: string }) => {
      // Stage 20 tier rule: visitors can view content but do not track progress or CPD.
      // Tracking requires a signed-in learner account.
      if (!session?.user?.id) return;
      setState((prev) => {
        let next = upsertSection(prev, input);
        if (input.minutesDelta && input.minutesDelta !== 0) {
          next = addActivityEntry(next, {
            trackId: input.trackId,
            levelId: input.levelId,
            sectionId: input.sectionId,
            minutesDelta: input.minutesDelta,
            note: input.note ?? "",
          });
        }
        saveCPDState(next);
        // Server-side enforcement: the server derives userId from the validated session.
        // Client never sends userId claims.
        fetch("/api/progress/cpd", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ state: next }),
        }).catch(() => {});
        return next;
      });
    },
    [session?.user?.id]
  );

  const getTrackTotals = useCallback(
    (trackId: CPDTrackId) => getTotalsForTrack(state, trackId),
    [state]
  );

  return { state, updateSection, getTrackTotals, isAuthed };
}
