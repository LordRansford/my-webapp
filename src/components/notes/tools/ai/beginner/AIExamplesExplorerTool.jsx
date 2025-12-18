"use client";

import { useMemo, useState } from "react";

const examples = [
  {
    id: "spam-filter",
    title: "Spam filter",
    input: "Email text, sender address, links, and headers",
    output: "Spam or not spam",
    modelType: "Classification",
  },
  {
    id: "recommendations",
    title: "Recommendations",
    input: "User history, item features, and context",
    output: "Ranked list of items",
    modelType: "Ranking",
  },
  {
    id: "forecasting",
    title: "Demand forecast",
    input: "Historical sales, season, and promotions",
    output: "Next week demand number",
    modelType: "Regression",
  },
  {
    id: "vision",
    title: "Image tagging",
    input: "Image pixels",
    output: "Labels such as cat, car, tree",
    modelType: "Classification",
  },
  {
    id: "assistant",
    title: "Chat assistant",
    input: "User prompt and conversation history",
    output: "Suggested reply or action",
    modelType: "Generation",
  },
];

export default function AIExamplesExplorerTool() {
  const [activeId, setActiveId] = useState(examples[0].id);
  const active = useMemo(() => examples.find((item) => item.id === activeId) || examples[0], [activeId]);

  return (
    <div className="space-y-3 text-sm text-gray-800">
      <div className="flex flex-wrap gap-2">
        {examples.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveId(item.id)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              item.id === active.id
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white/70 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Input</div>
        <p className="mt-1 text-sm text-gray-800">{active.input}</p>
        <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Model output</div>
        <p className="mt-1 text-sm text-gray-800">{active.output}</p>
        <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Typical model type</div>
        <p className="mt-1 text-sm text-gray-800">{active.modelType}</p>
      </div>
    </div>
  );
}
