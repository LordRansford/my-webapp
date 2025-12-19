"use client";

import { useMemo, useEffect, useState } from "react";
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

export function UrlTriage() {
  const storageKey = "template-cyber-web-url-triage";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    url: "",
    notes: "",
  });
  const [status, setStatus] = useState("");

  const analysis = useMemo(() => {
    const risks = [];
    const url = state.url || "";
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "https:") risks.push("Not using HTTPS.");
      if (parsed.username || parsed.password) risks.push("Contains user info in URL.");
      if (parsed.hostname.split(".").pop()?.length <= 2) risks.push("Short TLD. Verify legitimacy.");
      if (/\d{2,}/.test(parsed.hostname)) risks.push("Hostname has many numbers; check if trustworthy.");
      if (parsed.search.includes("=") && parsed.search.length > 80) risks.push("Long query string; inspect parameters.");
      if (!risks.length) risks.push("No obvious structural risks. Still verify sender and intent.");
    } catch {
      risks.push("URL not parsable. Check formatting.");
    }
    return risks;
  }, [state.url]);

  const buildSections = () => [
    { heading: "URL", body: state.url },
    { heading: "Findings", body: analysis.join(" ") },
    { heading: "Notes", body: state.notes || "None" },
  ];

  return (
    <TemplateLayout
      title="URL Risk Triage Tool"
      description="Check a URL for quick risk indicators before interacting."
      audience="Security awareness teams, responders, and anyone triaging links."
      useCases={[
        "Review suspicious links before clicking.",
        "Document quick triage for phishing reports.",
        "Share safe handling notes with users.",
      ]}
      instructions={["Paste the URL to triage.", "Review the structural signals and add your notes.", "Decide whether to block, allow, or escalate."]}
      outputTitle="Triage result"
      outputSummary={`Signals: ${analysis.join(" ")}`}
      outputInterpretation="Structural signals help but do not guarantee safety. Verify sender, context, and use sandboxed inspection where allowed."
      outputNextSteps={["Block if unsure.", "Report to security if suspicious.", "Use browser isolation for risky links."]}
      attributionText={attribution}
      version="1.0.0"
    >
      <TemplateExportPanel
        templateId="cyber-web-url-triage"
        title="URL Risk Triage Tool"
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
          URL to check
          <input
            type="url"
            value={state.url}
            onChange={(e) => updateState((prev) => ({ ...prev, url: e.target.value }))}
            placeholder="https://example.com/path?param=1"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <p className="mt-2 text-xs text-slate-700">This is a structural check only. It does not fetch or execute content.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Signals</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {analysis.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <label className="text-sm font-semibold text-slate-900">
            Notes / decision
            <textarea
              value={state.notes}
              onChange={(e) => updateState((prev) => ({ ...prev, notes: e.target.value }))}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              rows={4}
              placeholder="Block, allow, or escalate to security..."
            />
          </label>
        </div>
      </div>
      {status && <p className="text-sm font-semibold text-slate-700">{status}</p>}
    </TemplateLayout>
  );
}

export function PhishingChecker() {
  const storageKey = "template-cyber-web-phishing-checker";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    emailText: "",
    headerSummary: "",
  });

  const findings = useMemo(() => {
    const text = state.emailText.toLowerCase();
    const issues = [];
    if (text.includes("urgent") || text.includes("immediately")) issues.push("Urgent tone detected.");
    if (text.includes("gift card") || text.includes("payment")) issues.push("Payment or gift card mention.");
    if (text.includes("click here")) issues.push("Generic call to action.");
    const links = (state.emailText.match(/https?:\/\/\S+/g) || []).length;
    if (links > 2) issues.push("Multiple links present; inspect carefully.");
    if (!issues.length) issues.push("No obvious phishing markers. Still verify sender and headers.");
    return issues;
  }, [state.emailText]);

  const buildSections = () => [
    { heading: "Email text", body: state.emailText.slice(0, 500) },
    { heading: "Headers", body: state.headerSummary || "Not provided" },
    { heading: "Findings", body: findings.join(" ") },
  ];

  return (
    <TemplateLayout
      title="Phishing Email Checker"
      description="Paste email text and optional headers to get quick phishing markers."
      audience="Security analysts and awareness responders."
      useCases={["Triage reported emails quickly.", "Educate users on risky markers.", "Capture summary for incident notes."]}
      instructions={["Paste the email body and optional headers.", "Review the automated markers.", "Decide on block, delete, or escalate."]}
      outputTitle="Phishing markers"
      outputSummary={findings.join(" ")}
      outputInterpretation="Markers are hints, not proof. Check sender domain, SPF/DKIM/DMARC, and links in a sandbox."
      outputNextSteps={["Delete if suspicious.", "Report to security.", "Share learnings in awareness channels."]}
      attributionText={attribution}
      version="1.0.0"
    >
      <TemplateExportPanel
        templateId="cyber-web-phishing-checker"
        title="Phishing Email Checker"
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
        <label className="text-sm font-semibold text-slate-900">
          Email text
          <textarea
            value={state.emailText}
            onChange={(e) => updateState((prev) => ({ ...prev, emailText: e.target.value }))}
            rows={6}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Header summary (optional)
          <textarea
            value={state.headerSummary}
            onChange={(e) => updateState((prev) => ({ ...prev, headerSummary: e.target.value }))}
            rows={6}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="From, Return-Path, Received chain..."
          />
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Markers</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {findings.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </TemplateLayout>
  );
}

export function CookieStorageInspector() {
  const storageKey = "template-cyber-web-cookie-storage";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    localKeys: [],
    sessionKeys: [],
    notes: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const localKeys = Object.keys(window.localStorage);
    const sessionKeys = Object.keys(window.sessionStorage);
    updateState((prev) => ({ ...prev, localKeys, sessionKeys }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildSections = () => [
    { heading: "Local storage keys", body: state.localKeys.join(", ") || "None found" },
    { heading: "Session storage keys", body: state.sessionKeys.join(", ") || "None found" },
    { heading: "Notes", body: state.notes || "None" },
  ];

  return (
    <TemplateLayout
      title="Cookie and Storage Inspector"
      description="See what the browser is holding and capture guidance on secure storage."
      audience="Developers, QA, and security reviewers."
      useCases={["Check if sensitive data is stored client side.", "Document storage expectations for a feature.", "Educate teams on cookies vs storage."]}
      instructions={["Review detected storage keys in this browser.", "Add notes about what should or should not be stored.", "Share guidance with the team."]}
      outputTitle="Storage findings"
      outputSummary={`Local: ${state.localKeys.length} keys. Session: ${state.sessionKeys.length} keys.`}
      outputInterpretation="Client storage should never contain secrets. Prefer HttpOnly cookies for session tokens."
      outputNextSteps={[
        "Move sensitive values server side.",
        "Set Secure and HttpOnly on cookies.",
        "Document retention and clearing behaviour.",
      ]}
      attributionText={attribution}
      version="1.0.0"
    >
      <TemplateExportPanel
        templateId="cyber-web-cookie-storage"
        title="Cookie and Storage Inspector"
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
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Local storage keys</p>
          <p className="text-sm text-slate-700 mt-2">{state.localKeys.join(", ") || "None found"}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Session storage keys</p>
          <p className="text-sm text-slate-700 mt-2">{state.sessionKeys.join(", ") || "None found"}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <label className="text-sm font-semibold text-slate-900">
          Notes
          <textarea
            value={state.notes}
            onChange={(e) => updateState((prev) => ({ ...prev, notes: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="List what should be stored where, and what must never be stored client side."
          />
        </label>
      </div>
    </TemplateLayout>
  );
}

export function CSPBuilder() {
  const storageKey = "template-cyber-web-csp-builder";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    defaultSrc: "'self'",
    scriptSrc: "'self'",
    styleSrc: "'self'",
    imgSrc: "'self' data:",
    connectSrc: "'self'",
  });
  const [status, setStatus] = useState("");

  const csp = useMemo(() => {
    return `default-src ${state.defaultSrc}; script-src ${state.scriptSrc}; style-src ${state.styleSrc}; img-src ${state.imgSrc}; connect-src ${state.connectSrc}; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`;
  }, [state.connectSrc, state.defaultSrc, state.imgSrc, state.scriptSrc, state.styleSrc]);

  const buildSections = () => [
    { heading: "CSP", body: csp },
    { heading: "Notes", body: "Generated CSP. Adjust for CDNs and trusted third parties." },
  ];

  return (
    <TemplateLayout
      title="Content Security Policy Builder"
      description="Generate a CSP string and understand core directives."
      audience="Developers and security engineers."
      useCases={["Draft CSP for a new web app.", "Explain directives to teams.", "Export CSP for review."]}
      instructions={[
        "Set sources for scripts, styles, images, and connect calls.",
        "Review the generated CSP string.",
        "Copy it into your headers and test in report-only mode first.",
      ]}
      outputTitle="Generated CSP"
      outputSummary={csp}
      outputInterpretation="Start with strict defaults and add only the origins you own or trust. Test in report-only before enforcing."
      outputNextSteps={[
        "Deploy in report-only to gather violations.",
        "Tighten directives; avoid wildcards.",
        "Add nonce or hashes for inline scripts if needed.",
      ]}
      attributionText={attribution}
      version="1.0.0"
    >
      <TemplateExportPanel
        templateId="cyber-web-csp-builder"
        title="Content Security Policy Builder"
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
            onClick={() => copyText(csp, setStatus)}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Copy CSP
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

      <div className="grid gap-4 md:grid-cols-2">
        {["defaultSrc", "scriptSrc", "styleSrc", "imgSrc", "connectSrc"].map((field) => (
          <label key={field} className="text-sm font-semibold text-slate-900">
            {field.replace("Src", " src")}
            <input
              type="text"
              value={state[field]}
              onChange={(e) => updateState((prev) => ({ ...prev, [field]: e.target.value }))}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </label>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">CSP string</p>
        <p className="mt-2 break-words rounded-lg bg-slate-50 p-3 text-sm text-slate-800">{csp}</p>
        {status && <p className="mt-2 text-xs font-semibold text-slate-700">{status}</p>}
      </div>
    </TemplateLayout>
  );
}

export const webTools = {
  "cyber-web-url-triage": UrlTriage,
  "cyber-web-phishing-checker": PhishingChecker,
  "cyber-web-cookie-storage": CookieStorageInspector,
  "cyber-web-csp-builder": CSPBuilder,
};
