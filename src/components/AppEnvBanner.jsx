"use client";

import { getAppEnv } from "@/lib/appEnv";

export default function AppEnvBanner() {
  const env = getAppEnv();
  if (env === "production") return null;

  const message = env === "staging" ? "Staging environment. Pages are open for testing." : "Local development environment.";
  const badge = `NEXT_PUBLIC_APP_ENV=${env}`;

  return (
    <div role="status" aria-live="polite" className="border-b border-slate-200 bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
        <p className="m-0 text-sm font-semibold">{message}</p>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">{badge}</span>
      </div>
    </div>
  );
}


