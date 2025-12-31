/**
 * Credit Settings Page
 * 
 * Allows users to configure spend controls, limits, and alert preferences.
 */

"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Settings, Bell, TrendingUp, Save, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

interface SpendControls {
  maxDailyCredits: number | null; // null = use plan default
  maxMonthlyCredits: number | null;
  perRunMaxCredits: number | null;
  alertThresholds: {
    daily: number[]; // [50, 80, 100] = alert at 50%, 80%, 100%
    monthly: number[];
  };
  notifications: {
    email: boolean;
    inApp: boolean;
  };
}

interface PlanLimits {
  maxDailyCredits: number;
  maxMonthlyCredits: number;
}

export default function CreditSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [planLimits, setPlanLimits] = useState<PlanLimits | null>(null);
  const [controls, setControls] = useState<SpendControls>({
    maxDailyCredits: null,
    maxMonthlyCredits: null,
    perRunMaxCredits: null,
    alertThresholds: {
      daily: [50, 80, 100],
      monthly: [50, 80, 100],
    },
    notifications: {
      email: true,
      inApp: true,
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=/account/settings/credits");
      return;
    }

    if (status === "authenticated") {
      fetchSettings();
    }
  }, [status, router]);

  async function fetchSettings() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/account/settings/credits");
      if (!response.ok) {
        throw new Error("Failed to load settings");
      }
      const data = await response.json();
      setControls(data.controls || controls);
      setPlanLimits(data.planLimits);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/account/settings/credits", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ controls }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save settings");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-sky-600" />
            <h1 className="text-4xl font-bold text-slate-900">Credit Settings</h1>
          </div>
          <p className="text-lg text-slate-600">
            Configure spend limits, alerts, and notification preferences
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-sm text-emerald-800">Settings saved successfully!</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-amber-900">Error</p>
                <p className="text-sm text-amber-800 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Spend Limits */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-sky-600" />
              <h2 className="text-xl font-semibold text-slate-900">Spend Limits</h2>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Set custom limits to control your credit spending. Leave empty to use your plan defaults.
            </p>

            <div className="space-y-4">
              {/* Daily Limit */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Daily Credit Limit
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    value={controls.maxDailyCredits ?? ""}
                    onChange={(e) =>
                      setControls({
                        ...controls,
                        maxDailyCredits: e.target.value === "" ? null : parseInt(e.target.value, 10),
                      })
                    }
                    placeholder={planLimits?.maxDailyCredits.toString() || "Plan default"}
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="text-sm text-slate-600">credits/day</span>
                </div>
                {planLimits && (
                  <p className="text-xs text-slate-500 mt-1">
                    Plan default: {planLimits.maxDailyCredits.toLocaleString()} credits/day
                  </p>
                )}
              </div>

              {/* Monthly Limit */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Monthly Credit Limit
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    value={controls.maxMonthlyCredits ?? ""}
                    onChange={(e) =>
                      setControls({
                        ...controls,
                        maxMonthlyCredits: e.target.value === "" ? null : parseInt(e.target.value, 10),
                      })
                    }
                    placeholder={planLimits?.maxMonthlyCredits.toString() || "Plan default"}
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="text-sm text-slate-600">credits/month</span>
                </div>
                {planLimits && (
                  <p className="text-xs text-slate-500 mt-1">
                    Plan default: {planLimits.maxMonthlyCredits.toLocaleString()} credits/month
                  </p>
                )}
              </div>

              {/* Per-Run Limit */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Per-Run Maximum
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    value={controls.perRunMaxCredits ?? ""}
                    onChange={(e) =>
                      setControls({
                        ...controls,
                        perRunMaxCredits: e.target.value === "" ? null : parseInt(e.target.value, 10),
                      })
                    }
                    placeholder="No limit"
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="text-sm text-slate-600">credits/run</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Maximum credits allowed per single tool run (optional)
                </p>
              </div>
            </div>
          </div>

          {/* Alert Thresholds */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-sky-600" />
              <h2 className="text-xl font-semibold text-slate-900">Alert Thresholds</h2>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Get notified when you reach certain percentages of your limits.
            </p>

            <div className="space-y-4">
              {/* Daily Alerts */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Daily Limit Alerts (%)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[25, 50, 75, 90, 100].map((threshold) => (
                    <label key={threshold} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={controls.alertThresholds.daily.includes(threshold)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setControls({
                              ...controls,
                              alertThresholds: {
                                ...controls.alertThresholds,
                                daily: [...controls.alertThresholds.daily, threshold].sort((a, b) => a - b),
                              },
                            });
                          } else {
                            setControls({
                              ...controls,
                              alertThresholds: {
                                ...controls.alertThresholds,
                                daily: controls.alertThresholds.daily.filter((t) => t !== threshold),
                              },
                            });
                          }
                        }}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      />
                      <span className="text-sm text-slate-700">{threshold}%</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Monthly Alerts */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Monthly Limit Alerts (%)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[25, 50, 75, 90, 100].map((threshold) => (
                    <label key={threshold} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={controls.alertThresholds.monthly.includes(threshold)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setControls({
                              ...controls,
                              alertThresholds: {
                                ...controls.alertThresholds,
                                monthly: [...controls.alertThresholds.monthly, threshold].sort((a, b) => a - b),
                              },
                            });
                          } else {
                            setControls({
                              ...controls,
                              alertThresholds: {
                                ...controls.alertThresholds,
                                monthly: controls.alertThresholds.monthly.filter((t) => t !== threshold),
                              },
                            });
                          }
                        }}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      />
                      <span className="text-sm text-slate-700">{threshold}%</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-sky-600" />
              <h2 className="text-xl font-semibold text-slate-900">Notifications</h2>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Choose how you want to receive alerts about your credit usage.
            </p>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={controls.notifications.email}
                  onChange={(e) =>
                    setControls({
                      ...controls,
                      notifications: { ...controls.notifications, email: e.target.checked },
                    })
                  }
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <div>
                  <span className="text-sm font-medium text-slate-700">Email Notifications</span>
                  <p className="text-xs text-slate-500">Receive alerts via email</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={controls.notifications.inApp}
                  onChange={(e) =>
                    setControls({
                      ...controls,
                      notifications: { ...controls.notifications, inApp: e.target.checked },
                    })
                  }
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <div>
                  <span className="text-sm font-medium text-slate-700">In-App Notifications</span>
                  <p className="text-xs text-slate-500">Show alerts in the application</p>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <Link
              href="/account/credits"
              className="text-sm text-slate-600 hover:text-slate-900 font-medium"
            >
              ← Back to Credits
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
