import { useCallback, useEffect, useState } from "react";
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
  const [state, setState] = useState<CPDState>(() => getInitialCPDState());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fresh = getInitialCPDState();
    setState(fresh);
  }, []);

  const updateSection = useCallback(
    (input: CPDSectionKey & { completed?: boolean; minutesDelta?: number; note?: string }) => {
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
        return next;
      });
    },
    []
  );

  const getTrackTotals = useCallback(
    (trackId: CPDTrackId) => getTotalsForTrack(state, trackId),
    [state]
  );

  return { state, updateSection, getTrackTotals };
}
