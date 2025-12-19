"use client";

import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

type Props = {
  data: any[];
  dataKey: string;
  valueKey: string;
};

export default function RadarChartComp({ data, dataKey, valueKey }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey={dataKey} />
            <Radar dataKey={valueKey} stroke="#0f172a" fill="#0f172a" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-700 mt-2">Chart shown for illustration; values update as you change inputs.</p>
    </div>
  );
}
