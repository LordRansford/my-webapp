"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useStudiosStore } from "@/stores/useStudiosStore";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";

const localModels = {
  "local-small": "Local small",
  "local-instruct": "Local instruct",
};

function runLocalModel({ model, prompt, temperature, maxTokens }) {
  const trimmed = (prompt || "").trim();
  const tokensIn = Math.max(5, Math.round(trimmed.length / 4));
  const variation = temperature > 0.5 ? " (a bit more creative)" : "";
  const prefix = model === "local-instruct" ? "Instruction-style response:" : "Lightweight response:";
  const text =
    trimmed.length === 0
      ? "No prompt provided."
      : `${prefix}${variation} ${trimmed}\n\nKey points:\n- ${trimmed.slice(0, 60)}...\n- This is a local, deterministic sketch for teaching.`;
  const tokensOut = Math.min(maxTokens, Math.max(20, Math.round(text.length / 4)));
  return {
    text,
    tokensIn,
    tokensOut,
  };
}

function formatMs(ms) {
  if (!ms && ms !== 0) return "–";
  return `${ms.toFixed(0)} ms`;
}

function nowPretty() {
  const d = new Date();
  return d.toLocaleString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

function simpleDocsSearch(index, query) {
  if (!query.trim() || !index.length) return [];
  const q = query.toLowerCase();
  return index
    .map((c) => ({ ...c, score: c.text.toLowerCase().includes(q) ? 1 : Math.random() * 0.4 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

const defaultChunks = [
  { id: "s1", doc: "Sample note", text: "Hashing turns data into fixed length digests for integrity checks." },
  { id: "s2", doc: "Sample note", text: "Availability is often expressed as nines; 99.9% means ~8.76 hours down per year." },
  { id: "s3", doc: "Sample note", text: "In vector search, cosine similarity measures the angle between embeddings." },
];

export default function LlmAgentLabPage() {
  const addJob = useStudiosStore((s) => s.addJob);
  const updateJob = useStudiosStore((s) => s.updateJob);
  const jobs = useStudiosStore((s) => s.jobs);

  // Prompt bench
  const [promptModel, setPromptModel] = useState("local-small");
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(180);
  const [promptText, setPromptText] = useState("Explain hashing to a twelve year old who likes football.");
  const [promptOutput, setPromptOutput] = useState("");
  const [promptMetrics, setPromptMetrics] = useState(null);

  // Tool sandbox
  const [toolPrompt, setToolPrompt] = useState("What is 2+2 and what time is it?");
  const [toolTrace, setToolTrace] = useState([]);
  const [toolAnswer, setToolAnswer] = useState("");

  // Agent builder
  const [agentPrompt, setAgentPrompt] = useState("What time is it and add 3+4?");
  const [agentPath, setAgentPath] = useState([]);
  const [agentAnswer, setAgentAnswer] = useState("");
  const [allowCalc, setAllowCalc] = useState(true);
  const [allowDocs, setAllowDocs] = useState(true);
  const [allowClock, setAllowClock] = useState(true);

  // Grounding
  const [groundQuery, setGroundQuery] = useState("How does vector search work?");
  const [groundShowChunks, setGroundShowChunks] = useState(true);
  const [groundAnswer, setGroundAnswer] = useState("");
  const [groundChunks, setGroundChunks] = useState(defaultChunks);
  const [customChunk, setCustomChunk] = useState("");

  const groundingSource = useMemo(() => groundChunks, [groundChunks]);

  const recentJobs = useMemo(() => jobs.filter((j) => j.studio === "llm-agent-lab").slice(-5).reverse(), [jobs]);

  const resetPromptBench = () => {
    setPromptModel("local-small");
    setTemperature(0.2);
    setMaxTokens(180);
    setPromptText("");
    setPromptOutput("");
    setPromptMetrics(null);
  };

  const handlePromptRun = () => {
    const started = performance.now();
    const res = runLocalModel({ model: promptModel, prompt: promptText, temperature, maxTokens });
    const latencyMs = performance.now() - started;
    setPromptOutput(res.text);
    setPromptMetrics({ ...res, latencyMs });
    const jobId = `llm-prompt-${Date.now()}`;
    addJob({ id: jobId, name: "LLM Lab – prompt bench", studio: "llm-agent-lab", status: "running" });
    updateJob(jobId, {
      status: "completed",
      finishedAt: new Date().toISOString(),
      metrics: { tokensIn: res.tokensIn, tokensOut: res.tokensOut, latencyMs },
    });
  };

  const runToolSandbox = () => {
    const steps = [];
    const jobId = `llm-tools-${Date.now()}`;
    addJob({ id: jobId, name: "LLM Lab – tools", studio: "llm-agent-lab", status: "running" });

    const text = toolPrompt.toLowerCase();
    steps.push({ role: "model", text: "Received prompt and checking for tools." });
    let toolCalls = 0;
    let answerParts = [];

    if (text.includes("time")) {
      toolCalls += 1;
      const t = nowPretty();
      steps.push({ role: "tool", name: "clock", text: `Clock → ${t}` });
      answerParts.push(`The current time is ${t}.`);
    }
    const mathMatch = text.match(/(-?\d+)\s*[\+\-\*\/]\s*(-?\d+)/);
    if (mathMatch) {
      toolCalls += 1;
      const [a, b] = [Number(mathMatch[1]), Number(mathMatch[2])];
      let op = toolPrompt.includes("-") ? "-" : toolPrompt.includes("*") ? "*" : toolPrompt.includes("/") ? "/" : "+";
      const val =
        op === "+"
          ? a + b
          : op === "-"
          ? a - b
          : op === "*"
          ? a * b
          : b === 0
          ? "undefined"
          : a / b;
      steps.push({ role: "tool", name: "calculator", text: `Calculator → ${val}` });
      answerParts.push(`The math result is ${val}.`);
    }
    steps.push({ role: "model", text: "Composed the final answer using tool results." });
    if (answerParts.length === 0) {
      answerParts = ["No specific tool was used. Here's a simple echo of your request.", toolPrompt];
    }
    const final = answerParts.join(" ");
    setToolTrace(steps);
    setToolAnswer(final);
    updateJob(jobId, {
      status: "completed",
      finishedAt: new Date().toISOString(),
      metrics: { toolCallCount: toolCalls, tokensIn: Math.round(toolPrompt.length / 4), tokensOut: Math.round(final.length / 4) },
    });
  };

  const runAgent = () => {
    const path = [];
    let steps = 1;
    const jobId = `llm-agent-${Date.now()}`;
    addJob({ id: jobId, name: "LLM Lab – agent", studio: "llm-agent-lab", status: "running" });

    path.push("User input");
    const lower = agentPrompt.toLowerCase();
    let intent = "general";
    if (lower.includes("time")) intent = "time";
    else if (lower.match(/\d+\s*[\+\-\*\/]\s*\d+/)) intent = "math";
    else if (lower.includes("doc") || lower.includes("note") || lower.includes("search")) intent = "docs";
    path.push("Intent classifier");

    let toolResult = "";
    if (intent === "math" && allowCalc) {
      steps += 1;
      path.push("Use calculator");
      const mathMatch = lower.match(/(-?\d+)\s*([\+\-\*\/])\s*(-?\d+)/);
      if (mathMatch) {
        const a = Number(mathMatch[1]);
        const op = mathMatch[2];
        const b = Number(mathMatch[3]);
        toolResult =
          op === "+"
            ? `${a + b}`
            : op === "-"
            ? `${a - b}`
            : op === "*"
            ? `${a * b}`
            : b === 0
            ? "undefined"
            : `${a / b}`;
      }
    } else if (intent === "time" && allowClock) {
      steps += 1;
      path.push("Use clock");
      toolResult = nowPretty();
    } else if (intent === "docs" && allowDocs) {
      steps += 1;
      path.push("Use Docs search");
      const res = simpleDocsSearch(groundingSource, agentPrompt);
      toolResult = res.length ? `Found: ${res[0].text.slice(0, 80)}` : "No doc snippets found.";
    }

    path.push("Answer composer");
    const answer = toolResult
      ? `Routed via intent "${intent}" and tool response: ${toolResult}`
      : `Intent "${intent}" had no allowed tool. Echo: ${agentPrompt}`;
    setAgentPath(path);
    setAgentAnswer(answer);
    updateJob(jobId, {
      status: "completed",
      finishedAt: new Date().toISOString(),
      metrics: { steps: path.length, toolCallCount: toolResult ? 1 : 0 },
    });
  };

  const addCustomChunk = () => {
    if (!customChunk.trim()) return;
    setGroundChunks((prev) => [...prev, { id: `c-${Date.now()}`, doc: "Custom", text: customChunk.trim() }]);
    setCustomChunk("");
  };

  const runGrounded = () => {
    const jobId = `llm-ground-${Date.now()}`;
    addJob({ id: jobId, name: "LLM Lab – grounding", studio: "llm-agent-lab", status: "running" });
    const retrieved = simpleDocsSearch(groundingSource, groundQuery);
    const context = retrieved.map((c) => c.text).join(" | ");
    const res = runLocalModel({
      model: "local-instruct",
      prompt: `Question: ${groundQuery}\nContext: ${context}`,
      temperature: 0.2,
      maxTokens: 200,
    });
    setGroundAnswer(res.text);
    setGroundShowChunks((prev) => prev); // no-op, keeps state
    updateJob(jobId, {
      status: "completed",
      finishedAt: new Date().toISOString(),
      metrics: { tokensIn: res.tokensIn, tokensOut: res.tokensOut, queryCount: 1, chunkCount: retrieved.length },
    });
  };

  return (
    <div className="page-content space-y-8">
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-100">
          LLM &amp; Agent Lab
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">LLM &amp; Agent Lab</h1>
        <p className="text-sm text-slate-700 max-w-3xl">
          This is the part of the building where language models show their workings. Try prompts, wire simple tools together, watch an
          agent pick a path and see where things break in a low risk way.
        </p>
      </div>

      <SecurityBanner />

      {/* 1. Prompt bench */}
      <section
        id="prompt-bench"
        className="rounded-3xl bg-white p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <h2 className="text-lg font-semibold text-slate-900">1. Prompt bench</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2 text-sm text-slate-700">
            <p>Prompts are instructions. Temperature nudges creativity; max tokens caps output length. Try variations to feel the shifts.</p>
            <button
              onClick={resetPromptBench}
              className="text-xs font-semibold text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded"
            >
              Reset settings
            </button>
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4">
            <div className="grid grid-cols-2 gap-3 text-sm text-slate-800">
              <label className="space-y-1 text-xs font-semibold text-slate-700">
                Model
                <select
                  value={promptModel}
                  onChange={(e) => setPromptModel(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                >
                  {Object.entries(localModels).map(([id, label]) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-xs font-semibold text-slate-700">
                Temperature
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-slate-700">Current: {temperature.toFixed(2)}</span>
              </label>
              <label className="space-y-1 text-xs font-semibold text-slate-700">
                Max tokens
                <input
                  type="number"
                  min={50}
                  max={500}
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              </label>
            </div>
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="Explain hashing to a twelve year old who likes football."
            />
            <button
              onClick={handlePromptRun}
              className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Run prompt
            </button>
            {promptOutput && (
              <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-sm text-slate-800">
                <div className="flex flex-wrap gap-3 text-xs text-slate-700">
                  <span className="rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Tokens in: {promptMetrics?.tokensIn ?? "–"}</span>
                  <span className="rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Tokens out: {promptMetrics?.tokensOut ?? "–"}</span>
                  <span className="rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Latency: {formatMs(promptMetrics?.latencyMs)}</span>
                </div>
                <div className="whitespace-pre-wrap">{promptOutput}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Tool calling sandbox */}
      <section
        id="tool-sandbox"
        className="rounded-3xl bg-white p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <h2 className="text-lg font-semibold text-slate-900">2. Tool calling sandbox</h2>
        <p className="text-sm text-slate-700">
          Tools are abilities the model can call. We show each step so you can see when a tool is invoked and how the answer is composed.
        </p>
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4">
          <textarea
            value={toolPrompt}
            onChange={(e) => setToolPrompt(e.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            placeholder="Ask something that needs a tool, e.g. time or arithmetic."
          />
          <button
            onClick={runToolSandbox}
            className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Run with tools
          </button>
          {toolTrace.length > 0 && (
            <div className="space-y-3">
              <div className="space-y-2">
                {toolTrace.map((step, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                    <span className="text-xs font-semibold text-slate-600">
                      {step.role === "tool" ? `Tool: ${step.name}` : "Model"}
                    </span>
                    <p className="text-sm text-slate-800">{step.text}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                Final answer: {toolAnswer}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Agent flow builder */}
      <section
        id="agent-builder"
        className="rounded-3xl bg-white p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <h2 className="text-lg font-semibold text-slate-900">3. Agent flow builder</h2>
        <p className="text-sm text-slate-700">
          A sketch of routing logic: classify intent, pick a tool if allowed, then compose an answer. Good for building intuition before
          heavier agent frameworks.
        </p>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 lg:col-span-2">
            <div className="flex flex-wrap gap-3 text-sm text-slate-800">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={allowCalc}
                  onChange={(e) => setAllowCalc(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-200"
                />
                Allow calculator
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={allowClock}
                  onChange={(e) => setAllowClock(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-200"
                />
                Allow clock
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={allowDocs}
                  onChange={(e) => setAllowDocs(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-200"
                />
                Allow Docs search
              </label>
            </div>
            <textarea
              value={agentPrompt}
              onChange={(e) => setAgentPrompt(e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="Ask the agent something that needs routing."
            />
            <button
              onClick={runAgent}
              className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Ask the agent
            </button>
            {agentPath.length > 0 && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 text-sm text-slate-800">
                  {agentPath.map((node, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100"
                    >
                      {idx + 1}. {node}
                    </span>
                  ))}
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                  {agentAnswer}
                </div>
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-sm text-slate-800 space-y-2">
            <p className="text-xs font-semibold text-slate-900">Flow sketch</p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li>1. User input</li>
              <li>2. Intent classifier (math, time, docs, general)</li>
              <li>3. Tool node (calculator, clock, docs search)</li>
              <li>4. Answer composer</li>
            </ul>
            <p className="text-xs text-slate-600">
              This is a simplified routing demo. Real agents add memory, retries, guards and better selection logic.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Grounding on your own notes */}
      <section
        id="grounding"
        className="rounded-3xl bg-white p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <h2 className="text-lg font-semibold text-slate-900">4. Grounding on your own notes</h2>
        <p className="text-sm text-slate-700">
          Ask a question, retrieve relevant chunks from your notes, and draft an answer. Stays in-browser for safety.
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4">
            <input
              type="text"
              value={groundQuery}
              onChange={(e) => setGroundQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="Ask about your uploaded notes..."
            />
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <input
                type="checkbox"
                checked={groundShowChunks}
                onChange={(e) => setGroundShowChunks(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-200"
              />
              <span>Show retrieved chunks</span>
            </div>
            <button
              onClick={runGrounded}
              className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Ask with grounding
            </button>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-800">Add a custom chunk (optional)</p>
              <textarea
                value={customChunk}
                onChange={(e) => setCustomChunk(e.target.value)}
                rows={2}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="Paste a short paragraph to include in retrieval."
              />
              <button
                onClick={addCustomChunk}
                className="inline-flex items-center rounded-2xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-200"
              >
                Add chunk
              </button>
            </div>
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <p className="text-xs font-semibold text-slate-900">Answer</p>
            <div className="min-h-[80px] whitespace-pre-wrap text-sm text-slate-800">{groundAnswer || "No answer yet."}</div>
            {groundShowChunks && (
              <div className="space-y-2 rounded-2xl border border-slate-100 bg-white p-3">
                <p className="text-xs font-semibold text-slate-900">Retrieved chunks</p>
                {simpleDocsSearch(groundingSource, groundQuery).map((c) => (
                  <div key={c.id} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-800">
                    <div className="text-xs text-slate-700 mb-1">{c.doc}</div>
                    {c.text.slice(0, 220)}
                  </div>
                ))}
                {groundingSource.length === 0 && <p className="text-xs text-slate-600">Add chunks to enable retrieval.</p>}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Recent LLM runs */}
      <section
        id="llm-runs"
        className="rounded-3xl bg-white p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">5. Recent LLM runs</h2>
            <p className="text-sm text-slate-700">Prompt bench, tools, agents and grounding activity logged here.</p>
          </div>
          <Link href="/studios" className="text-xs font-semibold text-emerald-700 hover:underline">
            Open Control Room
          </Link>
        </div>
        {recentJobs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-700">
            No runs yet. Try the prompt bench to create your first log.
          </div>
        )}
        {recentJobs.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <table className="min-w-full text-sm text-slate-800">
              <thead className="bg-slate-50 text-xs text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Job</th>
                  <th className="px-3 py-2 text-left font-semibold">Tokens in</th>
                  <th className="px-3 py-2 text-left font-semibold">Tokens out</th>
                  <th className="px-3 py-2 text-left font-semibold">Tool calls</th>
                  <th className="px-3 py-2 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job) => (
                  <tr key={job.id} className="border-t border-slate-100">
                    <td className="px-3 py-2 text-sm">{job.name}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">{job.metrics?.tokensIn ?? "-"}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">{job.metrics?.tokensOut ?? "-"}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">{job.metrics?.toolCallCount ?? "-"}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">{job.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
