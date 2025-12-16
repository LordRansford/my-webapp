"use client";

import { useMemo, useState } from "react";

export function SecurityZoneDesigner() {
  const [zones, setZones] = useState([
    { id: 1, name: "Internet", trustLevel: "Public", exposedPorts: 0 },
    { id: 2, name: "DMZ", trustLevel: "Partner", exposedPorts: 4 },
    { id: 3, name: "Application", trustLevel: "Internal", exposedPorts: 2 },
    { id: 4, name: "Data", trustLevel: "Restricted", exposedPorts: 1 },
  ]);

  function updateZone(id, patch) {
    setZones((current) => current.map((z) => (z.id === id ? { ...z, ...patch } : z)));
  }

  function addZone() {
    const nextId = zones.length ? Math.max(...zones.map((z) => z.id)) + 1 : 1;
    setZones((current) => [...current, { id: nextId, name: "", trustLevel: "Internal", exposedPorts: 1 }]);
  }

  function removeZone(id) {
    setZones((current) => current.filter((z) => z.id !== id));
  }

  const stats = useMemo(() => {
    const publicLike = zones.filter((z) => z.trustLevel === "Public" || z.trustLevel === "Partner");
    const restrictedZones = zones.filter((z) => z.trustLevel === "Restricted");
    const totalExposedPorts = zones.reduce((sum, z) => sum + z.exposedPorts, 0);

    return {
      publicLikeCount: publicLike.length,
      restrictedZonesCount: restrictedZones.length,
      totalExposedPorts,
    };
  }, [zones]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600">
        Sketch your security zones to highlight where trust changes, where ports are exposed, and where stricter controls or
        monitoring may be needed.
      </p>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Zones</p>
            <button
              type="button"
              onClick={addZone}
              className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800"
            >
              Add zone
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {zones.map((zone) => (
              <div key={zone.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3 shadow-sm">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <input
                    className="w-full rounded-xl border border-slate-200 px-2 py-1 text-sm font-semibold"
                    placeholder="For example Partner integration layer"
                    value={zone.name}
                    onChange={(e) => updateZone(zone.id, { name: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => removeZone(zone.id)}
                    className="rounded-full px-2 py-1 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <label className="text-xs text-slate-600">
                    Trust level
                    <select
                      className="mt-1 w-full rounded-xl border border-slate-200 px-2 py-1 text-xs"
                      value={zone.trustLevel}
                      onChange={(e) => updateZone(zone.id, { trustLevel: e.target.value })}
                    >
                      <option value="Public">Public</option>
                      <option value="Partner">Partner</option>
                      <option value="Internal">Internal</option>
                      <option value="Restricted">Restricted</option>
                    </select>
                  </label>

                  <label className="text-xs text-slate-600">
                    Exposed ports or endpoints
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={zone.exposedPorts}
                      onChange={(e) => updateZone(zone.id, { exposedPorts: Number(e.target.value) || 0 })}
                      className="mt-1 w-full"
                    />
                    <span className="mt-1 inline-block text-xs text-slate-700">
                      {zone.exposedPorts} exposed port{zone.exposedPorts === 1 ? "" : "s"}
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Boundary view</p>
            <p className="text-xs text-slate-700">
              Public or partner facing zones: <span className="font-semibold">{stats.publicLikeCount}</span>
            </p>
            <p className="text-xs text-slate-700">
              Restricted zones: <span className="font-semibold">{stats.restrictedZonesCount}</span>
            </p>
            <p className="text-xs text-slate-700">
              Total exposed ports or endpoints: <span className="font-semibold">{stats.totalExposedPorts}</span>
            </p>
            <p className="mt-2 text-xs text-slate-600">
              Many exposed ports in higher trust zones often point to weak boundaries. Centralise access and tighten network policy
              where possible.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
            <p className="mb-1 font-medium">Prompts</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Is there a clear path from public traffic to your most sensitive data.</li>
              <li>Which zones need extra monitoring or intrusion detection.</li>
              <li>Are any services in a more trusted zone than they need to be.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
