"use client";

import { useState } from "react";

export default function StakeholderPersonaMapDashboard() {
  const [personas, setPersonas] = useState([
    { role: "Product manager", goals: "Ship features faster", fears: "Tech debt, slow approvals", type: "Internal" },
    { role: "Customer", goals: "Simple onboarding", fears: "Repetitive data entry", type: "External" },
  ]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        {personas.map((p, idx) => (
          <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">{p.role}</p>
              <span className="rounded-full bg-white px-2 py-1 text-sm font-semibold text-slate-700">{p.type}</span>
            </div>
            <p className="mt-2 text-xs text-slate-700">
              <span className="font-semibold text-slate-900">Goals:</span> {p.goals}
            </p>
            <p className="text-xs text-slate-700">
              <span className="font-semibold text-slate-900">Concerns:</span> {p.fears}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-slate-700">
        Balance gains and worries-design comms that speak to both.
      </div>
    </div>
  );
}

