"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

function Card({ title, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default function ArchitectureDiagramsAdminClient() {
  const [metrics, setMetrics] = useState(null);
  const [status, setStatus] = useState("Loading…");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/architecture-diagrams/metrics", { method: "GET" });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || "Could not load metrics.");
        }
        const json = await res.json();
        if (!cancelled) {
          setMetrics(json);
          setStatus("");
        }
      } catch (err) {
        if (!cancelled) setStatus("Could not load metrics.");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const mostSelected = useMemo(() => {
    if (!metrics?.variants) return null;
    const sorted = [...metrics.variants].sort((a, b) => (b.count || 0) - (a.count || 0));
    return sorted[0] || null;
  }, [metrics]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8 space-y-6">
      <header className="space-y-2 rounded-3xl bg-gradient-to-br from-slate-50 via-emerald-50/40 to-slate-50 p-8 shadow-sm ring-1 ring-slate-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Admin</p>
        <h1 className="text-3xl font-semibold text-slate-900">Architecture Diagram Studio</h1>
        <p className="text-sm text-slate-700">Aggregated metrics only. No user content is collected or displayed here.</p>
        <div className="pt-2">
          <Link href="/admin/feedback" className="text-sm font-semibold text-emerald-700 hover:underline">
            Admin home
          </Link>
        </div>
      </header>

      {status ? <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 text-sm text-slate-700 shadow-sm">{status}</div> : null}

      {metrics ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card title="Generations">
            <p className="text-3xl font-semibold text-slate-900">{metrics.generations ?? 0}</p>
          </Card>

          <Card title="Most selected variant">
            <p className="text-lg font-semibold text-slate-900">{mostSelected ? mostSelected.id : metrics.mostSelectedVariant || "minimal"}</p>
            <p className="mt-1 text-sm text-slate-700">{mostSelected ? `${mostSelected.count} selections` : ""}</p>
          </Card>

          <Card title="Exports">
            <ul className="space-y-1 text-sm text-slate-700">
              <li>SVG: {metrics.exports?.svg ?? 0}</li>
              <li>PNG: {metrics.exports?.png ?? 0}</li>
              <li>PDF requested: {metrics.exports?.pdfRequested ?? 0}</li>
            </ul>
          </Card>

          <Card title="PDF health">
            <p className="text-sm text-slate-700">
              Success rate: <span className="font-semibold text-slate-900">{Math.round((metrics.pdf?.successRate || 0) * 100)}%</span>
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Common failures</p>
            {(metrics.pdf?.commonFailures || []).length ? (
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                {metrics.pdf.commonFailures.map((f) => (
                  <li key={f.reason}>
                    {f.reason}: {f.count}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-700">No failures recorded.</p>
            )}
          </Card>

          <Card title="Performance">
            <p className="text-sm text-slate-700">Duration buckets (ms)</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {(metrics.performance?.durationBuckets || []).map((b) => (
                <li key={b.bucket}>
                  {b.bucket}: {b.count}
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Common failures">
            <p className="text-sm text-slate-700">This view is aggregated and intentionally minimal.</p>
          </Card>
        </div>
      ) : null}
    </main>
  );
}


