"use client";

import React, { useMemo, useState } from "react";
import { SecurityNotice } from "@/components/SecurityNotice";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";
import { Activity, Radar, Bell } from "lucide-react";

export default function ObservabilityLab() {
  const [logging, setLogging] = useState(1); // 0 Minimal,1 Normal,2 Verbose
  const [metrics, setMetrics] = useState(1); // 0 Basic,1 Key business,2 Full system
  const [tracing, setTracing] = useState(1); // 0 None,1 Key flows,2 Full

  const levelText = useMemo(() => {
    const loggingText = ["Minimal logs: errors only.", "Normal logs: requests + warnings.", "Verbose logs: debug everywhere (watch noise)."][logging];
    const metricsText = ["Basic host metrics.", "Key business metrics wired.", "Full system metrics; watch cost/cardinality."][metrics];
    const tracingText = ["No traces; hard to debug hops.", "Key flows traced end-to-end.", "Full distributed tracing; keep sampling in mind."][tracing];
    const risk = logging === 0 || metrics === 0 || tracing === 0 ? "Risk: blind spots on incidents." : "Risk: too much can get noisy/expensive.";
    return `${loggingText} ${metricsText} ${tracingText} ${risk}`;
  }, [logging, metrics, tracing]);

  const alertScore = useMemo(() => {
    return Math.round(((logging + metrics + tracing) / 6) * 100);
  }, [logging, metrics, tracing]);

  const alertCopy =
    alertScore < 40
      ? "You will get paged for vibes, not signals. Tighten alerts."
      : alertScore < 80
      ? "Better, but trim noise and add runbooks."
      : "Healthy: actionable alerts with context.";

  const [alertChecks, setAlertChecks] = useState<Record<string, boolean>>({
    "On call alerts only for real user pain": true,
    "No alerts on pure noise metrics": false,
    "Run books attached for critical alerts": false,
    "Alerts tested and reviewed": false,
  });

  const alertSanity = useMemo(() => {
    const total = Object.keys(alertChecks).length;
    const on = Object.values(alertChecks).filter(Boolean).length;
    return Math.round((on / total) * 100);
  }, [alertChecks]);

  return (
    <div className="space-y-6">
      <SecurityNotice />
      <SecurityBanner />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-sky-600" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-slate-900">1. Signals you want to see</h2>
            </div>
            <div className="space-y-3 text-sm text-slate-800">
              {[
                { label: "Logging depth", value: logging, set: setLogging, options: ["Minimal", "Normal", "Verbose"] },
                { label: "Metrics coverage", value: metrics, set: setMetrics, options: ["Basic", "Key business metrics", "Full system metrics"] },
                { label: "Tracing", value: tracing, set: setTracing, options: ["None", "Key flows only", "Full distributed tracing"] },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span>{item.label}</span>
                    <span>{item.options[item.value]}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={item.options.length - 1}
                    step={1}
                    value={item.value}
                    onChange={(e) => item.set(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              ))}
              <p className="text-sm text-slate-700 leading-relaxed">{levelText}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Radar className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <h3 className="text-2xl font-semibold text-slate-900">2. Observability architecture sketch</h3>
            </div>
            <p className="text-sm text-slate-700">Conceptual flow from services to dashboards and alerts.</p>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-xs text-slate-800 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-slate-200 bg-white p-2 text-center">Service A</div>
                <div className="rounded-lg border border-slate-200 bg-white p-2 text-center">Service B</div>
                <div className="rounded-lg border border-slate-200 bg-white p-2 text-center">Service C</div>
              </div>
              <div className="text-center text-slate-600">↧ logs/metrics/traces ↧</div>
              <div className="rounded-lg border border-slate-200 bg-white p-3 text-center font-semibold">
                Collector / Observability platform
                <div className="text-[10px] text-slate-600">
                  {logging === 2 ? "Verbose logs" : "Normal logs"}, {metrics === 2 ? "Full metrics" : "Key metrics"},{" "}
                  {tracing === 2 ? "Full traces" : tracing === 1 ? "Key traces" : "No traces"}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-slate-200 bg-white p-2 text-center">Further practice</div>
                <div className="rounded-lg border border-slate-200 bg-white p-2 text-center">Alerting</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-600" aria-hidden="true" />
              <h3 className="text-2xl font-semibold text-slate-900">3. Alert sanity check</h3>
            </div>
            <div className="space-y-2 text-sm text-slate-800">
              {Object.keys(alertChecks).map((key) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={alertChecks[key]}
                    onChange={(e) => setAlertChecks((prev) => ({ ...prev, [key]: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-200"
                  />
                  <span>{key}</span>
                </label>
              ))}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-700">
                <span>Alert sanity score</span>
                <span>{alertSanity}/100</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div
                  className={`h-2 rounded-full transition-all ${
                    alertSanity < 40 ? "bg-rose-400" : alertSanity < 80 ? "bg-amber-400" : "bg-emerald-500"
                  }`}
                  style={{ width: `${alertSanity}%` }}
                />
              </div>
              <p className="text-xs text-slate-600">{alertCopy}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
