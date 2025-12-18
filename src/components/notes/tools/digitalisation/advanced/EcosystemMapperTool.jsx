"use client";

import { useMemo, useState } from "react";
import { Network, Building2, Shield, Users } from "lucide-react";

const ROLE_OPTIONS = [
  { value: "Publisher", icon: Building2 },
  { value: "Consumer", icon: Users },
  { value: "Governor", icon: Shield },
];

export default function EcosystemMapperTool() {
  const [actors, setActors] = useState([
    { id: 1, name: "TSO", role: "Publisher", flow: "Grid constraints and forecasts" },
    { id: 2, name: "DSO", role: "Consumer", flow: "Network and asset data" },
    { id: 3, name: "Regulator", role: "Governor", flow: "Compliance and reporting rules" },
  ]);

  const addActor = () => {
    const nextId = actors.length ? Math.max(...actors.map((a) => a.id)) + 1 : 1;
    setActors((prev) => [
      ...prev,
      { id: nextId, name: "New actor", role: "Publisher", flow: "" },
    ]);
  };

  const updateActor = (id, patch) => {
    setActors((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const removeActor = (id) => {
    if (actors.length <= 1) return;
    setActors((prev) => prev.filter((a) => a.id !== id));
  };

  const roleCounts = useMemo(() => {
    return ROLE_OPTIONS.reduce((acc, role) => {
      acc[role.value] = actors.filter((a) => a.role === role.value).length;
      return acc;
    }, {});
  }, [actors]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
            <Network className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Ecosystem mapper</p>
            <p className="text-xs text-slate-600">Map actors, roles, and data flows around the platform.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={addActor}
          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          Add actor
        </button>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-2">
          {actors.map((actor) => (
            <div key={actor.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  value={actor.name}
                  onChange={(e) => updateActor(actor.id, { name: e.target.value })}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="Actor name"
                />
                <select
                  value={actor.role}
                  onChange={(e) => updateActor(actor.id, { role: e.target.value })}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.value}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeActor(actor.id)}
                  className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100"
                  aria-label={`Remove ${actor.name}`}
                >
                  Remove
                </button>
              </div>
              <input
                value={actor.flow}
                onChange={(e) => updateActor(actor.id, { flow: e.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Data or service flow"
              />
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role balance</p>
          <div className="mt-3 space-y-2 text-xs text-slate-700">
            {ROLE_OPTIONS.map((role) => (
              <div key={role.value} className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2">
                <p className="font-semibold text-slate-900">{role.value}</p>
                <p className="text-xs text-slate-600">{roleCounts[role.value]} actors</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-600">
            Healthy ecosystems balance producers, consumers, and governance so data sharing stays trusted.
          </p>
        </div>
      </div>
    </div>
  );
}
