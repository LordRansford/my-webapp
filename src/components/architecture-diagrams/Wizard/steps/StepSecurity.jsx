"use client";

import { wizardCopy, isProfessionals } from "@/lib/architecture-diagrams/copy/audience";
import SwitchRow from "@/components/ui/SwitchRow";

const DATA_TYPES = [
  { value: "pii", label: "PII" },
  { value: "financial", label: "Financial" },
  { value: "telemetry", label: "Telemetry" },
  { value: "credentials", label: "Credentials" },
  { value: "health", label: "Health" },
  { value: "other", label: "Other" },
];

export default function StepSecurity({ audience = "students", goal, security, dataTypes, onChange, errors = [] }) {
  const copy = wizardCopy(audience);
  const title = "Security and data";
  const selected = new Set(dataTypes || []);
  const hasSensitive = selected.size > 0;
  const hasBoundary = (security.trustBoundaries || []).filter(Boolean).length > 0;
  const needsBoundaryAck = (goal === "security-review" || goal === "data-review") && !hasBoundary && !security.hasNoTrustBoundariesConfirmed;
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-700">{copy.securityIntro}</p>
        <p className="mt-2 text-xs text-slate-600">{copy.securityHelp}</p>
        {isProfessionals(audience) && copy.professionalsReminder ? (
          <p className="mt-2 text-xs font-semibold text-slate-700">{copy.professionalsReminder}</p>
        ) : null}
        {needsBoundaryAck ? (
          <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <p className="font-semibold">Consider adding a trust boundary</p>
            <p className="mt-1">For security and data review goals, trust boundaries help reviewers understand where rules change.</p>
          </div>
        ) : null}
        {hasSensitive && !hasBoundary && !security.hasNoTrustBoundariesConfirmed ? (
          <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <p className="font-semibold">Sensitive data guidance</p>
            <p className="mt-1">If sensitive data exists, consider adding a trust boundary and marking sensitive flows in the flows step.</p>
          </div>
        ) : null}
      </div>

      <label className="block text-sm font-semibold text-slate-900">
        Authentication method
        <input
          value={security.authenticationMethod}
          onChange={(e) => onChange({ security: { ...security, authenticationMethod: e.target.value } })}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          placeholder="Password, SSO, OIDC, API key"
        />
        <p className="mt-2 text-xs text-slate-600">Example: OIDC with MFA for admins.</p>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <SwitchRow
          label="Admin access"
          description="Someone has elevated permissions."
          checked={Boolean(security.adminAccess)}
          onCheckedChange={(checked) => onChange({ security: { ...security, adminAccess: checked } })}
          tone="indigo"
        />

        <SwitchRow
          label="Trust boundaries present"
          description="A boundary where rules change, like browser to server."
          checked={Boolean((security.trustBoundaries || []).length > 0)}
          onCheckedChange={(checked) => {
            if (checked) {
              onChange({ security: { ...security, trustBoundaries: ["Browser to server"], hasNoTrustBoundariesConfirmed: false } });
            } else {
              onChange({ security: { ...security, trustBoundaries: [], hasNoTrustBoundariesConfirmed: false } });
            }
          }}
          tone="sky"
        />
      </div>

      {(security.trustBoundaries || []).length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">Trust boundaries</p>
            <button
              type="button"
              onClick={() => onChange({ security: { ...security, trustBoundaries: [...(security.trustBoundaries || []), ""] } })}
              className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              Add boundary
            </button>
          </div>
          <p className="text-xs text-slate-600">Examples: Browser to API, Partner network, Public Internet.</p>
          <div className="space-y-2">
            {(security.trustBoundaries || []).map((b, idx) => (
              <div key={`boundary-${idx}`} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center">
                <input
                  value={b}
                  onChange={(e) => {
                    const next = [...(security.trustBoundaries || [])];
                    next[idx] = e.target.value;
                    onChange({ security: { ...security, trustBoundaries: next } });
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="Browser to server"
                  aria-label={`Trust boundary ${idx + 1}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = (security.trustBoundaries || []).filter((_, i) => i !== idx);
                    onChange({ security: { ...security, trustBoundaries: next } });
                  }}
                  className="rounded-full border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-800 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <SwitchRow
          label="This system has no trust boundaries"
          description="If you are sure, you can confirm it here. Reviewers will see this choice."
          checked={Boolean(security.hasNoTrustBoundariesConfirmed)}
          onCheckedChange={(checked) => onChange({ security: { ...security, hasNoTrustBoundariesConfirmed: checked } })}
          tone="amber"
        />
      )}

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-900">Sensitive data categories</p>
        <p className="text-xs text-slate-600">Select categories that appear in stores or flows.</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {DATA_TYPES.map((dt) => (
            <SwitchRow
              key={dt.value}
              label={dt.label}
              checked={selected.has(dt.value)}
              onCheckedChange={(checked) => {
                const next = new Set(selected);
                if (checked) next.add(dt.value);
                else next.delete(dt.value);
                onChange({ dataTypes: Array.from(next) });
              }}
              className="px-3 py-2"
              tone="slate"
            />
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


