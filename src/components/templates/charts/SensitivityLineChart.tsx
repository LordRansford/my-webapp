import React from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

type Props = {
  values: number[];
};

export default function SensitivityLineChart({ values }: Props) {
  const data = values.map((v, idx) => ({ name: `S${idx + 1}`, value: v }));
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" aria-label="Sensitivity line chart">
      <div className="text-sm font-semibold text-slate-900 mb-2">Scenario sensitivity</div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#0f172a" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
      <p className="sr-only">Sensitivity values {values.join(", ")}</p>
    </div>
  );
}
