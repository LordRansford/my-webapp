"use client";

import { useMemo } from "react";
import { wizardCopy } from "@/lib/architecture-diagrams/copy/audience";

const containerTypes = [
  { value: "ui", label: "UI" },
  { value: "api", label: "API" },
  { value: "worker", label: "Worker" },
  { value: "database", label: "Database" },
  { value: "third-party", label: "Third party" },
];

function SoftWarning({ children }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
      <p className="font-semibold">Tip</p>
      <p className="mt-1">{children}</p>
    </div>
  );
}

function RowActions({ onRemove, removeLabel = "Remove" }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="rounded-full border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-800 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2"
    >
      {removeLabel}
    </button>
  );
}

export default function StepBuildingBlocks({ audience = "students", users, externalSystems, containers, onChange, errors = [] }) {
  const copy = wizardCopy(audience);
  const title = "Building blocks";
  const hasNothing = useMemo(() => users.length === 0 && externalSystems.length === 0 && containers.length === 0, [containers.length, externalSystems.length, users.length]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-700">{copy.containersIntro}</p>
        <p className="mt-2 text-xs text-slate-600">{copy.containersHelp}</p>
      </div>

      {hasNothing ? <SoftWarning>Add at least one user, external system, or container to make the diagrams useful.</SoftWarning> : null}

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-900">Users</p>
          <button
            type="button"
            onClick={() => onChange({ users: [...users, { name: "" }] })}
            className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Add user
          </button>
        </div>
        <div className="space-y-2">
          {users.length === 0 ? <p className="text-xs text-slate-600">No users yet.</p> : null}
          {users.map((u, idx) => (
            <div key={`user-${idx}`} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center">
              <input
                value={u.name}
                onChange={(e) => {
                  const next = [...users];
                  next[idx] = { ...next[idx], name: e.target.value };
                  onChange({ users: next });
                }}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Customer"
                aria-label={`User ${idx + 1} name`}
              />
              <RowActions
                onRemove={() => {
                  const next = users.filter((_, i) => i !== idx);
                  onChange({ users: next });
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-900">External systems</p>
          <button
            type="button"
            onClick={() => onChange({ externalSystems: [...externalSystems, { name: "" }] })}
            className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Add external system
          </button>
        </div>
        <div className="space-y-2">
          {externalSystems.length === 0 ? <p className="text-xs text-slate-600">No external systems yet.</p> : null}
          {externalSystems.map((s, idx) => (
            <div key={`ext-${idx}`} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center">
              <input
                value={s.name}
                onChange={(e) => {
                  const next = [...externalSystems];
                  next[idx] = { ...next[idx], name: e.target.value };
                  onChange({ externalSystems: next });
                }}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Payment provider"
                aria-label={`External system ${idx + 1} name`}
              />
              <RowActions
                onRemove={() => {
                  const next = externalSystems.filter((_, i) => i !== idx);
                  onChange({ externalSystems: next });
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-900">Containers</p>
          <button
            type="button"
            onClick={() => onChange({ containers: [...containers, { name: "", type: "api", description: "" }] })}
            className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Add container
          </button>
        </div>

        <div className="space-y-2">
          {containers.length === 0 ? <p className="text-xs text-slate-600">No containers yet.</p> : null}
          {containers.map((c, idx) => (
            <div key={`container-${idx}`} className="rounded-2xl border border-slate-200 bg-white p-3">
              <div className="grid gap-2 sm:grid-cols-12 sm:items-center">
                <div className="sm:col-span-4">
                  <input
                    value={c.name}
                    onChange={(e) => {
                      const next = [...containers];
                      next[idx] = { ...next[idx], name: e.target.value };
                      onChange({ containers: next });
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    placeholder="Web app"
                    aria-label={`Container ${idx + 1} name`}
                  />
                </div>
                <div className="sm:col-span-3">
                  <select
                    value={c.type}
                    onChange={(e) => {
                      const next = [...containers];
                      next[idx] = { ...next[idx], type: e.target.value };
                      onChange({ containers: next });
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    aria-label={`Container ${idx + 1} type`}
                  >
                    {containerTypes.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-4">
                  <input
                    value={c.description}
                    onChange={(e) => {
                      const next = [...containers];
                      next[idx] = { ...next[idx], description: e.target.value };
                      onChange({ containers: next });
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    placeholder="Short description"
                    aria-label={`Container ${idx + 1} description`}
                  />
                </div>
                <div className="sm:col-span-1 sm:flex sm:justify-end">
                  <RowActions
                    removeLabel="Remove"
                    onRemove={() => {
                      const next = containers.filter((_, i) => i !== idx);
                      onChange({ containers: next });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {errors.length ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
          <p className="font-semibold">Please fix the following:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}


