"use client";

import { create } from "zustand";

const makeId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
};

// Seed a lightweight sample dataset so Model Forge and Control Room have something to show.
const sampleDatasetId = "sample-ds-1";
const sampleRows = Array.from({ length: 30 }).map((_, idx) => ({
  feature_a: Number((Math.random() * 10 + idx * 0.2).toFixed(2)),
  feature_b: Number((Math.random() * 5 + 1).toFixed(2)),
  category: ["alpha", "beta", "gamma"][idx % 3],
  target: idx % 2 === 0 ? "yes" : "no",
}));

const initialDatasets = [
  {
    id: sampleDatasetId,
    name: "Sample customer churn",
    sizeBytes: 12_000,
    rowCount: sampleRows.length,
    columnCount: 4,
    columns: ["feature_a", "feature_b", "category", "target"],
    createdAt: new Date().toISOString(),
  },
];

const initialParsedData = {
  [sampleDatasetId]: {
    columns: ["feature_a", "feature_b", "category", "target"],
    rows: sampleRows,
  },
};

export const useStudiosStore = create((set, get) => ({
  datasets: initialDatasets,
  parsedDataById: initialParsedData,
  jobs: [],

  addDataset: (meta, parsed) =>
    set((state) => {
      const exists = state.datasets.find((d) => d.id === meta.id);
      const nextDatasets = exists
        ? state.datasets.map((d) => (d.id === meta.id ? meta : d))
        : [...state.datasets, meta];
      const nextParsed = parsed
        ? { ...state.parsedDataById, [meta.id]: parsed }
        : state.parsedDataById;
      return { datasets: nextDatasets, parsedDataById: nextParsed };
    }),

  setParsedData: (datasetId, parsed) =>
    set((state) => ({
      parsedDataById: { ...state.parsedDataById, [datasetId]: parsed },
    })),

  getParsedData: (datasetId) => get().parsedDataById[datasetId],

  addJob: (job) =>
    set((state) => ({
      jobs: [
        ...state.jobs,
        {
          ...job,
          id: job.id || makeId(),
          startedAt: job.startedAt || new Date().toISOString(),
        },
      ],
    })),

  updateJob: (id, patch) =>
    set((state) => ({
      jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)),
    })),
}));
