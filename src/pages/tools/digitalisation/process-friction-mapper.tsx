"use client";

import React, { useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/tools/ToolShell";
import { getToolContract } from "@/lib/tools/loadContract";
import { createToolError } from "@/components/tools/ErrorPanel";
import type { ToolContract, ExecutionMode } from "@/components/tools/ToolShell";

const contract = getToolContract("process-friction-mapper");

export default function ProcessFrictionMapperPage() {
  const [processSteps, setProcessSteps] = useState<string[]>(["", ""]);
  const [actors, setActors] = useState<string[]>([""]);
  const [frictionPoints, setFrictionPoints] = useState<string[]>([""]);

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

  const updateArray = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    setter((prev) => {
      const newArr = [...prev];
      newArr[index] = value;
      return newArr;
    });
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <nav className="mb-4">
        <Link href="/tools" className="text-sm font-semibold text-blue-700 hover:underline">
          ← Back to Tools
        </Link>
      </nav>

      <ToolShell contract={contract} onRun={handleRun} initialInputs={{ processSteps, actors, frictionPoints }}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Process Steps (max 30)</label>
            {processSteps.map((step, idx) => (
              <input
                key={idx}
                type="text"
                value={step}
                onChange={(e) => updateArray(setProcessSteps, idx, e.target.value)}
                maxLength={500}
                className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder={`Step ${idx + 1}`}
              />
            ))}
            {processSteps.length < 30 && (
              <button
                type="button"
                onClick={() => setProcessSteps([...processSteps, ""])}
                className="mt-2 text-xs text-slate-600 underline"
              >
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
                onChange={(e) => updateArray(setActors, idx, e.target.value)}
                maxLength={200}
                className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder={`Actor ${idx + 1}`}
              />
            ))}
            {actors.length < 20 && (
              <button
                type="button"
                onClick={() => setActors([...actors, ""])}
                className="mt-2 text-xs text-slate-600 underline"
              >
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
                onChange={(e) => updateArray(setFrictionPoints, idx, e.target.value)}
                maxLength={500}
                className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder={`Friction point ${idx + 1}`}
              />
            ))}
            {frictionPoints.length < 20 && (
              <button
                type="button"
                onClick={() => setFrictionPoints([...frictionPoints, ""])}
                className="mt-2 text-xs text-slate-600 underline"
              >
                + Add Friction Point
              </button>
            )}
          </div>
        </div>
      </ToolShell>
    </div>
  );
}

