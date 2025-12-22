"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { AccessOrder, meetsAccess, type AccessLevel } from "@/lib/accessLevels";
import AccessHint from "./AccessHint";
import { useAnalytics } from "@/hooks/useAnalytics";
import { getTestingOverrideDecision } from "@/lib/testingMode";

type Props = {
  requiredLevel: AccessLevel;
  fallbackMessage?: string;
  showUpgradeHint?: boolean;
  children: React.ReactNode;
};

export default function AccessGate({ requiredLevel, fallbackMessage, showUpgradeHint = true, children }: Props) {
  const { data: session } = useSession();
  const [plan, setPlan] = useState<AccessLevel>("public");
  const analytics = useAnalytics();
  const testing = getTestingOverrideDecision().allowed;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        if (testing) {
          if (!cancelled) setPlan("professional");
          return;
        }
        const res = await fetch("/api/billing/summary");
        if (!res.ok) throw new Error("summary");
        const data = await res.json();
        const level: AccessLevel =
          data?.plan === "supporter"
            ? "supporter"
            : data?.plan === "pro" || data?.plan === "professional"
            ? "professional"
            : session?.user?.id
            ? "registered"
            : "public";
        if (!cancelled) setPlan(level);
      } catch {
        if (!cancelled) setPlan(session?.user?.id ? "registered" : "public");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, testing]);

  const allowed = useMemo(() => testing || meetsAccess(requiredLevel, plan), [requiredLevel, plan, testing]);

  useEffect(() => {
    if (!allowed) {
      analytics.track({ type: "access_gate_locked" as any, requiredLevel, plan } as any);
    }
    // fire once on mount per gate
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed]);

  if (allowed) return <>{children}</>;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-slate-900">This feature is available to higher access levels.</p>
        <p className="text-sm text-slate-700">
          Current: {plan}. Required: {requiredLevel}.
        </p>
        {fallbackMessage ? <AccessHint message={fallbackMessage} /> : null}
        {showUpgradeHint ? (
          <AccessHint
            message="Create an account or sign in to continue."
            detail="Accounts save your progress and enable certificates and downloads."
          />
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Link href="/signin" className="button">
            Sign in
          </Link>
          <Link href="/pricing" className="link">
            See access options
          </Link>
        </div>
      </div>
    </div>
  );
}


