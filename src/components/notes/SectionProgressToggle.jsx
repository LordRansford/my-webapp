"use client";

import { useMemo, useState } from "react";
import { useCPD } from "@/hooks/useCPD";
import { getSectionAliases, resolveTrackId } from "@/lib/cpd";
import SaveProgressPrompt from "@/components/auth/SaveProgressPrompt";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function SectionProgressToggle({ courseId, levelId, sectionId }) {
  const { state, updateSection, isAuthed } = useCPD();
  const { track } = useAnalytics();
  const trackId = resolveTrackId(courseId);
  const [hasAwarded, setHasAwarded] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);

  const aliasIds = useMemo(
    () => getSectionAliases(trackId, levelId, sectionId),
    [trackId, levelId, sectionId]
  );

  const matchingSections = useMemo(() => {
    if (!aliasIds.length) return [];
    return state.sections.filter(
      (s) => s.trackId === trackId && s.levelId === levelId && aliasIds.includes(s.sectionId)
    );
  }, [state.sections, trackId, levelId, aliasIds]);

  const checked = useMemo(() => matchingSections.some((s) => Boolean(s.completed)), [matchingSections]);

  const hasCompletedBefore = useMemo(
    () => matchingSections.some((s) => Boolean(s.completed) || (Number(s.minutes) || 0) > 0),
    [matchingSections]
  );

  const onChange = () => {
    if (!isAuthed) {
      setShowSavePrompt(true);
      return;
    }
    const awardingMinutes = !checked && !hasCompletedBefore && !hasAwarded;

    if (!checked) track({ type: "section_started", trackId, levelId, sectionId });

    updateSection({
      trackId,
      levelId,
      sectionId,
      completed: !checked,
      minutesDelta: awardingMinutes ? 10 : 0,
    });

    // Keep legacy aliases in sync so toggling behaves predictably for users
    // who completed an older section ID before we introduced canonical IDs.
    // We do not award minutes for alias sync writes.
    for (const aliasId of aliasIds) {
      if (aliasId === sectionId) continue;
      updateSection({
        trackId,
        levelId,
        sectionId: aliasId,
        completed: !checked,
        minutesDelta: 0,
      });
    }

    if (!checked) track({ type: "section_completed", trackId, levelId, sectionId });
    if (awardingMinutes) {
      setHasAwarded(true);
    }
    if (!checked && !isAuthed) setShowSavePrompt(true);
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onChange}
        disabled={!isAuthed}
        role="switch"
        aria-checked={checked}
        aria-label={checked ? "Marked complete" : "Mark as complete"}
        className={`inline-flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-2 text-sm font-semibold transition sm:w-auto ${
          checked ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-slate-200 bg-white text-slate-800"
        } ${!isAuthed ? "cursor-not-allowed opacity-70" : ""} focus:outline-none focus:ring focus:ring-blue-200`}
      >
        <span className="min-w-0 break-words">{checked ? "Marked complete" : "Mark as complete"}</span>
        <span
          aria-hidden="true"
          className={`relative inline-flex h-6 w-11 items-center rounded-full border transition ${
            checked ? "border-emerald-500/30 bg-emerald-500" : "border-slate-300 bg-slate-200"
          } dark:border-slate-600 dark:bg-slate-800`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition ${
              checked ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </span>
      </button>
      {showSavePrompt && !isAuthed ? <SaveProgressPrompt /> : null}
    </div>
  );
}
