"use client";

import { useMemo, useState } from "react";

const sources = ["App", "Sensor", "CSV upload"];
const processors = ["Clean", "Join", "Aggregate"];
const consumers = ["Dashboard", "AI model", "Report"];

export default function DataPipelineDesignerTool() {
  const [selectedSource, setSelectedSource] = useState("App");
  const [selectedProcessor, setSelectedProcessor] = useState("Clean");
  const [selectedConsumer, setSelectedConsumer] = useState("Dashboard");

  const summary = useMemo(
    () =>
      `${selectedSource} -> ${selectedProcessor} -> ${selectedConsumer}`,
    [selectedSource, selectedProcessor, selectedConsumer]
  );

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Pick a source, a processor, and a consumer to sketch a tiny pipeline. Notice how every hop needs ownership and checks.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <Selector
          label="Source"
          value={selectedSource}
          onChange={setSelectedSource}
          options={sources}
          hint="Where data enters."
        />
        <Selector
          label="Processor"
          value={selectedProcessor}
          onChange={setSelectedProcessor}
          options={processors}
          hint="What transforms the data."
        />
        <Selector
          label="Consumer"
          value={selectedConsumer}
          onChange={setSelectedConsumer}
          options={consumers}
          hint="Who uses the output."
        />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800">
        <p className="font-semibold text-slate-900">Pipeline view</p>
        <p className="mt-1 font-mono text-xs text-slate-700">{summary}</p>
        <p className="mt-1 text-xs text-slate-700">
          If any part fails or is undefined, data stops flowing or becomes untrustworthy.
        </p>
      </div>
    </div>
  );
}

function Selector({ label, value, onChange, options, hint }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-sky-200"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-slate-600">{hint}</p>
    </div>
  );
}
