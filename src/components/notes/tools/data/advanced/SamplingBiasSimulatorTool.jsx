"use client";

import { useMemo, useState } from "react";

const population = [
  { group: "A", count: 50 },
  { group: "B", count: 30 },
  { group: "C", count: 20 },
];

function sample(pop, size, biasGroup) {
  const expanded = [];
  pop.forEach((item) => {
    const weight = biasGroup && item.group === biasGroup ? 2 : 1;
    for (let i = 0; i < item.count * weight; i += 1) {
      expanded.push(item.group);
    }
  });

  const result = [];
  for (let i = 0; i < size; i += 1) {
    const pick = Math.floor(Math.random() * expanded.length);
    result.push(expanded[pick]);
  }
  return result;
}

export default function SamplingBiasSimulatorTool() {
  const [size, setSize] = useState(20);
  const [biasGroup, setBiasGroup] = useState("");

  const draw = useMemo(() => sample(population, size, biasGroup || null), [size, biasGroup]);

  const counts = useMemo(() => {
    return population.map((item) => ({
      group: item.group,
      sample: draw.filter((g) => g === item.group).length,
      population: item.count,
    }));
  }, [draw]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Change sample size or bias toward a group to see how conclusions can drift from the real population.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-800">
          <span>Sample size</span>
          <input
            type="range"
            min="5"
            max="80"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="accent-amber-500"
          />
          <span className="text-xs text-slate-600">{size} samples</span>
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-800">
          <span>Bias toward group</span>
          <select
            value={biasGroup}
            onChange={(e) => setBiasGroup(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-sky-200"
          >
            <option value="">None</option>
            {population.map((item) => (
              <option key={item.group} value={item.group}>
                {item.group}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-600">Bias doubles the chance of picking that group.</span>
        </label>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="font-semibold text-slate-900">Population vs sample</p>
        <ul className="mt-2 space-y-1">
          {counts.map((item) => (
            <li key={item.group}>
              Group {item.group}: population {item.population}, sample {item.sample}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-slate-600">
          If the sample does not reflect the population, results will be skewed. Larger, fair samples reduce risk but never remove it.
        </p>
      </div>
    </div>
  );
}
