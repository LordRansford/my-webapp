"use client";

import { useMemo, useState } from "react";

export function CouplingCohesionVisualizer() {
  const [modules, setModules] = useState([
    { id: 1, name: "PricingEngine", incoming: 5, outgoing: 6, responsibilities: 5 },
    { id: 2, name: "BillingService", incoming: 3, outgoing: 2, responsibilities: 3 },
  ]);

  function updateModule(id, patch) {
    setModules((current) => current.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  function addModule() {
    const nextId = modules.length ? Math.max(...modules.map((m) => m.id)) + 1 : 1;
    setModules((current) => [
      ...current,
      { id: nextId, name: "", incoming: 0, outgoing: 0, responsibilities: 1 },
    ]);
  }

  function removeModule(id) {
    setModules((current) => current.filter((m) => m.id !== id));
  }

  function score(m) {
    const coupling = m.incoming + m.outgoing;
    const cohesion = m.responsibilities;
    const risk = coupling + cohesion;

    if (risk >= 15) return { label: "High risk god module", tone: "bg-rose-50 text-rose-700" };
    if (risk >= 8) return { label: "Needs attention", tone: "bg-amber-50 text-amber-800" };
    return { label: "Looks manageable", tone: "bg-emerald-50 text-emerald-700" };
  }

  const worstModule = useMemo(
    () =>
      modules.length
        ? modules.reduce((worst, m) =>
            m.incoming + m.outgoing + m.responsibilities >
            worst.incoming + worst.outgoing + worst.responsibilities
              ? m
              : worst,
          )
        : null,
    [modules],
  );

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600">
        This tool gives you a feel for coupling and cohesion. It is deliberately approximate. The aim is
        not a perfect metric. The aim is to notice when one module is absorbing too many responsibilities
        and dependencies.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-3 text-sm">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="text-left">Module</th>
              <th className="text-left">Incoming deps</th>
              <th className="text-left">Outgoing deps</th>
              <th className="text-left">Responsibilities</th>
              <th className="text-left">Assessment</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {modules.map((m) => {
              const s = score(m);
              return (
                <tr key={m.id} className="align-middle">
                  <td className="pr-2">
                    <input
                      className="w-full rounded-xl border border-slate-200 px-2 py-1 text-sm"
                      placeholder="Module name"
                      value={m.name}
                      onChange={(e) => updateModule(m.id, { name: e.target.value })}
                    />
                  </td>
                  <td className="pr-2">
                    <input
                      type="number"
                      min={0}
                      className="w-full rounded-xl border border-slate-200 px-2 py-1 text-sm"
                      value={m.incoming}
                      onChange={(e) => updateModule(m.id, { incoming: Number(e.target.value) || 0 })}
                    />
                  </td>
                  <td className="pr-2">
                    <input
                      type="number"
                      min={0}
                      className="w-full rounded-xl border border-slate-200 px-2 py-1 text-sm"
                      value={m.outgoing}
                      onChange={(e) => updateModule(m.id, { outgoing: Number(e.target.value) || 0 })}
                    />
                  </td>
                  <td className="pr-2">
                    <input
                      type="number"
                      min={1}
                      className="w-full rounded-xl border border-slate-200 px-2 py-1 text-sm"
                      value={m.responsibilities}
                      onChange={(e) =>
                        updateModule(m.id, {
                          responsibilities: Math.max(1, Number(e.target.value) || 1),
                        })
                      }
                    />
                  </td>
                  <td className="pr-2">
                    <span
                      className={
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " +
                        s.tone
                      }
                    >
                      {s.label}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => removeModule(m.id)}
                      className="rounded-full px-2 py-1 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button
          type="button"
          onClick={addModule}
          className="mt-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800"
        >
          Add module
        </button>
      </div>

      <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
        <p className="mb-1 font-medium">How to read this</p>
        <p className="mb-1">
          Incoming dependencies increase the cost of change. Outgoing dependencies increase the risk of ripple effects. Responsibilities act as a rough stand in for cohesion. Very high values in all three fields suggest a god module.
        </p>
        {worstModule && (
          <p className="mt-1">
            The current highest risk module is{" "}
            <span className="font-semibold">{worstModule.name || "Unnamed module"}</span>. Try
            reducing either its dependencies or its responsibilities and see how the assessment changes.
          </p>
        )}
      </div>
    </div>
  );
}
