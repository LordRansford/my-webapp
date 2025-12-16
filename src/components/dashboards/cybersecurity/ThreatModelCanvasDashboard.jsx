"use client";

import React, { useState } from "react";
import { Plus, Trash2, Target, AlertTriangle } from "lucide-react";

export default function ThreatModelCanvasDashboard() {
  const [assets, setAssets] = useState(["Customer database", "Payment API"]);
  const [actors, setActors] = useState(["External attacker", "Insider"]);
  const [boundaries, setBoundaries] = useState(["Internet to DMZ", "DMZ to internal"]);
  const [threats, setThreats] = useState(["Data breach", "Unauthorized access"]);

  const addItem = (setter, current) => {
    setter([...current, ""]);
  };

  const updateItem = (setter, current, index, value) => {
    const updated = [...current];
    updated[index] = value;
    setter(updated);
  };

  const removeItem = (setter, current, index) => {
    setter(current.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-slate-950/80 p-4 text-slate-50 shadow-sm ring-1 ring-slate-800 md:flex-row md:p-5">
      {/* Left: canvas inputs */}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-slate-50">
            Threat model canvas
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            List assets, actors, trust boundaries and threats. This helps structure thinking about
            what could go wrong.
          </p>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-sky-400" />
              <label className="text-xs font-medium text-slate-200">Assets</label>
            </div>
            <button
              onClick={() => addItem(setAssets, assets)}
              className="rounded bg-sky-600 px-2 py-1 text-[0.65rem] font-medium text-white transition hover:bg-sky-700"
            >
              <Plus size={12} className="inline" />
            </button>
          </div>
          <div className="space-y-1">
            {assets.map((asset, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={asset}
                  onChange={(e) => updateItem(setAssets, assets, idx, e.target.value)}
                  placeholder="Asset name..."
                  className="flex-1 rounded border border-slate-700 bg-slate-950/80 px-2 py-1 text-[0.7rem] text-slate-50 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
                <button
                  onClick={() => removeItem(setAssets, assets, idx)}
                  className="rounded p-1 text-slate-400 transition hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-medium text-slate-200">Actors</label>
            <button
              onClick={() => addItem(setActors, actors)}
              className="rounded bg-sky-600 px-2 py-1 text-[0.65rem] font-medium text-white transition hover:bg-sky-700"
            >
              <Plus size={12} className="inline" />
            </button>
          </div>
          <div className="space-y-1">
            {actors.map((actor, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={actor}
                  onChange={(e) => updateItem(setActors, actors, idx, e.target.value)}
                  placeholder="Actor name..."
                  className="flex-1 rounded border border-slate-700 bg-slate-950/80 px-2 py-1 text-[0.7rem] text-slate-50 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
                <button
                  onClick={() => removeItem(setActors, actors, idx)}
                  className="rounded p-1 text-slate-400 transition hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-medium text-slate-200">Trust boundaries</label>
            <button
              onClick={() => addItem(setBoundaries, boundaries)}
              className="rounded bg-sky-600 px-2 py-1 text-[0.65rem] font-medium text-white transition hover:bg-sky-700"
            >
              <Plus size={12} className="inline" />
            </button>
          </div>
          <div className="space-y-1">
            {boundaries.map((boundary, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={boundary}
                  onChange={(e) => updateItem(setBoundaries, boundaries, idx, e.target.value)}
                  placeholder="Boundary description..."
                  className="flex-1 rounded border border-slate-700 bg-slate-950/80 px-2 py-1 text-[0.7rem] text-slate-50 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
                <button
                  onClick={() => removeItem(setBoundaries, boundaries, idx)}
                  className="rounded p-1 text-slate-400 transition hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-orange-400" />
              <label className="text-xs font-medium text-slate-200">Threats</label>
            </div>
            <button
              onClick={() => addItem(setThreats, threats)}
              className="rounded bg-sky-600 px-2 py-1 text-[0.65rem] font-medium text-white transition hover:bg-sky-700"
            >
              <Plus size={12} className="inline" />
            </button>
          </div>
          <div className="space-y-1">
            {threats.map((threat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={threat}
                  onChange={(e) => updateItem(setThreats, threats, idx, e.target.value)}
                  placeholder="Threat description..."
                  className="flex-1 rounded border border-slate-700 bg-slate-950/80 px-2 py-1 text-[0.7rem] text-slate-50 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
                <button
                  onClick={() => removeItem(setThreats, threats, idx)}
                  className="rounded p-1 text-slate-400 transition hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: summary */}
      <div className="flex w-full max-w-xs flex-col gap-4 md:max-w-sm">
        <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
          <h4 className="mb-3 text-xs font-semibold text-slate-100">Threat model summary</h4>
          <div className="space-y-3 text-xs">
            <div>
              <div className="mb-1 font-medium text-slate-300">Assets to protect</div>
              <div className="text-[0.7rem] text-slate-400">
                {assets.filter(Boolean).join(", ") || "None listed"}
              </div>
            </div>
            <div>
              <div className="mb-1 font-medium text-slate-300">Potential actors</div>
              <div className="text-[0.7rem] text-slate-400">
                {actors.filter(Boolean).join(", ") || "None listed"}
              </div>
            </div>
            <div>
              <div className="mb-1 font-medium text-slate-300">Trust boundaries</div>
              <div className="text-[0.7rem] text-slate-400">
                {boundaries.filter(Boolean).join(", ") || "None listed"}
              </div>
            </div>
            <div>
              <div className="mb-1 font-medium text-slate-300">Identified threats</div>
              <div className="text-[0.7rem] text-slate-400">
                {threats.filter(Boolean).join(", ") || "None listed"}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/80 p-3 text-xs text-slate-200 ring-1 ring-slate-800">
          <p className="font-semibold text-sky-200">Next steps</p>
          <p className="mt-1 text-[0.7rem] text-slate-300">
            Use this threat model to guide control choices, architecture decisions and testing
            priorities. Review it when the system changes.
          </p>
        </div>
      </div>
    </div>
  );
}

