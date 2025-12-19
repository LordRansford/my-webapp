import React from "react";
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from "recharts";

type Props = {
  values: number[];
  labels?: string[];
};

export default function RadarProfileChart({ values, labels }: Props) {
  const data = values.map((v, idx) => ({ subject: labels?.[idx] || `Dim ${idx + 1}`, A: v }));
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" aria-label="Radar profile chart">
      <div className="text-sm font-semibold text-slate-900 mb-2">Profile</div>
      <ResponsiveContainer width="100%" height={240}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Radar name="score" dataKey="A" stroke="#0f172a" fill="#0f172a" fillOpacity={0.15} />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
      <p className="sr-only">Radar chart values {values.join(", ")}</p>
    </div>
  );
}
