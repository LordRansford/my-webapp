"use client";

import React, { Component, ReactNode } from "react";
import ErrorPanel from "./ErrorPanel";
import type { ToolError } from "./ErrorPanel";

interface Props {
  children: ReactNode;
  toolId?: string;
}

interface State {
  hasError: boolean;
  error: ToolError | null;
}

export default class ToolsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(err: Error): State {
    return {
      hasError: true,
      error: {
        code: "component_error",
        message: err.message || "An unexpected error occurred",
        fixSuggestion: "Try refreshing the page or resetting the tool.",
      },
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Tool error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Reload the page to fully reset state
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-4xl p-6">
          <h1 className="mb-4 text-2xl font-semibold text-slate-900">Tool Error</h1>
          {this.state.error && <ErrorPanel error={this.state.error} />}
          <div className="mt-4">
            <button
              type="button"
              onClick={this.handleReset}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              Reset Tool
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

