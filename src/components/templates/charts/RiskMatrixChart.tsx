import React from "react";
import { ResponsiveContainer, ScatterChart, XAxis, YAxis, ZAxis, Scatter, Tooltip, Cell } from "recharts";

type Props = {
  row: number;
  col: number;
};

const colors = ["#22c55e", "#f59e0b", "#ef4444"];

export default function RiskMatrixChart({ row, col }: Props) {
  const data = [{ x: col, y: row, z: 100 }];
  const band = col + row > 14 ? colors[2] : col + row > 9 ? colors[1] : colors[0];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" aria-label="Risk matrix heatmap">
      <div className="text-sm font-semibold text-slate-900 mb-2">Risk matrix</div>
      <div className="text-xs text-slate-700 mb-2">Higher is top right. Point marks current position.</div>
      <ResponsiveContainer width="100%" height={220}>
        <ScatterChart>
          <XAxis type="number" dataKey="x" name="Impact" domain={[1, 10]} tick={{ fontSize: 11 }} />
          <YAxis type="number" dataKey="y" name="Likelihood" domain={[1, 10]} tick={{ fontSize: 11 }} />
          <ZAxis type="number" dataKey="z" range={[60, 60]} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={data} fill={band}>
            <Cell key="point" fill={band} />
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <p className="sr-only">Likelihood row {row}, impact column {col}</p>
    </div>
  );
}
