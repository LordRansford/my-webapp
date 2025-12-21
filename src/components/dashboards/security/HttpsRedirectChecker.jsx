"use client";

import { useState } from "react";
import { useToolRunner } from "@/hooks/useToolRunner";
import { normaliseUrl } from "@/lib/tooling/validation";
import { postJson } from "@/lib/tooling/http";

export default function HttpsRedirectChecker() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const runner = useToolRunner({ minIntervalMs: 800, toolId: "https-redirect-checker" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);
    runner.resetError();

    const parsed = normaliseUrl(url);
    if (!parsed.ok) {
      setError(parsed.message);
      return;
    }

    const data = await runner.run(async (signal) => {
      const res = await postJson("/api/dashboards/https-redirects", { url: parsed.url }, { signal });
      if (!res.ok) throw new Error("Request failed");
      return res.data;
    });

    if (data) setResult(data);
    if (!data && runner.errorMessage) setError(runner.errorMessage);
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
          maxLength={2048}
          aria-invalid={Boolean(error) || Boolean(runner.errorMessage)}
        />
        <button
          type="submit"
          disabled={runner.loading}
          className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {runner.loading ? "Tracing..." : "Trace redirects"}
        </button>
      </form>

      {error || runner.errorMessage ? (
        <p className="text-sm text-rose-600" role="alert" aria-live="polite">
          {error || runner.errorMessage}
        </p>
      ) : null}

      {!result && !runner.loading && !(error || runner.errorMessage) && (
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
                  <p className="mt-1 text-sm text-slate-600">
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
