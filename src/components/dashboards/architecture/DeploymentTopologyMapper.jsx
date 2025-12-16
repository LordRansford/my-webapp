"use client";

import { useMemo, useState } from "react";

export function DeploymentTopologyMapper() {
  const [environments, setEnvironments] = useState([
    { id: 1, name: "Production", instances: 12, userFacing: true },
    { id: 2, name: "Staging", instances: 4, userFacing: true },
    { id: 3, name: "Non prod shared", instances: 6, userFacing: false },
  ]);

  function updateEnv(id, patch) {
    setEnvironments((current) => current.map((env) => (env.id === id ? { ...env, ...patch } : env)));
  }

  function addEnv() {
    const nextId = environments.length ? Math.max(...environments.map((e) => e.id)) + 1 : 1;
    setEnvironments((current) => [...current, { id: nextId, name: "", instances: 1, userFacing: false }]);
  }

  function removeEnv(id) {
    setEnvironments((current) => current.filter((env) => env.id !== id));
  }

  const stats = useMemo(() => {
    const totalInstances = environments.reduce((sum, env) => sum + env.instances, 0);
    const userFacingEnvs = environments.filter((env) => env.userFacing).length;
    return {
      totalInstances,
      userFacingEnvs,
    };
  }, [environments]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600">
        Map out the environments where your system runs. This helps you talk about blast radius, deployment patterns and where
        experiments are safe or dangerous.
      </p>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Environments</p>
            <button
              type="button"
              onClick={addEnv}
              className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800"
            >
              Add environment
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {environments.map((env) => (
              <div key={env.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3 shadow-sm">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <input
                    className="w-full rounded-xl border border-slate-200 px-2 py-1 text-sm font-semibold"
                    placeholder="For example Production EU"
                    value={env.name}
                    onChange={(e) => updateEnv(env.id, { name: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => removeEnv(env.id)}
                    className="rounded-full px-2 py-1 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <label className="text-xs text-slate-600">
                    Instances
                    <input
                      type="range"
                      min={1}
                      max={30}
                      value={env.instances}
                      onChange={(e) => updateEnv(env.id, { instances: Number(e.target.value) || 1 })}
                      className="mt-1 w-full"
                    />
                    <span className="mt-1 inline-block text-xs text-slate-700">
                      {env.instances} instance{env.instances === 1 ? "" : "s"}
                    </span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300"
                      checked={env.userFacing}
                      onChange={(e) => updateEnv(env.id, { userFacing: e.target.checked })}
                    />
                    User facing environment
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Topology summary</p>
            <p className="text-xs text-slate-700">
              Total instances across all environments: <span className="font-semibold">{stats.totalInstances}</span>
            </p>
            <p className="text-xs text-slate-700">
              User facing environments: <span className="font-semibold">{stats.userFacingEnvs}</span>
            </p>
            <p className="mt-2 text-xs text-slate-600">
              A wide blast radius often comes from many user facing environments sharing the same failure modes. Separate control
              planes and strict deployment rules can reduce the chance of one mistake affecting everyone.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
            <p className="mb-1 font-medium">Questions to consider</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Where would you try a risky change first.</li>
              <li>Which environment has the widest blast radius today.</li>
              <li>Do you have a safe place to rehearse incident run books and failover tests.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
