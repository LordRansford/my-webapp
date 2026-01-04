"use client";

import React from "react";
import Link from "next/link";
import ToolShell, { useToolInputs } from "@/components/tools/ToolShell";
import { getToolContract } from "@/lib/tools/loadContract";
import { createToolError } from "@/components/tools/ErrorPanel";
import type { ToolContract, ExecutionMode } from "@/components/tools/ToolShell";

const contract = getToolContract("process-friction-mapper");

const examples = [
  {
    title: "Employee Onboarding",
    inputs: {
      processSteps: [
        "Submit application",
        "HR review",
        "Background check",
        "Manager approval",
        "IT account setup",
        "Equipment procurement",
        "First day orientation",
      ],
      actors: ["Candidate", "HR", "Manager", "IT", "Procurement"],
      frictionPoints: [
        "Manual email coordination between departments",
        "Background check takes 2-3 weeks",
        "IT account setup requires manager approval first",
        "Equipment order requires multiple signatures",
      ],
    },
  },
  {
    title: "Invoice Approval Process",
    inputs: {
      processSteps: [
        "Submit invoice",
        "Department review",
        "Finance validation",
        "Approver sign-off",
        "Payment processing",
      ],
      actors: ["Vendor", "Department", "Finance", "Approver"],
      frictionPoints: [
        "Invoices stuck in email inboxes",
        "Manual data entry into finance system",
        "Approver availability delays",
        "No visibility into approval status",
      ],
    },
  },
  {
    title: "Software Deployment",
    inputs: {
      processSteps: [
        "Code commit",
        "Automated tests",
        "Code review",
        "QA testing",
        "Deployment approval",
        "Production deploy",
        "Smoke tests",
      ],
      actors: ["Developer", "Reviewer", "QA", "DevOps"],
      frictionPoints: [
        "Code reviews bottlenecked by availability",
        "Manual deployment approval required",
        "QA environment differs from production",
        "Rollback process is manual and slow",
      ],
    },
  },
];

function ProcessFrictionForm() {
  const { inputs, setInputs } = useToolInputs();
  const processSteps = Array.isArray(inputs.processSteps) ? (inputs.processSteps as string[]) : ["", ""];
  const actors = Array.isArray(inputs.actors) ? (inputs.actors as string[]) : [""];
  const frictionPoints = Array.isArray(inputs.frictionPoints) ? (inputs.frictionPoints as string[]) : [""];

  const updateArray = (key: "processSteps" | "actors" | "frictionPoints", index: number, value: string) => {
    setInputs((prev) => {
      const arr = Array.isArray(prev[key]) ? ([...(prev[key] as string[])] as string[]) : [];
      arr[index] = value;
      return { ...prev, [key]: arr };
    });
  };

  const addItem = (key: "processSteps" | "actors" | "frictionPoints", max: number) => {
    setInputs((prev) => {
      const arr = Array.isArray(prev[key]) ? ([...(prev[key] as string[])] as string[]) : [];
      if (arr.length < max) arr.push("");
      return { ...prev, [key]: arr };
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Process Steps (max 30)</label>
        {processSteps.map((step, idx) => (
          <input
            key={idx}
            type="text"
            value={step}
            onChange={(e) => updateArray("processSteps", idx, e.target.value)}
            maxLength={500}
            className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder={`Step ${idx + 1}`}
          />
        ))}
        {processSteps.length < 30 && (
          <button type="button" onClick={() => addItem("processSteps", 30)} className="mt-2 text-xs text-slate-600 underline">
            + Add Step
          </button>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Actors (max 20)</label>
        {actors.map((actor, idx) => (
          <input
            key={idx}
            type="text"
            value={actor}
            onChange={(e) => updateArray("actors", idx, e.target.value)}
            maxLength={200}
            className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder={`Actor ${idx + 1}`}
          />
        ))}
        {actors.length < 20 && (
          <button type="button" onClick={() => addItem("actors", 20)} className="mt-2 text-xs text-slate-600 underline">
            + Add Actor
          </button>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Friction Points (max 20)</label>
        {frictionPoints.map((friction, idx) => (
          <input
            key={idx}
            type="text"
            value={friction}
            onChange={(e) => updateArray("frictionPoints", idx, e.target.value)}
            maxLength={500}
            className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder={`Friction point ${idx + 1}`}
          />
        ))}
        {frictionPoints.length < 20 && (
          <button type="button" onClick={() => addItem("frictionPoints", 20)} className="mt-2 text-xs text-slate-600 underline">
            + Add Friction Point
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProcessFrictionMapperPage() {
  if (!contract) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">Tool contract not found.</p>
      </div>
    );
  }

  const handleRun = async (mode: ExecutionMode, inputs: Record<string, unknown>) => {
    const steps = inputs.processSteps as string[];
    const acts = inputs.actors as string[];
    const frictions = inputs.frictionPoints as string[];

    const validSteps = steps.filter((s) => s.trim().length > 0);
    if (validSteps.length === 0) {
      return {
        success: false,
        error: createToolError("missing_steps", "process-friction-mapper", { message: "At least one process step is required" }),
      };
    }

    const result = {
      processSteps: validSteps,
      actors: acts.filter((a) => a.trim().length > 0),
      frictionPoints: frictions.filter((f) => f.trim().length > 0),
      frictionHotspots: frictions.filter((f) => f.trim().length > 0).map((f, i) => ({
        id: i + 1,
        description: f,
        affectedSteps: validSteps.filter((s) => s.toLowerCase().includes(f.toLowerCase().split(" ")[0])),
      })),
      recommendations: frictions.filter((f) => f.trim().length > 0).map((f) => `Address: ${f}`),
    };

    return { success: true, output: JSON.stringify(result, null, 2) };
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <nav className="mb-4">
        <Link href="/tools" className="text-sm font-semibold text-blue-700 hover:underline">
          ← Back to Tools
        </Link>
      </nav>

      <ToolShell contract={contract} onRun={handleRun} examples={examples}>
        <ProcessFrictionForm />
      </ToolShell>
    </div>
  );
}

