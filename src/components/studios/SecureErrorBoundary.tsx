"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, AlertCircle } from "lucide-react";
import { studioErrorHandler } from "@/lib/studios/security/errorHandler";
import { auditLogger, AuditActions } from "@/lib/studios/security/auditLogger";

interface Props {
  children: ReactNode;
  studio: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  isRetrying: boolean;
}

/**
 * Secure Error Boundary for Studios
 * 
 * Catches errors, logs them securely, and displays user-friendly messages
 * without exposing sensitive information.
 */
export default class SecureErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Handle error securely
    studioErrorHandler.handleError(error, "ErrorBoundary", this.props.studio);
    
    // Store error info for development only
    if (process.env.NODE_ENV === "development") {
      this.setState({ errorInfo });
    }

    // Log to audit
    auditLogger.log(AuditActions.ERROR_OCCURRED, this.props.studio, {
      errorMessage: error.message,
      errorStack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: this.state.retryCount + 1,
      isRetrying: true
    });
    
    // Log retry attempt
    auditLogger.log(AuditActions.RETRY_ATTEMPTED, this.props.studio, {
      retryCount: this.state.retryCount + 1,
      previousError: this.state.error?.message
    });
    
    // Reset retrying state after a brief delay
    setTimeout(() => {
      this.setState({ isRetrying: false });
    }, 100);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const userMessage = "Something went wrong. Please try again or refresh the page.";
      const isRetryable = this.state.error && studioErrorHandler.isRetryable(
        studioErrorHandler.handleError(this.state.error, "ErrorBoundary", this.props.studio)
      );

      return (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6" role="alert">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {isRetryable ? (
                <AlertCircle className="w-6 h-6 text-amber-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-rose-900 mb-2">
                {isRetryable ? "Temporary issue detected" : "Something went wrong"}
              </h3>
              <p className="text-sm text-rose-800 mb-4">
                {isRetryable 
                  ? "This appears to be a temporary issue. You can try again, or refresh the page."
                  : userMessage}
              </p>
              {this.state.retryCount > 0 && (
                <p className="text-xs text-rose-700 mb-4">
                  Retry attempt {this.state.retryCount}
                </p>
              )}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mb-4">
                  <summary className="cursor-pointer text-xs font-semibold text-rose-700 mb-2">
                    Technical Details (Development Only)
                  </summary>
                  <pre className="text-xs bg-rose-100 p-3 rounded overflow-auto max-h-48">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              <div className="flex items-center gap-3">
                <button
                  onClick={this.handleReset}
                  disabled={this.state.isRetrying}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                  aria-label="Retry loading this section"
                  type="button"
                >
                  <RefreshCw className={`w-4 h-4 ${this.state.isRetrying ? "animate-spin" : ""}`} aria-hidden="true" />
                  {this.state.isRetrying ? "Retrying..." : "Try Again"}
                </button>
                {this.state.retryCount >= 2 && (
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                    aria-label="Refresh the entire page"
                    type="button"
                  >
                    Refresh Page
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

