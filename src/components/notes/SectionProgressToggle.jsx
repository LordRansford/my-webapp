"use client";

import { useMemo, useState } from "react";
import { useCPD } from "@/hooks/useCPD";
import { resolveTrackId } from "@/lib/cpd";
import SaveProgressPrompt from "@/components/auth/SaveProgressPrompt";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function SectionProgressToggle({ courseId, levelId, sectionId }) {
  const { state, updateSection, isAuthed } = useCPD();
  const { track } = useAnalytics();
  const trackId = resolveTrackId(courseId);
  const [hasAwarded, setHasAwarded] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);

  const existingSection = useMemo(
    () =>
      state.sections.find(
        (section) =>
          section.trackId === trackId &&
          section.levelId === levelId &&
          section.sectionId === sectionId
      ),
    [state.sections, trackId, levelId, sectionId]
  );

  const checked = useMemo(
    () => Boolean(existingSection?.completed),
    [existingSection]
  );

  const hasCompletedBefore = useMemo(
    () => Boolean(existingSection && (existingSection.completed || existingSection.minutes > 0)),
    [existingSection]
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
        aria-pressed={checked}
        aria-label={checked ? "Marked complete" : "Mark as complete"}
        className={`inline-flex w-full flex-wrap items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition sm:w-auto ${
          checked ? "border-green-500 bg-green-50 text-green-800" : "border-gray-200 bg-white text-gray-700"
        } ${!isAuthed ? "opacity-70 cursor-not-allowed" : ""} focus:outline-none focus:ring focus:ring-blue-200`}
      >
        <span
          aria-hidden="true"
          className={`flex h-3 w-3 items-center justify-center rounded-full border ${
            checked ? "border-green-600 bg-green-500" : "border-gray-400"
          }`}
        />
        <span className="break-words">{checked ? "Marked complete" : "Mark as complete"}</span>
      </button>
      {showSavePrompt && !isAuthed ? <SaveProgressPrompt /> : null}
    </div>
  );
}
