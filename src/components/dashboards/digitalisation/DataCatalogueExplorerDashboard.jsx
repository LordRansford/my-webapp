"use client";

import { useMemo, useState } from "react";

const seed = [
  { name: "Customer profiles", domain: "Customer", owner: "CX Team", description: "Golden profiles with consent flags", quality: "High" },
  { name: "Orders", domain: "Commerce", owner: "Sales Ops", description: "Orders with line items and payment state", quality: "Medium" },
  { name: "Support tickets", domain: "Service", owner: "Support", description: "Tickets with SLA and channel metadata", quality: "Medium" },
];

export default function DataCatalogueExplorerDashboard() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("All");

  const items = useMemo(() => {
    return seed.filter((item) => {
      const matchDomain = domain === "All" || item.domain === domain;
      const matchQuery =
        !query ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());
      return matchDomain && matchQuery;
    });
  }, [query, domain]);

  const domains = ["All", ...new Set(seed.map((i) => i.domain))];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search catalogue..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        <select
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 md:w-48"
        >
          {domains.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.name} className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-600">{item.domain} · Owner: {item.owner}</p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-sm font-semibold ${
                  item.quality === "High"
                    ? "bg-emerald-100 text-emerald-700"
                    : item.quality === "Medium"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {item.quality}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-700">{item.description}</p>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-600">No catalogue entries match your filters yet.</p>}
      </div>
    </div>
  );
}
