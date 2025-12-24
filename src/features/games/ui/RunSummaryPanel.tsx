"use client";

import type { Coaching, Metrics } from "../types";
import { UI_COPY } from "../constants";
import ConceptPanel from "./ConceptPanel";

export default function RunSummaryPanel({
  metrics,
  coaching,
  concept,
}: {
  metrics: Metrics;
  coaching: Coaching;
  concept: { title: string; short: string; long: string; example: string };
}) {
  const s = (metrics.durationMs / 1000).toFixed(1);
  const diff = Math.round(metrics.maxDifficultyReached * 100);

  return (
    <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
      <p className="m-0 font-semibold text-slate-900">{UI_COPY.skillReviewTitle}</p>
      <p className="mt-2 m-0 text-xs font-semibold text-slate-600">
        Duration: {s}s · Difficulty: {diff}%
      </p>

      <div className="mt-3 space-y-2">
        <div>
          <p className="m-0 font-semibold text-slate-900">{coaching.headline}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {coaching.insights.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p className="mt-2 m-0 text-slate-700">
            <span className="font-semibold text-slate-900">Tip:</span> {coaching.tip}
          </p>
        </div>
      </div>

      <ConceptPanel title={concept.title} short={concept.short} long={concept.long} example={concept.example} />
    </section>
  );
}


