"use client";

import React, { useMemo, useState } from "react";
import { Server, Shield } from "lucide-react";

const COMMON_PORTS = [
  { port: 22, service: "SSH", default: true },
  { port: 80, service: "HTTP", default: true },
  { port: 443, service: "HTTPS", default: true },
  { port: 3306, service: "MySQL", default: false },
  { port: 5432, service: "PostgreSQL", default: false },
  { port: 8080, service: "HTTP Alt", default: false },
];

export default function PortSurfaceConceptDashboard() {
  const [openPorts, setOpenPorts] = useState(new Set([22, 80, 443]));

  const togglePort = (port) => {
    const newSet = new Set(openPorts);
    if (newSet.has(port)) {
      newSet.delete(port);
    } else {
      newSet.add(port);
    }
    setOpenPorts(newSet);
  };

  const surfaceSize = useMemo(() => {
    return openPorts.size;
  }, [openPorts]);

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-slate-950/80 p-4 text-slate-50 shadow-sm ring-1 ring-slate-800 md:flex-row md:p-5">
      {/* Left: controls */}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-slate-50">
            Port and service surface
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            Toggle ports on and off to see how the attack surface changes. Each open port is a
            potential entry point that needs to be defended.
          </p>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <label className="mb-3 block text-xs font-medium text-slate-200">Ports and services</label>
          <div className="space-y-2">
            {COMMON_PORTS.map((item) => {
              const isOpen = openPorts.has(item.port);
              return (
                <label
                  key={item.port}
                  className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/80 p-2 transition hover:bg-slate-800/50"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isOpen}
                      onChange={() => togglePort(item.port)}
                      className="rounded border-slate-600 bg-slate-800 text-sky-400 focus:ring-sky-400"
                    />
                    <div>
                      <span className="text-xs font-medium text-slate-100">
                        Port {item.port}
                      </span>
                      <span className="ml-2 text-xs text-slate-400">{item.service}</span>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${
                      isOpen
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {isOpen ? "Open" : "Closed"}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: visual */}
      <div className="flex w-full max-w-xs flex-col gap-4 md:max-w-sm">
        <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
          <div className="mb-4 flex items-center gap-2">
            <Server size={18} className="text-sky-400" />
            <h4 className="text-xs font-semibold text-slate-100">Host surface</h4>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-4">
            <div className="mb-3 text-center">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full border-2 border-slate-600 bg-slate-800">
                <Server size={24} className="text-slate-500" />
              </div>
              <div className="text-xs font-medium text-slate-300">Host</div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from(openPorts).map((port) => {
                const service = COMMON_PORTS.find((p) => p.port === port)?.service || "Service";
                return (
                  <div
                    key={port}
                    className="rounded-lg border border-sky-500/50 bg-sky-500/20 px-2 py-1"
                  >
                    <div className="text-[0.65rem] font-medium text-sky-300">{port}</div>
                    <div className="text-[0.6rem] text-sky-400">{service}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
          <div className="mb-3 flex items-center gap-2">
            <Shield size={18} className="text-purple-400" />
            <h4 className="text-xs font-semibold text-slate-100">Surface analysis</h4>
          </div>
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-slate-400">Open ports</span>
                <span className="font-semibold text-slate-100">{surfaceSize}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-purple-400 transition-all duration-500"
                  style={{ width: `${(surfaceSize / COMMON_PORTS.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-2 text-[0.7rem] text-slate-300">
              {surfaceSize === 0 ? (
                <p>All ports closed. Minimal attack surface, but no services available.</p>
              ) : surfaceSize <= 2 ? (
                <p>Small surface. Only essential services exposed. Good practice.</p>
              ) : surfaceSize <= 4 ? (
                <p>Moderate surface. Consider if all services are necessary.</p>
              ) : (
                <p>Large surface. Each open port needs monitoring and hardening.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

