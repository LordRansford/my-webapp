"use client";

import { useState } from "react";

const formats = [
  {
    id: "csv",
    label: "CSV",
    body: "Rows and columns separated by commas. Simple and human readable, but fragile if fields contain commas.",
  },
  {
    id: "json",
    label: "JSON",
    body: "Name value pairs, nested when needed. Great for APIs and flexible structures.",
  },
  {
    id: "image",
    label: "Images",
    body: "Grids of pixels with colour channels. Structure is spatial instead of rows and columns.",
  },
  {
    id: "audio",
    label: "Audio",
    body: "Samples of a waveform over time. Structure is a time series.",
  },
];

export default function DataFormatExplorer() {
  const [active, setActive] = useState("csv");

  const current = formats.find((fmt) => fmt.id === active);

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Toggle through formats and see how structure changes what tools and checks you need.
      </p>
      <div className="flex flex-wrap gap-2">
        {formats.map((fmt) => (
          <button
            key={fmt.id}
            type="button"
            onClick={() => setActive(fmt.id)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold shadow-sm focus:outline-none focus:ring ${
              active === fmt.id
                ? "border-indigo-500 bg-indigo-50 text-indigo-800 focus:ring-indigo-200"
                : "border-slate-200 bg-white text-slate-800 focus:ring-slate-200"
            }`}
          >
            {fmt.label}
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800">
        <p className="font-semibold text-slate-900">{current?.label}</p>
        <p className="mt-1 text-sm text-slate-700">{current?.body}</p>
      </div>
    </div>
  );
}
