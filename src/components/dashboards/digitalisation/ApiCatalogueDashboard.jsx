"use client";

import { useMemo, useState } from "react";

const seed = [
  { path: "/api/customers", method: "GET", domain: "Customer", owner: "CX", stability: "Stable" },
  { path: "/api/orders", method: "POST", domain: "Commerce", owner: "Sales", stability: "Caution" },
  { path: "/api/payments", method: "GET", domain: "Finance", owner: "Payments", stability: "Stable" },
];

export default function ApiCatalogueDashboard() {
  const [domain, setDomain] = useState("All");
  const [owner, setOwner] = useState("All");

  const filtered = useMemo(() => {
    return seed.filter((item) => {
      const dOk = domain === "All" || item.domain === domain;
      const oOk = owner === "All" || item.owner === owner;
      return dOk && oOk;
    });
  }, [domain, owner]);

  const domains = ["All", ...new Set(seed.map((i) => i.domain))];
  const owners = ["All", ...new Set(seed.map((i) => i.owner))];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row">
        <select
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 md:w-48"
        >
          {domains.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 md:w-48"
        >
          {owners.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 space-y-2">
        {filtered.map((api) => (
          <div key={api.path} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
            <div>
              <p className="font-semibold text-slate-900">
                {api.method} {api.path}
              </p>
              <p className="text-xs text-slate-600">
                {api.domain} · Owner: {api.owner}
              </p>
            </div>
            <span
              className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                api.stability === "Stable" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              {api.stability}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
