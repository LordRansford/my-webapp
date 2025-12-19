"use client";

import { useEffect, useMemo, useState } from "react";
import TemplateLayout from "@/components/templates/TemplateLayout";
import TemplateExportPanel from "@/components/templates/TemplateExportPanel";
import { useTemplateState } from "@/hooks/useTemplateState";

const attribution =
  "Created by Ransford for Ransfords Notes. Internal use allowed. Commercial use requires visible attribution. Exports are gated per policy.";

const formatTimestamp = (iso) => {
  if (!iso) return "Not saved yet";
  try {
    return new Date(iso).toLocaleString();
  } catch (error) {
    return iso;
  }
};

const copyText = async (text, setStatus) => {
  try {
    await navigator.clipboard.writeText(text);
    setStatus("Copied to clipboard");
  } catch {
    setStatus("Copy failed. Select and copy manually.");
  }
};

export function PasswordCoach() {
  const storageKey = "template-cyber-identity-password-coach";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    password: "",
    advice: [],
  });
  const [status, setStatus] = useState("");

  const score = useMemo(() => {
    const pwd = state.password || "";
    let s = 0;
    if (pwd.length >= 12) s += 2;
    if (pwd.length >= 16) s += 2;
    if (/[A-Z]/.test(pwd)) s += 1;
    if (/[a-z]/.test(pwd)) s += 1;
    if (/[0-9]/.test(pwd)) s += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) s += 1;
    return Math.min(10, s);
  }, [state.password]);

  useEffect(() => {
    const pwd = state.password || "";
    const tips = [];
    if (pwd.length < 12) tips.push("Use at least 12 characters; 16+ for admin or cloud accounts.");
    if (!/[A-Z]/.test(pwd)) tips.push("Add uppercase letters for entropy.");
    if (!/[0-9]/.test(pwd)) tips.push("Add numbers that are not predictable dates.");
    if (!/[^A-Za-z0-9]/.test(pwd)) tips.push("Add symbols that you can remember but others cannot guess.");
    if (pwd.length >= 16 && /[^A-Za-z0-9]/.test(pwd) && /[0-9]/.test(pwd)) {
      tips.push("Good length and variety. Ensure you use a password manager.");
    }
    updateState((prev) => ({ ...prev, advice: tips }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.password]);

  const strength = score >= 8 ? "Strong" : score >= 5 ? "Fair" : score >= 3 ? "Weak" : "Very weak";

  const outputSummary = `Strength: ${strength} (${score}/10).`;
  const outputInterpretation =
    strength === "Strong"
      ? "Use with MFA for admin and production accounts."
      : "Strengthen with longer passphrases and variety. Prefer password managers.";
  const outputNextSteps = [
    "Adopt a password manager to avoid reuse.",
    "Enable MFA on critical accounts.",
    "Rotate credentials on high-risk roles regularly.",
  ];

  const buildSections = () => [
    { heading: "Password", body: state.password || "(not provided)" },
    { heading: "Strength", body: outputSummary },
    { heading: "Advice", body: state.advice.join(" ") },
  ];

  return (
    <TemplateLayout
      title="Password and Passphrase Coach"
      description="Score a password or passphrase and get guidance on making it stronger."
      audience="Anyone setting passwords; identity admins coaching teams."
      useCases={[
        "Check if a password meets team guidance.",
        "Demonstrate why length and variety matter.",
        "Capture advice to share with users.",
      ]}
      instructions={[
        "Enter a password or passphrase you want to assess (use a sample, not a real secret).",
        "Review the strength score and suggested improvements.",
        "Copy the advice and share with the user or team.",
      ]}
      outputTitle="Strength result"
      outputSummary={outputSummary}
      outputInterpretation={outputInterpretation}
      outputNextSteps={outputNextSteps}
      attributionText={attribution}
      version="1.0.0"
    >
      <TemplateExportPanel
        templateId="cyber-identity-password-coach"
        title="Password and Passphrase Coach"
        category="Cybersecurity"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <button
          type="button"
          onClick={resetState}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Reset
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
        <label className="block text-sm font-semibold text-slate-900">
          Enter sample password or passphrase
          <input
            type="text"
            value={state.password}
            onChange={(e) => updateState((prev) => ({ ...prev, password: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Correct Horse Battery Staple 2025!"
          />
        </label>
        <p className="mt-2 text-xs text-slate-700">Do not paste real secrets; use a representative sample.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Score</p>
          <p className="text-3xl font-bold text-slate-900">
            {score}/10 <span className="text-base font-semibold">{strength}</span>
          </p>
          <p className="mt-2 text-sm text-slate-700">
            Strength is influenced by length, variety, and predictability. Longer passphrases beat short complex passwords.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Advice</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {state.advice.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => copyText(state.advice.join(" "), setStatus)}
            className="mt-3 inline-flex items-center rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Copy advice
          </button>
          {status && <p className="mt-2 text-xs font-semibold text-slate-700">{status}</p>}
        </div>
      </div>
    </TemplateLayout>
  );
}

export function MFAPicker() {
  const storageKey = "template-cyber-identity-mfa-picker";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    risk: "medium",
    device: "mobile",
    constraints: "",
  });

  const context = useMemo(() => {
    const recs = [];
    if (state.risk === "high") {
      recs.push("Hardware security key (FIDO2) for admins and production access.");
    } else {
      recs.push("Authenticator app TOTP as baseline.");
    }
    if (state.device === "desktop") {
      recs.push("Desktop push with number matching where supported.");
    }
    if (state.constraints.includes("travel")) {
      recs.push("Backup codes stored securely and short lived during travel.");
    }
    return recs;
  }, [state.constraints, state.device, state.risk]);

  const buildSections = () => [
    { heading: "Risk level", body: state.risk },
    { heading: "Device context", body: state.device },
    { heading: "Constraints", body: state.constraints || "None" },
    { heading: "Recommendations", body: context.join(" ") },
  ];

  return (
    <TemplateLayout
      title="MFA Method Picker"
      description="Select MFA methods based on risk, device context, and constraints."
      audience="Identity and access teams, security champions."
      useCases={[
        "Pick MFA per app risk and user group.",
        "Document MFA choices for audits.",
        "Explain why certain MFA is required.",
      ]}
      instructions={[
        "Choose the risk level and device context.",
        "Add any constraints such as travel or legacy systems.",
        "Review the recommended MFA mix.",
      ]}
      outputTitle="MFA recommendation"
      outputSummary={`Risk: ${state.risk}. Device: ${state.device}.`}
      outputInterpretation="Use hardware keys for admin and production access; TOTP for standard users; push with protections where device posture allows."
      outputNextSteps={["Roll out hardware keys to high-risk groups.", "Enable number matching for push MFA.", "Document fallback recovery steps."]}
      attributionText={attribution}
      version="1.0.0"
    >
      <TemplateExportPanel
        templateId="cyber-identity-mfa-picker"
        title="MFA Method Picker"
        category="Cybersecurity"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <button
          type="button"
          onClick={resetState}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2 rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-800">
          Risk level
          <select
            value={state.risk}
            onChange={(e) => updateState((prev) => ({ ...prev, risk: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label className="space-y-2 rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-800">
          Primary device
          <select
            value={state.device}
            onChange={(e) => updateState((prev) => ({ ...prev, device: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="mobile">Mobile-first</option>
            <option value="desktop">Desktop-first</option>
            <option value="shared">Shared devices</option>
          </select>
        </label>
        <label className="space-y-2 rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-800">
          Constraints
          <input
            type="text"
            value={state.constraints}
            onChange={(e) => updateState((prev) => ({ ...prev, constraints: e.target.value }))}
            placeholder="Travel, legacy app, SMS only"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Recommended MFA mix</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {context.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </TemplateLayout>
  );
}

export function RBACBuilder() {
  const storageKey = "template-cyber-identity-rbac-builder";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    roles: [
      { name: "Viewer", permissions: "Read-only access", review: "Quarterly" },
      { name: "Editor", permissions: "Create and update content", review: "Monthly" },
    ],
  });

  const addRole = () => {
    updateState((prev) => ({ ...prev, roles: [...prev.roles, { name: "", permissions: "", review: "Quarterly" }] }));
  };

  const updateRole = (index, field, value) => {
    updateState((prev) => {
      const roles = prev.roles.map((role, idx) => (idx === index ? { ...role, [field]: value } : role));
      return { ...prev, roles };
    });
  };

  const buildSections = () => [
    { heading: "Roles", body: state.roles.map((r) => `${r.name}: ${r.permissions} (Review: ${r.review})`).join(" | ") },
  ];

  return (
    <TemplateLayout
      title="RBAC Role Builder"
      description="Design roles, entitlements, and reviews for applications or platforms."
      audience="Identity admins, product teams, compliance leads."
      useCases={[
        "Document RBAC for a new app.",
        "Plan access reviews and separation of duties.",
        "Share with auditors and delivery teams.",
      ]}
      instructions={[
        "Add roles and define permissions in plain language.",
        "Set review cadence and ownership.",
        "Export and share with teams for validation.",
      ]}
      outputTitle="RBAC summary"
      outputSummary={`Roles defined: ${state.roles.length}`}
      outputInterpretation="Ensure roles are minimal and reviewed on the stated cadence. Map to groups in your IdP."
      outputNextSteps={["Align roles with groups in the IdP.", "Automate reviews where possible.", "Log approvals for audit."]}
      attributionText={attribution}
      version="1.0.0"
    >
      <TemplateExportPanel
        templateId="cyber-identity-rbac-builder"
        title="RBAC Role Builder"
        category="Cybersecurity"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addRole}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Add role
          </button>
          <button
            type="button"
            onClick={resetState}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {state.roles.map((role, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-3">
              <label className="text-sm text-slate-800">
                Role name
                <input
                  type="text"
                  value={role.name}
                  onChange={(e) => updateRole(index, "name", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </label>
              <label className="text-sm text-slate-800">
                Permissions
                <input
                  type="text"
                  value={role.permissions}
                  onChange={(e) => updateRole(index, "permissions", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </label>
              <label className="text-sm text-slate-800">
                Review cadence
                <select
                  value={role.review}
                  onChange={(e) => updateRole(index, "review", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annually">Annually</option>
                </select>
              </label>
            </div>
          </div>
        ))}
      </div>
    </TemplateLayout>
  );
}

export function SessionHygiene() {
  const storageKey = "template-cyber-identity-session-hygiene";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    sessionMinutes: 60,
    refreshMinutes: 1440,
    secureCookie: true,
    httpOnly: true,
    sameSite: "Lax",
    rotation: "30",
  });

  const issues = useMemo(() => {
    const list = [];
    if (state.sessionMinutes > 120) list.push("Session lifetime is long; shorten for sensitive apps.");
    if (!state.secureCookie) list.push("Enable Secure on cookies to block non-TLS use.");
    if (!state.httpOnly) list.push("Enable HttpOnly to reduce script access.");
    if (state.sameSite === "None") list.push("SameSite=None requires Secure; ensure CSRF controls exist.");
    if (Number(state.rotation) > 60) list.push("Refresh token rotation longer than 60 minutes; tighten if possible.");
    return list.length ? list : ["Configuration looks reasonable. Monitor tokens for reuse and anomalies."];
  }, [state.httpOnly, state.rotation, state.sameSite, state.secureCookie, state.sessionMinutes]);

  const buildSections = () => [
    {
      heading: "Session settings",
      body: `Session ${state.sessionMinutes} mins, refresh ${state.refreshMinutes} mins, rotation ${state.rotation} mins.`,
    },
    {
      heading: "Cookie settings",
      body: `Secure: ${state.secureCookie ? "Yes" : "No"}, HttpOnly: ${state.httpOnly ? "Yes" : "No"}, SameSite: ${state.sameSite}`,
    },
    { heading: "Findings", body: issues.join(" ") },
  ];

  return (
    <TemplateLayout
      title="Session and Token Hygiene Checker"
      description="Evaluate session lifetime, refresh cadence, and cookie flags."
      audience="Identity engineers, app developers, security reviewers."
      useCases={[
        "Quick review before go-live.",
        "Document session settings for security review.",
        "Coach teams on secure defaults.",
      ]}
      instructions={[
        "Enter session and refresh lifetimes.",
        "Confirm cookie flags and rotation interval.",
        "Review findings and adjust your settings.",
      ]}
      outputTitle="Hygiene findings"
      outputSummary={`Session ${state.sessionMinutes} mins; refresh ${state.refreshMinutes} mins; SameSite ${state.sameSite}.`}
      outputInterpretation="Shorter sessions and secure cookies reduce theft impact. Rotation and anomaly detection add resilience."
      outputNextSteps={[
        "Align lifetimes with data sensitivity.",
        "Ensure CSRF controls where SameSite=None.",
        "Monitor token reuse and revoke quickly.",
      ]}
      attributionText={attribution}
      version="1.0.0"
    >
      <TemplateExportPanel
        templateId="cyber-identity-session-hygiene"
        title="Session and Token Hygiene Checker"
        category="Cybersecurity"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <button
          type="button"
          onClick={resetState}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-800">
          Session lifetime (minutes)
          <input
            type="number"
            min="5"
            value={state.sessionMinutes}
            onChange={(e) => updateState((prev) => ({ ...prev, sessionMinutes: Number(e.target.value) }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="space-y-2 rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-800">
          Refresh token lifetime (minutes)
          <input
            type="number"
            min="10"
            value={state.refreshMinutes}
            onChange={(e) => updateState((prev) => ({ ...prev, refreshMinutes: Number(e.target.value) }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-800">
          <input
            type="checkbox"
            checked={state.secureCookie}
            onChange={(e) => updateState((prev) => ({ ...prev, secureCookie: e.target.checked }))}
          />
          Secure cookie
        </label>
        <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-800">
          <input
            type="checkbox"
            checked={state.httpOnly}
            onChange={(e) => updateState((prev) => ({ ...prev, httpOnly: e.target.checked }))}
          />
          HttpOnly
        </label>
        <label className="space-y-2 rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-800">
          SameSite
          <select
            value={state.sameSite}
            onChange={(e) => updateState((prev) => ({ ...prev, sameSite: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="Lax">Lax</option>
            <option value="Strict">Strict</option>
            <option value="None">None</option>
          </select>
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Findings</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {issues.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </TemplateLayout>
  );
}

export const identityTools = {
  "cyber-identity-password-coach": PasswordCoach,
  "cyber-identity-mfa-picker": MFAPicker,
  "cyber-identity-rbac-builder": RBACBuilder,
  "cyber-identity-session-hygiene": SessionHygiene,
};
