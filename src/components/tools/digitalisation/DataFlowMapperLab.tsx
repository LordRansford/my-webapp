"use client";

import React, { useState } from "react";
import { GitBranch } from "lucide-react";

type DataItem = {
  id: number;
  name: string;
  source: string;
  destination: string;
  classification: "Public" | "Internal" | "Confidential" | "Highly confidential";
};

export function DataFlowMapperLab() {
  const [items, setItems] = useState<DataItem[]>([
    {
      id: 1,
      name: "Customer contact details",
      source: "Web form",
      destination: "CRM",
      classification: "Confidential",
    },
    {
      id: 2,
      name: "Meter readings",
      source: "Devices",
      destination: "Data platform",
      classification: "Internal",
    },
  ]);

  const addItem = () => {
    const nextId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems((prev) => [
      ...prev,
      {
        id: nextId,
        name: "New dataset",
        source: "",
        destination: "",
        classification: "Internal",
      },
    ]);
  };

  const updateItem = (id: number, patch: Partial<DataItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };

  const removeItem = (id: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const classificationColor = (c: DataItem["classification"]) => {
    switch (c) {
      case "Public":
        return "bg-emerald-50 text-emerald-800 border-emerald-100";
      case "Internal":
        return "bg-sky-50 text-sky-800 border-sky-100";
      case "Confidential":
        return "bg-amber-50 text-amber-800 border-amber-100";
      case "Highly confidential":
        return "bg-rose-50 text-rose-800 border-rose-100";
      default:
        return "bg-slate-50 text-slate-800 border-slate-100";
    }
  };

  return (
    <section
      aria-labelledby="data-flow-mapper-title"
      className="rounded-3xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 p-6 sm:p-8 space-y-6 transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(15,23,42,0.10)]"
    >
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
            <GitBranch className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <h2
              id="data-flow-mapper-title"
              className="text-lg sm:text-xl font-semibold text-slate-900"
            >
              Data flow and classification mapper
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Capture where key datasets come from, where they go and how sensitive
              they are. This gives you a simple view of flows before you draw
              complex process maps.
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-700">
            Data items and flows
          </p>
          <button
            type="button"
            onClick={addItem}
            className="text-xs rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            aria-label="Add item"
          >
            Add item
          </button>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-3 space-y-2 text-xs text-slate-700"
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    updateItem(item.id, { name: e.target.value })
                  }
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder="Dataset name"
                />
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-[11px] px-2 py-1 rounded-full text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Source system
                  </label>
                  <input
                    type="text"
                    value={item.source}
                    onChange={(e) =>
                      updateItem(item.id, { source: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Destination system
                  </label>
                  <input
                    type="text"
                    value={item.destination}
                    onChange={(e) =>
                      updateItem(item.id, { destination: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Classification
                  </label>
                  <select
                    value={item.classification}
                    onChange={(e) =>
                      updateItem(item.id, {
                        classification: e.target.value as DataItem["classification"],
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  >
                    <option>Public</option>
                    <option>Internal</option>
                    <option>Confidential</option>
                    <option>Highly confidential</option>
                  </select>
                </div>
                <div
                  className={`flex-1 rounded-xl border px-3 py-2 text-xs sm:text-[13px] font-medium ${classificationColor(
                    item.classification
                  )}`}
                >
                  <p className="font-semibold text-slate-900">{item.classification}</p>
                  <p className="text-xs text-slate-700">
                    Design controls so this level of data only flows through
                    appropriate systems.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-600">
          Once you have this list, you can see which systems handle the most
          sensitive data and where manual steps still exist.
        </p>
      </div>
    </section>
  );
}
