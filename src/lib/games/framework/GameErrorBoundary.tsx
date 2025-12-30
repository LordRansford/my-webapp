/**
 * Game Error Boundary
 * 
 * Catches errors in game components and provides graceful fallback
 * with recovery options
 */

"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  gameName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GameErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Game Error:", error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });

    // In production, you might want to log to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl border border-red-200 bg-white p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
              <h1 className="text-xl font-semibold text-slate-900">
                {this.props.gameName ? `${this.props.gameName} Error` : "Game Error"}
              </h1>
            </div>
            <p className="text-slate-700 mb-6">
              Something went wrong while running the game. This has been logged and we&apos;ll look into it.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-6">
                <summary className="text-sm font-medium text-slate-600 cursor-pointer mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs bg-slate-100 p-3 rounded-lg overflow-auto max-h-48 text-slate-800">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                type="button"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Try Again
              </button>
              <Link
                href="/games/hub"
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                Back to Games Hub
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
