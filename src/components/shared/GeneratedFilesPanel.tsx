"use client";

import React from "react";
import { Download } from "lucide-react";
import type { GeneratedFile } from "@/lib/compute/generatedFiles";

function downloadText(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function GeneratedFilesPanel(props: { files: GeneratedFile[]; title?: string }) {
  const files = Array.isArray(props.files) ? props.files : [];
  if (files.length === 0) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900">{props.title || "Generated files"}</h3>
        <p className="text-[11px] text-slate-600">Copy or download these files.</p>
      </div>

      <div className="grid gap-3">
        {files.map((f) => (
          <div key={f.filename} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">{f.filename}</p>
                {f.description ? <p className="mt-0.5 text-xs text-slate-600">{f.description}</p> : null}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(f.content)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  Copy
                </button>
                <button
                  type="button"
                  onClick={() => downloadText(f.filename, f.content, f.mime || "text/plain")}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download
                </button>
              </div>
            </div>

            <pre className="whitespace-pre-wrap text-xs text-slate-900 max-h-64 overflow-auto rounded-lg bg-white border border-slate-200 p-3">
              {f.content}
            </pre>
          </div>
        ))}
      </div>
    </section>
  );
}

