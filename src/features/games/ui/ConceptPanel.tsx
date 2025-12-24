"use client";

import { useState } from "react";
import { UI_COPY } from "../constants";

export default function ConceptPanel({
  title,
  short,
  long,
  example,
}: {
  title: string;
  short: string;
  long: string;
  example: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2">
      <p className="m-0 text-xs font-semibold text-slate-600">
        {UI_COPY.trainsPrefix} {title}
      </p>
      <p className="mt-1 m-0 text-sm text-slate-700">{short}</p>
      <button
        type="button"
        className="mt-2 rounded-full border px-3 py-1 text-xs font-semibold"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? UI_COPY.collapse : UI_COPY.expand}
      </button>
      {open ? (
        <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          <p className="m-0">{long}</p>
          <p className="mt-2 m-0 text-xs font-semibold text-slate-600">Example: {example}</p>
        </div>
      ) : null}
    </div>
  );
}


