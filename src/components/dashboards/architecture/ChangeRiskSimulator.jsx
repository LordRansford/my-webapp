"use client";

import { useMemo, useState } from "react";

export function ChangeRiskSimulator() {
  const [deploysPerDay, setDeploysPerDay] = useState(5);
  const [testDepth, setTestDepth] = useState(70);
  const [blastRadius, setBlastRadius] = useState(60);
  const [rollbackReady, setRollbackReady] = useState(true);

  const stats = useMemo(() => {
    const frequencyFactor = Math.min(deploysPerDay / 5, 3);
    const testFactor = 1 - testDepth / 100;
    const blastFactor = blastRadius / 100;
    const rollbackFactor = rollbackReady ? 0.5 : 1;

    const riskScore = frequencyFactor * testFactor * blastFactor * rollbackFactor * 100;

    let band;
    if (riskScore < 15) band = "low";
    else if (riskScore < 40) band = "medium";
    else band = "high";

    return {
      riskScore,
      band,
    };
  }, [deploysPerDay, testDepth, blastRadius, rollbackReady]);

  function bandColour(band) {
    if (band === "low") return "text-emerald-700";
    if (band === "medium") return "text-amber-700";
    return "text-rose-700";
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600">
        Reason about change risk by adjusting deployment frequency, test depth, blast radius, and rollback readiness. This is for
        discussion, not prediction.
      </p>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
          <div className="space-y-4">
            <label className="block text-xs text-slate-600">
              Deployments per day
              <input
                type="range"
                min={0}
                max={50}
                value={deploysPerDay}
                onChange={(e) => setDeploysPerDay(Number(e.target.value) || 0)}
                className="mt-1 w-full"
              />
              <span className="mt-1 inline-block text-xs text-slate-700">
                {deploysPerDay} deployment{deploysPerDay === 1 ? "" : "s"} per day
              </span>
            </label>

            <label className="block text-xs text-slate-600">
              Depth of automated tests
              <input
                type="range"
                min={0}
                max={100}
                value={testDepth}
                onChange={(e) => setTestDepth(Number(e.target.value) || 0)}
                className="mt-1 w-full"
              />
              <span className="mt-1 inline-block text-xs text-slate-700">Rough coverage and depth: {testDepth} percent</span>
            </label>

            <label className="block text-xs text-slate-600">
              Blast radius for a bad release
              <input
                type="range"
                min={1}
                max={100}
                value={blastRadius}
                onChange={(e) => setBlastRadius(Number(e.target.value) || 1)}
                className="mt-1 w-full"
              />
              <span className="mt-1 inline-block text-xs text-slate-700">
                A failure could affect about {blastRadius} percent of users.
              </span>
            </label>

            <label className="mt-1 flex items-center gap-2 text-xs text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300"
                checked={rollbackReady}
                onChange={(e) => setRollbackReady(e.target.checked)}
              />
              We have a rehearsed, fast rollback or feature flag fallback
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Risk summary</p>
            <p className="text-xs text-slate-700">
              Relative risk score:{" "}
              <span className={`font-semibold ${bandColour(stats.band)}`}>{stats.riskScore.toFixed(1)}</span> out of 100
            </p>
            <p className="text-xs text-slate-700">
              Risk band: <span className={`font-semibold ${bandColour(stats.band)}`}>{stats.band.toUpperCase()}</span>
            </p>
            <p className="mt-2 text-xs text-slate-600">
              Lower risk usually comes from smaller blast radius, better automated tests, and a reliable rollback path rather than
              simply doing fewer deployments.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
            <p className="mb-1 font-medium">Discussion prompts</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Would a feature flag strategy reduce blast radius for risky changes.</li>
              <li>Is your rollback process rehearsed often enough to be trusted in production.</li>
              <li>Are you slowing delivery when you could instead improve tests and deployment automation.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
