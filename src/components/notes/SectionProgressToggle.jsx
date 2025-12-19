"use client";

import { useMemo, useState } from "react";
import { useCPD } from "@/hooks/useCPD";
import { resolveTrackId } from "@/lib/cpd";

export default function SectionProgressToggle({ courseId, levelId, sectionId }) {
  const { state, updateSection } = useCPD();
  const trackId = resolveTrackId(courseId);
  const [hasAwarded, setHasAwarded] = useState(false);

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
    const awardingMinutes = !checked && !hasCompletedBefore && !hasAwarded;

    updateSection({
      trackId,
      levelId,
      sectionId,
      completed: !checked,
      minutesDelta: awardingMinutes ? 10 : 0,
    });
    if (awardingMinutes) {
      setHasAwarded(true);
    }
  };

  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      aria-label={checked ? "Marked complete" : "Mark as complete"}
      className={`inline-flex w-full flex-wrap items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition sm:w-auto ${
        checked ? "border-green-500 bg-green-50 text-green-800" : "border-gray-200 bg-white text-gray-700"
      } focus:outline-none focus:ring focus:ring-blue-200`}
    >
      <span
        aria-hidden="true"
        className={`flex h-3 w-3 items-center justify-center rounded-full border ${
          checked ? "border-green-600 bg-green-500" : "border-gray-400"
        }`}
      />
      <span className="break-words">{checked ? "Marked complete" : "Mark as complete"}</span>
    </button>
  );
}
