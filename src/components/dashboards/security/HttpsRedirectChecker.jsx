"use client";

import { useState } from "react";

export default function HttpsRedirectChecker() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);

    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      setError("Please enter a valid URL such as http://example.com");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/dashboards/https-redirects", {
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
      setError("There was a problem following redirects for this site. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="redirect-url">
          URL to check
        </label>
        <input
          id="redirect-url"
          type="url"
          inputMode="url"
          placeholder="http://example.com"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? "Tracing..." : "Trace redirects"}
        </button>
      </form>

      {error && (
        <p className="text-sm text-rose-600" aria-live="polite">
          {error}
        </p>
      )}

      {!result && !loading && !error && (
        <p className="text-xs text-slate-500">This tool follows redirects through your backend so that you can see how users are moved from insecure to secure pages.</p>
      )}

      {result && (
        <div className="space-y-3">
          <ol className="space-y-2 text-xs text-slate-700">
            {result.chain?.map((hop, index) => (
              <li key={hop.url} className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-2">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-600 text-[10px] font-medium text-white">
                  {index + 1}
                </span>
                <div>
                  <p className="font-mono break-all">{hop.url}</p>
                  <p className="mt-1 text-[11px] text-slate-600">
                    Scheme: {hop.scheme} Status: {hop.status}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          {result.summary && <p className="text-xs text-slate-700">{result.summary}</p>}
        </div>
      )}
    </div>
  );
}
