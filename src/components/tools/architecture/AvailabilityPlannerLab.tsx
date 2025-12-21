"use client";

import React, { useMemo, useState } from "react";
import { Activity } from "lucide-react";

type ComponentAvailability = {
  id: number;
  name: string;
  availability: number;
};

function clampAvailability(v: number) {
  if (!Number.isFinite(v) || v < 90) return 90;
  if (v > 100) return 100;
  return v;
}

function computeChainAvailability(components: ComponentAvailability[]) {
  if (!components.length) return 1;
  return components.reduce(
    (acc, c) => (acc * clampAvailability(c.availability)) / 100,
    1
  );
}

export function AvailabilityPlannerLab() {
  const [components, setComponents] = useState<ComponentAvailability[]>([
    { id: 1, name: "Frontend", availability: 99.5 },
    { id: 2, name: "API layer", availability: 99.8 },
    { id: 3, name: "Database", availability: 99.9 },
  ]);

  const overall = useMemo(
    () => computeChainAvailability(components),
    [components]
  );

  const addComponent = () => {
    const nextId = components.length
      ? Math.max(...components.map((c) => c.id)) + 1
      : 1;
    setComponents((prev) => [
      ...prev,
      { id: nextId, name: "New component", availability: 99 },
    ]);
  };

  const updateAvailability = (id: number, value: string) => {
    const n = Number(value);
    setComponents((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, availability: clampAvailability(n) } : c
      )
    );
  };

  const removeComponent = (id: number) => {
    if (components.length <= 1) return;
    setComponents((prev) => prev.filter((c) => c.id !== id));
  };

  const downtimeMinutesPerMonth = (() => {
    const minutesInMonth = 30 * 24 * 60;
    const fractionDown = 1 - overall;
    return minutesInMonth * fractionDown;
  })();

  return (
    <section
      aria-labelledby="availability-planner-title"
      className="rounded-3xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 p-6 sm:p-8 space-y-6 transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(15,23,42,0.10)]"
    >
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
            <Activity className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <h2
              id="availability-planner-title"
              className="text-lg sm:text-xl font-semibold text-slate-900"
            >
              Availability and downtime planner
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Set target availability for each component in a path and see the
              combined effect. This makes it obvious how many nine values you
              really get at the edge.
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-700">
              Components in this user journey
            </p>
            <button
              type="button"
              onClick={addComponent}
              className="text-xs rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              aria-label="Add component"
            >
              Add component
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {components.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs text-slate-700 border border-slate-200"
              >
                <input
                  type="text"
                  value={c.name}
                  onChange={(e) =>
                    setComponents((prev) =>
                      prev.map((pc) =>
                        pc.id === c.id ? { ...pc, name: e.target.value } : pc
                      )
                    )
                  }
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
                <input
                  type="number"
                  min={90}
                  max={100}
                  value={c.availability}
                  onChange={(e) => updateAvailability(c.id, e.target.value)}
                  className="w-20 rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs text-right text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
                <span className="text-sm text-slate-500">percent</span>
                <button
                  type="button"
                  onClick={() => removeComponent(c.id)}
                  className="text-sm px-2 py-1 rounded-full text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                  aria-label="Remove component"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500">
            For a series of components, overall availability is the product of
            each one. This is why chains of services look less reliable than
            each individual service.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Combined availability
            </h3>
            <p className="text-sm text-slate-700">
              The combined end to end availability is{" "}
              <span className="font-semibold text-slate-900">
                {(overall * 100).toFixed(3)} percent
              </span>
              .
            </p>
            <p className="mt-1 text-sm text-slate-700">
              This corresponds to approximately{" "}
              <span className="font-semibold text-slate-900">
                {downtimeMinutesPerMonth.toFixed(1)} minutes
              </span>{" "}
              of downtime in a typical month.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 text-xs text-slate-700 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">
              Design question
            </h3>
            <p className="text-sm text-slate-700">
              If the downtime looks too high, you can redesign the path. That
              might mean removing steps, adding caching, using active active
              deployments or relaxing requirements for non critical operations.
            </p>
            <p className="text-sm text-slate-700">
              This lab is a quick way to have a concrete conversation with
              product owners about realistic reliability goals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
