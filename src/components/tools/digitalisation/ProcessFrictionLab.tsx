"use client";

import React, { useMemo, useState } from "react";
import { Workflow } from "lucide-react";

type Step = {
  id: number;
  name: string;
  isManual: boolean;
  frictionScore: number;
};

function clampFriction(v: number) {
  if (!Number.isFinite(v) || v < 0) return 0;
  if (v > 5) return 5;
  return v;
}

export function ProcessFrictionLab() {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      name: "Customer sends email",
      isManual: true,
      frictionScore: 4,
    },
    {
      id: 2,
      name: "Agent copies details into system",
      isManual: true,
      frictionScore: 5,
    },
    {
      id: 3,
      name: "System runs automatic checks",
      isManual: false,
      frictionScore: 2,
    },
  ]);

  const addStep = () => {
    const nextId = steps.length ? Math.max(...steps.map((s) => s.id)) + 1 : 1;
    setSteps((prev) => [
      ...prev,
      {
        id: nextId,
        name: "New step",
        isManual: true,
        frictionScore: 3,
      },
    ]);
  };

  const updateStep = (id: number, patch: Partial<Step>) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const removeStep = (id: number) => {
    if (steps.length <= 1) return;
    setSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const totalFriction = useMemo(
    () => steps.reduce((sum, s) => sum + clampFriction(s.frictionScore), 0),
    [steps]
  );

  const manualSteps = steps.filter((s) => s.isManual).length;

  return (
    <section
      aria-labelledby="process-friction-lab-title"
      className="rounded-3xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 p-6 sm:p-8 space-y-6 transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(15,23,42,0.10)]"
    >
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
            <Workflow className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <h2
              id="process-friction-lab-title"
              className="text-lg sm:text-xl font-semibold text-slate-900"
            >
              Process friction mapper
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Map the main steps in a process, mark which ones are manual and
              rate how painful they are. This gives you a simple digitalisation
              heatmap.
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-700">
              Process steps
            </p>
            <button
              type="button"
              onClick={addStep}
              className="text-xs rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              aria-label="Add step"
            >
              Add step
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {steps.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-slate-200 bg-white p-3 space-y-2 text-xs text-slate-700"
              >
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={s.name}
                    onChange={(e) =>
                      updateStep(s.id, { name: e.target.value })
                    }
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeStep(s.id)}
                    className="text-sm px-2 py-1 rounded-full text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                    aria-label="Remove step"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={s.isManual}
                      onChange={(e) =>
                        updateStep(s.id, { isManual: e.target.checked })
                      }
                      className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-sm text-slate-700">
                      Manual step
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">
                      Friction 0 to 5
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      step={0.5}
                      value={s.frictionScore}
                      onChange={(e) =>
                        updateStep(s.id, {
                          frictionScore: clampFriction(Number(e.target.value)),
                        })
                      }
                      className="w-16 rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs text-right text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            Manual steps with high friction are good candidates for automation
            or better interfaces.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Heatmap summary
            </h3>
            <p className="text-sm text-slate-700">
              You have {steps.length} steps in this process.{" "}
              <span className="font-semibold text-slate-900">{manualSteps}</span> are marked as manual.
            </p>
            <p className="mt-1 text-sm text-slate-700">
              Total friction score is{" "}
              <span className="font-semibold text-slate-900">
                {totalFriction.toFixed(1)}
              </span>
              .
            </p>
            <p className="mt-2 text-xs text-slate-600">
              Sort the list by friction score and start with the top one or two
              steps. That gives you a focused improvement plan instead of a
              vague digitalisation ambition.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 text-xs text-slate-700 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">
              How this supports a digital strategy
            </h3>
            <p className="text-sm text-slate-700">
              Instead of saying “we will automate the process”, you can say “we
              will reduce friction in the top two manual steps by redesigning
              forms and introducing guided workflows”.
            </p>
            <p className="text-sm text-slate-700">
              This is easier for stakeholders to understand and align with than
              abstract digitalisation goals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
