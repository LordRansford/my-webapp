"use client";

import React, { useState } from "react";
import { Plus, Trash2, Clock } from "lucide-react";

const CATEGORIES = ["Detection", "Containment", "Investigation", "Remediation", "Recovery"];

export default function IncidentTimelineDashboard() {
  const [events, setEvents] = useState([
    {
      id: 1,
      time: "10:00",
      category: "Detection",
      description: "Anomaly detected in authentication logs",
      impact: "Low",
    },
    {
      id: 2,
      time: "10:15",
      category: "Containment",
      description: "Affected system isolated from network",
      impact: "Medium",
    },
  ]);

  const addEvent = () => {
    setEvents([
      ...events,
      {
        id: Date.now(),
        time: "12:00",
        category: "Detection",
        description: "",
        impact: "Low",
      },
    ]);
  };

  const updateEvent = (id, field, value) => {
    setEvents(events.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const removeEvent = (id) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-slate-950/80 p-4 text-slate-50 shadow-sm ring-1 ring-slate-800 md:flex-row md:p-5">
      {/* Left: events */}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-slate-50">
            Incident timeline builder
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            Add events with time and category. Build a visual timeline to understand the sequence of
            an incident.
          </p>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-medium text-slate-200">Events</label>
            <button
              onClick={addEvent}
              className="rounded bg-sky-600 px-2 py-1 text-[0.65rem] font-medium text-white transition hover:bg-sky-700"
            >
              <Plus size={12} className="inline" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="grid grid-cols-4 gap-2 rounded-lg border border-slate-700 bg-slate-950/80 p-2"
              >
                <input
                  type="time"
                  value={event.time}
                  onChange={(e) => updateEvent(event.id, "time", e.target.value)}
                  className="rounded border border-slate-600 bg-slate-800 px-2 py-1 text-[0.7rem] text-slate-50 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
                <select
                  value={event.category}
                  onChange={(e) => updateEvent(event.id, "category", e.target.value)}
                  className="rounded border border-slate-600 bg-slate-800 px-2 py-1 text-[0.7rem] text-slate-50 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={event.description}
                  onChange={(e) => updateEvent(event.id, "description", e.target.value)}
                  placeholder="Description..."
                  className="rounded border border-slate-600 bg-slate-800 px-2 py-1 text-[0.7rem] text-slate-50 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
                <button
                  onClick={() => removeEvent(event.id)}
                  className="rounded p-1 text-slate-400 transition hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: timeline */}
      <div className="flex w-full max-w-xs flex-col gap-4 md:max-w-sm">
        <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
          <div className="mb-3 flex items-center gap-2">
            <Clock size={18} className="text-sky-400" />
            <h4 className="text-xs font-semibold text-slate-100">Timeline</h4>
          </div>
          <div className="space-y-3">
            {events
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((event, idx) => (
                <div key={event.id} className="relative flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-sky-400 bg-sky-500/20 text-[0.65rem] font-medium text-sky-300">
                      {idx + 1}
                    </div>
                    {idx < events.length - 1 && (
                      <div className="mt-1 h-12 w-px bg-slate-700" />
                    )}
                  </div>
                  <div className="flex-1 rounded-lg border border-slate-700 bg-slate-950/80 p-2">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[0.7rem] font-medium text-slate-200">
                        {event.time}
                      </span>
                      <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[0.65rem] text-sky-300">
                        {event.category}
                      </span>
                    </div>
                    <div className="text-[0.7rem] text-slate-300">
                      {event.description || "No description"}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/80 p-3 text-xs text-slate-200 ring-1 ring-slate-800">
          <p className="font-semibold text-sky-200">Key lessons</p>
          <p className="mt-1 text-[0.7rem] text-slate-300">
            Use timelines to identify gaps in detection, containment speed, and recovery time. They
            help teams learn and improve response processes.
          </p>
        </div>
      </div>
    </div>
  );
}

