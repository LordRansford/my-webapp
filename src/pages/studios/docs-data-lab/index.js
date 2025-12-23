"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useStudiosStore } from "@/stores/useStudiosStore";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";
import { validateUpload } from "@/utils/validateUpload";
import { formatBytes, getUploadPolicy } from "@/lib/uploads/policies";

const stopwords = new Set([
  "the",
  "and",
  "a",
  "an",
  "to",
  "of",
  "in",
  "on",
  "for",
  "with",
  "is",
  "it",
  "that",
  "this",
  "as",
  "at",
  "be",
  "by",
  "or",
  "from",
  "are",
  "was",
  "were",
  "can",
  "will",
  "about",
]);

const KEYWORD_CLASS = "bg-amber-100 text-amber-900";
const ENTITY_CLASS = "bg-emerald-100 text-emerald-900";

function humanSize(bytes) {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t && t.length > 2 && !stopwords.has(t));
}

function topKeywords(text, limit = 10) {
  const tokens = tokenize(text || "");
  const counts = {};
  tokens.forEach((t) => {
    counts[t] = (counts[t] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

function simpleEntities(text) {
  const words = text.split(/\s+/).filter(Boolean);
  const entities = { people: [], organisations: [], locations: [] };
  words.forEach((w) => {
    if (w.length < 3) return;
    const clean = w.replace(/[^A-Za-z]/g, "");
    if (!clean) return;
    if (clean[0] === clean[0]?.toUpperCase() && clean.slice(1) !== clean.slice(1).toUpperCase()) {
      if (clean.endsWith("Inc") || clean.endsWith("Ltd") || clean.endsWith("Corp")) {
        entities.organisations.push(clean);
      } else if (clean.endsWith("City") || clean.endsWith("Town") || clean.endsWith("Bay")) {
        entities.locations.push(clean);
      } else {
        entities.people.push(clean);
      }
    }
  });
  return entities;
}

function splitSentences(text) {
  return text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
}

function buildChunks(doc, vocab) {
  const sentences = splitSentences(doc.text || "");
  const chunks = [];
  const groupSize = 2;
  for (let i = 0; i < sentences.length; i += groupSize) {
    const text = sentences.slice(i, i + groupSize).join(" ");
    if (!text.trim()) continue;
    chunks.push({
      id: `${doc.id}-c${i}`,
      docId: doc.id,
      text,
      vector: embedText(text, vocab),
    });
  }
  if (chunks.length === 0 && doc.text) {
    chunks.push({ id: `${doc.id}-c0`, docId: doc.id, text: doc.text.slice(0, 400), vector: embedText(doc.text, vocab) });
  }
  return chunks;
}

function embedText(text, vocab) {
  const vec = Array(vocab.length).fill(0);
  const tokens = tokenize(text);
  tokens.forEach((t) => {
    const idx = vocab.indexOf(t);
    if (idx >= 0) vec[idx] += 1;
  });
  return vec;
}

function cosine(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function normalizeField(f) {
  return f.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function fieldSimilarity(a, b) {
  const na = normalizeField(a);
  const nb = normalizeField(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  const setA = new Set(na.split(""));
  const setB = new Set(nb.split(""));
  let inter = 0;
  setA.forEach((c) => {
    if (setB.has(c)) inter += 1;
  });
  return inter / Math.max(setA.size, setB.size);
}

export default function DocsDataLabPage() {
  const addJob = useStudiosStore((s) => s.addJob);
  const updateJob = useStudiosStore((s) => s.updateJob);
  const jobs = useStudiosStore((s) => s.jobs);

  const [docs, setDocs] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [indexSelection, setIndexSelection] = useState({});
  const [chunks, setChunks] = useState([]);
  const [vocab, setVocab] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const indexSectionRef = useRef(null);

  const [srcSchema, setSrcSchema] = useState("");
  const [tgtSchema, setTgtSchema] = useState("");

  const uploadPolicy = useMemo(() => getUploadPolicy("docs-data-lab"), []);

  const selectedDoc = useMemo(() => docs.find((d) => d.id === selectedDocId) || null, [docs, selectedDocId]);

  const selectedStats = useMemo(() => {
    if (!selectedDoc?.text) return null;
    const text = selectedDoc.text;
    const words = text.trim().split(/\s+/);
    const sentences = splitSentences(text);
    return {
      words: words.length,
      chars: text.length,
      sentences: sentences.length,
      keywords: topKeywords(text),
      entities: simpleEntities(text),
    };
  }, [selectedDoc]);

  const parsedFields = useMemo(() => {
    const parse = (text) =>
      text
        .split(/[\n,]/)
        .map((f) => f.trim())
        .filter(Boolean);
    return { src: parse(srcSchema), tgt: parse(tgtSchema) };
  }, [srcSchema, tgtSchema]);

  const fieldMappings = useMemo(() => {
    const mappings = [];
    parsedFields.src.forEach((src) => {
      let best = null;
      let bestScore = 0;
      parsedFields.tgt.forEach((tgt) => {
        const score = fieldSimilarity(src, tgt);
        if (score > bestScore) {
          bestScore = score;
          best = tgt;
        }
      });
      mappings.push({ source: src, target: bestScore >= 0.35 ? best : null, score: bestScore });
    });
    return mappings;
  }, [parsedFields]);

  const parseDoc = async (file) => {
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    const id = `${file.name}-${file.lastModified}`;
    const base = {
      id,
      name: file.name,
      sizeBytes: file.size,
    };
    let type = "txt";
    if (ext === "pdf") type = "pdf";
    else if (ext === "docx") type = "docx";
    else if (ext === "csv") type = "csv";
    let text = "";
    let pages;
    let rows;
    let columns;

    const raw = await file.text();
    if (type === "csv") {
      const lines = raw.split(/\r?\n/).filter(Boolean);
      columns = lines[0]?.split(",").map((c) => c.trim()) || [];
      rows = Math.max(0, lines.length - 1);
      text = lines.slice(0, 6).join("\n");
    } else {
      text = raw;
      pages = Math.max(1, Math.round(text.length / 1200));
    }

    return { ...base, type, pages, rows, columns, text };
  };

  const handleFiles = async (fileList) => {
    const maxBytes = uploadPolicy?.freeMaxBytes || 8 * 1024 * 1024;
    const allowedExtensions = uploadPolicy?.allowExtensions || [".pdf", ".docx", ".txt", ".csv"];
    const { safeFiles, errors } = validateUpload(fileList, { maxBytes, allowedExtensions });
    if (errors.length) alert(errors.join("\n"));
    if (!safeFiles.length) return;
    const parsed = await Promise.all(safeFiles.map(parseDoc));
    setDocs((prev) => {
      const merged = [...prev, ...parsed];
      if (!selectedDocId && merged.length > 0) setSelectedDocId(merged[0].id);
      return merged;
    });
  };

  const buildIndex = () => {
    const selected = docs.filter((d) => indexSelection[d.id]);
    if (!selected.length) return;
    const allText = selected.map((d) => d.text || "").join(" ");
    const vocabList = topKeywords(allText, 80).map((k) => k.word);
    const chunkList = selected.flatMap((d) => buildChunks(d, vocabList));
    setVocab(vocabList);
    setChunks(chunkList);
    setResults([]);
    const jobId = `docs-index-${Date.now()}`;
    addJob({ id: jobId, name: "Docs & Data Lab – index build", studio: "docs-data-lab", status: "running" });
    updateJob(jobId, {
      status: "completed",
      finishedAt: new Date().toISOString(),
      metrics: {
        documentCount: selected.length,
        chunkCount: chunkList.length,
      },
    });
  };

  const runQuery = () => {
    if (!query.trim() || !chunks.length) return;
    const qVec = embedText(query, vocab);
    const scored = chunks
      .map((c) => ({ ...c, score: cosine(qVec, c.vector) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    setResults(scored);
  };

  useEffect(() => {
    if (docs.length > 0 && !selectedDocId) {
      setSelectedDocId(docs[0].id);
    }
  }, [docs, selectedDocId]);

  const highlightExcerpt = useMemo(() => {
    if (!selectedDoc?.text) return null;
    const text = selectedDoc.text.slice(0, 1200);
    const keywords = new Set((selectedStats?.keywords || []).map((k) => k.word));
    const tokens = text.split(/(\s+)/);
    return tokens.map((t, idx) => {
      const clean = t.toLowerCase().replace(/[^a-z0-9]/g, "");
      const isKeyword = keywords.has(clean);
      const isEntity = selectedStats?.entities && Object.values(selectedStats.entities).some((arr) => arr.includes(t.replace(/[^A-Za-z]/g, "")));
      if (isKeyword || isEntity) {
        const cls = isKeyword ? KEYWORD_CLASS : ENTITY_CLASS;
        return (
          <span key={idx} className={`rounded px-1 ${cls}`}>
            {t}
          </span>
        );
      }
      return <span key={idx}>{t}</span>;
    });
  }, [selectedDoc, selectedStats]);

  const docsJobs = useMemo(() => jobs.filter((j) => j.studio === "docs-data-lab").slice(-5).reverse(), [jobs]);

  const focusBuildCard = () => {
    indexSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="page-content space-y-8">
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-800 ring-1 ring-purple-100">
          Docs &amp; Data Lab
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Docs &amp; Data Lab</h1>
        <p className="text-sm text-slate-700 max-w-3xl">
          This is the reading room. Feed it PDFs, Word files and tables, see what structure the machine finds and build a tiny search
          index so you can question your own documents.
        </p>
      </div>

      <SecurityBanner />

      {/* 1. Upload and inspect documents */}
      <section
        id="upload-inspect"
        className="rounded-3xl bg-white p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-900">1. Upload and inspect documents</h2>
          <label className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-sky-300 hover:text-sky-700">
            <input type="file" className="hidden" accept=".pdf,.docx,.txt,.csv" multiple onChange={(e) => handleFiles(e.target.files)} />
            Upload files
          </label>
        </div>
        <p className="text-xs text-slate-600">
          Free tier limit: {formatBytes(uploadPolicy?.freeMaxBytes || 0)} per file. With credits: {formatBytes(uploadPolicy?.paidMaxBytes || 0)}.
          Allowed: pdf, docx, txt, csv. Do not upload real customer data or secrets; use synthetic or anonymised samples.
        </p>
        {docs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-700">
            No documents yet. Upload a PDF, DOCX, TXT or small CSV.
          </div>
        )}
        {docs.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-5">
            <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white">
              <table className="min-w-full text-sm text-slate-800">
                <thead className="bg-slate-50 text-xs text-slate-600">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Name</th>
                    <th className="px-3 py-2 text-left font-semibold">Type</th>
                    <th className="px-3 py-2 text-left font-semibold">Pages/Rows</th>
                    <th className="px-3 py-2 text-left font-semibold">Size</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc) => (
                    <tr key={doc.id} className="border-t border-slate-100">
                      <td className="px-3 py-2">{doc.name}</td>
                      <td className="px-3 py-2 text-xs text-slate-600">{doc.type}</td>
                      <td className="px-3 py-2 text-xs text-slate-600">{doc.type === "csv" ? doc.rows ?? "-" : doc.pages ?? "-"}</td>
                      <td className="px-3 py-2 text-xs text-slate-600">{humanSize(doc.sizeBytes)}</td>
                      <td className="px-3 py-2 text-right">
                        <button
                          className="text-xs font-semibold text-sky-700 hover:underline"
                          onClick={() => setSelectedDocId(doc.id)}
                          aria-label={`Preview ${doc.name}`}
                        >
                          Preview
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="lg:col-span-3 space-y-3">
              {selectedDoc ? (
                <>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-sm text-slate-700">
                    <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                      <span className="rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Type: {selectedDoc.type}</span>
                      {selectedDoc.pages && <span className="rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Pages: {selectedDoc.pages}</span>}
                      {selectedDoc.rows && <span className="rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Rows: {selectedDoc.rows}</span>}
                      {selectedDoc.columns && selectedDoc.columns.length > 0 && (
                        <span className="rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Columns: {selectedDoc.columns.join(", ")}</span>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-3 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-100 bg-white p-3">
                      <p className="text-xs font-semibold text-slate-900 mb-2">Preview</p>
                      <div className="h-52 overflow-auto whitespace-pre-wrap text-xs text-slate-700">
                        {selectedDoc.type === "csv" ? selectedDoc.text : selectedDoc.text?.slice(0, 800) || "No preview"}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-white p-3">
                      <p className="text-xs font-semibold text-slate-900 mb-2">Extracted text</p>
                      <div className="h-52 overflow-auto whitespace-pre-wrap text-xs text-slate-700">{selectedDoc.text || "No text extracted"}</div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-600">Select a document to preview.</p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 2. Text and entity explorer */}
      <section
        id="text-entities"
        className="rounded-3xl bg-white p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <h2 className="text-lg font-semibold text-slate-900">2. Text and entity explorer</h2>
        {!selectedDoc && <p className="text-sm text-slate-600">Upload and select a document first.</p>}
        {selectedDoc && selectedStats && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 text-xs text-slate-700">
              <span className="rounded-full bg-slate-50 px-2 py-1 ring-1 ring-slate-200">Words: {selectedStats.words}</span>
              <span className="rounded-full bg-slate-50 px-2 py-1 ring-1 ring-slate-200">Chars: {selectedStats.chars}</span>
              <span className="rounded-full bg-slate-50 px-2 py-1 ring-1 ring-slate-200">Sentences: {selectedStats.sentences}</span>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-3">
                <p className="text-xs font-semibold text-slate-900 mb-2">Highlighted excerpt</p>
                <div className="h-56 overflow-auto whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{highlightExcerpt}</div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-700">
                  <span className={`rounded-full px-2 py-1 ring-1 ring-slate-200 ${KEYWORD_CLASS}`}>Keywords</span>
                  <span className={`rounded-full px-2 py-1 ring-1 ring-slate-200 ${ENTITY_CLASS}`}>Entities</span>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-3 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-slate-900 mb-2">Top keywords</p>
                  <ul className="space-y-1 text-sm text-slate-800">
                    {selectedStats.keywords.map((k) => (
                      <li key={k.word} className="flex items-center justify-between">
                        <span>{k.word}</span>
                        <span className="text-xs text-slate-600">{k.count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-slate-100 pt-2">
                  <p className="text-xs font-semibold text-slate-900 mb-1">Entities (heuristic)</p>
                  {["people", "organisations", "locations"].map((type) => (
                    <div key={type} className="text-xs text-slate-700">
                      <span className="font-semibold capitalize">{type}:</span>{" "}
                      {selectedStats.entities[type].length ? selectedStats.entities[type].join(", ") : "-"}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. Build a retrieval index */}
      <section
        id="retrieval"
        ref={indexSectionRef}
        className="rounded-3xl bg-white p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">3. Build a retrieval index</h2>
            <p className="text-sm text-slate-700">Select documents, build a tiny index, then ask questions against your own content.</p>
          </div>
          <button
            onClick={buildIndex}
            className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={!docs.length}
          >
            Build index
          </button>
        </div>
        {docs.length === 0 && <p className="text-sm text-slate-600">Upload at least one document first.</p>}
        {docs.length > 0 && (
          <div className="space-y-3">
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-white p-3">
                <p className="text-xs font-semibold text-slate-900 mb-2">Include documents</p>
                <div className="space-y-2 text-sm text-slate-800">
                  {docs.map((doc) => (
                    <label key={doc.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-200"
                        checked={!!indexSelection[doc.id]}
                        onChange={(e) => setIndexSelection((prev) => ({ ...prev, [doc.id]: e.target.checked }))}
                      />
                      <span>{doc.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-3 space-y-3">
                <p className="text-xs font-semibold text-slate-900">Ask a question about your documents</p>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., What is the main objective?"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                  <button
                    onClick={runQuery}
                    className="self-start rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                    disabled={!chunks.length}
                  >
                    Search
                  </button>
                  {!chunks.length && <p className="text-xs text-slate-600">Build the index first to enable search.</p>}
                </div>
              </div>
            </div>
            {results.length > 0 && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 space-y-3">
                <p className="text-xs font-semibold text-slate-900">Top matches</p>
                {results.map((res) => {
                  const doc = docs.find((d) => d.id === res.docId);
                  return (
                    <div key={res.id} className="rounded-xl border border-slate-100 bg-white p-3">
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>{doc?.name || res.docId}</span>
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
                          Score {(res.score || 0).toFixed(2)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-800">
                        {res.text.slice(0, 220)}
                        {res.text.length > 220 ? "…" : ""}
                      </p>
                    </div>
                  );
                })}
                <p className="text-xs text-slate-700">
                  This is a tiny retrieval demo to build intuition, not a production index.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 4. Schema and field mapper */}
      <section
        id="schema-mapper"
        className="rounded-3xl bg-white p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <h2 className="text-lg font-semibold text-slate-900">4. Schema and field mapper</h2>
        <p className="text-sm text-slate-700">
          Paste two sets of headers or keys. We will suggest simple matches to show how schema alignment feels in integration work.
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-800">Source schema</p>
            <textarea
              value={srcSchema}
              onChange={(e) => setSrcSchema(e.target.value)}
              rows={5}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="customer_id, name, address_line1, city, postcode"
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-800">Target schema</p>
            <textarea
              value={tgtSchema}
              onChange={(e) => setTgtSchema(e.target.value)}
              rows={5}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="custId, full_name, address1, city_name, postal_code"
            />
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-3">
            <p className="text-xs font-semibold text-slate-900 mb-2">Suggested mappings</p>
            {fieldMappings.length === 0 && <p className="text-sm text-slate-600">Add both schemas to see suggestions.</p>}
            <ul className="space-y-2 text-sm text-slate-800">
              {fieldMappings.map((m) => (
                <li key={m.source} className="flex items-center gap-2">
                  <span className="rounded-lg bg-slate-50 px-2 py-1 ring-1 ring-slate-200">{m.source}</span>
                  <span className="text-xs text-slate-500">→</span>
                  {m.target ? (
                    <span className="rounded-lg bg-emerald-50 px-2 py-1 text-emerald-800 ring-1 ring-emerald-100">{m.target}</span>
                  ) : (
                    <span className="rounded-lg bg-amber-50 px-2 py-1 text-amber-800 ring-1 ring-amber-100">Unmapped</span>
                  )}
                  <span className="text-xs text-slate-600">({(m.score * 100).toFixed(0)}%)</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-sm text-slate-800">
            <p className="text-xs font-semibold text-slate-900 mb-1">How to use this</p>
            <p className="text-sm text-slate-700">
              This is a sketch of schema alignment. Adjust field names and confirm mappings manually. Unmapped fields highlight gaps to
              address before integration.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Recent docs runs */}
      <section
        id="docs-runs"
        className="rounded-3xl bg-white p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">5. Recent docs runs</h2>
            <p className="text-sm text-slate-700">Latest index builds and document actions. Open Control Room for the full view.</p>
          </div>
          <Link href="/studios" className="text-xs font-semibold text-emerald-700 hover:underline">
            Open Control Room
          </Link>
        </div>
        {docsJobs.length === 0 && (
          <div className="flex items-center justify-between rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-700">
            <span>No runs yet. Build your first index to see it here.</span>
            <button
              onClick={focusBuildCard}
              className="rounded-2xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Build your first index
            </button>
          </div>
        )}
        {docsJobs.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <table className="min-w-full text-sm text-slate-800">
              <thead className="bg-slate-50 text-xs text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Job</th>
                  <th className="px-3 py-2 text-left font-semibold">Documents</th>
                  <th className="px-3 py-2 text-left font-semibold">Chunks</th>
                  <th className="px-3 py-2 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {docsJobs.map((job) => (
                  <tr key={job.id} className="border-t border-slate-100">
                    <td className="px-3 py-2">{job.name}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">{job.metrics?.documentCount ?? "-"}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">{job.metrics?.chunkCount ?? job.metrics?.indexSize ?? "-"}</td>
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
