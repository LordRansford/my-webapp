"use client";

import React, { useMemo, useState } from "react";
import { Code, Database, ShieldCheck } from "lucide-react";

type Area = "Secure development principles" | "Common application risks" | "Data protection basics" | "Handling user data";

export default function AppDataSecurityLab() {
  const [area, setArea] = useState<Area>("Secure development principles");
  const [secureDefaults, setSecureDefaults] = useState(true);
  const [inputValidation, setInputValidation] = useState(true);
  const [dependencyHygiene, setDependencyHygiene] = useState(true);
  const [secrets, setSecrets] = useState(true);
  const [encryptionAtRest, setEncryptionAtRest] = useState(false);
  const [loggingSensitive, setLoggingSensitive] = useState(false);

  const content = useMemo(() => {
    if (area === "Secure development principles") {
      return {
        title: "Secure development principles",
        bullets: [
          "Validate inputs at trust boundaries and fail safely.",
          "Use secure defaults so mistakes do not become incidents.",
          "Treat logs as sensitive and avoid secrets in telemetry.",
          "Review dependencies and update them as a habit.",
        ],
      };
    }
    if (area === "Common application risks") {
      return {
        title: "Common application risks",
        bullets: [
          "Broken access control (authz mistakes) is a top risk.",
          "Injection risks come from trusting input and composing queries unsafely.",
          "Insecure direct object references: users access things they should not.",
          "CSRF and session issues: ensure state-changing actions are protected.",
        ],
      };
    }
    if (area === "Data protection basics") {
      return {
        title: "Data protection basics",
        bullets: [
          "Classify data and apply controls based on sensitivity.",
          "Encrypt in transit by default. Use TLS properly and keep configs current.",
          "Limit access with least privilege and audit sensitive access.",
          "Retention and deletion rules are part of security.",
        ],
      };
    }
    return {
      title: "Secure handling of user data",
      bullets: [
        "Collect minimal personal data and document purpose.",
        "Avoid logging personal or secret data. Mask where needed.",
        "Use separate environments and never use production data in development.",
        "Have a breach and incident response plan for user data events.",
      ],
    };
  }, [area]);

  const checklistScore = useMemo(() => {
    const flags = [secureDefaults, inputValidation, dependencyHygiene, secrets, encryptionAtRest, loggingSensitive];
    return Math.round((flags.filter(Boolean).length / flags.length) * 100);
  }, [secureDefaults, inputValidation, dependencyHygiene, secrets, encryptionAtRest, loggingSensitive]);

  return (
    <section className="space-y-6" aria-label="Application and data security lab">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-sky-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Application and data security</h2>
        </div>
        <p className="text-sm text-slate-700">
          This lab focuses on prevention. No exploit demonstrations. The goal is to build habits that reduce incidents and protect user data.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Choose a topic</p>
            <div className="grid gap-3 md:grid-cols-2">
              {(
                ["Secure development principles", "Common application risks", "Data protection basics", "Handling user data"] as Area[]
              ).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setArea(a)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    area === a ? "border-sky-300 bg-sky-50 ring-1 ring-sky-200" : "border-slate-200 bg-slate-50/60"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{a}</p>
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-slate-700" aria-hidden="true" />
                <p className="text-sm font-semibold text-slate-900">{content.title}</p>
              </div>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                {content.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">Quick checklist</h3>
            </div>
            <div className="space-y-2 text-sm text-slate-800">
              {[
                { key: "defaults", label: "Secure defaults", v: secureDefaults, set: setSecureDefaults },
                { key: "validation", label: "Input validation at boundaries", v: inputValidation, set: setInputValidation },
                { key: "deps", label: "Dependency hygiene (updates and scanning)", v: dependencyHygiene, set: setDependencyHygiene },
                { key: "secrets", label: "Secrets kept out of code", v: secrets, set: setSecrets },
                { key: "rest", label: "Encryption at rest where appropriate", v: encryptionAtRest, set: setEncryptionAtRest },
                { key: "logs", label: "Avoid logging sensitive data", v: loggingSensitive, set: setLoggingSensitive },
              ].map((x) => (
                <label key={x.key} className="flex items-center gap-2">
                  <input type="checkbox" checked={x.v} onChange={(e) => x.set(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200" />
                  <span>{x.label}</span>
                </label>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-sm font-semibold text-slate-900">Score</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{checklistScore}/100</p>
              <p className="mt-2 text-sm text-slate-700">
                The goal is not 100. The goal is to remove the common failures that lead to incidents.
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Tie-in to data and AI</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Data: classification, access, retention, and auditability are core security controls.</li>
              <li>AI: privacy, bias, and quiet failure modes require secure pipelines and clear accountability.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}



