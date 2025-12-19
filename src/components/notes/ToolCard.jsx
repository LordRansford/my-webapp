"use client";

import { useState } from "react";
import { useCPD } from "@/hooks/useCPD";
import { resolveTrackId } from "@/lib/cpd";

export default function ToolCard({
  id,
  title,
  description,
  children,
  courseId,
  levelId,
  sectionId,
  cpdMinutesOnUse,
}) {
  const { updateSection } = useCPD();
  const [hasAwarded, setHasAwarded] = useState(false);
  const trackId = courseId ? resolveTrackId(courseId) : null;

  const handleUse = () => {
    if (!trackId || !levelId || !sectionId) return;
    if (hasAwarded) return;
    updateSection({
      trackId,
      levelId,
      sectionId,
      minutesDelta: cpdMinutesOnUse ?? 5,
      note: id ? `Used tool ${id}` : `Used tool ${title}`,
    });
    setHasAwarded(true);
  };

  return (
    <section className="my-6 w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300">
      <header className="mb-4 min-w-0">
        <h3 className="mb-2 text-lg font-semibold text-slate-900 break-words">{title}</h3>
        {description ? (
          <p className="text-sm leading-relaxed text-slate-600 break-words">{description}</p>
        ) : null}
      </header>
      <div
        className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 transition-colors duration-200 w-full overflow-x-auto"
        onClick={handleUse}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleUse();
          }
        }}
      >
        {children}
      </div>
    </section>
  );
}
