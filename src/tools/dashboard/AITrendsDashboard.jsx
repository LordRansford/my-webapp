"use client";

import { useEffect, useMemo, useState } from "react";
import ChartCard from "@/components/dashboard/ChartCard";
import DashboardQueryPanel from "@/components/dashboard/DashboardQueryPanel";
import InsightHighlights from "@/components/dashboard/InsightHighlights";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

function scoreSeverity(x) {
  return Math.max(1, Math.min(5, Number(x?.severity || 1)));
}

export default function AITrendsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState({
    familyType: "All",
    failureCategory: "All",
    minSeverity: 1,
    focus: "Failure modes",
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch("/api/dashboards/ai", { cache: "no-store" });
      const json = await res.json();
      setData(json);
      setLoading(false);
    };
    load();
  }, []);

  const types = useMemo(() => {
    if (!data) return ["All"];
    const xs = new Set(data.modelFamilies.map((m) => m.type));
    return ["All", ...Array.from(xs)];
  }, [data]);

  const failureCats = useMemo(() => {
    if (!data) return ["All"];
    const xs = new Set(data.failureModes.map((f) => f.category));
    return ["All", ...Array.from(xs)];
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return null;

    const mf = data.modelFamilies.filter((m) => (query.familyType === "All" ? true : m.type === query.familyType));

    const fm = data.failureModes
      .filter((f) => (query.failureCategory === "All" ? true : f.category === query.failureCategory))
      .filter((f) => scoreSeverity(f) >= Number(query.minSeverity || 1))
      .map((f) => ({ ...f, severity: scoreSeverity(f) }));

    return { mf, fm };
  }, [data, query]);

  const familyChart = useMemo(() => {
    if (!filtered) return [];
    const grouped = new Map();
    for (const m of filtered.mf) {
      const k = m.family;
      grouped.set(k, (grouped.get(k) || 0) + 1);
    }
    return Array.from(grouped.entries()).map(([name, count]) => ({ name, count }));
  }, [filtered]);

  const failureRadar = useMemo(() => {
    if (!filtered) return [];
    return filtered.fm.map((f) => ({ name: f.mode, severity: f.severity }));
  }, [filtered]);

  const narrative = useMemo(() => {
    if (!filtered) return "";
    const fm = filtered.fm;
    const mf = filtered.mf;

    const topFailure = fm.slice().sort((a, b) => b.severity - a.severity)[0];
    const modelTypes = new Set(mf.map((m) => m.type));

    if (query.focus === "Failure modes") {
      if (!topFailure) return "No failure modes match your current filters.";
      return `The strongest signal in this view is ${topFailure.mode}. I treat it as high risk because ${topFailure.why.toLowerCase()}. If this was a real system, I would ask what assumptions made that failure likely and what monitoring would detect it early.`;
    }

    return `Your filters currently include ${modelTypes.size} model type${modelTypes.size === 1 ? "" : "s"}. The point here is not to pick a favourite model family. It is to notice what kind of mistakes your system will make and whether you can live with them operationally.`;
  }, [filtered, query]);

  const insights = useMemo(() => {
    if (!filtered) return [];
    const out = [];

    const severe = filtered.fm.filter((x) => x.severity >= 4);
    if (severe.length >= 2) {
      out.push({
        title: "High severity cluster",
        body: "Multiple failure modes in this view are high severity. That usually means the risk is systemic, not a single bug.",
      });
    }

    const hasSecurity = filtered.fm.some((x) => x.category === "Security");
    if (hasSecurity) {
      out.push({
        title: "Security is a system property",
        body: "Security failure modes appear here because models become part of a wider system. A safe model can still be used unsafely.",
      });
    }

    if (Number(query.minSeverity) >= 4) {
      out.push({
        title: "You are filtering for pain",
        body: "This is the right habit. Start from what can hurt you, then design controls and monitoring around that.",
      });
    }

    return out;
  }, [filtered, query]);

  return (
    <div className="rn-dashboard-grid">
      <DashboardQueryPanel
        title="Query"
        subtitle="Pick a view, filter what you want to focus on, then let the charts argue back."
        query={query}
        onChange={setQuery}
        schema={{
          focus: {
            label: "Focus",
            type: "select",
            options: ["Failure modes", "Model families"],
          },
          familyType: {
            label: "Model type",
            type: "select",
            options: types,
          },
          failureCategory: {
            label: "Failure category",
            type: "select",
            options: failureCats,
          },
          minSeverity: {
            label: "Minimum severity",
            type: "range",
            min: 1,
            max: 5,
            step: 1,
          },
        }}
        presets={[
          {
            label: "Show me high severity failures",
            apply: { focus: "Failure modes", minSeverity: 4, failureCategory: "All", familyType: "All" },
          },
          {
            label: "Focus on security failures",
            apply: { focus: "Failure modes", minSeverity: 3, failureCategory: "Security", familyType: "All" },
          },
          {
            label: "Explore model families",
            apply: { focus: "Model families", minSeverity: 1, failureCategory: "All", familyType: "All" },
          },
        ]}
      />

      <div className="rn-dashboard-main">
        <div className="rn-card">
          <div className="rn-card-title">What this view is saying</div>
          <div className="rn-card-body">{loading ? "Loading data…" : narrative}</div>
        </div>

        <InsightHighlights items={insights} />

        <ChartCard
          title="Model families in scope"
          description="This is a simple count view. I use it to remind myself not to worship a model family. Most failures come from the experiment and the system, not the architecture."
          loading={loading}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={familyChart}>
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#111827" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Failure modes and severity"
          description="Severity is not a scientific fact here. It is a teaching signal. The goal is to build the habit of asking what happens when the system fails, not just whether it fails."
          loading={loading}
        >
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={failureRadar}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" tick={false} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} />
              <Radar dataKey="severity" fill="#111827" fillOpacity={0.2} stroke="#111827" />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="rn-card">
          <div className="rn-card-title">How I would use this in a real project</div>
          <div className="rn-card-body">
            I would start by writing down what harm looks like in this context. Then I would pick metrics that measure that harm, not just model fit.
            Then I would design monitoring that can see drift, leakage, and misuse. If the system cannot see failure, it cannot be safe.
          </div>
        </div>
      </div>
    </div>
  );
}
