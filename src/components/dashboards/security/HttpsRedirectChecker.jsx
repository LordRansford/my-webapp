"use client";

import { useState } from "react";
import { useToolRunner } from "@/hooks/useToolRunner";
import { normaliseUrl } from "@/lib/tooling/validation";
import { postJson } from "@/lib/tooling/http";
import ComputeMeterPanel from "@/components/compute/ComputeMeterPanel";
import RunCostPreview from "@/components/compute/RunCostPreview";

export default function HttpsRedirectChecker() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const runner = useToolRunner({ minIntervalMs: 800, toolId: "https-redirect-checker" });
  const toolId = "https-redirect-checker";

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

    const meta = { inputBytes: parsed.url.length, steps: 6, expectedWallMs: 1200 };
    const pre = runner.prepare(meta);
    if (pre.estimate.creditShortfall) {
      setConfirmOpen(true);
      return;
    }

    const data = await runner.run(async (signal) => {
      const res = await postJson("/api/dashboards/https-redirects", { url: parsed.url }, { signal });
      if (!res.ok) throw new Error("Request failed");
      return res.data;
    }, meta);

    if (data) setResult(data);
    if (!data && runner.errorMessage) setError(runner.errorMessage);
  };

  return (
    <div className="space-y-4">
      <RunCostPreview estimate={runner.compute.pre} creditsBalance={runner.compute.creditsVisible ? runner.compute.creditsBalance : null} />
      <ComputeMeterPanel toolId={toolId} phase="pre" estimate={runner.compute.pre} inputBytes={runner.compute.lastInputBytes || undefined} />
      {runner.compute.post ? <ComputeMeterPanel toolId={toolId} phase="post" estimate={runner.compute.post} inputBytes={runner.compute.lastInputBytes || undefined} /> : null}

      {confirmOpen ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
          <p className="text-sm font-semibold text-amber-900">Credit warning</p>
          <p className="mt-1 text-sm text-amber-900">This run may exceed your visible credit balance. You can cancel or continue.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="button"
              onClick={() => {
                setConfirmOpen(false);
                runner.clearCompute();
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button primary"
              onClick={async () => {
                setConfirmOpen(false);
                const parsed = normaliseUrl(url);
                if (!parsed.ok) return;
                const meta = { inputBytes: parsed.url.length, steps: 6, expectedWallMs: 1200 };
                const data = await runner.run(async (signal) => {
                  const res = await postJson("/api/dashboards/https-redirects", { url: parsed.url }, { signal });
                  if (!res.ok) throw new Error("Request failed");
                  return res.data;
                }, meta);
                if (data) setResult(data);
              }}
            >
              Continue
            </button>
          </div>
        </div>
      ) : null}

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
