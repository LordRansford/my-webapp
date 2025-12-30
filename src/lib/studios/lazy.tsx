"use client";

import dynamic from "next/dynamic";
import { ComponentType, ReactElement } from "react";
import LoadingSpinner from "@/components/ai-studio/LoadingSpinner";
import ErrorBoundaryWrapper from "@/components/ai-studio/ErrorBoundaryWrapper";

/**
 * Lazy load studio components with error boundary and loading state
 */
export function lazyLoadStudioComponent<P extends Record<string, unknown> = Record<string, unknown>>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: ComponentType
) {
  const LazyComponent = dynamic(importFunc, {
    loading: () => (
      <div className="p-8">
        <LoadingSpinner message="Loading studio component..." />
      </div>
    ),
    ssr: false,
  });

  return function WrappedComponent(props: P): ReactElement {
    return (
      <ErrorBoundaryWrapper>
        <LazyComponent {...(props as P)} />
      </ErrorBoundaryWrapper>
    );
  };
}


