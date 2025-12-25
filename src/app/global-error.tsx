"use client";

import React from "react";
import ErrorPanel from "@/components/tools/ErrorPanel";
import type { ToolError } from "@/components/tools/ErrorPanel";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const [debugReport, setDebugReport] = React.useState<string>("");

  React.useEffect(() => {
    // Log error with consistent prefix
    console.error("[TOOLS-ERROR]", {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      route: typeof window !== "undefined" ? window.location.pathname : "unknown",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      timestamp: new Date().toISOString(),
    });

    // Generate debug report
    const report = {
      error: {
        message: error.message,
        stack: error.stack,
        digest: error.digest,
      },
      context: {
        route: typeof window !== "undefined" ? window.location.pathname : "unknown",
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
        buildId: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "unknown",
      },
    };
    setDebugReport(JSON.stringify(report, null, 2));
  }, [error]);

  const handleCopyDebugReport = () => {
    navigator.clipboard.writeText(debugReport);
    alert("Debug report copied to clipboard");
  };

  const toolError: ToolError = {
    code: "global_error",
    message: error.message || "An unexpected error occurred",
    fixSuggestion: "Try refreshing the page. If the error persists, use the debug report to get help.",
  };

  return (
    <html>
      <body>
        <div className="mx-auto max-w-4xl p-6">
          <h1 className="mb-4 text-2xl font-semibold text-slate-900">Something went wrong</h1>
          <ErrorPanel error={toolError} />
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h2 className="mb-2 text-sm font-semibold text-slate-900">Where</h2>
              <p className="text-sm text-slate-700">
                Route: {typeof window !== "undefined" ? window.location.pathname : "unknown"}
              </p>
              {error.digest && (
                <p className="text-sm text-slate-700">Error ID: {error.digest}</p>
              )}
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h2 className="mb-2 text-sm font-semibold text-slate-900">What you can do</h2>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                <li>Refresh the page</li>
                <li>Clear your browser cache</li>
                <li>Try a different browser</li>
                <li>Report this issue with the debug report below</li>
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-slate-900">Debug Report</h2>
                <button
                  type="button"
                  onClick={handleCopyDebugReport}
                  className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                >
                  Copy debug report
                </button>
              </div>
              <pre className="overflow-auto rounded bg-slate-50 p-3 text-xs text-slate-800 max-h-64">
                {debugReport}
              </pre>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={reset}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Try again
              </button>
              <button
                type="button"
                onClick={() => window.location.href = "/"}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Go home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

