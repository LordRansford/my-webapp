"use client";

import { useState } from "react";

export default function GlossaryTip({ term, children }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <button
        className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 bg-white text-[11px] font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-blue-200"
        aria-label={`Definition of ${term}`}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        ?
      </button>
      {open ? (
        <div className="absolute z-20 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-800 shadow-lg">
          <p className="mb-1 font-semibold text-gray-900">{term}</p>
          <div className="leading-relaxed">{children}</div>
        </div>
      ) : null}
    </span>
  );
}
