import React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Props = {
  values: number[];
  labels?: string[];
};

export default function OptionBarChart({ values, labels }: Props) {
  const data = values.map((v, idx) => ({ name: labels?.[idx] || `Opt ${idx + 1}`, value: v }));
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" aria-label="Option comparison chart">
      <div className="text-sm font-semibold text-slate-900 mb-2">Option comparison</div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="value" fill="#0f172a" />
        </BarChart>
      </ResponsiveContainer>
      <p className="sr-only">Bar chart values {values.join(", ")}</p>
    </div>
  );
}
