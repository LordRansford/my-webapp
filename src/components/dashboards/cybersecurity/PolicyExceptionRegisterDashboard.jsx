"use client";

import React, { useState } from "react";
import { Plus, Trash2, FileText, Calendar, AlertTriangle } from "lucide-react";

export default function PolicyExceptionRegisterDashboard() {
  const [exceptions, setExceptions] = useState([
    {
      id: 1,
      policy: "Password complexity",
      reason: "Legacy system limitation",
      owner: "IT Operations",
      reviewDate: "2024-02-15",
    },
    {
      id: 2,
      policy: "MFA requirement",
      reason: "Third party system does not support MFA",
      owner: "Security Team",
      reviewDate: "2024-03-01",
    },
  ]);

  const addException = () => {
    setExceptions([
      ...exceptions,
      {
        id: Date.now(),
        policy: "",
        reason: "",
        owner: "",
        reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
    ]);
  };

  const updateException = (id, field, value) => {
    setExceptions(
      exceptions.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const removeException = (id) => {
    setExceptions(exceptions.filter((e) => id !== e.id));
  };

  const getOverdue = () => {
    const now = new Date();
    return exceptions.filter((e) => {
      const review = new Date(e.reviewDate);
      return review < now;
    });
  };

  const getDueSoon = () => {
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return exceptions.filter((e) => {
      const review = new Date(e.reviewDate);
      return review >= now && review <= in30Days;
    });
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-slate-950/80 p-4 text-slate-50 shadow-sm ring-1 ring-slate-800 md:flex-row md:p-5">
      {/* Left: register */}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-slate-50">
            Policy and exception register
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            Record policy exceptions with reason, owner and review date. Track which exceptions need
            attention.
          </p>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-medium text-slate-200">Exceptions</label>
            <button
              onClick={addException}
              className="rounded bg-sky-600 px-2 py-1 text-[0.65rem] font-medium text-white transition hover:bg-sky-700"
            >
              <Plus size={12} className="inline" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {exceptions.map((exc) => (
              <div
                key={exc.id}
                className="grid grid-cols-5 gap-2 rounded-lg border border-slate-700 bg-slate-950/80 p-2"
              >
                <input
                  type="text"
                  value={exc.policy}
                  onChange={(e) => updateException(exc.id, "policy", e.target.value)}
                  placeholder="Policy..."
                  className="rounded border border-slate-600 bg-slate-800 px-2 py-1 text-[0.7rem] text-slate-50 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
                <input
                  type="text"
                  value={exc.reason}
                  onChange={(e) => updateException(exc.id, "reason", e.target.value)}
                  placeholder="Reason..."
                  className="rounded border border-slate-600 bg-slate-800 px-2 py-1 text-[0.7rem] text-slate-50 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
                <input
                  type="text"
                  value={exc.owner}
                  onChange={(e) => updateException(exc.id, "owner", e.target.value)}
                  placeholder="Owner..."
                  className="rounded border border-slate-600 bg-slate-800 px-2 py-1 text-[0.7rem] text-slate-50 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
                <input
                  type="date"
                  value={exc.reviewDate}
                  onChange={(e) => updateException(exc.id, "reviewDate", e.target.value)}
                  className="rounded border border-slate-600 bg-slate-800 px-2 py-1 text-[0.7rem] text-slate-50 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
                <button
                  onClick={() => removeException(exc.id)}
                  className="rounded p-1 text-slate-400 transition hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: summary */}
      <div className="flex w-full max-w-xs flex-col gap-4 md:max-w-sm">
        <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
          <div className="mb-3 flex items-center gap-2">
            <FileText size={18} className="text-sky-400" />
            <h4 className="text-xs font-semibold text-slate-100">Summary</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Total exceptions</span>
              <span className="font-semibold text-slate-100">{exceptions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Overdue reviews</span>
              <span className="font-semibold text-red-300">{getOverdue().length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Due within 30 days</span>
              <span className="font-semibold text-orange-300">{getDueSoon().length}</span>
            </div>
          </div>
        </div>

        {getOverdue().length > 0 && (
          <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-3 ring-1 ring-red-500/30">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-400" />
              <h4 className="text-xs font-semibold text-red-300">Overdue reviews</h4>
            </div>
            <div className="space-y-1 text-[0.7rem] text-red-200">
              {getOverdue().map((exc) => (
                <div key={exc.id}>
                  • <strong>{exc.policy || "Unnamed"}</strong> - Review was due {exc.reviewDate}
                </div>
              ))}
            </div>
          </div>
        )}

        {getDueSoon().length > 0 && (
          <div className="rounded-2xl border border-orange-500/50 bg-orange-500/10 p-3 ring-1 ring-orange-500/30">
            <div className="mb-2 flex items-center gap-2">
              <Calendar size={16} className="text-orange-400" />
              <h4 className="text-xs font-semibold text-orange-300">Due soon</h4>
            </div>
            <div className="space-y-1 text-[0.7rem] text-orange-200">
              {getDueSoon().map((exc) => (
                <div key={exc.id}>
                  • <strong>{exc.policy || "Unnamed"}</strong> - Review due {exc.reviewDate}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-slate-900/80 p-3 text-xs text-slate-200 ring-1 ring-slate-800">
          <p className="font-semibold text-sky-200">Exception management</p>
          <p className="mt-1 text-[0.7rem] text-slate-300">
            Exceptions should be time bound and regularly reviewed. They are safer when clearly
            documented with ownership and review dates.
          </p>
        </div>
      </div>
    </div>
  );
}

