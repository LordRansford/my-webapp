"use client";

import { useState } from "react";

export function Recap({ title = "Recap", points = [], terms = [], actions = [], openInitially = false, printMode = false }) {
  const [open, setOpen] = useState(openInitially);

  const content = (
    <div className="space-y-3">
      {points?.length ? (
        <div>
          <div className="text-sm font-semibold text-gray-900">Key points</div>
          <ul className="mt-1 list-disc pl-5 text-sm text-gray-800 space-y-1">
            {points.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {terms?.length ? (
        <div>
          <div className="text-sm font-semibold text-gray-900">Key terms</div>
          <ul className="mt-1 list-disc pl-5 text-sm text-gray-800 space-y-1">
            {terms.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {actions?.length ? (
        <div>
          <div className="text-sm font-semibold text-gray-900">Next actions</div>
          <ul className="mt-1 list-disc pl-5 text-sm text-gray-800 space-y-1">
            {actions.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );

  function copyRecap() {
    const text = [
      `${title}`,
      points?.length ? `Points:\n- ${points.join("\n- ")}` : "",
      terms?.length ? `Terms:\n- ${terms.join("\n- ")}` : "",
      actions?.length ? `Next:\n- ${actions.join("\n- ")}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");
    navigator.clipboard.writeText(text);
  }

  if (printMode) {
    return (
      <section className="my-6 rounded-2xl border bg-white/90 p-4 shadow-sm">
        <div className="text-base font-semibold text-gray-900 mb-2">{title}</div>
        {content}
      </section>
    );
  }

  return (
    <section className="my-8 rounded-2xl border bg-white/90 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Recap</p>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyRecap}
            className="rounded-full border px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
          >
            Copy recap
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
          >
            {open ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      {open ? <div className="mt-4">{content}</div> : null}
    </section>
  );
}

export default Recap;
