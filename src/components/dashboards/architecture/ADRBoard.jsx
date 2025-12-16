"use client";

import { useMemo, useState } from "react";

export function ADRBoard() {
  const [adrs, setAdrs] = useState([
    {
      id: 1,
      title: "Adopt event driven integration between billing and CRM",
      status: "Accepted",
      area: "Architecture",
    },
    {
      id: 2,
      title: "Use managed cloud database for transactional data",
      status: "Proposed",
      area: "Data",
    },
  ]);

  function updateADR(id, patch) {
    setAdrs((current) => current.map((adr) => (adr.id === id ? { ...adr, ...patch } : adr)));
  }

  function addADR() {
    const nextId = adrs.length ? Math.max(...adrs.map((a) => a.id)) + 1 : 1;
    setAdrs((current) => [
      ...current,
      {
        id: nextId,
        title: "",
        status: "Proposed",
        area: "Architecture",
      },
    ]);
  }

  function removeADR(id) {
    setAdrs((current) => current.filter((adr) => adr.id !== id));
  }

  const stats = useMemo(() => {
    const statusCounts = {
      Proposed: 0,
      Accepted: 0,
      Superseded: 0,
      Rejected: 0,
    };
    adrs.forEach((adr) => {
      statusCounts[adr.status] += 1;
    });

    return {
      total: adrs.length,
      statusCounts,
    };
  }, [adrs]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600">
        Architecture decision records keep important choices visible and explain why they were made. Use this board to sketch them
        while the system evolves.
      </p>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Decision records</p>
            <button
              type="button"
              onClick={addADR}
              className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800"
            >
              Add ADR
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {adrs.map((adr) => (
              <div key={adr.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3 shadow-sm">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <input
                    className="w-full rounded-xl border border-slate-200 px-2 py-1 text-sm font-semibold"
                    placeholder="Short statement of the decision"
                    value={adr.title}
                    onChange={(e) => updateADR(adr.id, { title: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => removeADR(adr.id)}
                    className="rounded-full px-2 py-1 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="text-xs text-slate-600">
                    Status
                    <select
                      className="mt-1 w-full rounded-xl border border-slate-200 px-2 py-1 text-xs"
                      value={adr.status}
                      onChange={(e) => updateADR(adr.id, { status: e.target.value })}
                    >
                      <option value="Proposed">Proposed</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Superseded">Superseded</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </label>

                  <label className="text-xs text-slate-600">
                    Area
                    <select
                      className="mt-1 w-full rounded-xl border border-slate-200 px-2 py-1 text-xs"
                      value={adr.area}
                      onChange={(e) => updateADR(adr.id, { area: e.target.value })}
                    >
                      <option value="Architecture">Architecture</option>
                      <option value="Security">Security</option>
                      <option value="Data">Data</option>
                      <option value="Operations">Operations</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Board summary</p>
            <p className="text-xs text-slate-700">
              Total ADRs: <span className="font-semibold">{stats.total}</span>
            </p>
            <p className="text-xs text-slate-700">
              Proposed: <span className="font-semibold">{stats.statusCounts.Proposed}</span>
            </p>
            <p className="text-xs text-slate-700">
              Accepted: <span className="font-semibold">{stats.statusCounts.Accepted}</span>
            </p>
            <p className="text-xs text-slate-700">
              Superseded: <span className="font-semibold">{stats.statusCounts.Superseded}</span>
            </p>
            <p className="text-xs text-slate-700">
              Rejected: <span className="font-semibold">{stats.statusCounts.Rejected}</span>
            </p>
            <p className="mt-2 text-xs text-slate-600">
              A healthy board usually has a small core of accepted decisions and a flow of proposed and superseded records that show
              evolution.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
            <p className="mb-1 font-medium">Prompts</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Which accepted decisions would be expensive to change today.</li>
              <li>Do you have major decisions that are not written down.</li>
              <li>Can new team members reconstruct the architecture story from these records.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
