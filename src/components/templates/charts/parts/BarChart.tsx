"use client";

import React from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Props = {
  data: any[];
  xKey: string;
  yKeys: string[];
};

export default function BarChartComp({ data, xKey, yKeys }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#e2e8f0" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            {yKeys.map((k, idx) => (
              <Bar key={k} dataKey={k} fill={idx === 0 ? "#0f172a" : "#1d4ed8"} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-700 mt-2">Bars compare options or factors. Accessible labels provided.</p>
    </div>
  );
}
