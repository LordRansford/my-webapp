"use client";

import dynamic from "next/dynamic";
import { ComponentType, ReactElement } from "react";
import LoadingSpinner from "./LoadingSpinner";
import ErrorBoundaryWrapper from "./ErrorBoundaryWrapper";

/**
 * Lazy load component with error boundary and loading state
 */
export function lazyLoadComponent<P extends Record<string, unknown> = Record<string, unknown>>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: ComponentType
) {
  const LazyComponent = dynamic(importFunc, {
    loading: () => (
      <div className="p-8">
        <LoadingSpinner message="Loading component..." />
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

