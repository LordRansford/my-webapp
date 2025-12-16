"use client";

import { useMemo, useState } from "react";

export function ObservabilityCoveragePlanner() {
  const [services, setServices] = useState([
    { id: 1, name: "Gateway", logs: true, metrics: true, traces: true, alerts: true },
    { id: 2, name: "Billing API", logs: true, metrics: true, traces: false, alerts: true },
    { id: 3, name: "Reporting", logs: true, metrics: false, traces: false, alerts: false },
  ]);

  function updateService(id, patch) {
    setServices((current) => current.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function addService() {
    const nextId = services.length ? Math.max(...services.map((s) => s.id)) + 1 : 1;
    setServices((current) => [...current, { id: nextId, name: "", logs: true, metrics: false, traces: false, alerts: false }]);
  }

  function removeService(id) {
    setServices((current) => current.filter((s) => s.id !== id));
  }

  const stats = useMemo(() => {
    if (!services.length) {
      return { coverage: { logs: 0, metrics: 0, traces: 0, alerts: 0 } };
    }
    const count = services.length;
    const logs = services.filter((s) => s.logs).length / count;
    const metrics = services.filter((s) => s.metrics).length / count;
    const traces = services.filter((s) => s.traces).length / count;
    const alerts = services.filter((s) => s.alerts).length / count;
    return { coverage: { logs, metrics, traces, alerts } };
  }, [services]);

  function coverageClass(value) {
    if (value >= 0.8) return "text-emerald-700";
    if (value >= 0.5) return "text-amber-700";
    return "text-rose-700";
  }

  function coverageLabel(value) {
    return (value * 100).toFixed(0) + " percent of services";
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600">
        Observability is a system property. Use this planner to see which signals you have and where you are blind in production.
      </p>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Services and signals</p>
            <button
              type="button"
              onClick={addService}
              className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800"
            >
              Add service
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {services.map((service) => (
              <div key={service.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3 shadow-sm">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <input
                    className="w-full rounded-xl border border-slate-200 px-2 py-1 text-sm font-semibold"
                    placeholder="For example Payment processor"
                    value={service.name}
                    onChange={(e) => updateService(service.id, { name: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => removeService(service.id)}
                    className="rounded-full px-2 py-1 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-slate-700">
                  <SignalToggle label="Logs" value={service.logs} onChange={(value) => updateService(service.id, { logs: value })} />
                  <SignalToggle
                    label="Metrics"
                    value={service.metrics}
                    onChange={(value) => updateService(service.id, { metrics: value })}
                  />
                  <SignalToggle
                    label="Traces"
                    value={service.traces}
                    onChange={(value) => updateService(service.id, { traces: value })}
                  />
                  <SignalToggle
                    label="Alerts"
                    value={service.alerts}
                    onChange={(value) => updateService(service.id, { alerts: value })}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Coverage summary</p>
            <p className={"text-xs " + coverageClass(stats.coverage.logs)}>
              Logs: <span className="font-semibold">{coverageLabel(stats.coverage.logs)}</span>
            </p>
            <p className={"text-xs " + coverageClass(stats.coverage.metrics)}>
              Metrics: <span className="font-semibold">{coverageLabel(stats.coverage.metrics)}</span>
            </p>
            <p className={"text-xs " + coverageClass(stats.coverage.traces)}>
              Traces: <span className="font-semibold">{coverageLabel(stats.coverage.traces)}</span>
            </p>
            <p className={"text-xs " + coverageClass(stats.coverage.alerts)}>
              Alerts: <span className="font-semibold">{coverageLabel(stats.coverage.alerts)}</span>
            </p>
            <p className="mt-2 text-xs text-slate-600">
              Aim for good coverage on logs and metrics, targeted traces on complex flows, and alerts only for symptoms a human should
              act on.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
            <p className="mb-1 font-medium">Prompts</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Could you debug an incident in each service with the current signals.</li>
              <li>Are alerts tied to clear run books rather than raw metrics.</li>
              <li>Do you have traces across the full user journey where latency really matters.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignalToggle({ label, value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 " +
        (value ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-600")
      }
    >
      <span className={"h-1.5 w-1.5 rounded-full " + (value ? "bg-emerald-500" : "bg-slate-300")} />
      {label}
    </button>
  );
}
