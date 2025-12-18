"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

const DEFAULT_TEXT = "Transformers pay attention to the most useful words.";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function TransformerAttentionExplorerTool() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const tokens = useMemo(
    () => text.split(/\s+/).filter(Boolean),
    [text]
  );
  const [focusIndex, setFocusIndex] = useState(0);

  const weights = useMemo(() => {
    if (!tokens.length) return [];
    return tokens.map((_, index) => 1 / (1 + Math.abs(index - focusIndex)));
  }, [tokens, focusIndex]);

  const maxWeight = Math.max(...weights, 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Transformer attention explorer</p>
          <p className="text-xs text-slate-600">Click a word to see where attention concentrates.</p>
        </div>
      </div>

      <div className="mt-4">
        <label className="text-xs font-semibold text-slate-600" htmlFor="attention-text">
          Example text
        </label>
        <input
          id="attention-text"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setFocusIndex(0);
          }}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          type="text"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tokens.map((token, index) => (
          <button
            key={`${token}-${index}`}
            type="button"
            onClick={() => setFocusIndex(index)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              index === focusIndex
                ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            {token}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {tokens.map((token, index) => {
          const weight = weights[index] || 0;
          const percent = clamp(Math.round((weight / maxWeight) * 100), 10, 100);
          return (
            <div key={`${token}-bar-${index}`} className="flex items-center gap-3 text-xs text-slate-700">
              <span className="w-24 truncate text-[11px] text-slate-500">{token}</span>
              <div className="h-2 flex-1 rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-indigo-400" style={{ width: `${percent}%` }} />
              </div>
              <span className="w-10 text-right text-[11px] text-slate-600">{percent}%</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">What to notice</p>
        <p className="mt-2">
          Attention highlights which tokens matter most for the current focus word. It is a guide to relevance, not a
          perfect explanation of meaning.
        </p>
      </div>
    </div>
  );
}
