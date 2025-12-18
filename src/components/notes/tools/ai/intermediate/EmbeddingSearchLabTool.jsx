"use client";

import { useMemo, useState } from "react";

const documents = [
  {
    id: "doc-1",
    title: "Password hygiene checklist",
    body: "Use long passphrases, enable multi factor, and rotate credentials after incidents.",
  },
  {
    id: "doc-2",
    title: "Vector search basics",
    body: "Embeddings turn text into vectors so we can search by meaning, not just keywords.",
  },
  {
    id: "doc-3",
    title: "Incident response steps",
    body: "Triage, contain, eradicate, recover, then learn and update playbooks.",
  },
  {
    id: "doc-4",
    title: "Prompt writing tips",
    body: "Be explicit about goal, format, and constraints so the output is consistent.",
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

export default function EmbeddingSearchLabTool() {
  const [query, setQuery] = useState("how do embeddings help search");

  const results = useMemo(() => {
    const queryTokens = tokenize(query);
    return documents
      .map((doc) => {
        const docTokens = tokenize(doc.body);
        return {
          ...doc,
          score: scoreMatch(queryTokens, docTokens),
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [query]);

  return (
    <div className="space-y-3 text-sm text-gray-800">
      <label className="block text-xs font-semibold text-gray-600">Search query</label>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        type="text"
      />

      <div className="space-y-2">
        {results.map((doc) => (
          <div key={doc.id} className="rounded-xl border border-gray-200 bg-white/70 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-gray-900">{doc.title}</p>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                {(doc.score * 100).toFixed(0)}%
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-700">{doc.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
