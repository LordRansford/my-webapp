"use client";

import { useState } from "react";

const allLayers = ["Presentation", "Domain", "Integration", "Data"];

export function SystemLandscapeCanvas() {
  const [rows, setRows] = useState([
    { id: 1, name: "Web app", layer: "Presentation", talksTo: "Domain" },
    { id: 2, name: "Domain service", layer: "Domain", talksTo: "Data" },
  ]);

  function updateRow(id, patch) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function addRow() {
    const nextId = rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
    setRows((current) => [
      ...current,
      {
        id: nextId,
        name: "",
        layer: "Presentation",
        talksTo: "Domain",
      },
    ]);
  }

  function removeRow(id) {
    setRows((current) => current.filter((row) => row.id !== id));
  }

  function isViolation(row) {
    if (row.layer === "Presentation" && row.talksTo === "Data") return true;
    if (row.layer === "Data" && (row.talksTo === "Domain" || row.talksTo === "Presentation")) {
      return true;
    }
    return false;
  }

  const violationCount = rows.filter(isViolation).length;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600">
        List a few key components, place them in layers and describe which layer they talk to most
        often. The simple rules below highlight obvious layering problems.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-3 text-sm">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="text-left">Component</th>
              <th className="text-left">Layer</th>
              <th className="text-left">Primarily talks to</th>
              <th className="text-left">Health</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const violation = isViolation(row);
              return (
                <tr key={row.id} className="align-middle">
                  <td className="pr-2">
                    <input
                      className="w-full rounded-xl border border-slate-200 px-2 py-1 text-sm"
                      placeholder="Web app, API gateway, pricing service"
                      value={row.name}
                      onChange={(e) => updateRow(row.id, { name: e.target.value })}
                    />
                  </td>
                  <td className="pr-2">
                    <select
                      className="w-full rounded-xl border border-slate-200 px-2 py-1 text-sm"
                      value={row.layer}
                      onChange={(e) => updateRow(row.id, { layer: e.target.value })}
                    >
                      {allLayers.map((layer) => (
                        <option key={layer}>{layer}</option>
                      ))}
                    </select>
                  </td>
                  <td className="pr-2">
                    <select
                      className="w-full rounded-xl border border-slate-200 px-2 py-1 text-sm"
                      value={row.talksTo}
                      onChange={(e) => updateRow(row.id, { talksTo: e.target.value })}
                    >
                      {allLayers.map((layer) => (
                        <option key={layer}>{layer}</option>
                      ))}
                    </select>
                  </td>
                  <td className="pr-2">
                    <span
                      className={
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " +
                        (violation ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700")
                      }
                    >
                      {violation ? "Layering risk" : "Looks sensible"}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
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
          onClick={addRow}
          className="mt-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800"
        >
          Add component
        </button>
      </div>

      <div className="grid gap-2 rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
        <p className="font-medium">Hints</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Keep presentation logic out of the data layer.</li>
          <li>Domain logic should not depend directly on user interface details.</li>
          <li>
            If many components talk straight to the data layer, consider adding a clearer domain
            layer.
          </li>
        </ul>
        <p className="text-slate-600">
          Current obvious violations detected: <span className="font-semibold">{violationCount}</span>
        </p>
      </div>
    </div>
  );
}
