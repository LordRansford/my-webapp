"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import TemplateLayout from "@/components/templates/TemplateLayout";
import TemplateExportPanel from "@/components/templates/TemplateExportPanel";
import { useTemplateState } from "@/hooks/useTemplateState";
import { useToolRunner } from "@/hooks/useToolRunner";
import { isProbablyDomain, isProbablyHostname, isProbablyIp, safeTrim } from "@/lib/tooling/validation";
import { postJson } from "@/lib/tooling/http";
import ComputeEstimatePanel from "@/components/compute/ComputeEstimatePanel";
import ComputeSummaryPanel from "@/components/compute/ComputeSummaryPanel";
import ComputeMeter from "@/components/ComputeMeter";
import CreditConsent, { useCreditConsent } from "@/components/credits/CreditConsent";

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

const NetworkNotice = () => (
  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
    These checks are informational only and do not prove a site is safe. Use only for domains or IPs you own or are allowed to
    inspect.
  </div>
);

function useNetworkTool(storageKey, apiPath) {
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    target: "",
    consent: false,
    result: null,
    error: "",
  });
  const runner = useToolRunner({ minIntervalMs: 900, toolId: storageKey });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [serverEstimate, setServerEstimate] = useState(null);
  const [serverActual, setServerActual] = useState(null);
  const [serverFreeRemainingMs, setServerFreeRemainingMs] = useState(null);
  const [serverHints, setServerHints] = useState([]);
  const [serverStatus, setServerStatus] = useState("success");
  // Check if this tool requires credits (DNS lookup and IP reputation do)
  const requiresCredits = apiPath === "dns-lookup" || apiPath === "ip-reputation";
  const estimatedCredits = requiresCredits ? 1 : 0;
  const [balance, setBalance] = useState(null);
  
  // Fetch credit balance for tools that require credits
  useEffect(() => {
    if (requiresCredits && typeof window !== "undefined") {
      fetch("/api/credits/status")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          setBalance(typeof d?.balance === "number" ? d.balance : 0);
        })
        .catch(() => setBalance(0));
    }
  }, [requiresCredits]);
  
  const { accepted: creditAccepted, canProceed: creditCanProceed } = useCreditConsent(estimatedCredits, balance);

  const validateTarget = useCallback((targetRaw) => {
    const t = safeTrim(targetRaw, 253);
    if (!t) return { ok: false, message: "Enter a target first." };

    // dns-lookup + whois-summary expect domains. tls-inspect can accept hostname.
    if (apiPath === "dns-lookup" || apiPath === "whois-summary") {
      if (!isProbablyDomain(t)) return { ok: false, message: "This input does not look like a domain. Try example.com" };
      return { ok: true, value: t.toLowerCase() };
    }

    if (apiPath === "tls-inspect") {
      if (!isProbablyHostname(t)) return { ok: false, message: "This input does not look like a hostname. Try example.com" };
      return { ok: true, value: t.toLowerCase() };
    }

    // ip-reputation supports IPs and hostnames in some setups.
    if (apiPath === "ip-reputation") {
      if (!isProbablyIp(t) && !isProbablyHostname(t)) {
        return { ok: false, message: "This input does not look like an IP address or hostname." };
      }
      return { ok: true, value: t.toLowerCase() };
    }

    return { ok: true, value: t };
  }, [apiPath]);

  const runLookup = async () => {
    updateState((prev) => ({ ...prev, error: "" }));
    setServerActual(null);
    setServerStatus("success");

    if (!state.consent) {
      updateState((prev) => ({ ...prev, error: "Please confirm you have permission to inspect this target." }));
      return;
    }
    
    // Check credit consent for tools that require credits
    if (requiresCredits && !creditCanProceed) {
      updateState((prev) => ({ ...prev, error: "Please accept the credit estimate and ensure sufficient credits." }));
      return;
    }

    const check = validateTarget(state.target);
    if (!check.ok) {
      updateState((prev) => ({ ...prev, error: check.message }));
      return;
    }

    const meta = { inputBytes: String(check.value).length, steps: 1, expectedWallMs: 900 };
    runner.prepare(meta);

    const data = await runner.run(async (signal) => {
      try {
        const er = await fetch("/api/compute/estimate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ toolId: apiPath, inputBytes: meta.inputBytes, requestedComplexityPreset: "standard" }),
        });
        const ej = await er.json().catch(() => null);
        if (ej?.ok) {
          setServerEstimate(ej);
          setServerFreeRemainingMs(typeof ej?.freeTierRemainingMs === "number" ? ej.freeTierRemainingMs : null);
          setServerHints(Array.isArray(ej?.costHints) ? ej.costHints : []);
          if (!ej.allowed) setServerStatus("blocked");
        }
      } catch {
        // ignore
      }
      const res = await postJson(`/api/tools/${apiPath}`, { target: check.value }, { signal });
      if (!res.ok) throw new Error("Lookup failed");
      if (res?.data?.receipt) {
        const r = res.data.receipt;
        const durationMs = Number(r?.durationMs || 0);
        const freeTierAppliedMs = Number(r?.freeTierAppliedMs || 0);
        const creditsCharged = Number(r?.creditsCharged || 0);
        setServerActual({ durationMs, freeTierAppliedMs, paidMs: Math.max(0, durationMs - freeTierAppliedMs), creditsCharged });
      }
      return res.data;
    }, meta);

    if (data) updateState((prev) => ({ ...prev, result: data, error: "" }));
    if (!data && runner.errorMessage) updateState((prev) => ({ ...prev, error: runner.errorMessage }));
  };

  return {
    state,
    updateState,
    resetState,
    lastUpdated,
    loading: runner.loading,
    runLookup,
    runner,
    confirmOpen,
    setConfirmOpen,
    serverEstimate,
    serverActual,
    serverFreeRemainingMs,
    serverHints,
    serverStatus,
    requiresCredits,
    estimatedCredits,
    balance,
    creditAccepted,
    creditCanProceed,
  };
}

function NetworkTemplate({
  title,
  description,
  audience,
  useCases,
  instructions,
  outputTitle,
  outputInterpretation,
  outputNextSteps,
  storageKey,
  apiPath,
  consentLabel,
  placeholder,
  summaryWhenEmpty,
}) {
  const tool = useNetworkTool(storageKey, apiPath);
  const outputSummary = tool.state.result ? "Result available" : summaryWhenEmpty;

  const buildSections = useMemo(
    () => () => [
        { heading: "Target", body: tool.state.target },
        { heading: "Result", body: "Result available. Review on-screen output for details." },
      ],
    [tool.state.target]
  );

  return (
    <TemplateLayout
      title={title}
      description={description}
      audience={audience}
      useCases={useCases}
      instructions={instructions}
      outputTitle={outputTitle}
      outputSummary={outputSummary}
      outputInterpretation={outputInterpretation}
      outputNextSteps={outputNextSteps}
      attributionText={attribution}
      version="1.0.0"
    >
      <TemplateExportPanel
        templateId={storageKey}
        title={title}
        category="Cybersecurity"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <NetworkNotice />

      <div className="mt-4 space-y-3">
        <ComputeEstimatePanel estimate={tool.runner.compute.pre || tool.runner.compute.live} />
        <ComputeSummaryPanel toolId={storageKey} summary={tool.runner.compute.post} />
        {tool.requiresCredits && (
          <CreditConsent
            estimatedCredits={tool.estimatedCredits}
            currentBalance={tool.balance}
            onAccept={() => {}}
          />
        )}
        <ComputeMeter
          estimate={
            tool.serverEstimate?.ok
              ? {
                  estimatedCpuMs: Number(tool.serverEstimate.estimatedCpuMs || 0),
                  estimatedWallTimeMs: Number(tool.serverEstimate.estimatedWallTimeMs || 0),
                  estimatedCreditCost: Number(tool.serverEstimate.estimatedCreditCost || 0),
                  freeTierAppliedMs: Number(tool.serverEstimate.freeTierAppliedMs || 0),
                  paidMs: Number(tool.serverEstimate.paidMs || 0),
                  allowed: Boolean(tool.serverEstimate.allowed),
                  reasons: Array.isArray(tool.serverEstimate.reasons) ? tool.serverEstimate.reasons : [],
                }
              : null
          }
          actual={tool.serverActual || null}
          tier={typeof tool.serverFreeRemainingMs === "number" ? { freeMsRemainingToday: tool.serverFreeRemainingMs } : null}
          remainingCredits={typeof tool.serverEstimate?.requiredCreditsIfAny === "number" ? null : null}
          runStatus={tool.serverStatus || "success"}
          costHints={tool.serverHints || []}
          compact
        />
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mt-4">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(tool.lastUpdated)}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={tool.resetState}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Reset
          </button>
          <button
            type="button"
            disabled={!tool.state.consent || !tool.state.target || tool.loading || (tool.requiresCredits && !tool.creditCanProceed)}
            onClick={tool.runLookup}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {tool.loading ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <label className="text-sm font-semibold text-slate-900">
          Target
          <input
            type="text"
            value={tool.state.target}
            onChange={(e) => tool.updateState((prev) => ({ ...prev, target: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder={placeholder}
          />
        </label>
        <label className="mt-3 flex items-center gap-2 text-sm text-slate-800">
          <input
            type="checkbox"
            checked={tool.state.consent}
            onChange={(e) => tool.updateState((prev) => ({ ...prev, consent: e.target.checked }))}
          />
          {consentLabel}
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Result</p>
        {tool.loading ? (
          <p className="text-sm text-slate-700">Loading...</p>
        ) : tool.state.error ? (
          <p className="text-sm font-semibold text-rose-700" role="alert" aria-live="polite">
            {tool.state.error}
          </p>
        ) : tool.state.result ? (
          <div className="mt-2 space-y-2">
            <p className="text-sm text-slate-700">Result received. Review the key fields below.</p>
            <details className="rounded-xl border border-slate-200 bg-white p-3">
              <summary className="cursor-pointer text-sm font-semibold text-slate-900">Show details</summary>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-800">{JSON.stringify(tool.state.result, null, 2)}</pre>
            </details>
          </div>
        ) : (
          <p className="text-sm text-slate-700">Run a lookup to see details.</p>
        )}
      </div>
    </TemplateLayout>
  );
}

export function DNSLookup() {
  return (
    <NetworkTemplate
      title="DNS Lookup Explorer"
      description="Passive DNS lookups with guardrails."
      audience="Network and security engineers."
      useCases={["Check A and AAAA records for owned domains.", "Inspect TXT records for SPF/DMARC.", "Validate DNS changes during cutovers."]}
      instructions={[
        "Enter a domain you own or are authorised to inspect.",
        "Confirm permission and run the lookup.",
        "Review the records and act accordingly.",
      ]}
      outputTitle="DNS result"
      outputInterpretation="Use these records for validation only. Do not treat as assurance."
      outputNextSteps={["Verify SPF/DMARC alignment.", "Check TTL values before changes.", "Document changes in change control."]}
      storageKey="cyber-network-dns-lookup"
      apiPath="dns-lookup"
      consentLabel="I confirm I own or have permission to inspect this domain."
      placeholder="example.com"
      summaryWhenEmpty="No lookup yet"
    />
  );
}

export function WhoisSummary() {
  return (
    <NetworkTemplate
      title="WHOIS and Domain Age Summary"
      description="Summarise registration and age for permitted domains."
      audience="Security analysts and platform teams."
      useCases={["Check domain age during triage.", "Record WHOIS summary for vendor due diligence.", "Validate ownership."]}
      instructions={[
        "Enter a domain you own or are authorised to inspect.",
        "Confirm permission and run the summary.",
        "Use the output to inform your decision.",
      ]}
      outputTitle="WHOIS result"
      outputInterpretation="Domain age and registrar data can hint at risk but must be combined with other checks."
      outputNextSteps={["Review registrar and contact fields.", "Check for privacy-protected data.", "Record in your case notes."]}
      storageKey="cyber-network-whois-summary"
      apiPath="whois-summary"
      consentLabel="I confirm I own or have permission to inspect this domain."
      placeholder="example.com"
      summaryWhenEmpty="No lookup yet"
    />
  );
}

export function TLSInspector() {
  return (
    <NetworkTemplate
      title="TLS Certificate Inspector"
      description="Fetch certificate metadata for allowed hosts."
      audience="Security engineers and SRE."
      useCases={["Check expiry and issuer.", "Confirm SAN entries for services.", "Document certificates for change control."]}
      instructions={[
        "Enter a hostname you own or are authorised to inspect.",
        "Confirm permission and run the lookup.",
        "Review issuer, SAN, and expiry.",
      ]}
      outputTitle="TLS details"
      outputInterpretation="Use to validate certificate basics. Always test with your own monitoring for expiry and trust."
      outputNextSteps={["Set alerts for expiry and rotation.", "Ensure intermediate certificates are present.", "Use modern TLS settings at the endpoint."]}
      storageKey="cyber-network-tls-inspector"
      apiPath="tls-inspect"
      consentLabel="I confirm I own or have permission to inspect this host."
      placeholder="example.com"
      summaryWhenEmpty="No lookup yet"
    />
  );
}

export function IPReputation() {
  return (
    <NetworkTemplate
      title="IP Reputation and ASN Explainer"
      description="Look up IP reputation indicators and ASN summary with safe defaults."
      audience="Security analysts and responders."
      useCases={["Check IPs during incident triage.", "Capture ASN and geolocation hints.", "Document findings in tickets."]}
      instructions={[
        "Enter an IP address you are permitted to inspect.",
        "Confirm permission and run the lookup.",
        "Review ASN, geolocation, and any flags.",
      ]}
      outputTitle="IP reputation"
      outputInterpretation="Reputation data is advisory only. Combine with logs, context, and threat intel."
      outputNextSteps={["Block if malicious and confirmed.", "Add to watchlist if uncertain.", "Document in incident notes."]}
      storageKey="cyber-network-ip-reputation"
      apiPath="ip-reputation"
      consentLabel="I confirm I have permission to inspect this IP."
      placeholder="203.0.113.10"
      summaryWhenEmpty="No lookup yet"
    />
  );
}

export const networkTools = {
  "cyber-network-dns-lookup": DNSLookup,
  "cyber-network-whois-summary": WhoisSummary,
  "cyber-network-tls-inspector": TLSInspector,
  "cyber-network-ip-reputation": IPReputation,
};
