"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type JobResponse =
  | { jobId: string; status: string }
  | {
      jobId: string;
      status: string;
      durationMs: number;
      freeTierAppliedMs: number;
      chargedCredits: number;
      remainingFreeMsToday: number;
      result?: any;
    };

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function SandboxEchoToolPage() {
  const [message, setMessage] = useState("Hello from the secure runner");
  const [repeat, setRepeat] = useState(2);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");
  const [receipt, setReceipt] = useState<{ durationMs: number; freeTierAppliedMs: number; chargedCredits: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const payload = useMemo(() => ({ message, repeat }), [message, repeat]);

  useEffect(() => {
    let alive = true;
    async function poll(id: string) {
      setStatus("queued");
      for (let i = 0; i < 60; i++) {
        if (!alive) return;
        const res = await fetch(`/api/jobs/${encodeURIComponent(id)}`, { method: "GET" });
        const data = await res.json().catch(() => null);
        const s = data?.job?.status || data?.status || null;
        if (s) setStatus(String(s));
        if (s === "succeeded") {
          const stdout = data?.job?.resultJson?.stdout || data?.job?.resultJson?.result?.stdout || data?.job?.resultJson?.stdout;
          setOutput(String(stdout || ""));
          setReceipt({
            durationMs: Number(data?.job?.durationMs || 0),
            freeTierAppliedMs: Number(data?.job?.freeTierAppliedMs || 0),
            chargedCredits: Number(data?.job?.chargedCredits || 0),
          });
          setBusy(false);
          return;
        }
        if (s === "failed" || s === "denied" || s === "cancelled") {
          setError(String(data?.job?.errorMessage || "Job did not complete."));
          setBusy(false);
          return;
        }
        await sleep(600);
      }
      setError("Timed out waiting for job.");
      setBusy(false);
    }

    if (jobId) {
      poll(jobId);
    }
    return () => {
      alive = false;
    };
  }, [jobId]);

  const submit = async () => {
    setError(null);
    setOutput("");
    setReceipt(null);
    setBusy(true);
    setStatus(null);
    setJobId(null);

    const res = await fetch("/api/jobs/create", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ toolId: "sandbox-echo", mode: "enqueue", inputBytes: message.length, payload }),
    });
    const data = (await res.json().catch(() => null)) as JobResponse | null;
    if (!res.ok || !data || !("jobId" in data)) {
      setError("Unable to create job.");
      setBusy(false);
      return;
    }
    setJobId(String((data as any).jobId));
    setStatus(String((data as any).status || "queued"));
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-6 lg:px-8 space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold text-slate-600">Tools</p>
        <h1 className="text-3xl font-semibold text-slate-900">Sandbox echo</h1>
        <p className="text-slate-700">
          This tool calls the secure compute runner. The website does not execute untrusted code.
        </p>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          This tool requires secure compute runner. It is coming soon.
        </div>
      </header>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">{error}</div> : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <label className="space-y-1 block">
          <span className="text-xs font-semibold text-slate-700">Message</span>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          />
        </label>
        <label className="space-y-1 block">
          <span className="text-xs font-semibold text-slate-700">Repeat</span>
          <input
            type="number"
            min={1}
            max={20}
            value={repeat}
            onChange={(e) => setRepeat(Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          />
        </label>
        <button
          type="button"
          onClick={submit}
          disabled={busy}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300"
        >
          {busy ? "Running..." : "Run"}
        </button>
        <p className="text-xs text-slate-600">
          Job status: <span className="font-semibold">{status || "idle"}</span> {jobId ? <span className="font-mono">({jobId})</span> : null}
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Output</h2>
        <pre className="min-h-[120px] overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 whitespace-pre-wrap">
          {output || "No output yet."}
        </pre>
        {receipt ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-semibold text-slate-700">durationMs</p>
              <p className="mt-1 text-sm text-slate-900">{receipt.durationMs}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-semibold text-slate-700">freeTierAppliedMs</p>
              <p className="mt-1 text-sm text-slate-900">{receipt.freeTierAppliedMs}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-semibold text-slate-700">chargedCredits</p>
              <p className="mt-1 text-sm text-slate-900">{receipt.chargedCredits}</p>
            </div>
          </div>
        ) : null}
      </section>

      <div>
        <Link href="/tools" className="text-sm font-semibold text-emerald-700 hover:underline">
          Back to tools
        </Link>
      </div>
    </main>
  );
}


