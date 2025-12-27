"use client";

import { useMemo, useState } from "react";
import { CheckPill } from "@/components/ui/CheckPill";

export function EventFlowModeler() {
  const [events, setEvents] = useState([
    { id: 1, name: "CustomerRegistered", consumers: 3, critical: true },
    { id: 2, name: "TariffChanged", consumers: 2, critical: false },
  ]);

  function updateEvent(id, patch) {
    setEvents((current) => current.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function addEvent() {
    const nextId = events.length ? Math.max(...events.map((e) => e.id)) + 1 : 1;
    setEvents((current) => [...current, { id: nextId, name: "", consumers: 1, critical: false }]);
  }

  function removeEvent(id) {
    setEvents((current) => current.filter((e) => e.id !== id));
  }

  const stats = useMemo(() => {
    if (!events.length) {
      return {
        totalConsumers: 0,
        averageConsumers: 0,
        maxConsumers: 0,
        hotEvent: "",
        criticalCount: 0,
      };
    }
    const totalConsumers = events.reduce((sum, e) => sum + e.consumers, 0);
    const max = Math.max(...events.map((e) => e.consumers));
    const hot = events.find((e) => e.consumers === max);
    const criticalCount = events.filter((e) => e.critical).length;

    return {
      totalConsumers,
      averageConsumers: totalConsumers / events.length,
      maxConsumers: max,
      hotEvent: hot?.name || "",
      criticalCount,
    };
  }, [events]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600">
        Events connect services together. This modeller helps you spot hotspots where a single event has many consumers or where
        too many events are treated as critical.
      </p>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Events</p>
            <button
              type="button"
              onClick={addEvent}
              className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800"
            >
              Add event
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {events.map((event) => (
              <div key={event.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3 shadow-sm">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <input
                    className="w-full rounded-xl border border-slate-200 px-2 py-1 text-sm font-semibold"
                    placeholder="Event name, for example InvoiceRaised"
                    value={event.name}
                    onChange={(e) => updateEvent(event.id, { name: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => removeEvent(event.id)}
                    className="rounded-full px-2 py-1 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <label className="text-xs text-slate-600">
                    Number of consumers
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={event.consumers}
                      onChange={(e) => updateEvent(event.id, { consumers: Number(e.target.value) || 1 })}
                      className="mt-1 w-full"
                    />
                    <span className="mt-1 inline-block text-xs text-slate-700">
                      {event.consumers} consumer{event.consumers === 1 ? "" : "s"}
                    </span>
                  </label>

                  <div className="sm:max-w-xs">
                    <CheckPill
                      checked={event.critical}
                      onCheckedChange={(checked) => updateEvent(event.id, { critical: checked })}
                      tone="amber"
                    >
                      Critical event that must not be lost
                    </CheckPill>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Event flow summary</p>
            <p className="text-xs text-slate-700">
              Total consumers: <span className="font-semibold">{stats.totalConsumers}</span>
            </p>
            <p className="text-xs text-slate-700">
              Average consumers per event: <span className="font-semibold">{stats.averageConsumers.toFixed(1)}</span>
            </p>
            <p className="text-xs text-slate-700">
              Maximum consumers on a single event: <span className="font-semibold">{stats.maxConsumers}</span>
            </p>
            {stats.hotEvent && (
              <p className="text-xs text-slate-700">
                Highest fan out event: <span className="font-semibold">{stats.hotEvent}</span>
              </p>
            )}
            <p className="mt-1 text-xs text-slate-700">
              Critical events: <span className="font-semibold">{stats.criticalCount}</span>
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
            <p className="mb-1 font-medium">What to discuss</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Would any service be blocked if one event processing pipeline failed.</li>
              <li>Do you have too many events marked as critical for the team to manage.</li>
              <li>Is the highest fan out event a good candidate for extra observability and testing.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
