"use client";

import { useMemo, useState } from "react";

const fields = [
  { id: "customer", label: "Customer ID" },
  { id: "product", label: "Product ID" },
  { id: "timestamp", label: "Timestamp" },
  { id: "location", label: "Location" },
  { id: "notes", label: "Free text notes" },
];

const questions = [
  { id: "repeat", label: "Which customers are repeat buyers", needs: ["customer"] },
  { id: "per_product", label: "Which products are trending", needs: ["product"] },
  { id: "season", label: "Is there seasonality", needs: ["timestamp"] },
  { id: "region", label: "Where do orders cluster", needs: ["location"] },
  { id: "sentiment", label: "How do people feel", needs: ["notes"] },
];

export default function ModelAbstractionLabTool() {
  const [active, setActive] = useState({
    customer: true,
    product: true,
    timestamp: true,
    location: false,
    notes: false,
  });

  const toggle = (id) => setActive((prev) => ({ ...prev, [id]: !prev[id] }));

  const results = useMemo(
    () =>
      questions.map((q) => {
        const missing = q.needs.filter((need) => !active[need]);
        return { ...q, possible: missing.length === 0, missing };
      }),
    [active]
  );

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Turn fields on or off to see which questions the model can answer. Abstraction saves effort but can hide needed detail.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {fields.map((field) => (
          <label
            key={field.id}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm shadow-sm ${
              active[field.id] ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white"
            }`}
          >
            <input
              type="checkbox"
              checked={active[field.id]}
              onChange={() => toggle(field.id)}
              className="h-4 w-4"
            />
            <span className="text-slate-900">{field.label}</span>
          </label>
        ))}
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="font-semibold text-slate-900">What you can answer</p>
        <ul className="mt-2 space-y-1">
          {results.map((q) => (
            <li key={q.id} className={q.possible ? "text-emerald-700" : "text-amber-700"}>
              {q.label} {q.possible ? "(possible)" : `(missing: ${q.missing.map((m) => m).join(", ")})`}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-slate-600">
          Every field you remove simplifies storage, but it may block an important question later.
        </p>
      </div>
    </div>
  );
}
