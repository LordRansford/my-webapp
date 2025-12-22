"use client";

import React, { useMemo, useState } from "react";
import { KeyRound, UserCheck, ShieldCheck } from "lucide-react";

export default function IamLab() {
  const [authn, setAuthn] = useState("Google sign-in (OAuth)");
  const [authz, setAuthz] = useState("Role-based access control (RBAC)");
  const [leastPrivilege, setLeastPrivilege] = useState(true);
  const [mfa, setMfa] = useState(true);
  const [sessionHygiene, setSessionHygiene] = useState(true);
  const [adminAllowlist, setAdminAllowlist] = useState(true);

  const guidance = useMemo(() => {
    const g: string[] = [];
    g.push("Authentication proves who you are. Authorisation decides what you can do.");
    if (leastPrivilege) g.push("Least privilege reduces blast radius. Start with minimal permissions and add only what is needed.");
    if (mfa) g.push("MFA reduces account takeover. Apply it first to admins and high-risk operations.");
    if (sessionHygiene) g.push("Sessions must expire and be revocable. Short-lived sessions reduce risk.");
    if (adminAllowlist) g.push("Admin should be explicit (allowlist). Do not rely on hidden routes as security.");
    return g;
  }, [leastPrivilege, mfa, sessionHygiene, adminAllowlist]);

  return (
    <section className="space-y-6" aria-label="Identity and access management lab">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-amber-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Identity and access management</h2>
        </div>
        <p className="text-sm text-slate-700">
          Identity is the control plane for modern security. If identity fails, everything behind it is exposed.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-sky-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">1. Authn vs authz</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Authentication (who)</span>
                <input value={authn} onChange={(e) => setAuthn(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Authorisation (what)</span>
                <input value={authz} onChange={(e) => setAuthz(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200" />
              </label>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-sm font-semibold text-slate-900">Tie-in to this platform</p>
              <p className="mt-2 text-sm text-slate-700">
                This site uses a passwordless approach and keeps identity minimal. Admin access is intended to be explicit (email allowlist), not hidden.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">2. Controls checklist</h3>
            </div>
            <div className="space-y-2 text-sm text-slate-800">
              {[
                { key: "leastPrivilege", label: "Least privilege by default", v: leastPrivilege, set: setLeastPrivilege },
                { key: "mfa", label: "MFA for privileged operations", v: mfa, set: setMfa },
                { key: "session", label: "Session expiry and revocation", v: sessionHygiene, set: setSessionHygiene },
                { key: "admin", label: "Admin allowlist and auditability", v: adminAllowlist, set: setAdminAllowlist },
              ].map((x) => (
                <label key={x.key} className="flex items-center gap-2">
                  <input type="checkbox" checked={x.v} onChange={(e) => x.set(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200" />
                  <span>{x.label}</span>
                </label>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">Guidance</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                {guidance.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Credential hygiene basics</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Protect recovery flows (password reset, email change).</li>
              <li>Watch for credential stuffing and reused passwords.</li>
              <li>Separate user and admin identities where possible.</li>
              <li>Log auth events and review suspicious patterns.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}



