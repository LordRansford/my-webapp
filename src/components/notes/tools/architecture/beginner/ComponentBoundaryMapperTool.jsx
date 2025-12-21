"use client";

import { useMemo, useState } from "react";

const SYSTEMS = [
  {
    id: "clinic",
    name: "Small clinic booking system",
    description:
      "Patients book appointments, clinicians view schedules, payments are taken for some services, and email reminders are sent.",
    splits: [
      { title: "Scheduling", why: "Owns appointments and availability. Central domain concept." },
      { title: "Patient records", why: "Owns patient contact details and preferences. Sensitive data boundary." },
      { title: "Payments", why: "Owns payment attempts and refunds. Isolated risk and compliance concerns." },
      { title: "Notifications", why: "Owns email and SMS sending. Failure should not break booking." },
    ],
  },
  {
    id: "shop",
    name: "Online shop checkout",
    description:
      "Users browse products, add to cart, place orders, pay, and receive shipping updates. Support staff can cancel or refund.",
    splits: [
      { title: "Catalog", why: "Owns product data and search. Read heavy boundary." },
      { title: "Orders", why: "Owns order state and lifecycle. Source of truth for order status." },
      { title: "Payments", why: "Owns payment attempts. Strong auditing and idempotency needs." },
      { title: "Shipping", why: "Owns delivery updates. Integrates with carriers." },
    ],
  },
] ;

export default function ComponentBoundaryMapperTool() {
  const [systemId, setSystemId] = useState(SYSTEMS[0].id);

  const system = useMemo(() => SYSTEMS.find((s) => s.id === systemId) || SYSTEMS[0], [systemId]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-700">
        Practice decomposing a system into components. The skill is naming boundaries so responsibilities and ownership
        are clear.
      </p>

      <label className="block space-y-1">
        <span className="text-sm font-semibold text-slate-800">Sample system</span>
        <select
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          value={systemId}
          onChange={(e) => setSystemId(e.target.value)}
        >
          {SYSTEMS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">{system.name}</p>
        <p className="mt-2 text-sm text-slate-700">{system.description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {system.splits.map((c) => (
          <div key={c.title} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">{c.title}</p>
            <p className="mt-2 text-sm text-slate-700">{c.why}</p>
            <p className="mt-2 text-xs text-slate-600">
              Interface prompt: what are the 2 to 3 operations other parts are allowed to call here
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}


