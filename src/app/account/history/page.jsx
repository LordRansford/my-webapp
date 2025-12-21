"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ExportHistoryPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/account/history")
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(() => setData({ authenticated: false, recentToolRuns: [], recentDownloads: [] }));
  }, []);

  const recentToolRuns = data?.recentToolRuns || [];
  const recentDownloads = data?.recentDownloads || [];

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8">
      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Account</p>
        <h1 className="text-3xl font-semibold text-slate-900">My history</h1>
        <p className="text-base text-slate-700">
          This page shows recent downloads and tool runs tied to your account. CPD summary will sit here later.
        </p>
        {!data ? (
          <p className="text-sm text-slate-700">Loading your history...</p>
        ) : data.authenticated ? null : (
          <p className="text-sm text-slate-700">
            You are not signed in. You can still browse everything. Sign in if you want history saved across devices.
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Link href="/signin" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Sign in
          </Link>
          <Link href="/pricing" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
            See plans
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recent template downloads</h2>
          {recentDownloads.length === 0 ? (
            <p className="mt-3 text-sm text-slate-700">No downloads yet.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-slate-800">
              {recentDownloads.map((d) => (
                <li key={d.id} className="rounded-2xl bg-slate-50 px-3 py-2">
                  <div className="font-semibold text-slate-900">{d.templateId}</div>
                  <div className="text-xs text-slate-700">
                    {d.licenseChoice === "internal_use" ? "Internal use" : "Commercial use"} · Attribution{" "}
                    {d.signaturePolicyApplied === "kept" ? "kept" : "removed"} · {new Date(d.timestamp).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recent tool runs</h2>
          {recentToolRuns.length === 0 ? (
            <p className="mt-3 text-sm text-slate-700">No tool runs yet.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-slate-800">
              {recentToolRuns.map((r) => (
                <li key={r.id} className="rounded-2xl bg-slate-50 px-3 py-2">
                  <div className="font-semibold text-slate-900">{r.toolId}</div>
                  <div className="text-xs text-slate-700">{new Date(r.timestamp).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
