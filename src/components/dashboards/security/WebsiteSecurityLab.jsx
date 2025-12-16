"use client";

import { useState } from "react";

export default function WebsiteSecurityLab() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);

    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      setError("Please enter a valid URL such as https://example.com");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/dashboards/website-security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: parsed.href }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("There was a problem analysing this site. Please try again or use a different URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="website-url">
          Website URL
        </label>
        <input
          id="website-url"
          type="url"
          inputMode="url"
          placeholder="https://example.com"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? "Analysing..." : "Analyse"}
        </button>
      </form>

      {error && (
        <p className="text-sm text-rose-600" aria-live="polite">
          {error}
        </p>
      )}

      {!result && !loading && !error && (
        <p className="text-xs text-slate-500">
          Only use this tool on sites you own or are allowed to test. Results are educational and do not replace a professional security audit.
        </p>
      )}

      {result && (
        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Connection</h3>
            <p className="mt-1 text-xs text-slate-600">
              Scheme: <span className="font-mono">{result.scheme}</span>
            </p>
            <p className="mt-1 text-xs text-slate-600">
              TLS version: <span className="font-mono">{result.tlsVersion || "Not available"}</span>
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Redirects:{" "}
              <span className="font-mono">
                {result.redirects && result.redirects.length > 0 ? result.redirects.join(" → ") : "None observed"}
              </span>
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Certificate</h3>
            <p className="mt-1 text-xs text-slate-600">
              Issuer: <span className="font-mono">{result.certificate?.issuer || "Not available from API"}</span>
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Valid from: <span className="font-mono">{result.certificate?.validFrom || "Unknown"}</span>
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Valid to: <span className="font-mono">{result.certificate?.validTo || "Unknown"}</span>
            </p>
          </section>

          <section className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Security headers</h3>
            <div className="mt-2 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
              <div>
                <p>
                  Content Security Policy: <span className="font-mono">{result.headers?.csp || "Not set"}</span>
                </p>
                <p className="mt-1">
                  X Frame Options: <span className="font-mono">{result.headers?.xFrameOptions || "Not set"}</span>
                </p>
              </div>
              <div>
                <p>
                  Referrer Policy: <span className="font-mono">{result.headers?.referrerPolicy || "Not set"}</span>
                </p>
                <p className="mt-1">
                  HSTS: <span className="font-mono">{result.headers?.hsts || "Not set"}</span>
                </p>
              </div>
            </div>
            {result.summary && <p className="mt-3 text-xs text-slate-700">{result.summary}</p>}
          </section>
        </div>
      )}
    </div>
  );
}
