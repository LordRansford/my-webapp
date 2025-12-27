"use client";

import { wizardCopy } from "@/lib/architecture-diagrams/copy/audience";
import MiniSwitch from "@/components/ui/MiniSwitch";

function SoftWarning({ children }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
      <p className="font-semibold">Tip</p>
      <p className="mt-1">{children}</p>
    </div>
  );
}

export default function StepFlows({ audience = "students", flows, options, onChange, errors = [] }) {
  const copy = wizardCopy(audience);
  const title = "Key flows";
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-700">{copy.flowsIntro}</p>
        <p className="mt-2 text-xs text-slate-600">{copy.flowsHelp}</p>
      </div>

      {flows.length === 0 ? <SoftWarning>Add one or two flows to make the review step more useful.</SoftWarning> : null}

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">Flows</p>
        <button
          type="button"
          onClick={() => onChange({ flows: [...flows, { from: "", to: "", purpose: "", sensitive: false }] })}
          className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
        >
          Add flow
        </button>
      </div>

      <div className="space-y-2">
        {flows.map((f, idx) => (
          <div key={`flow-${idx}`} className="rounded-2xl border border-slate-200 bg-white p-3">
            <div className="grid gap-2 sm:grid-cols-12 sm:items-center">
              <div className="sm:col-span-3">
                <label className="text-xs font-semibold text-slate-700">
                  From
                  <select
                    value={f.from}
                    onChange={(e) => {
                      const next = [...flows];
                      next[idx] = { ...next[idx], from: e.target.value };
                      onChange({ flows: next });
                    }}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    aria-label={`Flow ${idx + 1} from`}
                  >
                    <option value="">Select</option>
                    {options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="sm:col-span-3">
                <label className="text-xs font-semibold text-slate-700">
                  To
                  <select
                    value={f.to}
                    onChange={(e) => {
                      const next = [...flows];
                      next[idx] = { ...next[idx], to: e.target.value };
                      onChange({ flows: next });
                    }}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    aria-label={`Flow ${idx + 1} to`}
                  >
                    <option value="">Select</option>
                    {options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="sm:col-span-4">
                <label className="text-xs font-semibold text-slate-700">
                  Purpose
                  <input
                    value={f.purpose}
                    onChange={(e) => {
                      const next = [...flows];
                      next[idx] = { ...next[idx], purpose: e.target.value };
                      onChange({ flows: next });
                    }}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    placeholder="Login, checkout, write audit log"
                    aria-label={`Flow ${idx + 1} purpose`}
                  />
                </label>
              </div>
              <div className="sm:col-span-1">
                <div className="mt-7 flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <span className="text-xs font-semibold text-slate-700">Sensitive</span>
                  <MiniSwitch
                    checked={Boolean(f.sensitive)}
                    onCheckedChange={(checked) => {
                      const next = [...flows];
                      next[idx] = { ...next[idx], sensitive: checked };
                      onChange({ flows: next });
                    }}
                    ariaLabel={`Flow ${idx + 1} sensitive data toggle`}
                    tone="amber"
                  />
                </div>
              </div>
              <div className="sm:col-span-1 sm:flex sm:justify-end">
                <button
                  type="button"
                  onClick={() => onChange({ flows: flows.filter((_, i) => i !== idx) })}
                  className="rounded-full border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-800 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
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


