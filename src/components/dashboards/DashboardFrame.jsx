"use client";

import React from "react";

function clampName(s) {
  return String(s || "dashboard")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function FriendlyFallback({ title }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="m-0 text-sm font-semibold text-slate-900">{title || "Dashboard unavailable"}</p>
      <p className="mt-2 text-sm text-slate-700">
        This dashboard could not load. Please refresh the page. If it keeps failing, it will be fixed soon.
      </p>
    </div>
  );
}

class DashboardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Intentionally no console logging of dashboard contents.
  }

  render() {
    if (this.state.hasError) return <FriendlyFallback title={this.props.title} />;
    return this.props.children;
  }
}

export default function DashboardFrame({ title, children }) {
  const ref = React.useRef(null);
  const [busy, setBusy] = React.useState(null);
  const [hint, setHint] = React.useState("");

  const exportPng = async () => {
    if (!ref.current) return;
    setHint("");
    setBusy("png");
    try {
      const mod = await import("html2canvas");
      const html2canvas = mod.default || mod;
      const canvas = await html2canvas(ref.current, { backgroundColor: null, scale: 2, useCORS: true });
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("PNG export failed");
      downloadBlob(blob, `${clampName(title)}.png`);
    } catch {
      setHint("Could not export PNG. Try again.");
    } finally {
      setBusy(null);
    }
  };

  const exportCsv = async () => {
    if (!ref.current) return;
    setHint("");
    setBusy("csv");
    try {
      const table = ref.current.querySelector("table");
      if (!table) {
        setHint("No table found to export. This dashboard may not support CSV export yet.");
        return;
      }
      const rows = Array.from(table.querySelectorAll("tr")).map((tr) =>
        Array.from(tr.querySelectorAll("th,td")).map((cell) =>
          String(cell.textContent || "").replace(/\s+/g, " ").trim()
        )
      );
      const escape = (v) => {
        const s = String(v ?? "");
        if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
        return s;
      };
      const csv = rows.map((r) => r.map(escape).join(",")).join("\n");
      downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${clampName(title)}.csv`);
    } catch {
      setHint("Could not export CSV. Try again.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="my-6 w-full max-w-full overflow-x-auto">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold text-slate-900">{title || "Dashboard"}</div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
            onClick={exportCsv}
            disabled={busy === "csv" || busy === "png"}
          >
            {busy === "csv" ? "Exporting…" : "Export CSV"}
          </button>
          <button
            type="button"
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
            onClick={exportPng}
            disabled={busy === "csv" || busy === "png"}
          >
            {busy === "png" ? "Exporting…" : "Export PNG"}
          </button>
        </div>
      </div>
      {hint ? <div className="mb-3 text-xs text-slate-600">{hint}</div> : null}
      <div ref={ref}>
        <DashboardErrorBoundary title={title}>{children}</DashboardErrorBoundary>
      </div>
    </div>
  );
}


