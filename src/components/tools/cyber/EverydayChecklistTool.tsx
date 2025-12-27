"use client";

import React, { useMemo, useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { CyberToolCard } from "./CyberToolCard";
import SwitchRow from "@/components/ui/SwitchRow";

type Role = "Employee" | "Engineer" | "Analyst";

const CHECKS: Record<Role, string[]> = {
  Employee: [
    "Pause before clicking links or opening attachments you did not expect.",
    "Check sender address and domain carefully.",
    "Use unique passwords and MFA where available.",
    "Report suspicious messages instead of forwarding them.",
  ],
  Engineer: [
    "Avoid secrets in logs and client code.",
    "Rotate keys and tokens regularly.",
    "Apply least privilege to service accounts.",
    "Review CSP, HSTS, and cookie flags in staging before release.",
  ],
  Analyst: [
    "Capture indicators (domains, hashes, IPs) with timestamps.",
    "Validate alerts against baseline behaviour.",
    "Document containment steps clearly before acting.",
    "Share concise summaries with affected teams.",
  ],
};

export function EverydayChecklistTool() {
  const [role, setRole] = useState<Role>("Employee");
  const [done, setDone] = useState<Record<string, boolean>>({});

  const items = CHECKS[role];
  const completed = useMemo(() => items.filter((i) => done[i]).length, [items, done]);
  const percent = Math.round((completed / items.length) * 100);

  return (
    <CyberToolCard
      id="everyday-checklist-title"
      title="Everyday security checklist"
      icon={<ClipboardCheck className="h-4 w-4" aria-hidden="true" />}
      description="Pick a role and tick through a short, high-impact checklist for daily security hygiene."
    >
      <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Role</label>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value as Role);
                setDone({});
              }}
              className="w-full sm:w-60 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              <option value="Employee">Employee</option>
              <option value="Engineer">Engineer</option>
              <option value="Analyst">Analyst</option>
            </select>
          </div>
          <div className="rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-800 inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
            {percent}% done
          </div>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <SwitchRow
              key={item}
              label={item}
              checked={!!done[item]}
              onCheckedChange={(checked) => setDone((prev) => ({ ...prev, [item]: checked }))}
              tone="sky"
            />
          ))}
        </div>

        <p className="text-xs text-slate-500">
          Use this as a quick personal ritual or as part of a team stand-up. Small consistent actions reduce risk.
        </p>
      </div>
    </CyberToolCard>
  );
}
