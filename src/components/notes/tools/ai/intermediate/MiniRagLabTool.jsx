"use client";

import { useMemo, useState } from "react";

const corpus = [
  {
    id: "chunk-1",
    title: "RAG overview",
    body: "Retrieval augmented generation pairs a model with a retrieval step so answers are grounded in documents.",
  },
  {
    id: "chunk-2",
    title: "Chunking strategy",
    body: "Split documents into small chunks so each retrieved piece fits the model context window.",
  },
  {
    id: "chunk-3",
    title: "Evaluation note",
    body: "Check whether retrieved chunks actually contain the evidence for the answer.",
  },
];

const tokenize = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

const scoreMatch = (queryTokens, docTokens) => {
  if (!queryTokens.length) return 0;
  const set = new Set(docTokens);
  const hits = queryTokens.filter((token) => set.has(token)).length;
  return hits / queryTokens.length;
};

export default function MiniRagLabTool() {
  const [question, setQuestion] = useState("Why does chunking matter in RAG?");

  const topChunk = useMemo(() => {
    const queryTokens = tokenize(question);
    return corpus
      .map((chunk) => ({
        ...chunk,
        score: scoreMatch(queryTokens, tokenize(chunk.body)),
      }))
      .sort((a, b) => b.score - a.score)[0];
  }, [question]);

  const answer = useMemo(() => {
    if (!topChunk) return "Ask a question to see a grounded answer.";
    return `Based on the retrieved note, ${topChunk.body}`;
  }, [topChunk]);

  return (
    <div className="space-y-3 text-sm text-gray-800">
      <label className="block text-xs font-semibold text-gray-600">Question</label>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        type="text"
      />

      <div className="rounded-2xl border border-gray-200 bg-white/70 p-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Retrieved chunk</div>
        <p className="mt-1 text-sm font-semibold text-gray-900">{topChunk?.title}</p>
        <p className="mt-1 text-xs text-gray-700">{topChunk?.body}</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white/70 p-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Draft answer</div>
        <p className="mt-1 text-sm text-gray-800">{answer}</p>
      </div>
    </div>
  );
}
