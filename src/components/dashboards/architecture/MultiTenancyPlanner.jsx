"use client";

import { useMemo, useState } from "react";

export function MultiTenancyPlanner() {
  const [tenants, setTenants] = useState(50);
  const [model, setModel] = useState("Pooled");
  const [complianceSensitivity, setComplianceSensitivity] = useState(70);

  const stats = useMemo(() => {
    let isolationScore;
    let costScore;
    let blastRadiusFactor;

    if (model === "Pooled") {
      isolationScore = 1;
      costScore = 3;
      blastRadiusFactor = 1;
    } else if (model === "PooledIsolatedData") {
      isolationScore = 2;
      costScore = 2;
      blastRadiusFactor = 0.5;
    } else {
      isolationScore = 3;
      costScore = 1;
      blastRadiusFactor = 0.2;
    }

    const regulatedTenants = tenants * (complianceSensitivity / 100);
    const combinedRisk = blastRadiusFactor * (complianceSensitivity / 100);

    return {
      isolationScore,
      costScore,
      blastRadiusFactor,
      regulatedTenants,
      combinedRisk,
    };
  }, [tenants, model, complianceSensitivity]);

  function modelDescription() {
    switch (model) {
      case "Pooled":
        return "All tenants share the same app and database schema. Isolation is logical using tenant identifiers.";
      case "PooledIsolatedData":
        return "Tenants share app instances but have separate schemas or databases. Better isolation, some economies of scale.";
      case "FullyIsolated":
        return "Each tenant has an isolated stack. Strongest isolation, usually the highest operational cost.";
      default:
        return "";
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600">
        Multi-tenancy decisions affect cost, complexity, and risk. Compare models at a high level and think about regulated tenants
        explicitly.
      </p>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
          <div className="space-y-4">
            <label className="block text-xs text-slate-600">
              Number of tenants
              <input
                type="range"
                min={1}
                max={500}
                step={1}
                value={tenants}
                onChange={(e) => setTenants(Number(e.target.value) || 1)}
                className="mt-1 w-full"
              />
              <span className="mt-1 inline-block text-xs text-slate-700">
                {tenants} tenant{tenants === 1 ? "" : "s"}
              </span>
            </label>

            <div className="text-xs text-slate-600">
              Tenancy model
              <div className="mt-1 flex flex-wrap gap-2">
                <ModelChip label="Pooled" active={model === "Pooled"} onClick={() => setModel("Pooled")} />
                <ModelChip
                  label="Pooled with isolated data"
                  active={model === "PooledIsolatedData"}
                  onClick={() => setModel("PooledIsolatedData")}
                />
                <ModelChip label="Fully isolated" active={model === "FullyIsolated"} onClick={() => setModel("FullyIsolated")} />
              </div>
              <p className="mt-2 text-xs text-slate-700">{modelDescription()}</p>
            </div>

            <label className="block text-xs text-slate-600">
              Percentage of tenants with strong regulatory or security demands
              <input
                type="range"
                min={0}
                max={100}
                value={complianceSensitivity}
                onChange={(e) => setComplianceSensitivity(Number(e.target.value) || 0)}
                className="mt-1 w-full"
              />
              <span className="mt-1 inline-block text-xs text-slate-700">
                About {complianceSensitivity} percent of tenants need stronger assurances.
              </span>
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Model comparison</p>
            <p className="text-xs text-slate-700">
              Isolation strength (1 low, 3 high): <span className="font-semibold">{stats.isolationScore}</span>
            </p>
            <p className="text-xs text-slate-700">
              Cost efficiency (1 low, 3 high): <span className="font-semibold">{stats.costScore}</span>
            </p>
            <p className="text-xs text-slate-700">
              Blast radius factor for a serious incident:{" "}
              <span className="font-semibold">{(stats.blastRadiusFactor * 100).toFixed(0)} percent</span>
            </p>
            <p className="mt-1 text-xs text-slate-700">
              Tenants with strong regulatory demands: <span className="font-semibold">{stats.regulatedTenants.toFixed(0)}</span>
            </p>
            <p className="mt-2 text-xs text-slate-600">
              Combined risk roughly follows blast radius and the proportion of regulated tenants. You might mix models: pooled for
              most, isolated for a few demanding tenants.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
            <p className="mb-1 font-medium">Prompts</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Which tenants would be hardest to recover for after a shared incident.</li>
              <li>Can you separate demanding tenants without rebuilding everything.</li>
              <li>Do your contracts and marketing match the isolation model you actually run.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModelChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full border px-3 py-1 text-xs " +
        (active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300")
      }
    >
      {label}
    </button>
  );
}
