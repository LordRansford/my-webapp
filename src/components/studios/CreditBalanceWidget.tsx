/**
 * Credit Balance Widget
 * 
 * Displays current credit balance in navigation/header.
 * Shows balance, usage progress, and quick link to purchase.
 */

"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CreditCard, Zap, TrendingUp, AlertCircle } from "lucide-react";

interface CreditBalance {
  balance: number;
  usage: {
    daily: { used: number; cap: number; remaining: number; percentage: number };
    monthly: { used: number; cap: number; remaining: number; percentage: number };
  };
  alerts: {
    daily: boolean;
    monthly: boolean;
  };
}

interface CreditBalanceWidgetProps {
  compact?: boolean; // Compact mode for header
  showDetails?: boolean; // Show usage details
}

export default function CreditBalanceWidget({
  compact = false,
  showDetails = false,
}: CreditBalanceWidgetProps) {
  const { data: session, status } = useSession();
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetchBalance();
      // Refresh every 30 seconds
      const interval = setInterval(fetchBalance, 30000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [status, session]);

  async function fetchBalance() {
    try {
      const response = await fetch("/api/credits/balance");
      if (!response.ok) {
        throw new Error("Failed to load balance");
      }
      const data = await response.json();
      setBalance(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : null);
    } finally {
      setLoading(false);
    }
  }

  // Don't show for unauthenticated users
  if (status !== "authenticated" || !session?.user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Zap className="w-4 h-4 animate-pulse" />
        <span className="hidden sm:inline">Loading...</span>
      </div>
    );
  }

  if (error || !balance) {
    return (
      <Link
        href="/account/credits"
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        <CreditCard className="w-4 h-4" />
        <span className="hidden sm:inline">Credits</span>
      </Link>
    );
  }

  const hasAlert = balance.alerts.daily || balance.alerts.monthly;

  if (compact) {
    return (
      <Link
        href="/account/credits"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-sky-300 transition-colors group"
      >
        <Zap className={`w-4 h-4 ${hasAlert ? "text-amber-500" : "text-sky-600"}`} />
        <span className="font-semibold text-slate-900">
          {balance.balance.toLocaleString()}
        </span>
        {hasAlert && (
          <AlertCircle className="w-4 h-4 text-amber-500" aria-label="Usage alert" />
        )}
      </Link>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-sky-600" />
          <h3 className="font-semibold text-slate-900">Credits</h3>
        </div>
        <Link
          href="/account/credits"
          className="text-xs text-sky-600 hover:text-sky-700 font-medium"
        >
          Manage →
        </Link>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900">
            {balance.balance.toLocaleString()}
          </span>
          <span className="text-sm text-slate-600">credits</span>
        </div>
      </div>

      {showDetails && (
        <div className="space-y-3 mb-4">
          {/* Daily Usage */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-700">Daily</span>
              <span className="text-xs text-slate-600">
                {balance.usage.daily.used} / {balance.usage.daily.cap}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  balance.alerts.daily ? "bg-amber-500" : "bg-sky-500"
                }`}
                style={{ width: `${Math.min(100, balance.usage.daily.percentage)}%` }}
              />
            </div>
          </div>

          {/* Monthly Usage */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-700">Monthly</span>
              <span className="text-xs text-slate-600">
                {balance.usage.monthly.used} / {balance.usage.monthly.cap}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  balance.alerts.monthly ? "bg-amber-500" : "bg-sky-500"
                }`}
                style={{ width: `${Math.min(100, balance.usage.monthly.percentage)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {hasAlert && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-2 mb-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-800">
              {balance.alerts.daily && balance.alerts.monthly
                ? "Daily and monthly limits approaching"
                : balance.alerts.daily
                ? "Daily limit approaching"
                : "Monthly limit approaching"}
            </p>
          </div>
        </div>
      )}

      <Link
        href="/account/credits"
        className="block w-full text-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold text-sm transition-colors"
      >
        Purchase Credits
      </Link>
    </div>
  );
}
