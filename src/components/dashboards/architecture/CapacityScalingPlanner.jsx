"use client";

import { useMemo, useState } from "react";

export function CapacityScalingPlanner() {
  const [requestsPerSecond, setRequestsPerSecond] = useState(200);
  const [capacityPerInstance, setCapacityPerInstance] = useState(100);
  const [instances, setInstances] = useState(3);
  const [targetUtilisation, setTargetUtilisation] = useState(70);

  const stats = useMemo(() => {
    const totalCapacity = capacityPerInstance * instances;
    const utilisation = totalCapacity === 0 ? 0 : (requestsPerSecond / totalCapacity) * 100;
    const meetsTarget = utilisation <= targetUtilisation;
    const suggestedInstances =
      capacityPerInstance === 0
        ? 0
        : Math.ceil((requestsPerSecond / capacityPerInstance) * (100 / targetUtilisation));

    return {
      totalCapacity,
      utilisation,
      meetsTarget,
      suggestedInstances,
    };
  }, [requestsPerSecond, capacityPerInstance, instances, targetUtilisation]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600">
        Use this planner to reason about how many instances you need for a given level of traffic and how much headroom you want.
        It is intentionally simple so you can adjust it quickly during a conversation.
      </p>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
          <div className="space-y-4">
            <label className="block text-xs text-slate-600">
              Incoming requests per second
              <input
                type="range"
                min={50}
                max={2000}
                step={50}
                value={requestsPerSecond}
                onChange={(e) => setRequestsPerSecond(Number(e.target.value) || 50)}
                className="mt-1 w-full"
              />
              <span className="mt-1 inline-block text-xs text-slate-700">{requestsPerSecond} requests per second.</span>
            </label>

            <label className="block text-xs text-slate-600">
              Capacity per instance (requests per second)
              <input
                type="range"
                min={50}
                max={500}
                step={10}
                value={capacityPerInstance}
                onChange={(e) => setCapacityPerInstance(Number(e.target.value) || 50)}
                className="mt-1 w-full"
              />
              <span className="mt-1 inline-block text-xs text-slate-700">
                Each instance can handle about {capacityPerInstance} requests per second.
              </span>
            </label>

            <label className="block text-xs text-slate-600">
              Number of instances
              <input
                type="range"
                min={1}
                max={20}
                value={instances}
                onChange={(e) => setInstances(Number(e.target.value) || 1)}
                className="mt-1 w-full"
              />
              <span className="mt-1 inline-block text-xs text-slate-700">
                {instances} instance{instances === 1 ? "" : "s"} provisioned.
              </span>
            </label>

            <label className="block text-xs text-slate-600">
              Target utilisation
              <input
                type="range"
                min={40}
                max={90}
                step={5}
                value={targetUtilisation}
                onChange={(e) => setTargetUtilisation(Number(e.target.value) || 40)}
                className="mt-1 w-full"
              />
              <span className="mt-1 inline-block text-xs text-slate-700">Aim to stay under {targetUtilisation}% utilisation.</span>
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Capacity view</p>
            <p className="text-xs text-slate-700">
              Total capacity: <span className="font-semibold">{stats.totalCapacity} requests per second</span>
            </p>
            <p className="text-xs text-slate-700">
              Current utilisation:{" "}
              <span
                className={
                  "font-semibold " +
                  (stats.utilisation > 100
                    ? "text-rose-600"
                    : stats.utilisation > targetUtilisation
                    ? "text-amber-700"
                    : "text-emerald-700")
                }
              >
                {stats.utilisation.toFixed(1)}%
              </span>
            </p>
            <p className="text-xs text-slate-700">
              Meets target: <span className="font-semibold">{stats.meetsTarget ? "Yes, with headroom" : "No, consider scaling out"}</span>
            </p>
            <p className="mt-1 text-xs text-slate-700">
              Suggested instance count to reach the target utilisation: <span className="font-semibold">{stats.suggestedInstances}</span>
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
            <p className="mb-1 font-medium">How to use this</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Set peak traffic levels rather than daily averages.</li>
              <li>Choose a target utilisation that leaves space for spikes and deployments.</li>
              <li>Use the suggested instance count as a starting point for auto scaling configuration.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
