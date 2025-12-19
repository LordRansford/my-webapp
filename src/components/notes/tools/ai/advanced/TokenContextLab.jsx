"use client";

import { useMemo, useState } from "react";
import { ListChecks, Scissors } from "lucide-react";

const DEFAULT_TEXT =
  "Transformers break text into tokens, weigh them with attention, and stay within a context window. Short prompts leave room for reasoning.";

const tokenize = (text) =>
  text
    .trim()
    .split(/\s+/)
    .filter(Boolean);

export default function TokenContextLab() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [limit, setLimit] = useState(48);
  const [focusIndex, setFocusIndex] = useState(0);

  const tokens = useMemo(() => tokenize(text), [text]);
  const truncated = tokens.slice(0, limit);
  const overflow = tokens.length > limit;

  const attentionHint = useMemo(() => {
    if (!truncated.length) return [];
    return truncated.map((_, index) => 1 / (1 + Math.abs(index - focusIndex)));
  }, [truncated, focusIndex]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
          <ListChecks className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Explore tokens and context</p>
          <p className="text-xs text-slate-600">See how token limits and position hints shape model inputs.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <span className="text-xs font-semibold text-slate-600">Prompt text</span>
          <textarea
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setFocusIndex(0);
            }}
            rows={5}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
          />
          <p className="mt-2 text-[11px] text-slate-500">
            Tokens here are a simple split on whitespace to keep the idea clear.
          </p>
        </label>

        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Context window</span>
            <input
              type="range"
              min={12}
              max={120}
              value={limit}
              onChange={(event) => setLimit(Number(event.target.value))}
              className="flex-1 accent-sky-500"
            />
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
              {limit} tokens
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Total tokens: <span className="font-semibold text-slate-800">{tokens.length}</span>{" "}
            {overflow ? "(will be truncated)" : "(fits)"}
          </p>
          {overflow ? (
            <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-2 text-[11px] text-amber-700">
              <p className="font-semibold">Truncation</p>
              <p>The model only sees the first {limit} tokens. Long prompts or retrieved context can fall out.</p>
            </div>
          ) : null}
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2 text-[11px] text-slate-700">
            <p className="font-semibold text-slate-800">Truncated view</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{truncated.join(" ") || "Add some text above."}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center justify-between text-xs text-slate-700">
          <span className="font-semibold text-slate-800">Token positions</span>
          <div className="flex items-center gap-2 text-[11px] text-slate-600">
            <Scissors className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Click a token to focus attention</span>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {truncated.slice(0, 24).map((token, index) => {
            const weight = attentionHint[index];
            const isActive = index === focusIndex;
            const opacity = Math.max(0.25, Math.min(1, weight));
            return (
              <button
                key={`${token}-${index}`}
                type="button"
                onClick={() => setFocusIndex(index)}
                className={`flex flex-col rounded-xl border px-3 py-2 text-left text-[11px] transition ${
                  isActive ? "border-sky-400 bg-sky-50 text-sky-800" : "border-slate-200 bg-white text-slate-700"
                }`}
                style={{ boxShadow: `0 0 0 1px rgba(56, 189, 248, ${isActive ? 0.45 : 0})`, opacity }}
              >
                <span className="truncate font-semibold">{token}</span>
                <span className="text-[10px] text-slate-500">Pos {index + 1}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] text-slate-600">
          Positional encodings tell the model where each token sits. Attention then turns that into a soft focus across the window.
        </p>
      </div>
    </div>
  );
}
