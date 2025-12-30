"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { studioErrorHandler } from "@/lib/studios/security/errorHandler";
import { auditLogger, AuditActions } from "@/lib/studios/security/auditLogger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundaryWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Handle error securely
    const studioError = studioErrorHandler.handleError(error, "ErrorBoundaryWrapper", "ai-studio");
    
    // Log to audit
    auditLogger.log(AuditActions.ERROR_OCCURRED, "ai-studio", {
      error: {
        code: studioError.code,
        message: studioError.message
      },
      componentStack: errorInfo.componentStack
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="rounded-2xl border border-red-200 bg-red-50 p-6"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-2">Something went wrong</h3>
              <p className="text-sm text-red-800 mb-4">
                {this.state.error
                  ? studioErrorHandler.getUserFriendlyMessage(
                      studioErrorHandler.handleError(this.state.error, "Render", "ai-studio")
                    )
                  : "An error occurred while loading this component. Please try again."}
              </p>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mb-4">
                  <summary className="cursor-pointer text-sm font-medium text-red-700 mb-2">
                    Error details (development only)
                  </summary>
                  <pre className="text-xs bg-red-100 p-3 rounded overflow-auto text-red-900">
                    {this.state.error.message}
                    {"\n"}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm"
                aria-label="Retry loading component"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryWrapper;

