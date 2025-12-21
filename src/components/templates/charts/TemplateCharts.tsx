"use client";

import dynamic from "next/dynamic";
import React from "react";

const RadarChartComp = dynamic(() => import("./parts/RadarChart"), { ssr: false });
const LineChartComp = dynamic(() => import("./parts/LineChart"), { ssr: false });
const BarChartComp = dynamic(() => import("./parts/BarChart"), { ssr: false });

type MatrixProps = {
  placement?: { row: number; col: number };
};

export function RiskMatrix({ placement }: MatrixProps) {
  const rows = ["Very High", "High", "Medium", "Low", "Very Low"];
  const cols = ["Very Low", "Low", "Medium", "High", "Very High"];
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-slate-900">Risk matrix</p>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-6 gap-1 min-w-[320px]">
          <div />
          {cols.map((c) => (
            <div key={c} className="text-center text-xs font-semibold text-slate-700">
              {c}
            </div>
          ))}
          {rows.map((r, rowIdx) => (
            <React.Fragment key={r}>
              <div className="text-xs font-semibold text-slate-700">{r}</div>
              {cols.map((c, colIdx) => {
                const active = placement && placement.row === rowIdx && placement.col === colIdx;
                return (
                  <div
                    key={c}
                    className={`h-10 rounded ${active ? "bg-amber-200 border-2 border-amber-500" : "bg-slate-100"} flex items-center justify-center text-sm text-slate-700`}
                    aria-label={`${r} x ${c}`}
                  >
                    {active ? "Current" : ""}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TemplateRadarChart({ data }: { data: Record<string, any>[] }) {
  if (!data?.length) return null;
  return <RadarChartComp data={data} dataKey="name" valueKey="value" />;
}

export function TemplateLineChart({ data, xKey, yKey }: { data: Record<string, any>[]; xKey: string; yKey: string }) {
  if (!data?.length) return null;
  return <LineChartComp data={data} xKey={xKey} yKey={yKey} />;
}

export function TemplateBarChart({ data, xKey, yKeys }: { data: Record<string, any>[]; xKey: string; yKeys: string[] }) {
  if (!data?.length) return null;
  return <BarChartComp data={data} xKey={xKey} yKeys={yKeys} />;
}
