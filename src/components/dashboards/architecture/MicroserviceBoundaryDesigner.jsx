"use client";

import { useMemo, useState } from "react";

const initialCapabilities = [
  { id: 1, name: "Customer onboarding", service: "Customer" },
  { id: 2, name: "Tariff management", service: "Pricing" },
  { id: 3, name: "Billing", service: "Billing" },
  { id: 4, name: "Meter data ingestion", service: "Metering" },
];

const suggestedServices = ["Customer", "Pricing", "Billing", "Metering", "Shared"];

export function MicroserviceBoundaryDesigner() {
  const [capabilities, setCapabilities] = useState(initialCapabilities);

  function assignService(id, service) {
    setCapabilities((current) => current.map((c) => (c.id === id ? { ...c, service } : c)));
  }

  const serviceMap = useMemo(() => {
    const map = new Map();
    for (const cap of capabilities) {
      const list = map.get(cap.service) ?? [];
      list.push(cap);
      map.set(cap.service, list);
    }
    return map;
  }, [capabilities]);

  const crossServiceInteractions = useMemo(() => {
    const nounToServices = new Map();

    for (const cap of capabilities) {
      const tokens = cap.name.toLowerCase().split(/\s+/);
      for (const token of tokens) {
        if (token.length < 4) continue;
        const set = nounToServices.get(token) ?? new Set();
        set.add(cap.service);
        nounToServices.set(token, set);
      }
    }

    let count = 0;
    nounToServices.forEach((services) => {
      if (services.size > 1) count += services.size - 1;
    });
    return count;
  }, [capabilities]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600">
        Slice a small set of capabilities into services. This does not tell you the one correct
        answer; it nudges you to notice where responsibilities clump together or where too many
        cross service conversations appear.
      </p>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-3 text-sm md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Capabilities</p>
          {capabilities.map((cap) => (
            <div
              key={cap.id}
              className="flex items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2"
            >
              <span className="text-sm text-slate-800">{cap.name}</span>
              <select
                className="rounded-xl border border-slate-200 px-2 py-1 text-xs"
                value={cap.service}
                onChange={(e) => assignService(cap.id, e.target.value)}
              >
                {suggestedServices.map((service) => (
                  <option key={service} value={service}>
                    {service} service
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Service view</p>
          <div className="grid gap-3 md:grid-cols-2">
            {Array.from(serviceMap.entries()).map(([service, caps]) => (
              <div
                key={service}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-3 shadow-sm"
              >
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {service} service
                </p>
                <ul className="list-disc pl-4 text-xs text-slate-700">
                  {caps.map((cap) => (
                    <li key={cap.id}>{cap.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
            <p className="mb-1 font-medium">Cross service interactions</p>
            <p className="mb-1">
              Estimated cross service conversations based on shared nouns in capability names:{" "}
              <span className="font-semibold">{crossServiceInteractions}</span>
            </p>
            <p>
              You ideally want clear boundaries where most capabilities for a concept live in the
              same service. If many services mention the same thing, such as customer or meter, you
              may be spreading the domain too thin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
