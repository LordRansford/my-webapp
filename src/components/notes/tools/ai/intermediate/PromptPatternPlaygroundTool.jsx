"use client";

import { useMemo, useState } from "react";

const patterns = [
  {
    id: "role",
    label: "Role and goal",
    template: "You are a helpful assistant. Task: {task}. Output in 5 bullet points.",
    hint: "Give the model a role and a clear output format.",
  },
  {
    id: "few-shot",
    label: "Few shot",
    template: "Task: {task}\nExample input: A\nExample output: B\nNow do it for: {task}",
    hint: "Show one example so the model copies the pattern.",
  },
  {
    id: "critique",
    label: "Critique and improve",
    template: "Draft an answer to: {task}. Then list 3 weaknesses and improve the answer.",
    hint: "Ask for self review to reduce mistakes.",
  },
  {
    id: "constraints",
    label: "Constraints",
    template: "Task: {task}. Constraints: keep it under 80 words and avoid jargon.",
    hint: "Add constraints to keep output predictable.",
  },
];

export default function PromptPatternPlaygroundTool() {
  const [task, setTask] = useState("Explain what vector search is.");
  const [patternId, setPatternId] = useState(patterns[0].id);

  const active = useMemo(
    () => patterns.find((pattern) => pattern.id === patternId) || patterns[0],
    [patternId]
  );

  const promptPreview = useMemo(() => active.template.replaceAll("{task}", task), [active, task]);

  return (
    <div className="space-y-3 text-sm text-gray-800">
      <div>
        <label className="block text-xs font-semibold text-gray-600">Task</label>
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          type="text"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {patterns.map((pattern) => (
          <button
            key={pattern.id}
            type="button"
            onClick={() => setPatternId(pattern.id)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              pattern.id === active.id
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            }`}
          >
            {pattern.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white/70 p-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Prompt preview</div>
        <p className="mt-2 whitespace-pre-wrap text-sm text-gray-800">{promptPreview}</p>
        <p className="mt-2 text-xs text-gray-600">{active.hint}</p>
      </div>
    </div>
  );
}
