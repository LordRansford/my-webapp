"use client";

import React from "react";

type NotesProps = {
  whatThisTellsYou?: string[];
  interpretationTips?: string[];
  limitations?: string[];
};

function Section({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
      <p className="text-xs font-semibold text-slate-800">{title}</p>
      <ul className="mt-2 space-y-1 text-sm text-slate-700">
        {items.map((x, idx) => (
          <li key={`${title}-${idx}`}>• {x}</li>
        ))}
      </ul>
    </div>
  );
}

export function ToolOutputNotes({
  whatThisTellsYou,
  interpretationTips,
  limitations,
}: NotesProps) {
  const hasAny =
    (whatThisTellsYou && whatThisTellsYou.length > 0) ||
    (interpretationTips && interpretationTips.length > 0) ||
    (limitations && limitations.length > 0);

  if (!hasAny) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Section title="What this tells you" items={whatThisTellsYou} />
      <Section title="Interpretation tips" items={interpretationTips} />
      <Section title="Limitations" items={limitations} />
    </div>
  );
}


