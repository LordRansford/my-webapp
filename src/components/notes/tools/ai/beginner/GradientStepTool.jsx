"use client";

import { useMemo, useState } from "react";

export default function GradientStepTool() {
  const [weight, setWeight] = useState(0.5);
  const [gradient, setGradient] = useState(-0.2);
  const [lr, setLr] = useState(0.1);

  const updated = useMemo(() => weight - lr * gradient, [weight, lr, gradient]);

  return (
    <div className="space-y-3 text-sm text-gray-800">
      <p className="text-sm text-gray-700">Change the weight, gradient, and learning rate. See one gradient descent step.</p>

      <div className="grid gap-2 md:grid-cols-3">
        <NumberInput label="Weight (w)" value={weight} setValue={setWeight} step={0.1} />
        <NumberInput label="Gradient (∂L/∂w)" value={gradient} setValue={setGradient} step={0.05} />
        <NumberInput label="Learning rate (η)" value={lr} setValue={setLr} step={0.01} min={0.01} max={1} />
      </div>

      <div className="rounded-2xl border bg-white/70 p-3">
        <div className="text-xs uppercase tracking-wide text-gray-600">Update</div>
        <p className="mt-1 text-sm">wₙ₊₁ = w - η · gradient</p>
        <p className="text-lg font-semibold text-gray-900">New weight: {updated.toFixed(3)}</p>
        <p className="text-xs text-gray-600">If gradient is negative, the weight increases. If positive, the weight decreases.</p>
      </div>
    </div>
  );
}

function NumberInput({ label, value, setValue, step = 0.1, min = -2, max = 2 }) {
  return (
    <label className="block text-xs font-semibold text-gray-600">
      {label}
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => setValue(Number(e.target.value))}
        className="mt-1 w-full rounded-lg border px-2 py-1 text-sm text-gray-900"
      />
    </label>
  );
}
