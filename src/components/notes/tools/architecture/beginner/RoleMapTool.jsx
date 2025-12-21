"use client";

import { useMemo, useState } from "react";
import { Users, ShieldCheck, TestTube2, Wrench, LineChart, Code2 } from "lucide-react";

const ROLE_OPTIONS = [
  { id: "product", name: "Product", icon: LineChart },
  { id: "dev", name: "Developer", icon: Code2 },
  { id: "test", name: "Tester", icon: TestTube2 },
  { id: "devops", name: "DevOps", icon: Wrench },
  { id: "security", name: "Security", icon: ShieldCheck },
];

const STATUS_OPTIONS = [
  { value: "owned", label: "Owned", tone: "bg-emerald-50 text-emerald-700" },
  { value: "shared", label: "Shared", tone: "bg-amber-50 text-amber-700" },
  { value: "missing", label: "Gap", tone: "bg-rose-50 text-rose-700" },
];

export default function RoleMapTool() {
  const [roles, setRoles] = useState(
    ROLE_OPTIONS.map((role) => ({ ...role, status: "owned" }))
  );

  const updateRole = (id, status) => {
    setRoles((prev) => prev.map((role) => (role.id === id ? { ...role, status } : role)));
  };

  const summary = useMemo(() => {
    return STATUS_OPTIONS.reduce((acc, option) => {
      acc[option.value] = roles.filter((role) => role.status === option.value).length;
      return acc;
    }, {});
  }, [roles]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
          <Users className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Role map</p>
          <p className="text-xs text-slate-600">Mark who owns each role and spot the gaps.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {roles.map((role) => {
          const Icon = role.icon;
          const statusTone =
            STATUS_OPTIONS.find((option) => option.value === role.status)?.tone ||
            "bg-slate-100 text-slate-700";
          return (
            <div key={role.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-600">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {role.name}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateRole(role.id, option.value)}
                    aria-pressed={role.status === option.value}
                    className={`rounded-full border px-2.5 py-1 font-semibold ${
                      role.status === option.value
                        ? `${option.tone} border-transparent`
                        : "border-slate-200 bg-white text-slate-500"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-sm font-semibold ${statusTone}`}>
                {role.status}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3 text-xs text-slate-700">
        {STATUS_OPTIONS.map((option) => (
          <div key={option.value} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
            <p className="font-semibold text-slate-900">{option.label}</p>
            <p className="text-xs text-slate-600">{summary[option.value]} roles</p>
          </div>
        ))}
      </div>
    </div>
  );
}
