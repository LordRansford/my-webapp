"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MarketingPageTemplate } from "@/components/templates/PageTemplates";

type Lang = "js" | "py";

const EXAMPLES: Record<Lang, Array<{ title: string; code: string }>> = {
  js: [
    { title: "Hello world", code: `console.log("Hello world")` },
    { title: "Simple loop", code: `let sum = 0;\nfor (let i = 1; i <= 5; i++) sum += i;\nconsole.log("sum", sum);` },
    { title: "Tiny transform", code: `const nums = [1, 2, 3, 4];\nconst doubled = nums.map((n) => n * 2);\nconsole.log(doubled.join(", "));` },
  ],
  py: [
    { title: "Hello world", code: `print("Hello world")` },
    { title: "Simple loop", code: `total = 0\nfor i in range(1, 6):\n  total += i\nprint("sum", total)` },
    { title: "Tiny transform", code: `nums = [1, 2, 3, 4]\ndoubled = [n * 2 for n in nums]\nprint(",".join(str(n) for n in doubled))` },
  ],
};

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function CodeLabPage() {
  const [lang, setLang] = useState<Lang>("js");
  const [exampleIdx, setExampleIdx] = useState(0);
  const [code, setCode] = useState(EXAMPLES.js[0].code);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("idle");
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [meta, setMeta] = useState<{ durationMs: number; freeTierAppliedMs: number; chargedCredits: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const examples = useMemo(() => EXAMPLES[lang], [lang]);

  useEffect(() => {
    setExampleIdx(0);
    setCode(EXAMPLES[lang][0].code);
    setStdout("");
    setStderr("");
    setMeta(null);
    setError(null);
    setJobId(null);
    setStatus("idle");
    setBusy(false);
  }, [lang]);

  useEffect(() => {
    let alive = true;
    async function poll(id: string) {
      setStatus("queued");
      for (let i = 0; i < 60; i++) {
        if (!alive) return;
        const res = await fetch(`/api/jobs/${encodeURIComponent(id)}`);
        const data = await res.json().catch(() => null);
        const s = data?.job?.status || null;
        if (s) setStatus(String(s));
        if (s === "succeeded") {
          setStdout(String(data?.job?.resultJson?.stdout || ""));
          setStderr(String(data?.job?.resultJson?.stderr || ""));
          setMeta({
            durationMs: Number(data?.job?.durationMs || 0),
            freeTierAppliedMs: Number(data?.job?.freeTierAppliedMs || 0),
            chargedCredits: Number(data?.job?.chargedCredits || 0),
          });
          setBusy(false);
          return;
        }
        if (s === "denied" || s === "failed" || s === "cancelled") {
          setError(String(data?.job?.errorMessage || "Job did not complete."));
          setBusy(false);
          return;
        }
        await sleep(600);
      }
      setError("Timed out waiting for job.");
      setBusy(false);
    }

    if (jobId) poll(jobId);
    return () => {
      alive = false;
    };
  }, [jobId]);

  const setExample = (idx: number) => {
    setExampleIdx(idx);
    setCode(examples[idx].code);
  };

  const reset = () => {
    setCode(examples[exampleIdx].code);
    setInput("");
    setStdout("");
    setStderr("");
    setMeta(null);
    setError(null);
    setStatus("idle");
    setJobId(null);
    setBusy(false);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      setError("Could not copy to clipboard. Please copy manually.");
    }
  };

  const run = async () => {
    setBusy(true);
    setError(null);
    setStdout("");
    setStderr("");
    setMeta(null);
    setStatus("creating");
    setJobId(null);

    const payload = { language: lang, code, input, presets: [] };
    const res = await fetch("/api/jobs/create", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ toolId: "code-runner", mode: "enqueue", inputBytes: code.length, payload }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.jobId) {
      setError(String(data?.error || "Unable to create job."));
      setBusy(false);
      setStatus("idle");
      return;
    }
    setJobId(String(data.jobId));
  };

  return (
    <MarketingPageTemplate breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Code Lab" }]}>
      <main className="mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8 space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold text-slate-600">Tools</p>
          <h1 className="text-3xl font-semibold text-slate-900">Code Lab</h1>
          <p className="text-slate-700">Run small snippets in a secure sandbox. No network. No filesystem. No OS shell access.</p>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
            Runs in a secure sandbox with limits: 8 seconds, 128 MB, no network. JS runs in-browser; Python runs in a remote locked-down runner.
          </div>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setLang("js")}
              className={`rounded-full px-4 py-2 text-sm font-semibold border ${
                lang === "js" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-900 border-slate-300"
              }`}
            >
              JavaScript (runs in browser)
            </button>
            <button
              type="button"
              onClick={() => setLang("py")}
              className={`rounded-full px-4 py-2 text-sm font-semibold border ${
                lang === "py" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-900 border-slate-300"
              }`}
            >
              Python (sandboxed runner)
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {examples.map((ex, idx) => (
              <button
                key={ex.title}
                type="button"
                onClick={() => setExample(idx)}
                className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                  exampleIdx === idx ? "bg-emerald-50 text-emerald-900 border-emerald-200" : "bg-white text-slate-700 border-slate-200"
                }`}
              >
                {ex.title}
              </button>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs font-semibold text-slate-700">Code</span>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={12}
                className="w-full rounded-2xl border border-slate-200 bg-white p-3 font-mono text-sm text-slate-900"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-semibold text-slate-700">Input (optional)</span>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={12}
                className="w-full rounded-2xl border border-slate-200 bg-white p-3 font-mono text-sm text-slate-900"
              />
            </label>
          </div>

          {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">{error}</div> : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={run}
                disabled={busy}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300"
              >
                {busy ? "Running..." : "Run"}
              </button>
              <button
                type="button"
                onClick={reset}
                disabled={busy}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:bg-slate-200"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={copyCode}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-slate-600">
              No network. No filesystem. CPU/Memory/Time limited. Python runs in remote sandbox; JS runs in-browser.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 space-y-1">
            <p className="m-0 font-semibold text-slate-800">Status</p>
            <p className="m-0">
              {status === "idle"
                ? "Idle"
                : status === "creating"
                  ? "Submitting job"
                  : status === "queued"
                    ? "Queued (waiting for runner)"
                    : status === "running"
                      ? "Running in sandbox"
                      : status}
            </p>
            {meta ? (
              <p className="m-0 text-slate-700">
                Duration: {meta.durationMs} ms · Free tier: {meta.freeTierAppliedMs} ms · Charged credits: {meta.chargedCredits}
              </p>
            ) : null}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Stdout</h2>
              <pre className="mt-2 min-h-[140px] overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 whitespace-pre-wrap">
                {stdout || "No output yet."}
              </pre>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Stderr</h2>
              <pre className="mt-2 min-h-[140px] overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 whitespace-pre-wrap">
                {stderr || "No errors."}
              </pre>
            </div>
          </div>

          {meta ? (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold text-slate-700">runtime (ms)</p>
                <p className="mt-1 text-sm text-slate-900">{meta.durationMs}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold text-slate-700">free tier applied (ms)</p>
                <p className="mt-1 text-sm text-slate-900">{meta.freeTierAppliedMs}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold text-slate-700">credits charged</p>
                <p className="mt-1 text-sm text-slate-900">{meta.chargedCredits}</p>
              </div>
            </div>
          ) : null}
        </section>

        <div className="flex items-center justify-between">
          <Link href="/tools" className="text-sm font-semibold text-emerald-700 hover:underline">
            Back to tools
          </Link>
          <Link href="/studios" className="text-sm font-semibold text-slate-700 hover:underline">
            Go to studios
          </Link>
        </div>
      </main>
    </MarketingPageTemplate>
  );
}


