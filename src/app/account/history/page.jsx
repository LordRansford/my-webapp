"use client";

import { useEffect, useState } from "react";
import { getExportHistory } from "@/lib/history/exportHistory";

export default function ExportHistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getExportHistory());
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8">
      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Account</p>
        <h1 className="text-3xl font-semibold text-slate-900">My downloads and exports</h1>
        <p className="text-base text-slate-700">
          This history is stored in your browser profile. It lists the exports you performed, the intended use, and whether
          attribution was included.
        </p>
        <p className="text-sm text-slate-700">
          These resources are educational and planning aids. They are not legal advice and do not replace professional security
          testing. Only use them on systems and data where you have permission.
        </p>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        {history.length === 0 ? (
          <p className="text-sm text-slate-700">No exports recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2 text-sm text-slate-800">
              <thead>
                <tr>
                  <th className="rounded-l-lg bg-slate-100 px-3 py-2 text-left font-semibold text-slate-900">Template</th>
                  <th className="bg-slate-100 px-3 py-2 text-left font-semibold text-slate-900">Format</th>
                  <th className="bg-slate-100 px-3 py-2 text-left font-semibold text-slate-900">Use</th>
                  <th className="bg-slate-100 px-3 py-2 text-left font-semibold text-slate-900">Attribution</th>
                  <th className="rounded-r-lg bg-slate-100 px-3 py-2 text-left font-semibold text-slate-900">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {history
                  .slice()
                  .reverse()
                  .map((item, index) => (
                    <tr key={`${item.templateId}-${index}`} className="rounded-lg">
                      <td className="rounded-l-lg bg-white px-3 py-2">{item.templateId}</td>
                      <td className="bg-white px-3 py-2 uppercase">{item.format}</td>
                      <td className="bg-white px-3 py-2 capitalize">{item.intendedUse}</td>
                      <td className="bg-white px-3 py-2">{item.includeAttribution ? "Included" : "Removed"}</td>
                      <td className="rounded-r-lg bg-white px-3 py-2">
                        {new Date(item.exportedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
