"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Radar, Plus, Trash2 } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { AiToolCard } from "./AiToolCard";

type Doc = {
  id: string;
  title: string;
  text: string;
};

type ScoredDoc = Doc & {
  score: number;
};

const STOP_WORDS = new Set<string>([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "of",
  "to",
  "in",
  "on",
  "for",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "am",
  "this",
  "that",
  "it",
  "as",
  "by",
  "at",
  "with",
  "from",
  "i",
  "you",
  "we",
  "they",
  "he",
  "she",
  "them",
  "us",
  "our",
  "your",
  "their",
]);

function normaliseText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function simpleTokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function hashStringToInt(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function embed(text: string, dim: number): Float32Array {
  const vec = new Float32Array(dim);
  const tokens = simpleTokenise(text);
  if (tokens.length === 0) return vec;
  for (const token of tokens) {
    const h = hashStringToInt(token);
    const idx = h % dim;
    vec[idx] += 1;
  }
  let norm = 0;
  for (let i = 0; i < dim; i += 1) {
    norm += vec[i] * vec[i];
  }
  norm = Math.sqrt(norm);
  if (norm === 0) return vec;
  for (let i = 0; i < dim; i += 1) {
    vec[i] = vec[i] / norm;
  }
  return vec;
}

function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  if (a.length !== b.length) return 0;
  let dot = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
  }
  return dot;
}

const DEFAULT_DOCS: Doc[] = [
  {
    id: "doc-1",
    title: "Explaining supervised learning to a colleague",
    text: "I am teaching a new colleague what supervised learning is, using a housing price dataset with features such as bedrooms, location and floor area.",
  },
  {
    id: "doc-2",
    title: "Incident about access control in a web app",
    text: "We had an incident where a user could see other customer records due to a missing access control check on the API.",
  },
  {
    id: "doc-3",
    title: "Draft data strategy note",
    text: "I am drafting a short note on why good data quality, clear ownership and discoverability are critical for digitalisation in the energy sector.",
  },
];

export function VectorSearchLab() {
  const [docs, setDocs] = useState<Doc[]>(DEFAULT_DOCS);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [query, setQuery] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [vectorDimension, setVectorDimension] = useState(64);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(DEFAULT_DOCS[0]?.id ?? null);

  const docEmbeddings = useMemo(() => {
    const dim = vectorDimension;
    const map = new Map<string, Float32Array>();
    docs.forEach((doc) => {
      map.set(doc.id, embed(`${doc.title} ${doc.text}`, dim));
    });
    return map;
  }, [docs, vectorDimension]);

  const scores: ScoredDoc[] = useMemo(() => {
    const cleanQuery = normaliseText(query);
    if (!cleanQuery) {
      return docs.map((doc) => ({ ...doc, score: 0 }));
    }
    const qVec = embed(cleanQuery, vectorDimension);
    const scored = docs.map((doc) => {
      const dVec = docEmbeddings.get(doc.id);
      const score = dVec ? cosineSimilarity(qVec, dVec) : 0;
      return { ...doc, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored;
  }, [docs, query, vectorDimension, docEmbeddings]);

  const chartData = useMemo(
    () =>
      scores.map((d, idx) => ({
        name: idx === 0 ? "Top match" : `Doc ${idx + 1}`,
        label: d.title.slice(0, 24),
        score: Number(d.score.toFixed(3)),
      })),
    [scores]
  );

  const handleAddDoc = useCallback(() => {
    const title = normaliseText(newTitle);
    const text = normaliseText(newText);
    if (!title || !text) return;

    const id = `doc-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const doc: Doc = { id, title, text };
    setDocs((prev) => [...prev, doc]);
    setNewTitle("");
    setNewText("");
    setSelectedDocId(id);
  }, [newTitle, newText]);

  const handleRemoveDoc = useCallback(
    (id: string) => {
      setDocs((prev) => prev.filter((d) => d.id !== id));
      setSelectedDocId((prev) => {
        if (prev === id) {
          const remaining = docs.filter((d) => d.id !== id);
          return remaining.length ? remaining[0].id : null;
        }
        return prev;
      });
    },
    [docs]
  );

  const selectedDoc = useMemo(() => docs.find((d) => d.id === selectedDocId) ?? null, [docs, selectedDocId]);

  const handleRunSearch = useCallback(() => {
    setLastQuery(query);
  }, [query]);

  return (
    <AiToolCard
      id="vector-search-lab-title"
      title="Vector search explorer"
      icon={<Radar className="h-4 w-4" aria-hidden="true" />}
      description="Build a tiny search index in your browser, see how your texts become vectors and explore similarity using cosine distance."
    >
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 xl:col-span-1">
          <p className="text-xs font-semibold text-slate-700">Step 1 – Build a small text collection</p>
          <p className="text-[11px] text-slate-600">
            Add short notes, incidents, requirements or FAQs that you want to search over. Try to mix different themes to make
            similarity more interesting.
          </p>

          <div className="space-y-2">
            <label htmlFor="new-doc-title" className="block text-[11px] font-medium text-slate-700">
              New document title
            </label>
            <input
              id="new-doc-title"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="For example: Access control incident"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="new-doc-text" className="block text-[11px] font-medium text-slate-700">
              New document text
            </label>
            <textarea
              id="new-doc-text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="Write a short paragraph about a problem, scenario or requirement."
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleAddDoc}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Add document</span>
            </button>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>Vector dims</span>
              <select
                value={vectorDimension}
                onChange={(e) => setVectorDimension(Number(e.target.value))}
                className="rounded-2xl border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-200"
              >
                <option value={32}>32</option>
                <option value={64}>64</option>
                <option value={128}>128</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-medium text-slate-700">Collection overview</p>
            {docs.length === 0 ? (
              <p className="text-[11px] text-slate-500">Add a few short documents to start building your search space.</p>
            ) : (
              <ul className="max-h-40 space-y-1 overflow-auto pr-1">
                {docs.map((doc) => (
                  <li
                    key={doc.id}
                    className={`flex items-center justify-between gap-2 rounded-2xl border px-2 py-1.5 ${
                      doc.id === selectedDocId ? "border-sky-400 bg-sky-50/70" : "border-slate-200 bg-white"
                    }`}
                  >
                    <button type="button" onClick={() => setSelectedDocId(doc.id)} className="flex-1 text-left">
                      <p className="truncate text-[11px] font-medium text-slate-800">{doc.title || "Untitled document"}</p>
                      <p className="truncate text-[10px] text-slate-500">{doc.text}</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc(doc.id)}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-1 text-slate-400 hover:border-rose-300 hover:text-rose-500"
                      aria-label="Remove document"
                    >
                      <Trash2 className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 xl:col-span-1">
          <p className="text-xs font-semibold text-slate-700">Step 2 – Ask a question or describe what you need</p>
          <p className="text-[11px] text-slate-600">
            Type a natural language query. For example, ask for incidents about access control, notes about data strategy or
            examples of supervised learning. The lab will compute cosine similarity between your query and each document.
          </p>

          <div className="space-y-2">
            <label htmlFor="vector-search-query" className="block text-[11px] font-medium text-slate-700">
              Search query
            </label>
            <textarea
              id="vector-search-query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="For example: show me anything about broken access control incidents"
            />
          </div>

          <button
            type="button"
            onClick={handleRunSearch}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500"
          >
            Run similarity search
          </button>

          <div className="space-y-2">
            <p className="text-[11px] font-medium text-slate-700">Similarity scores</p>
            <div className="h-44 rounded-2xl border border-slate-200 bg-white px-3 py-2">
              {scores.length === 0 ? (
                <p className="text-[11px] text-slate-500">Add at least one document to see similarity scores.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="label" tick={{ fontSize: 9 }} interval={0} />
                    <YAxis
                      tick={{ fontSize: 9 }}
                      domain={[0, 1]}
                      label={{ value: "Cosine similarity", angle: -90, position: "insideLeft", fontSize: 10 }}
                    />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 12, padding: 8 }} />
                    <Bar dataKey="score" fill="#0f766e" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Scores close to 1 indicate strong similarity. Scores near 0 mean the query and document share few tokens in common
              after basic cleaning and normalisation.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-700">
            {lastQuery ? (
              <p>
                You just searched for{" "}
                <span className="font-medium text-slate-900">“{lastQuery.trim()}”</span> and the bar chart shows which documents
                are closest in vector space. This is a very small but real example of vector based retrieval, similar in spirit to
                how modern RAG systems work at a larger scale.
              </p>
            ) : (
              <p>When you run a search, this box will describe what happened and how to interpret the scores.</p>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 xl:col-span-1">
          <p className="text-xs font-semibold text-slate-700">Step 3 – Inspect one document in context</p>
          <p className="text-[11px] text-slate-600">
            Click a document in the list to focus on it. You can compare its wording with your query and think about why the
            similarity score is high or low.
          </p>

          {selectedDoc ? (
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-[11px] font-semibold text-slate-900">{selectedDoc.title || "Untitled document"}</p>
              <p className="text-[11px] text-slate-700 leading-relaxed">{selectedDoc.text}</p>
              <p className="mt-2 text-[11px] text-slate-500">
                Try editing this text in the collection and running the same query again. You will see how small changes in wording
                can change the similarity score, which is helpful when you design prompts or knowledge snippets for real retrieval
                systems.
              </p>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">Select a document from the collection on the left to inspect it here.</p>
          )}
        </div>
      </div>
    </AiToolCard>
  );
}
