"use client";

function Section({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{title}</p>
      <div className="mt-2 text-sm text-slate-800">{children}</div>
    </div>
  );
}

function List({ items, empty }) {
  if (!items || items.length === 0) return <p className="text-sm text-slate-700">{empty}</p>;
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
      {items.map((x, idx) => (
        <li key={`${x}-${idx}`}>{x}</li>
      ))}
    </ul>
  );
}

export default function StepReview({ input, validation, onGenerate, generationEnabled }) {
  const errors = validation?.ok ? [] : validation?.errors || [];
  const canGenerate = Boolean(generationEnabled);
  const purposeWarnings = input?.__purposeWarnings || [];
  const inputVersion = input?.__inputVersion || "";
  const needsTrustBoundaryAck =
    (input?.goal === "security-review" || input?.goal === "data-review") &&
    !((input?.security?.trustBoundaries || []).filter(Boolean).length > 0) &&
    !input?.security?.hasNoTrustBoundariesConfirmed;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Review</h2>
        <p className="mt-1 text-sm text-slate-700">This is a read only summary of your inputs.</p>
      </div>

      {purposeWarnings.length ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Purpose guardrails</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {purposeWarnings.map((w, idx) => (
              <li key={`${w}-${idx}`}>{w}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {!validation?.ok ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          <p className="font-semibold">Validation results</p>
          <p className="mt-1 text-xs text-rose-900/80">Fix these items to continue. The tool will not guess missing details.</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            {errors.map((e) => (
              <li key={`${e.path}:${e.message}`}>
                <span className="font-semibold">{e.path}</span>: {e.message}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <p className="font-semibold">Validation results</p>
          <p className="mt-1 text-xs text-emerald-900/80">Inputs look good.</p>
        </div>
      )}

      <Section title="Version">
        <List
          items={[
            input.versionName ? `Version name: ${input.versionName}` : "Version name: (optional)",
          ]}
          empty="n/a"
        />
        {inputVersion ? (
          <p className="mt-2 text-xs text-slate-600">Generated from input version {inputVersion}</p>
        ) : (
          <p className="mt-2 text-xs text-slate-600">An input version hash will be shown after generation.</p>
        )}
      </Section>

      <div className="grid gap-3 md:grid-cols-2">
        <Section title="Goal and audience">
          <List
            items={[
              `Goal: ${input.goal}`,
              `Audience: ${input.audience}`,
            ]}
            empty="Not set."
          />
        </Section>
        <Section title="System">
          <p className="text-sm font-semibold text-slate-900">{input.systemName || "Unnamed system"}</p>
          <p className="mt-1 text-sm text-slate-700">{input.systemDescription || "No description yet."}</p>
        </Section>
      </div>

      <Section title="Building blocks">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Users</p>
            <List items={(input.users || []).map((u) => u.name).filter(Boolean)} empty="No users." />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">External systems</p>
            <List items={(input.externalSystems || []).map((s) => s.name).filter(Boolean)} empty="No external systems." />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Containers</p>
            <List
              items={(input.containers || [])
                .map((c) => `${c.name || "Unnamed"} (${c.type})${c.description ? `: ${c.description}` : ""}`)
                .filter(Boolean)}
              empty="No containers."
            />
          </div>
        </div>
      </Section>

      <Section title="Flows">
        <List
          items={(input.flows || []).map((f) => {
            const sensitive = f.sensitive ? " [sensitive]" : "";
            return `${f.from} → ${f.to}: ${f.purpose}${sensitive}`;
          })}
          empty="No flows."
        />
      </Section>

      <Section title="Security and data">
        <List
          items={[
            `Authentication: ${input.security?.authenticationMethod || "Not set"}`,
            `Admin access: ${input.security?.adminAccess ? "Yes" : "No"}`,
            (input.security?.trustBoundaries || []).length > 0
              ? `Trust boundaries: ${(input.security?.trustBoundaries || []).join(", ")}`
              : input.security?.hasNoTrustBoundariesConfirmed
                ? "Trust boundaries: none (confirmed)"
                : "Trust boundaries: not set",
            `Sensitive data categories: ${(input.dataTypes || []).join(", ") || "None selected"}`,
          ]}
        />
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!canGenerate}
          onClick={canGenerate ? onGenerate : undefined}
          className={`rounded-full px-5 py-2 text-sm font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
            canGenerate ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-200 text-slate-600 cursor-not-allowed"
          }`}
        >
          Generate diagrams
        </button>
        {!canGenerate ? (
          <p className="text-sm font-semibold text-slate-700">
            {validation?.ok && needsTrustBoundaryAck
              ? "Add a trust boundary or confirm that the system has no trust boundaries."
              : "Fix validation items to enable generation"}
          </p>
        ) : (
          <p className="text-sm font-semibold text-slate-700">These diagrams are generated drafts. Review before using in decisions.</p>
        )}
      </div>
    </div>
  );
}


