"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useStudioPreferences } from "@/hooks/useStudioPreferences";
import { Save, Settings, Palette, Bell, Eye, Zap, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function StudioSettingsPage() {
  const { data: session } = useSession();
  const { preferences, loading, error, updatePreferences } = useStudioPreferences();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [localPrefs, setLocalPrefs] = useState<any>(null);

  useEffect(() => {
    if (preferences) {
      setLocalPrefs({ ...preferences });
    }
  }, [preferences]);

  async function handleSave() {
    if (!localPrefs) return;

    setSaving(true);
    setSaved(false);

    try {
      await updatePreferences({
        ui: localPrefs.ui,
        studios: localPrefs.studios,
        notifications: localPrefs.notifications,
        accessibility: localPrefs.accessibility,
        performance: localPrefs.performance,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save preferences:", err);
    } finally {
      setSaving(false);
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Sign in required</h1>
          <p className="text-slate-600 mb-6">Please sign in to manage your studio preferences.</p>
          <Link
            href="/api/auth/signin"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !localPrefs) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Error loading preferences</h1>
          <p className="text-slate-600">{error || "Unknown error"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Studio Preferences</h1>
          <p className="text-slate-600">Customize your studio experience</p>
        </div>

        <div className="space-y-6">
          {/* UI Preferences */}
          <section className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-slate-900">UI Preferences</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
                <select
                  value={localPrefs.ui.theme}
                  onChange={(e) =>
                    setLocalPrefs({
                      ...localPrefs,
                      ui: { ...localPrefs.ui, theme: e.target.value as any },
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localPrefs.ui.compactMode}
                    onChange={(e) =>
                      setLocalPrefs({
                        ...localPrefs,
                        ui: { ...localPrefs.ui, compactMode: e.target.checked },
                      })
                    }
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">Compact mode</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localPrefs.ui.showHelpTooltips}
                    onChange={(e) =>
                      setLocalPrefs({
                        ...localPrefs,
                        ui: { ...localPrefs.ui, showHelpTooltips: e.target.checked },
                      })
                    }
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">Show help tooltips</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localPrefs.ui.showCreditEstimates}
                    onChange={(e) =>
                      setLocalPrefs({
                        ...localPrefs,
                        ui: { ...localPrefs.ui, showCreditEstimates: e.target.checked },
                      })
                    }
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">Show credit estimates</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localPrefs.ui.showExamples}
                    onChange={(e) =>
                      setLocalPrefs({
                        ...localPrefs,
                        ui: { ...localPrefs.ui, showExamples: e.target.checked },
                      })
                    }
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">Show examples</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localPrefs.ui.animationEnabled}
                    onChange={(e) =>
                      setLocalPrefs({
                        ...localPrefs,
                        ui: { ...localPrefs.ui, animationEnabled: e.target.checked },
                      })
                    }
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">Enable animations</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localPrefs.ui.reducedMotion}
                    onChange={(e) =>
                      setLocalPrefs({
                        ...localPrefs,
                        ui: { ...localPrefs.ui, reducedMotion: e.target.checked },
                      })
                    }
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">Reduce motion (accessibility)</span>
                </label>
              </div>
            </div>
          </section>

          {/* Dev Studio Preferences */}
          <section className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-semibold text-slate-900">Dev Studio</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPrefs.studios.dev.autoSave}
                  onChange={(e) =>
                    setLocalPrefs({
                      ...localPrefs,
                      studios: {
                        ...localPrefs.studios,
                        dev: { ...localPrefs.studios.dev, autoSave: e.target.checked },
                      },
                    })
                  }
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">Auto-save projects</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPrefs.studios.dev.showAdvancedOptions}
                  onChange={(e) =>
                    setLocalPrefs({
                      ...localPrefs,
                      studios: {
                        ...localPrefs.studios,
                        dev: { ...localPrefs.studios.dev, showAdvancedOptions: e.target.checked },
                      },
                    })
                  }
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">Show advanced options</span>
              </label>
            </div>
          </section>

          {/* Cyber Studio Preferences */}
          <section className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-rose-600" />
              <h2 className="text-xl font-semibold text-slate-900">Cyber Studio</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPrefs.studios.cyber.autoValidate}
                  onChange={(e) =>
                    setLocalPrefs({
                      ...localPrefs,
                      studios: {
                        ...localPrefs.studios,
                        cyber: { ...localPrefs.studios.cyber, autoValidate: e.target.checked },
                      },
                    })
                  }
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">Auto-validate inputs</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPrefs.studios.cyber.showComplianceChecks}
                  onChange={(e) =>
                    setLocalPrefs({
                      ...localPrefs,
                      studios: {
                        ...localPrefs.studios,
                        cyber: { ...localPrefs.studios.cyber, showComplianceChecks: e.target.checked },
                      },
                    })
                  }
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">Show compliance checks</span>
              </label>
            </div>
          </section>

          {/* Data Studio Preferences */}
          <section className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-slate-900">Data Studio</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPrefs.studios.data.autoInferSchema}
                  onChange={(e) =>
                    setLocalPrefs({
                      ...localPrefs,
                      studios: {
                        ...localPrefs.studios,
                        data: { ...localPrefs.studios.data, autoInferSchema: e.target.checked },
                      },
                    })
                  }
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">Auto-infer schema</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPrefs.studios.data.showDataPreview}
                  onChange={(e) =>
                    setLocalPrefs({
                      ...localPrefs,
                      studios: {
                        ...localPrefs.studios,
                        data: { ...localPrefs.studios.data, showDataPreview: e.target.checked },
                      },
                    })
                  }
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">Show data preview</span>
              </label>
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-slate-900">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localPrefs.notifications.creditLow}
                    onChange={(e) =>
                      setLocalPrefs({
                        ...localPrefs,
                        notifications: { ...localPrefs.notifications, creditLow: e.target.checked },
                      })
                    }
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">Notify when credits are low</span>
                </label>
                {localPrefs.notifications.creditLow && (
                  <div className="ml-7">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Threshold: {localPrefs.notifications.creditThreshold}%
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={localPrefs.notifications.creditThreshold}
                      onChange={(e) =>
                        setLocalPrefs({
                          ...localPrefs,
                          notifications: {
                            ...localPrefs.notifications,
                            creditThreshold: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                )}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localPrefs.notifications.toolComplete}
                    onChange={(e) =>
                      setLocalPrefs({
                        ...localPrefs,
                        notifications: { ...localPrefs.notifications, toolComplete: e.target.checked },
                      })
                    }
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">Notify when tools complete</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localPrefs.notifications.errors}
                    onChange={(e) =>
                      setLocalPrefs({
                        ...localPrefs,
                        notifications: { ...localPrefs.notifications, errors: e.target.checked },
                      })
                    }
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">Notify on errors</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localPrefs.notifications.updates}
                    onChange={(e) =>
                      setLocalPrefs({
                        ...localPrefs,
                        notifications: { ...localPrefs.notifications, updates: e.target.checked },
                      })
                    }
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">Notify about updates</span>
                </label>
              </div>
            </div>
          </section>

          {/* Accessibility */}
          <section className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-slate-900">Accessibility</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPrefs.accessibility.highContrast}
                  onChange={(e) =>
                    setLocalPrefs({
                      ...localPrefs,
                      accessibility: { ...localPrefs.accessibility, highContrast: e.target.checked },
                    })
                  }
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">High contrast mode</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPrefs.accessibility.largeText}
                  onChange={(e) =>
                    setLocalPrefs({
                      ...localPrefs,
                      accessibility: { ...localPrefs.accessibility, largeText: e.target.checked },
                    })
                  }
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">Large text</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPrefs.accessibility.keyboardNavigation}
                  onChange={(e) =>
                    setLocalPrefs({
                      ...localPrefs,
                      accessibility: { ...localPrefs.accessibility, keyboardNavigation: e.target.checked },
                    })
                  }
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">Enhanced keyboard navigation</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPrefs.accessibility.screenReaderOptimized}
                  onChange={(e) =>
                    setLocalPrefs({
                      ...localPrefs,
                      accessibility: { ...localPrefs.accessibility, screenReaderOptimized: e.target.checked },
                    })
                  }
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">Screen reader optimized</span>
              </label>
            </div>
          </section>

          {/* Performance */}
          <section className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-slate-900">Performance</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPrefs.performance.enableCaching}
                  onChange={(e) =>
                    setLocalPrefs({
                      ...localPrefs,
                      performance: { ...localPrefs.performance, enableCaching: e.target.checked },
                    })
                  }
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">Enable caching</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPrefs.performance.prefetchTools}
                  onChange={(e) =>
                    setLocalPrefs({
                      ...localPrefs,
                      performance: { ...localPrefs.performance, prefetchTools: e.target.checked },
                    })
                  }
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">Prefetch tools</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPrefs.performance.lazyLoadImages}
                  onChange={(e) =>
                    setLocalPrefs({
                      ...localPrefs,
                      performance: { ...localPrefs.performance, lazyLoadImages: e.target.checked },
                    })
                  }
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">Lazy load images</span>
              </label>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3 pt-4">
            {saved && (
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Preferences saved!</span>
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
