"use client";

import { useState } from "react";

const storeOptions = [
  "Relational database",
  "Document store",
  "Column store",
  "Time series database",
  "Object storage",
];

function recommendedStore(kind) {
  switch (kind) {
    case "Transactional":
      return "Relational database";
    case "Analytical":
      return "Column store";
    case "Reference":
      return "Relational database";
    case "Time series":
      return "Time series database";
    case "Log":
      return "Object storage";
    default:
      return "Relational database";
  }
}

export function DataStoragePlanner() {
  const [rows, setRows] = useState([
    {
      id: 1,
      name: "Customer accounts",
      kind: "Transactional",
      chosenStore: "Relational database",
    },
    {
      id: 2,
      name: "Meter readings",
      kind: "Time series",
      chosenStore: "Time series database",
    },
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
        kind: "Transactional",
        chosenStore: "Relational database",
      },
    ]);
  }

  function removeRow(id) {
    setRows((current) => current.filter((r) => r.id !== id));
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600">
        Not all data has the same shape or access pattern. This planner helps you practise matching
        a data set to a storage option. It is intentionally opinionated but not strict. The point is
        to think about why a match feels good or bad.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-3 text-sm">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="text-left">Data set</th>
              <th className="text-left">Kind</th>
              <th className="text-left">Chosen store</th>
              <th className="text-left">Recommendation</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const rec = recommendedStore(row.kind);
              const match = row.chosenStore === rec;
              return (
                <tr key={row.id} className="align-middle">
                  <td className="pr-2">
                    <input
                      className="w-full rounded-xl border border-slate-200 px-2 py-1 text-sm"
                      placeholder="For example Asset register"
                      value={row.name}
                      onChange={(e) => updateRow(row.id, { name: e.target.value })}
                    />
                  </td>
                  <td className="pr-2">
                    <select
                      className="w-full rounded-xl border border-slate-200 px-2 py-1 text-sm"
                      value={row.kind}
                      onChange={(e) => updateRow(row.id, { kind: e.target.value, chosenStore: rec })}
                    >
                      <option value="Transactional">Transactional</option>
                      <option value="Analytical">Analytical</option>
                      <option value="Reference">Reference</option>
                      <option value="Time series">Time series</option>
                      <option value="Log">Log</option>
                    </select>
                  </td>
                  <td className="pr-2">
                    <select
                      className="w-full rounded-xl border border-slate-200 px-2 py-1 text-sm"
                      value={row.chosenStore}
                      onChange={(e) => updateRow(row.id, { chosenStore: e.target.value })}
                    >
                      {storeOptions.map((store) => (
                        <option key={store}>{store}</option>
                      ))}
                    </select>
                  </td>
                  <td className="pr-2">
                    <span
                      className={
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " +
                        (match ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800")
                      }
                    >
                      {match ? "Good fit" : `Suggested: ${rec}`}
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
          Add data set
        </button>
      </div>

      <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
        <p className="mb-1 font-medium">Things to notice</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Transactional data usually needs strong consistency and clear transactions.</li>
          <li>Analytical data is often read heavy and can be optimised for scanning not updates.</li>
          <li>Time series data benefits from stores that understand time based access patterns.</li>
        </ul>
      </div>
    </div>
  );
}
