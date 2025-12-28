"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "@/components/notes/ErrorBoundary";

function LoadingSkeleton() {
  return (
    <div className="rn-skeleton rn-skeleton-chart" role="status" aria-label="Loading dashboard">
      <span className="visually-hidden">Loading dashboard content...</span>
    </div>
  );
}

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="rn-callout" role="alert">
      <div className="rn-callout-title">Dashboard unavailable</div>
      <div className="rn-callout-body">
        <p>This dashboard could not be loaded. This might be a temporary issue.</p>
        {process.env.NODE_ENV !== "production" && error && (
          <details className="mt-2">
            <summary className="cursor-pointer text-sm">Technical details</summary>
            <pre className="mt-2 overflow-auto text-xs">{error?.message || String(error)}</pre>
          </details>
        )}
        <button
          onClick={resetErrorBoundary}
          className="rn-btn rn-btn-primary rn-mt"
          type="button"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export default function DynamicDashboardLoader({ children }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingSkeleton />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

