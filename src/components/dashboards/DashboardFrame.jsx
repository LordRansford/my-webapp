"use client";

import React from "react";

function FriendlyFallback({ title }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="m-0 text-sm font-semibold text-slate-900">{title || "Dashboard unavailable"}</p>
      <p className="mt-2 text-sm text-slate-700">
        This dashboard could not load. Please refresh the page. If it keeps failing, it will be fixed soon.
      </p>
    </div>
  );
}

class DashboardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Intentionally no console logging of dashboard contents.
  }

  render() {
    if (this.state.hasError) return <FriendlyFallback title={this.props.title} />;
    return this.props.children;
  }
}

export default function DashboardFrame({ title, children }) {
  return (
    <div className="my-6 w-full max-w-full overflow-x-auto">
      <DashboardErrorBoundary title={title}>{children}</DashboardErrorBoundary>
    </div>
  );
}


