"use client";

import React, { useMemo, useState } from "react";

type PromptScore = {
  score: number;
  hints: string[];
};

function analysePrompt(text: string): PromptScore {
  const t = text.trim();
  if (!t) return { score: 0, hints: [] };

  const lower = t.toLowerCase();
  const hints: string[] = [];

  if (!/[.!?]/.test(t)) {
    hints.push("Add full sentences so the model can follow your reasoning.");
  }

  if (!lower.includes("you are") && !lower.includes("as an")) {
    hints.push(
      "Consider giving the model a clear role, for example “You are a security analyst…”."
    );
  }

  if (!lower.includes("goal") && !lower.includes("task") && !lower.includes("produce")) {
    hints.push("State the main goal, for example “Your goal is to summarise…”.");
  }

  if (
    !lower.includes("constraints") &&
    !lower.includes("do not") &&
    !lower.includes("avoid")
  ) {
    hints.push("Add a few constraints: length, tone, or things to avoid.");
  }

  if (t.split(/\s+/).length < 25) {
    hints.push("This prompt is very short. Longer context often gives better results.");
  }

  const maxPossible = 5;
  let score = maxPossible - hints.length;
  if (score < 0) score = 0;

  return { score, hints };
}

export function PromptClarityLab() {
  const [prompt, setPrompt] = useState("");
  const analysis = useMemo(() => analysePrompt(prompt), [prompt]);

  const percentage = (analysis.score / 5) * 100;

  const barColor =
    percentage >= 80
      ? "bg-emerald-500"
      : percentage >= 50
      ? "bg-amber-400"
      : "bg-rose-500";

  return (
    <section
      aria-labelledby="prompt-clarity-lab-title"
      className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 p-6 sm:p-8 space-y-6"
    >
      <header className="space-y-2">
        <h2
          id="prompt-clarity-lab-title"
          className="text-lg sm:text-xl font-semibold text-slate-900"
        >
          Prompt clarity lab
        </h2>
        <p className="text-sm text-slate-600 max-w-xl">
          Paste a prompt you plan to use with an AI model. This lab does not run
          the model. It helps you see if your instructions are clear, complete
          and grounded in a goal.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <label
            htmlFor="prompt-input"
            className="text-xs font-medium uppercase tracking-wide text-slate-500"
          >
            Your prompt
          </label>
          <textarea
            id="prompt-input"
            className="h-56 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
            placeholder="For example: You are a data scientist helping me describe the performance of a classification model to a non-technical audience…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <p className="text-xs text-slate-500">
            Your text never leaves the browser. Use this as a rehearsal space
            before you send anything to a real model.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">
              Clarity score
            </h3>
            {prompt.trim() ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full ${barColor} transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">
                    {analysis.score}/5
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  This score is not a judgement. It is a nudge to include
                  context, goals and constraints so the model has less guessing
                  to do.
                </p>
              </>
            ) : (
              <p className="text-xs text-slate-500">
                Start typing a prompt to see a breakdown of what could be
                clearer.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">
              Suggestions for this prompt
            </h3>
            {prompt.trim() ? (
              analysis.hints.length ? (
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                  {analysis.hints.map((hint, idx) => (
                    <li key={idx}>{hint}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-600">
                  This looks like a well structured prompt. You can still improve
                  it by adding small examples or counterexamples.
                </p>
              )
            ) : (
              <p className="text-xs text-slate-500">
                When you paste a prompt, you will see concrete suggestions here.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
