"use client";

import { useState } from "react";
import { useToolRunner } from "@/hooks/useToolRunner";
import { isProbablyDomain, safeTrim } from "@/lib/tooling/validation";
import { postJson } from "@/lib/tooling/http";

export default function DnsEmailSecurityDashboard() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const runner = useToolRunner({ minIntervalMs: 800, toolId: "dns-email-security-dashboard" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);

    const trimmed = safeTrim(domain, 253).toLowerCase();
    if (!isProbablyDomain(trimmed)) {
      setError("This input does not look right. Try a domain like example.com");
      return;
    }

    runner.resetError();
    const data = await runner.run(async (signal) => {
      const res = await postJson("/api/dashboards/dns-email-security", { domain: trimmed }, { signal });
      if (!res.ok) throw new Error("Request failed");
      return res.data;
    });

    if (data) setResult(data);
    if (!data && runner.errorMessage) setError(runner.errorMessage);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="dns-domain">
          Domain name
        </label>
        <div className="flex-1 relative" style={{ zIndex: 10 }}>
          <input
            id="dns-domain"
            type="text"
            placeholder="example.com"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            style={{
              pointerEvents: "auto",
              position: "relative",
              zIndex: 10,
            }}
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
            maxLength={253}
            aria-invalid={Boolean(error) || Boolean(runner.errorMessage)}
          />
        </div>
        <button
          type="submit"
          disabled={runner.loading}
          className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {runner.loading ? "Checking..." : "Check records"}
        </button>
      </form>

      {(error || runner.errorMessage) && (
        <div 
          className="rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3"
          style={{
            pointerEvents: "none",
            position: "relative",
            zIndex: 1,
            marginTop: "0.5rem",
          }}
          role="alert"
        >
          <p className="text-sm text-rose-700 font-medium" aria-live="polite">
            {error || runner.errorMessage}
          </p>
        </div>
      )}

      {!result && !runner.loading && !(error || runner.errorMessage) && (
        <p className="text-xs text-slate-500">This uses only public DNS records. It does not send any mail or perform intrusive scanning.</p>
      )}

      {result && (
        <div className="grid gap-4 md:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Web presence</h3>
            <p className="mt-1 text-xs text-slate-600">A and AAAA records:</p>
            <ul className="mt-1 space-y-1 text-xs font-mono text-slate-700">
              {result.aRecords?.length ? result.aRecords.map((ip) => <li key={ip}>{ip}</li>) : <li>No records found</li>}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Mail routing</h3>
            <p className="mt-1 text-xs text-slate-600">MX records:</p>
            <ul className="mt-1 space-y-1 text-xs font-mono text-slate-700">
              {result.mxRecords?.length ? result.mxRecords.map((mx) => <li key={mx}>{mx}</li>) : <li>No MX records found</li>}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Email protection</h3>
            <p className="mt-1 text-xs text-slate-600">
              SPF: <span className="font-mono">{result.spf?.record || "Not found"}</span>
            </p>
            <p className="mt-1 text-xs text-slate-600">
              SPF assessment: <span className="font-semibold">{result.spf?.assessment || "Unknown"}</span>
            </p>
            <p className="mt-3 text-xs text-slate-600">
              DMARC: <span className="font-mono">{result.dmarc?.record || "Not found"}</span>
            </p>
            <p className="mt-1 text-xs text-slate-600">
              DMARC policy: <span className="font-semibold">{result.dmarc?.policy || "None"}</span>
            </p>
          </section>

          <section className="md:col-span-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Summary</h3>
            <p className="mt-1 text-xs text-slate-700">{result.summary || "No summary provided by API."}</p>
          </section>
        </div>
      )}
    </div>
  );
}
