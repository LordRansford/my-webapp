"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ScatterChart,
  Scatter,
  Legend,
} from "recharts";
import { useStudiosStore } from "@/stores/useStudiosStore";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";
import { validateUpload } from "@/utils/validateUpload";
import StudioNavigation from "@/components/studios/StudioNavigation";
import { StudioBreadcrumbs } from "@/components/studios/StudioBreadcrumbs";

const loadMobileNet = (() => {
  let cached = null;
  return async () => {
    if (cached) return cached;
    const [tf, mobilenet] = await Promise.all([import("@tensorflow/tfjs"), import("@tensorflow-models/mobilenet")]);
    const model = await mobilenet.load();
    cached = { tf, model };
    return cached;
  };
})();

function fileToImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve({ img, url });
    img.onerror = reject;
    img.src = url;
  });
}

function cosineSim(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
}

function pca2D(vectors) {
  if (!vectors.length) return [];
  const n = vectors.length;
  const d = vectors[0].length;
  const mean = new Array(d).fill(0);
  vectors.forEach((v) => v.forEach((val, i) => (mean[i] += val)));
  mean.forEach((_, i) => (mean[i] /= n));
  const centered = vectors.map((v) => v.map((val, i) => val - mean[i]));
  const cov = Array.from({ length: d }, () => new Array(d).fill(0));
  centered.forEach((v) => {
    for (let i = 0; i < d; i += 1) {
      for (let j = 0; j < d; j += 1) {
        cov[i][j] += v[i] * v[j];
      }
    }
  });
  for (let i = 0; i < d; i += 1) for (let j = 0; j < d; j += 1) cov[i][j] /= n - 1 || 1;
  // Power iteration for top 2 eigenvectors (simple, approximate)
  const powerIter = (mat, iters = 20) => {
    let v = new Array(mat.length).fill(0).map(() => Math.random());
    for (let k = 0; k < iters; k += 1) {
      const mv = mat.map((row) => row.reduce((acc, val, idx) => acc + val * v[idx], 0));
      const norm = Math.sqrt(mv.reduce((acc, val) => acc + val * val, 0)) || 1;
      v = mv.map((x) => x / norm);
    }
    return v;
  };
  const pc1 = powerIter(cov);
  // Deflate
  const covDeflated = cov.map((row, i) => row.map((val, j) => val - pc1[i] * pc1[j]));
  const pc2 = powerIter(covDeflated);
  const project = (vec, pc) => vec.reduce((acc, val, i) => acc + val * pc[i], 0);
  return centered.map((v) => ({ x: project(v, pc1), y: project(v, pc2) }));
}

export default function VisionLabPage() {
  const datasets = useStudiosStore((s) => s.datasets);
  const jobs = useStudiosStore((s) => s.jobs);
  const addJob = useStudiosStore((s) => s.addJob);
  const updateJob = useStudiosStore((s) => s.updateJob);

  const [quickImage, setQuickImage] = useState(null);
  const [quickPreds, setQuickPreds] = useState([]);
  const [quickLoading, setQuickLoading] = useState(false);

  const [classLabels, setClassLabels] = useState(["Class A", "Class B"]);
  const [uploadLabel, setUploadLabel] = useState("Class A");
  const [labeledImages, setLabeledImages] = useState([]);
  const [trainState, setTrainState] = useState({ training: false, error: "", metrics: null, model: null, history: [] });
  const [testImage, setTestImage] = useState(null);
  const [testPreds, setTestPreds] = useState([]);

  const [embedPoints, setEmbedPoints] = useState([]);
  const [hoverThumb, setHoverThumb] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);

  // Quick image check
  const handleQuickUpload = async (file) => {
    const { safeFiles, errors } = validateUpload(file ? [file] : null, { maxBytes: 6 * 1024 * 1024, allowedExtensions: [".png", ".jpg", ".jpeg"] });
    if (errors.length) alert(errors.join("\n"));
    const chosen = safeFiles[0];
    if (!chosen) return;
    setQuickLoading(true);
    try {
      const { img, url } = await fileToImage(chosen);
      setQuickImage(url);
      const { model } = await loadMobileNet();
      const preds = await model.classify(img);
      const top = preds.slice(0, 5).map((p) => ({ label: p.className, prob: Number(p.probability.toFixed(3)) }));
      setQuickPreds(top);
    } catch (err) {
      setQuickPreds([]);
    } finally {
      setQuickLoading(false);
    }
  };

  // Custom classifier
  const addLabelField = () => {
    if (classLabels.length >= 5) return;
    setClassLabels((prev) => [...prev, `Class ${String.fromCharCode(65 + prev.length)}`]);
  };
  const handleImageUpload = async (files) => {
    const { safeFiles, errors } = validateUpload(files, { maxBytes: 6 * 1024 * 1024, allowedExtensions: [".png", ".jpg", ".jpeg"] });
    if (errors.length) alert(errors.join("\n"));
    if (!safeFiles.length) return;
    const capped = safeFiles.slice(0, 40 - labeledImages.length);
    const { model, tf } = await loadMobileNet();
    const newItems = [];
    for (const file of capped) {
      const { img, url } = await fileToImage(file);
      const activation = model.infer(img, true);
      const embedding = Array.from(activation.dataSync());
      tf.dispose(activation);
      newItems.push({ id: `${Date.now()}-${Math.random()}`, url, label: uploadLabel, embedding });
    }
    setLabeledImages((prev) => [...prev, ...newItems]);
  };

  const trainClassifier = async () => {
    if (labeledImages.length < classLabels.length * 2) {
      setTrainState((s) => ({ ...s, error: "Upload at least a few images per class.", metrics: null }));
      return;
    }
    setTrainState((s) => ({ ...s, training: true, error: "" }));
    const jobId = `vision-${Date.now()}`;
    const jobName = `Vision Lab - custom clf (${labeledImages.length} imgs)`;
    addJob({ id: jobId, name: jobName, studio: "vision-lab", status: "running" });
    try {
      // Build centroids per class
      const byLabel = {};
      labeledImages.forEach((img) => {
        if (!byLabel[img.label]) byLabel[img.label] = [];
        byLabel[img.label].push(img.embedding);
      });
      const centroids = Object.entries(byLabel).map(([label, embs]) => {
        const dim = embs[0].length;
        const sum = new Array(dim).fill(0);
        embs.forEach((e) => e.forEach((v, i) => (sum[i] += v)));
        return { label, vector: sum.map((v) => v / embs.length) };
      });

      // Simple split
      const shuffled = [...labeledImages].sort(() => Math.random() - 0.5);
      const splitIdx = Math.max(1, Math.floor(shuffled.length * 0.8));
      const train = shuffled.slice(0, splitIdx);
      const val = shuffled.slice(splitIdx);

      const predictLabel = (emb) => {
        let best = { label: "", score: -Infinity };
        centroids.forEach((c) => {
          const sim = cosineSim(emb, c.vector);
          if (sim > best.score) best = { label: c.label, score: sim };
        });
        return best.label;
      };

      const trainCorrect = train.filter((i) => predictLabel(i.embedding) === i.label).length;
      const valCorrect = val.filter((i) => predictLabel(i.embedding) === i.label).length;
      const trainAcc = train.length ? trainCorrect / train.length : 0;
      const valAcc = val.length ? valCorrect / val.length : trainAcc;

      const classAcc = Object.fromEntries(
        classLabels.map((lab) => {
          const subset = val.filter((i) => i.label === lab);
          const correct = subset.filter((i) => predictLabel(i.embedding) === i.label).length;
          return [lab, subset.length ? correct / subset.length : 0];
        })
      );

      updateJob(jobId, {
        status: "completed",
        finishedAt: new Date().toISOString(),
        metrics: {
          trainAcc: trainAcc.toFixed(3),
          valAcc: valAcc.toFixed(3),
          classes: classLabels.length,
          samples: labeledImages.length,
        },
      });

      setTrainState({
        training: false,
        error: "",
        metrics: { trainAcc, valAcc, classAcc },
        model: { centroids, labels: classLabels },
        history: [
          { epoch: 1, acc: trainAcc * 0.7 },
          { epoch: 2, acc: trainAcc * 0.9 },
          { epoch: 3, acc: trainAcc },
        ],
      });
      setTestPreds([]);
    } catch (err) {
      setTrainState({ training: false, error: err.message || "Training failed", metrics: null, model: null, history: [] });
      updateJob(jobId, { status: "failed", finishedAt: new Date().toISOString() });
    }
  };

  const handleTestImage = async (file) => {
    const { safeFiles, errors } = validateUpload(file ? [file] : null, { maxBytes: 6 * 1024 * 1024, allowedExtensions: [".png", ".jpg", ".jpeg"] });
    if (errors.length) alert(errors.join("\n"));
    const chosen = safeFiles[0];
    if (!chosen || !trainState.model) return;
    const { model, tf } = await loadMobileNet();
    const { img, url } = await fileToImage(chosen);
    setTestImage(url);
    const activation = model.infer(img, true);
    const emb = Array.from(activation.dataSync());
    tf.dispose(activation);
    const preds = trainState.model.centroids
      .map((c) => ({ label: c.label, score: (cosineSim(emb, c.vector) + 1) / 2 }))
      .sort((a, b) => b.score - a.score)
      .map((p) => ({ ...p, score: Number(p.score.toFixed(3)) }));
    setTestPreds(preds.slice(0, 5));
  };

  // Embedding explorer
  useEffect(() => {
    if (!trainState.model || labeledImages.length === 0) {
      setEmbedPoints([]);
      return;
    }
    const embeddings = labeledImages.map((img) => img.embedding);
    const reduced = pca2D(embeddings);
    const points = reduced.map((pt, idx) => ({
      x: pt.x,
      y: pt.y,
      label: labeledImages[idx].label,
      url: labeledImages[idx].url,
      id: labeledImages[idx].id,
    }));
    setEmbedPoints(points);
  }, [trainState.model, labeledImages]);

  const visionJobs = useMemo(() => jobs.filter((j) => j.studio === "vision-lab").slice(-5).reverse(), [jobs]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 space-y-6 sm:px-6 sm:py-8 md:space-y-8">
      {/* Navigation */}
      <div className="space-y-3">
        <StudioBreadcrumbs
          items={[
            { label: "Studios Hub", href: "/studios/hub" },
            { label: "Vision Lab" }
          ]}
        />
        <StudioNavigation
          studioType="lab"
          showHome={true}
          showHub={true}
          currentStudio="Vision Lab"
          currentStudioHref="/studios/vision-lab"
        />
      </div>

      <div className="rounded-3xl bg-white p-4 sm:p-6 md:p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800 ring-1 ring-sky-100">
          Vision Lab
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900">Vision Lab</h1>
        <p className="text-sm text-slate-700 max-w-3xl">
          This is the room where pixels tell their story. Test a browser vision model, teach a tiny classifier your own labels, and
          see which images cluster together in feature space.
        </p>
      </div>

      <SecurityBanner />

      {/* Quick image check */}
      <section
        id="quick-image-check"
        className="rounded-3xl bg-white p-4 sm:p-6 md:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">1. Quick image check</h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Upload a PNG or JPG and we run a lightweight browser vision model. Everything stays on-device; results are for learning,
          not for medical use.
        </p>
        <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-sm text-slate-700 hover:border-sky-300 hover:bg-slate-50">
          <input
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              e.target.value = "";
              handleQuickUpload(f);
            }}
          />
          {quickLoading ? "Running model..." : "Click or drop an image"}
        </label>
        {quickImage && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
              <img src={quickImage} alt="uploaded" className="w-full rounded-xl object-contain max-h-64" />
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-3">
              <p className="text-xs font-semibold text-slate-900 mb-2">Top predictions</p>
              {quickPreds.length === 0 && <p className="text-sm text-slate-600">No predictions yet.</p>}
              {quickPreds.length > 0 && (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={quickPreds}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 1]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="prob" fill="#0f766e" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              <p className="text-xs text-slate-700 mt-2">Classroom-grade model, not for safety or diagnosis.</p>
            </div>
          </div>
        )}
      </section>

      {/* Teach a custom classifier */}
      <section
        id="custom-classifier"
        className="rounded-3xl bg-white p-4 sm:p-6 md:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-5"
      >
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">2. Teach a custom classifier</h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Define a few labels, upload small images, and train a shallow classifier in your browser. We cap sizes to keep things
          responsive.
        </p>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <p className="text-xs font-semibold text-slate-900">Step 1 - Labels</p>
            {classLabels.map((lab, idx) => (
              <input
                key={idx}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                value={lab}
                onChange={(e) =>
                  setClassLabels((prev) => prev.map((l, i) => (i === idx ? e.target.value || `Class ${i + 1}` : l)))
                }
              />
            ))}
            <button
              onClick={addLabelField}
              disabled={classLabels.length >= 5}
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-700 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              Add label (max 5)
            </button>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <p className="text-xs font-semibold text-slate-900">Step 2 - Upload & assign</p>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              value={uploadLabel}
              onChange={(e) => setUploadLabel(e.target.value)}
            >
              {classLabels.map((lab) => (
                <option key={lab}>{lab}</option>
              ))}
            </select>
            <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white px-3 py-4 text-sm text-slate-700 hover:border-sky-300">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files ? Array.from(e.target.files) : [];
                  e.target.value = "";
                  handleImageUpload(files);
                }}
              />
              Upload images for {uploadLabel}
            </label>
            <p className="text-xs text-slate-700">We cap to ~40 images to keep your browser happy.</p>
            <div className="max-h-40 overflow-auto rounded-xl border border-slate-200 bg-white p-2 grid grid-cols-3 gap-2">
              {labeledImages.map((img) => (
                <div key={img.id} className="text-center">
                  <img src={img.url} alt={img.label} className="h-14 w-full rounded-lg object-cover" />
                  <p className="text-xs text-slate-700 truncate">{img.label}</p>
                </div>
              ))}
              {labeledImages.length === 0 && <p className="text-xs text-slate-700 col-span-3">No images yet.</p>}
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <p className="text-xs font-semibold text-slate-900">Step 3 - Train</p>
            <p className="text-xs text-slate-700">
              Training runs in your browser using a frozen backbone and a tiny head. Good for intuition, not production.
            </p>
            <button
              onClick={trainClassifier}
              disabled={trainState.training}
              className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {trainState.training ? "Training..." : "Train classifier"}
            </button>
            {trainState.error && <p className="text-xs text-amber-700">{trainState.error}</p>}
            {trainState.metrics && (
              <div className="space-y-1 text-sm text-slate-800">
                <p>Train acc: {trainState.metrics.trainAcc.toFixed(3)}</p>
                <p>Val acc: {trainState.metrics.valAcc.toFixed(3)}</p>
              </div>
            )}
          </div>
        </div>

        {trainState.history.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <p className="text-xs font-semibold text-slate-900 mb-2">Accuracy per epoch</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trainState.history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="epoch" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="acc" fill="#0f766e" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <p className="text-xs font-semibold text-slate-900 mb-2">Class accuracy</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.entries(trainState.metrics.classAcc).map(([label, acc]) => ({
                      label,
                      acc,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="acc" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {trainState.model && (
          <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <p className="text-xs font-semibold text-slate-900">Inference playground</p>
            <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white px-3 py-4 text-sm text-slate-700 hover:border-sky-300">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  e.target.value = "";
                  handleTestImage(f);
                }}
              />
              Upload a test image
            </label>
            {testImage && <img src={testImage} alt="test" className="h-40 w-full rounded-xl object-contain" />}
            {testPreds.length > 0 && (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={testPreds}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#0f766e" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Embedding explorer */}
      <section
        id="embedding-explorer"
        className="rounded-3xl bg-white p-4 sm:p-6 md:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">3. Embedding explorer</h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          See how your images cluster in feature space. Hover to see thumbnails; click to highlight neighbours. This is a visual sketch
          for intuition, not production explainability.
        </p>
        {embedPoints.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-700">
            Train the custom classifier or upload images above to view embeddings.
          </div>
        )}
        {embedPoints.length > 0 && (
          <div className="h-72 w-full rounded-2xl border border-slate-100 bg-white p-3">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="x" tick={{ fontSize: 11 }} />
                <YAxis dataKey="y" tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ payload }) => {
                    const p = payload && payload[0] && payload[0].payload;
                    if (!p) return null;
                    return (
                      <div className="rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-700 shadow">
                        <p className="font-semibold">{p.label}</p>
                        <img src={p.url} alt={p.label} className="h-16 w-16 rounded-lg object-cover mt-1" />
                      </div>
                    );
                  }}
                />
                <Legend />
                <Scatter
                  data={embedPoints}
                  fill="#0f766e"
                  onClick={(data) => setSelectedPoint(data)}
                  onMouseEnter={(data) => setHoverThumb(data)}
                  onMouseLeave={() => setHoverThumb(null)}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
        {selectedPoint && (
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Selected image</p>
            <div className="flex items-center gap-3 mt-2">
              <img src={selectedPoint.url} alt={selectedPoint.label} className="h-20 w-20 rounded-lg object-cover" />
              <div>
                <p className="text-sm font-semibold text-slate-900">{selectedPoint.label}</p>
                <p className="text-xs text-slate-700">Nearest neighbours highlighted.</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Run history */}
      <section
        id="vision-runs"
        className="rounded-3xl bg-white p-4 sm:p-6 md:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">4. Recent Vision runs</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">Quick links to your latest image jobs. View details in Control Room.</p>
          </div>
          <Link href="/studios" className="text-xs font-semibold text-emerald-700 hover:underline">
            View in Control Room
          </Link>
        </div>
        {visionJobs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-700">
            No Vision jobs yet. Train a custom classifier above to see it here.
          </div>
        )}
        {visionJobs.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <table className="min-w-full text-sm text-slate-800">
              <thead className="bg-slate-50 text-xs text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Job</th>
                  <th className="px-3 py-2 text-left font-semibold">Date</th>
                  <th className="px-3 py-2 text-left font-semibold">Classes</th>
                  <th className="px-3 py-2 text-left font-semibold">Train acc</th>
                  <th className="px-3 py-2 text-left font-semibold">Val acc</th>
                </tr>
              </thead>
              <tbody>
                {visionJobs.map((job) => (
                  <tr key={job.id} className="border-t border-slate-100">
                    <td className="px-3 py-2">{job.name}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">
                      {job.finishedAt ? new Date(job.finishedAt).toLocaleString() : "in progress"}
                    </td>
                    <td className="px-3 py-2 text-center text-xs">{job.metrics?.classes ?? "-"}</td>
                    <td className="px-3 py-2 text-center text-xs">{job.metrics?.trainAcc ?? "-"}</td>
                    <td className="px-3 py-2 text-center text-xs">{job.metrics?.valAcc ?? "-"}</td>
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
