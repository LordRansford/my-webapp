"use client";

import { useEffect } from "react";
import Link from "next/link";
import { captureException } from "@/lib/sentry-utils";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Client-side error boundary: log to console and Sentry
    console.error("ui:error", { message: error?.message || "unknown" });
    // Capture error in Sentry if available
    if (error) {
      captureException(error, {
        tags: {
          component: "ErrorBoundary",
        },
        contexts: {
          error: {
            resetAvailable: typeof reset === "function",
          },
        },
      });
    }
  }, [error, reset]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900">500</h1>
        <h2 className="mt-4 text-2xl font-semibold text-slate-700">
          Something went wrong
        </h2>
        <p className="mt-4 text-slate-600 max-w-md">
          We&apos;re sorry, but something unexpected happened. Our team has been notified.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}


