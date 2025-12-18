"use client";

import EvaluationMetricsExplorer from "@/components/dashboards/ai/EvaluationMetricsExplorer";
import DriftMonitorSimulator from "@/components/dashboards/ai/DriftMonitorSimulator";

export default function ModelForgeAdvancedTool() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <EvaluationMetricsExplorer />
      <DriftMonitorSimulator />
    </div>
  );
}
