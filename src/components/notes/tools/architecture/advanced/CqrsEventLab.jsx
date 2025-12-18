"use client";

import { useState } from "react";
import { Play, Repeat, Database, ListChecks } from "lucide-react";

const SCENARIOS = [
  {
    id: "order",
    title: "Place order",
    command: "PlaceOrder",
    events: ["OrderPlaced", "InventoryReserved", "PaymentCaptured"],
    readModel: "Order summary with status and totals.",
  },
  {
    id: "customer",
    title: "Update customer address",
    command: "UpdateAddress",
    events: ["AddressUpdated", "BillingProfileRefreshed"],
    readModel: "Customer profile and billing view.",
  },
];

export default function CqrsEventLab() {
  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [ran, setRan] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
          <Repeat className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">CQRS and events lab</p>
          <p className="text-xs text-slate-600">Run a command and watch the events and read model update.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {SCENARIOS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setScenario(item);
              setRan(false);
            }}
            className={`rounded-2xl border p-3 text-left text-xs font-semibold transition ${
              scenario.id === item.id
                ? "border-indigo-200 bg-white shadow-sm ring-1 ring-indigo-100"
                : "border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white"
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-700">Command</div>
          <button
            type="button"
            onClick={() => setRan(true)}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Play className="h-3 w-3" aria-hidden="true" />
            Run command
          </button>
        </div>
        <p className="mt-2 text-sm font-semibold text-slate-900">{scenario.command}</p>
        <p className="mt-1 text-xs text-slate-600">
          Commands change state. Queries read from a separate model for speed.
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Database className="h-4 w-4" aria-hidden="true" />
              Event stream
            </div>
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              {scenario.events.map((event) => (
                <li key={event} className={ran ? "text-slate-700" : "text-slate-400"}>
                  {ran ? event : "Waiting"}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <ListChecks className="h-4 w-4" aria-hidden="true" />
              Read model
            </div>
            <p className="mt-2 text-xs text-slate-600">
              {ran ? scenario.readModel : "Read model updates after events project."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
