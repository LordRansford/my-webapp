"use client";

import { useEffect, useMemo, useState } from "react";
import ChartCard from "@/components/dashboard/ChartCard";
import DashboardQueryPanel from "@/components/dashboard/DashboardQueryPanel";
import InsightHighlights from "@/components/dashboard/InsightHighlights";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function CybersecurityDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState({
    focus: "Threats",
    minSeverity: 1,
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch("/api/dashboards/cybersecurity", { cache: "no-store" });
      const json = await res.json();
      setData(json);
      setLoading(false);
    };
    load();
  }, []);

  const threats = useMemo(() => {
    if (!data) return [];
    return data.threatCategories
      .filter((t) => t.severity >= query.minSeverity)
      .map((t) => ({ name: t.category, severity: t.severity }));
  }, [data, query]);

  const narrative = useMemo(() => {
    if (!data || threats.length === 0) return "No threats match your current view.";
    const top = threats.slice().sort((a, b) => b.severity - a.severity)[0];
    return `The most severe category here is ${top.name}. I focus on this first because high severity issues tend to cascade across systems, especially when identity or privilege is involved.`;
  }, [threats, data]);

  const insights = useMemo(() => {
    if (!data) return [];
    const out = [];

    if (threats.some((t) => t.name.toLowerCase().includes("credential"))) {
      out.push({
        title: "Identity dominates risk",
        body: "Credential related failures appear frequently because identity systems sit upstream of everything else.",
      });
    }

    if (query.minSeverity >= 4) {
      out.push({
        title: "You are prioritising pain",
        body: "Filtering by high severity is a strong habit. It forces conversations about unacceptable outcomes.",
      });
    }

    return out;
  }, [data, threats, query]);

  return (
    <div className="rn-dashboard-grid">
      <DashboardQueryPanel
        title="Query"
        subtitle="Choose what kind of security thinking you want to do, then explore how risk clusters."
        query={query}
        onChange={setQuery}
        schema={{
          focus: {
            label: "Focus",
            type: "select",
            options: ["Threats", "Controls"],
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
          { label: "Show me critical risks", apply: { minSeverity: 4 } },
          { label: "Show everything", apply: { minSeverity: 1 } },
        ]}
      />

      <div className="rn-dashboard-main">
        <div className="rn-card">
          <div className="rn-card-title">What this view suggests</div>
          <div className="rn-card-body">{loading ? "Loading…" : narrative}</div>
        </div>

        <InsightHighlights items={insights} />

        <ChartCard
          title="Threat categories by severity"
          description="This chart groups threats by how damaging they tend to be when they succeed. Severity is a teaching signal, not a prediction."
          loading={loading}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={threats}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="severity" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="rn-card">
          <div className="rn-card-title">How I would use this defensively</div>
          <div className="rn-card-body">
            I would map these categories to concrete assets and trust boundaries, then ask which controls actually reduce the highest severity risks. Anything that relies on perfect human behaviour is a weak
            control.
          </div>
        </div>
      </div>
    </div>
  );
}
