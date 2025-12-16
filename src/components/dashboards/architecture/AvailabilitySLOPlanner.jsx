"use client";

import { useMemo, useState } from "react";

export function AvailabilitySLOPlanner() {
  const [componentAvailability, setComponentAvailability] = useState(99.5);
  const [seriesComponents, setSeriesComponents] = useState(3);
  const [parallelRedundancy, setParallelRedundancy] = useState(1);

  const stats = useMemo(() => {
    const p = componentAvailability / 100;
    const seriesAvailability = Math.pow(p, seriesComponents);
    const parallelAvailability = parallelRedundancy <= 1 ? p : 1 - Math.pow(1 - p, parallelRedundancy);
    const combinedAvailability = seriesAvailability * parallelAvailability;
    const downtimeMinutesPerMonth = (1 - combinedAvailability) * 30 * 24 * 60;

    return {
      seriesAvailability,
      parallelAvailability,
      combinedAvailability,
      downtimeMinutesPerMonth,
    };
  }, [componentAvailability, seriesComponents, parallelRedundancy]);

  function formatPercent(value) {
    return (value * 100).toFixed(3) + " percent";
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600">
        See how component availability composes into a system level objective. This is a quick sense-check, not a formal
        reliability model.
      </p>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
          <div className="space-y-4">
            <label className="block text-xs text-slate-600">
              Availability of a single component
              <input
                type="range"
                min={95}
                max={99.99}
                step={0.05}
                value={componentAvailability}
                onChange={(e) => setComponentAvailability(Number(e.target.value) || 95)}
                className="mt-1 w-full"
              />
              <span className="mt-1 inline-block text-xs text-slate-700">
                Component availability: <span className="font-semibold">{componentAvailability.toFixed(3)} percent</span>
              </span>
            </label>

            <label className="block text-xs text-slate-600">
              Number of components in series on the critical path
              <input
                type="range"
                min={1}
                max={8}
                value={seriesComponents}
                onChange={(e) => setSeriesComponents(Number(e.target.value) || 1)}
                className="mt-1 w-full"
              />
              <span className="mt-1 inline-block text-xs text-slate-700">
                {seriesComponents} component{seriesComponents === 1 ? "" : "s"} in series
              </span>
            </label>

            <label className="block text-xs text-slate-600">
              Redundant instances for one tier
              <input
                type="range"
                min={1}
                max={4}
                value={parallelRedundancy}
                onChange={(e) => setParallelRedundancy(Number(e.target.value) || 1)}
                className="mt-1 w-full"
              />
              <span className="mt-1 inline-block text-xs text-slate-700">
                {parallelRedundancy} instance{parallelRedundancy === 1 ? "" : "s"} in parallel at one tier
              </span>
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">SLO view</p>
            <p className="text-xs text-slate-700">
              Series availability: <span className="font-semibold">{formatPercent(stats.seriesAvailability)}</span>
            </p>
            <p className="text-xs text-slate-700">
              Parallel tier availability: <span className="font-semibold">{formatPercent(stats.parallelAvailability)}</span>
            </p>
            <p className="text-xs text-slate-700">
              Combined estimated availability: <span className="font-semibold">{formatPercent(stats.combinedAvailability)}</span>
            </p>
            <p className="mt-2 text-xs text-slate-700">
              Approximate downtime per month:{" "}
              <span className="font-semibold">{stats.downtimeMinutesPerMonth.toFixed(1)} minutes</span>
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
            <p className="mb-1 font-medium">Things to reflect on</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Is your promised SLO stricter than what these numbers suggest is realistic.</li>
              <li>Which component contributes most to downtime-invest there first.</li>
              <li>Do you know the real dependency chain well enough to count the series components.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

