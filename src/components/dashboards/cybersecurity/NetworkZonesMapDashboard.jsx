"use client";

import React, { useState } from "react";
import { Network, Shield } from "lucide-react";

const ZONES = [
  { id: "internet", label: "Internet", color: "red" },
  { id: "dmz", label: "DMZ", color: "orange" },
  { id: "internal", label: "Internal", color: "green" },
  { id: "secure", label: "Secure", color: "blue" },
];

const SYSTEMS = [
  { id: 1, name: "Web Server", zone: "dmz" },
  { id: 2, name: "Database", zone: "secure" },
  { id: 3, name: "API Gateway", zone: "dmz" },
  { id: 4, name: "User Workstation", zone: "internal" },
];

const ALLOWED_FLOWS = [
  { from: "internet", to: "dmz", allowed: true },
  { from: "dmz", to: "internal", allowed: false },
  { from: "dmz", to: "secure", allowed: true },
  { from: "internal", to: "secure", allowed: true },
];

export default function NetworkZonesMapDashboard() {
  const [systems, setSystems] = useState(SYSTEMS);

  const moveSystem = (systemId, newZone) => {
    setSystems(systems.map((s) => (s.id === systemId ? { ...s, zone: newZone } : s)));
  };

  const getZoneColor = (zoneId) => {
    const zone = ZONES.find((z) => z.id === zoneId);
    const colors = {
      red: "border-red-500/50 bg-red-500/10",
      orange: "border-orange-500/50 bg-orange-500/10",
      green: "border-green-500/50 bg-green-500/10",
      blue: "border-blue-500/50 bg-blue-500/10",
    };
    return colors[zone?.color] || "border-slate-700 bg-slate-800";
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-slate-950/80 p-4 text-slate-50 shadow-sm ring-1 ring-slate-800 md:flex-row md:p-5">
      {/* Left: zones */}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-slate-50">
            Network zones map
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            Arrange systems into zones and see where traffic is allowed. This is a simplified view
            of network segmentation.
          </p>
        </div>

        <div className="space-y-3">
          {ZONES.map((zone) => {
            const zoneSystems = systems.filter((s) => s.zone === zone.id);
            return (
              <div
                key={zone.id}
                className={`rounded-xl border p-3 ring-1 ring-slate-800 ${getZoneColor(zone.id)}`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-100">{zone.label}</h4>
                  <span className="text-[0.65rem] text-slate-400">
                    {zoneSystems.length} system{zoneSystems.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="space-y-1">
                  {zoneSystems.map((system) => (
                    <div
                      key={system.id}
                      className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/80 p-2"
                    >
                      <span className="text-xs text-slate-200">{system.name}</span>
                      <select
                        value={system.zone}
                        onChange={(e) => moveSystem(system.id, e.target.value)}
                        className="rounded border border-slate-600 bg-slate-800 px-2 py-0.5 text-[0.65rem] text-slate-200 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                      >
                        {ZONES.map((z) => (
                          <option key={z.id} value={z.id}>
                            {z.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: flow map */}
      <div className="flex w-full max-w-xs flex-col gap-4 md:max-w-sm">
        <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
          <div className="mb-4 flex items-center gap-2">
            <Network size={18} className="text-sky-400" />
            <h4 className="text-xs font-semibold text-slate-100">Allowed flows</h4>
          </div>
          <div className="space-y-2">
            {ALLOWED_FLOWS.map((flow, idx) => {
              const fromZone = ZONES.find((z) => z.id === flow.from);
              const toZone = ZONES.find((z) => z.id === flow.to);
              return (
                <div key={idx} className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/80 p-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.7rem] text-slate-300">{fromZone?.label}</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-[0.7rem] text-slate-300">{toZone?.label}</span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${
                      flow.allowed
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {flow.allowed ? "Allowed" : "Blocked"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/80 p-3 text-xs text-slate-200 ring-1 ring-slate-800">
          <div className="mb-2 flex items-center gap-2">
            <Shield size={16} className="text-purple-400" />
            <p className="font-semibold text-sky-200">Zone principles</p>
          </div>
          <ul className="mt-1 space-y-1 text-[0.7rem] text-slate-300">
            <li>• Internet has no direct access to internal zones</li>
            <li>• DMZ acts as a buffer between internet and internal</li>
            <li>• Secure zones contain high value assets</li>
            <li>• Firewalls enforce flow rules between zones</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

