"use client";

import React, { useState } from "react";
import { Target, Shield, Users } from "lucide-react";

export default function RedBlueExercisePlannerDashboard() {
  const [objectives, setObjectives] = useState("Test incident response procedures and team coordination");
  const [scope, setScope] = useState("Web application and internal network");
  const [rules, setRules] = useState("No production data. No real attacks on external systems.");
  const [expectedLearning, setExpectedLearning] = useState("Identify gaps in detection and response");

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-slate-950/80 p-4 text-slate-50 shadow-sm ring-1 ring-slate-800 md:flex-row md:p-5">
      {/* Left: planning form */}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-slate-50">
            Red team and blue team planner
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            Outline objectives, scope, rules and expected learning for a security exercise. Planning
            carefully keeps exercises safe and useful.
          </p>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <div className="mb-2 flex items-center gap-2">
            <Target size={16} className="text-sky-400" />
            <label className="text-xs font-medium text-slate-200">Objectives</label>
          </div>
          <textarea
            value={objectives}
            onChange={(e) => setObjectives(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            placeholder="What should this exercise achieve?"
          />
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <div className="mb-2 flex items-center gap-2">
            <Shield size={16} className="text-purple-400" />
            <label className="text-xs font-medium text-slate-200">Scope</label>
          </div>
          <textarea
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            placeholder="What systems or areas are in scope?"
          />
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <div className="mb-2 flex items-center gap-2">
            <Users size={16} className="text-orange-400" />
            <label className="text-xs font-medium text-slate-200">Safety rules</label>
          </div>
          <textarea
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            placeholder="What are the boundaries and safety constraints?"
          />
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <label className="mb-2 block text-xs font-medium text-slate-200">Expected learning</label>
          <textarea
            value={expectedLearning}
            onChange={(e) => setExpectedLearning(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            placeholder="What should participants learn?"
          />
        </div>
      </div>

      {/* Right: summary */}
      <div className="flex w-full max-w-xs flex-col gap-4 md:max-w-sm">
        <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
          <h4 className="mb-3 text-xs font-semibold text-slate-100">Exercise plan summary</h4>
          <div className="space-y-4 text-xs">
            <div>
              <div className="mb-1 font-medium text-slate-300">Objectives</div>
              <div className="text-[0.7rem] text-slate-400">
                {objectives || "Not specified"}
              </div>
            </div>
            <div>
              <div className="mb-1 font-medium text-slate-300">Scope</div>
              <div className="text-[0.7rem] text-slate-400">{scope || "Not specified"}</div>
            </div>
            <div>
              <div className="mb-1 font-medium text-slate-300">Safety rules</div>
              <div className="text-[0.7rem] text-slate-400">{rules || "Not specified"}</div>
            </div>
            <div>
              <div className="mb-1 font-medium text-slate-300">Expected learning</div>
              <div className="text-[0.7rem] text-slate-400">
                {expectedLearning || "Not specified"}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/80 p-3 text-xs text-slate-200 ring-1 ring-slate-800">
          <p className="font-semibold text-sky-200">Exercise best practices</p>
          <ul className="mt-1 space-y-1 text-[0.7rem] text-slate-300">
            <li>• Clearly define boundaries before starting</li>
            <li>• Ensure all participants understand safety rules</li>
            <li>• Document findings and lessons learned</li>
            <li>• Use isolated environments when possible</li>
            <li>• Review and improve based on outcomes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

