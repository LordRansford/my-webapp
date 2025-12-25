/**
 * HOC to wrap tool pages with error boundary
 */
import React from "react";
import ToolsErrorBoundary from "./ToolsErrorBoundary";

export function withToolErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  toolId: string
) {
  return function WrappedComponent(props: P) {
    return (
      <ToolsErrorBoundary toolId={toolId}>
        <Component {...props} />
      </ToolsErrorBoundary>
    );
  };
}

