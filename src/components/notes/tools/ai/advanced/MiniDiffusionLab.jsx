"use client";

import { useMemo, useState } from "react";
import { Eraser, Sparkles } from "lucide-react";

const GRID_SIZE = 8;
const STEPS = 10;

const buildBase = () => {
  const values = [];
  const center = (GRID_SIZE - 1) / 2;
  const radius = GRID_SIZE / 2.5;
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const dist = Math.hypot(row - center, col - center);
      const intensity = dist < radius ? 1 - dist / radius : 0;
      values.push(Math.max(0, intensity));
    }
  }
  return values;
};

const buildNoise = () => Array.from({ length: GRID_SIZE * GRID_SIZE }, () => Math.random());

export default function MiniDiffusionLab() {
  const [step, setStep] = useState(0);
  const base = useMemo(() => buildBase(), []);
  const noise = useMemo(() => buildNoise(), []);

  const blend = step / STEPS;
  const grid = useMemo(
    () => base.map((value, index) => value * (1 - blend) + noise[index] * blend),
    [base, noise, blend]
  );

  const caption =
    step === 0
      ? "Clean latent pattern"
      : step < STEPS / 2
      ? "Noise being added"
      : step === STEPS
      ? "Fully noised"
      : "Denoising back to structure";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-fuchsia-50 text-fuchsia-700 ring-1 ring-fuchsia-100">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Watch a tiny diffusion process</p>
          <p className="text-xs text-slate-600">Step through noising and denoising to see an image emerge.</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-700">
          <span className="font-semibold text-slate-900">Step {step}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">{caption}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setStep((prev) => Math.max(0, prev - 1))}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:border-slate-300"
          >
            Denoise
          </button>
          <button
            type="button"
            onClick={() => setStep((prev) => Math.min(STEPS, prev + 1))}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:border-slate-300"
          >
            Add noise
          </button>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-800"
          >
            <Eraser className="h-3.5 w-3.5" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div>
          <div
            className="grid aspect-square w-full grid-cols-8 gap-[3px] rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-inner"
            role="img"
            aria-label="Diffusion grid"
          >
            {grid.map((value, index) => {
              const shade = Math.round(value * 255);
              return (
                <div
                  key={`cell-${index}`}
                  className="rounded-[6px] border border-white/60"
                  style={{ backgroundColor: `rgb(${shade}, ${shade}, ${shade})` }}
                />
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-slate-600">
            Each step moves between latent structure and random noise. Sampling walks this path until a clean picture appears.
          </p>
        </div>

        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3 text-[11px] text-slate-700">
          <p className="text-xs font-semibold text-slate-900">How to read this</p>
          <ul className="list-disc pl-4 text-[11px] text-slate-700">
            <li>Noise pushes the grid toward gray static.</li>
            <li>Denoising leans back toward the latent shape.</li>
            <li>Sampling is the set of tiny steps that travel this curve.</li>
          </ul>
          <p className="text-[11px] text-slate-600">
            Try adding noise until the pattern hides, then denoise to see how structure can return.
          </p>
        </div>
      </div>
    </div>
  );
}
