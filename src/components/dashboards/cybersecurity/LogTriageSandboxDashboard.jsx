"use client";

import React, { useState } from "react";
import { FileText, AlertCircle, CheckCircle } from "lucide-react";

const SAMPLE_LOGS = [
  {
    id: 1,
    entry: "2024-01-15 10:23:45 [INFO] User login successful: user@example.com",
    category: "normal",
    explanation: "Normal authentication event. No action needed.",
  },
  {
    id: 2,
    entry: "2024-01-15 10:24:12 [WARN] Failed login attempt: admin@example.com from 192.0.2.1",
    category: "suspicious",
    explanation: "Failed login for admin account. Monitor for repeated attempts.",
  },
  {
    id: 3,
    entry: "2024-01-15 10:25:30 [ERROR] Database connection timeout after 30s",
    category: "urgent",
    explanation: "Service degradation. May indicate attack or infrastructure issue.",
  },
  {
    id: 4,
    entry: "2024-01-15 10:26:01 [INFO] File uploaded: report.pdf (2.3MB)",
    category: "normal",
    explanation: "Routine file operation. Check if file type and size are expected.",
  },
  {
    id: 5,
    entry: "2024-01-15 10:27:15 [WARN] Unusual API call pattern: 100 requests in 10s from 192.0.2.5",
    category: "suspicious",
    explanation: "Possible automated attack or misconfigured client. Investigate source.",
  },
];

export default function LogTriageSandboxDashboard() {
  const [currentLog, setCurrentLog] = useState(0);
  const [userChoice, setUserChoice] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const log = SAMPLE_LOGS[currentLog];

  const handleChoice = (choice) => {
    setUserChoice(choice);
    setShowExplanation(true);
  };

  const nextLog = () => {
    setCurrentLog((prev) => (prev + 1) % SAMPLE_LOGS.length);
    setUserChoice(null);
    setShowExplanation(false);
  };

  const getChoiceColor = (choice) => {
    if (choice === "normal" && log.category === "normal") return "text-emerald-300";
    if (choice === "suspicious" && log.category === "suspicious") return "text-orange-300";
    if (choice === "urgent" && log.category === "urgent") return "text-red-300";
    return "text-slate-400";
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-slate-950/80 p-4 text-slate-50 shadow-sm ring-1 ring-slate-800 md:flex-row md:p-5">
      {/* Left: log entry */}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-slate-50">
            Log triage sandbox
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            Review synthetic log entries and classify them. Compare your assessment with an analyst
            view.
          </p>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Entry {currentLog + 1} of {SAMPLE_LOGS.length}
            </span>
            <button
              onClick={nextLog}
              className="rounded bg-sky-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-sky-700"
            >
              Next log
            </button>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-3 font-mono text-[0.7rem] text-slate-200">
            {log.entry}
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <label className="mb-2 block text-xs font-medium text-slate-200">
            How would you classify this?
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleChoice("normal")}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                userChoice === "normal"
                  ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                  : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => handleChoice("suspicious")}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                userChoice === "suspicious"
                  ? "border-orange-500 bg-orange-500/20 text-orange-300"
                  : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Suspicious
            </button>
            <button
              onClick={() => handleChoice("urgent")}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                userChoice === "urgent"
                  ? "border-red-500 bg-red-500/20 text-red-300"
                  : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Urgent
            </button>
          </div>
        </div>
      </div>

      {/* Right: analysis */}
      <div className="flex w-full max-w-xs flex-col gap-4 md:max-w-sm">
        {showExplanation && (
          <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
            <div className="mb-3 flex items-center gap-2">
              <FileText size={18} className="text-sky-400" />
              <h4 className="text-xs font-semibold text-slate-100">Analysis</h4>
            </div>
            <div className="space-y-3">
              <div>
                <div className="mb-1 text-xs text-slate-400">Your choice</div>
                <div className={`text-sm font-medium ${getChoiceColor(userChoice)}`}>
                  {userChoice === "normal" && "Normal"}
                  {userChoice === "suspicious" && "Suspicious"}
                  {userChoice === "urgent" && "Urgent"}
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs text-slate-400">Analyst view</div>
                <div
                  className={`text-sm font-medium ${
                    log.category === "normal"
                      ? "text-emerald-300"
                      : log.category === "suspicious"
                      ? "text-orange-300"
                      : "text-red-300"
                  }`}
                >
                  {log.category === "normal" && "Normal"}
                  {log.category === "suspicious" && "Suspicious"}
                  {log.category === "urgent" && "Urgent"}
                </div>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-2 text-[0.7rem] text-slate-300">
                {log.explanation}
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-slate-900/80 p-3 text-xs text-slate-200 ring-1 ring-slate-800">
          <p className="font-semibold text-sky-200">Triage principles</p>
          <ul className="mt-1 space-y-1 text-[0.7rem] text-slate-300">
            <li>• Normal: Expected behavior, no action needed</li>
            <li>• Suspicious: Unusual pattern, monitor or investigate</li>
            <li>• Urgent: Immediate attention required</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

