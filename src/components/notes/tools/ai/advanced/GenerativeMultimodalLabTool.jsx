"use client";

import { useMemo, useState } from "react";
import { Sparkles, Image, Mic } from "lucide-react";

const MODES = [
  { id: "text", label: "Text", icon: Sparkles },
  { id: "image", label: "Image", icon: Image },
  { id: "audio", label: "Audio", icon: Mic },
];

const buildOutput = (mode, prompt, temperature) => {
  const tone = temperature > 0.7 ? "playful" : temperature > 0.4 ? "balanced" : "precise";
  if (mode === "image") {
    return `Generated image concept: ${prompt || "a clean city skyline"} with a ${tone} style and soft lighting.`;
  }
  if (mode === "audio") {
    return `Generated audio concept: ${prompt || "a calm voice note"} in a ${tone} tone with gentle pacing.`;
  }
  return `Generated text: ${prompt || "a clear summary"} in a ${tone} style with focused detail.`;
};

export default function GenerativeMultimodalLabTool() {
  const [mode, setMode] = useState("text");
  const [prompt, setPrompt] = useState("Explain a smart energy dashboard.");
  const [temperature, setTemperature] = useState(0.5);

  const output = useMemo(() => buildOutput(mode, prompt, temperature), [mode, prompt, temperature]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Generative and multimodal lab</p>
          <p className="text-xs text-slate-600">Try prompts across text, image, and audio modes.</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {MODES.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                mode === item.id
                  ? "border-sky-200 bg-sky-50 text-sky-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <span className="text-xs font-semibold text-slate-600">Prompt</span>
          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
            type="text"
          />
        </label>
        <label className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <span className="text-xs font-semibold text-slate-600">Temperature: {temperature.toFixed(2)}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={temperature}
            onChange={(event) => setTemperature(Number(event.target.value))}
            className="mt-2 w-full accent-slate-900"
          />
        </label>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Output preview</p>
        <p className="mt-2">{output}</p>
      </div>
    </div>
  );
}
