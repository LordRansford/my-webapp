"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Lightbulb, Wrench } from "lucide-react";

const STORIES = [
  {
    id: "retry-storm",
    title: "Retry storm during an outage",
    summary: "Retries multiplied traffic until the whole platform slowed down.",
    rootCause: "Automatic retries with no limits and no circuit breaker.",
    fix: "Add backoff, cap retries, and open circuit breakers on errors.",
    lesson: "Safety is about stopping the blast radius, not just adding more retries.",
  },
  {
    id: "schema-drift",
    title: "Breaking change in a shared schema",
    summary: "A small field rename caused multiple downstream failures.",
    rootCause: "No versioning and no contract tests between services.",
    fix: "Version APIs and add compatibility tests before release.",
    lesson: "Stable contracts protect teams from surprise changes.",
  },
  {
    id: "cache-stale",
    title: "Stale cache after a critical update",
    summary: "Users kept seeing old data after an urgent update.",
    rootCause: "Cache invalidation was manual and inconsistent.",
    fix: "Use cache expiry rules and publish events on updates.",
    lesson: "Caching is powerful, but stale data can be worse than slow data.",
  },
];

export default function FailureStoryExplorer() {
  const [activeId, setActiveId] = useState(STORIES[0].id);
  const activeStory = useMemo(
    () => STORIES.find((story) => story.id === activeId) || STORIES[0],
    [activeId]
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-50 text-rose-700 ring-1 ring-rose-100">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Failure story explorer</p>
          <p className="text-xs text-slate-600">Pick a story and spot the real cause and fix.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="space-y-2">
          {STORIES.map((story) => (
            <button
              key={story.id}
              type="button"
              onClick={() => setActiveId(story.id)}
              className={`w-full rounded-2xl border px-3 py-2 text-left text-xs font-semibold transition ${
                story.id === activeId
                  ? "border-rose-200 bg-rose-50 text-rose-800"
                  : "border-slate-200 bg-slate-50/70 text-slate-700 hover:border-slate-300 hover:bg-white"
              }`}
            >
              {story.title}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <p className="text-xs font-semibold text-slate-900">{activeStory.title}</p>
          <p className="mt-2 text-xs text-slate-600">{activeStory.summary}</p>

          <div className="mt-3 grid gap-2">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold text-slate-700">Root cause</p>
              <p className="mt-1 text-xs text-slate-600">{activeStory.rootCause}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
                Better fix
              </p>
              <p className="mt-1 text-xs text-slate-600">{activeStory.fix}</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
              <p className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
                Lesson
              </p>
              <p className="mt-1 text-xs text-emerald-700">{activeStory.lesson}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
