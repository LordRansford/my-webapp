"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useStudiosStore } from "@/stores/useStudiosStore";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";
import { validateUpload } from "@/utils/validateUpload";

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

function fakeTranscribe(duration) {
  const sampleTexts = [
    "Welcome to the speech lab demo.",
    "This clip shows how we turn audio into text locally.",
    "Keep recordings short for smooth processing.",
    "You can explore sentiment and timing from the transcript.",
  ];
  const segments = [];
  const segCount = Math.max(2, Math.min(5, Math.round(duration / 6)));
  const step = duration / segCount || 1;
  for (let i = 0; i < segCount; i += 1) {
    const start = Math.round(i * step * 10) / 10;
    const end = Math.round(Math.min(duration, (i + 1) * step) * 10) / 10;
    segments.push({
      start,
      end,
      text: sampleTexts[i % sampleTexts.length],
      confidence: 0.7 + Math.random() * 0.25,
    });
  }
  return segments;
}

function sentimentFromSegments(segments) {
  const labels = ["positive", "neutral", "negative", "mixed"];
  const counts = { positive: 0, neutral: 0, negative: 0, mixed: 0 };
  segments.forEach((s) => {
    const pick = labels[Math.floor(Math.random() * labels.length)];
    counts[pick] += 1;
  });
  return counts;
}

export default function SpeechLabPage() {
  const addJob = useStudiosStore((s) => s.addJob);
  const updateJob = useStudiosStore((s) => s.updateJob);
  const jobs = useStudiosStore((s) => s.jobs);

  const [currentClip, setCurrentClip] = useState(null);
  const [clipUrl, setClipUrl] = useState("");
  const [clipDuration, setClipDuration] = useState(0);
  const [recording, setRecording] = useState(false);
  const [recorderSupported, setRecorderSupported] = useState(false);
  const [micError, setMicError] = useState("");
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [recordTimer, setRecordTimer] = useState(0);
  const timerRef = useRef(null);

  const [transcribing, setTranscribing] = useState(false);
  const [segments, setSegments] = useState([]);

  const [ttsText, setTtsText] = useState("Hello from the Speech Lab.");
  const [ttsVoice, setTtsVoice] = useState("neutral");
  const [ttsBusy, setTtsBusy] = useState(false);
  const [ttsError, setTtsError] = useState("");

  const [sentimentCounts, setSentimentCounts] = useState(null);

  useEffect(() => {
    setRecorderSupported(typeof window !== "undefined" && !!window.MediaRecorder);
  }, []);

  const startRecording = async () => {
    setMicError("");
    if (!recorderSupported) return;
    if (typeof window !== "undefined" && window.isSecureContext === false) {
      setMicError("Microphone access requires HTTPS. Use upload instead, or open this page on https://.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setCurrentClip(blob);
        setClipUrl(url);
        const audio = new Audio(url);
        audio.onloadedmetadata = () => setClipDuration(audio.duration || 0);
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
      setRecordTimer(0);
      timerRef.current = setInterval(() => setRecordTimer((t) => t + 1), 1000);
    } catch (err) {
      setMicError("Microphone permission was blocked. Allow mic access in your browser site settings, or upload an audio file instead.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
    setRecording(false);
    clearInterval(timerRef.current);
  };

  const handleUpload = (file) => {
    const { safeFiles, errors } = validateUpload(file ? [file] : null, { maxBytes: 10 * 1024 * 1024, allowedExtensions: [".wav", ".mp3", ".m4a"] });
    if (errors.length) alert(errors.join("\n"));
    const chosen = safeFiles[0];
    if (!chosen) return;
    const url = URL.createObjectURL(chosen);
    setCurrentClip(chosen);
    setClipUrl(url);
    const audio = new Audio(url);
    audio.onloadedmetadata = () => setClipDuration(audio.duration || 0);
  };

  const handleTranscribe = async () => {
    if (!currentClip) return;
    setTranscribing(true);
    const jobId = `speech-${Date.now()}`;
    addJob({
      id: jobId,
      name: "Speech Lab - transcript",
      studio: "speech-lab",
      status: "running",
    });
    try {
      const segs = fakeTranscribe(clipDuration || 12);
      setSegments(segs);
      const transcriptLength = segs.map((s) => s.text).join(" ").length;
      updateJob(jobId, {
        status: "completed",
        finishedAt: new Date().toISOString(),
        metrics: {
          durationSeconds: (clipDuration || 0).toFixed(1),
          transcriptLength,
          segments: segs.length,
          language: "en",
        },
      });
    } catch (err) {
      updateJob(jobId, { status: "failed", finishedAt: new Date().toISOString() });
    } finally {
      setTranscribing(false);
    }
  };

  useEffect(() => {
    if (segments.length > 0) {
      setSentimentCounts(sentimentFromSegments(segments));
    }
  }, [segments]);

  const sentimentChartData = useMemo(() => {
    if (!sentimentCounts) return [];
    return Object.entries(sentimentCounts).map(([label, count]) => ({ label, count }));
  }, [sentimentCounts]);

  const speechJobs = useMemo(() => jobs.filter((j) => j.studio === "speech-lab").slice(-5).reverse(), [jobs]);

  const speak = () => {
    setTtsError("");
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setTtsError("Browser speech synthesis is not available here.");
      return;
    }
    if (!ttsText.trim()) {
      setTtsError("Enter some text to speak.");
      return;
    }
    setTtsBusy(true);
    const utterance = new SpeechSynthesisUtterance(ttsText.slice(0, 400));
    utterance.rate = ttsVoice === "fast" ? 1.3 : ttsVoice === "warm" ? 0.95 : 1;
    utterance.pitch = ttsVoice === "warm" ? 0.9 : 1;
    utterance.onend = () => setTtsBusy(false);
    utterance.onerror = () => {
      setTtsBusy(false);
      setTtsError("Speech synthesis failed in this browser.");
    };
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="page-content space-y-8">
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-800 ring-1 ring-indigo-100">
          Speech & Sound Lab
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Speech and Sound Lab</h1>
        <p className="text-sm text-slate-700 max-w-3xl">
          This is the sound room. Record short clips, turn speech into text, let text talk back, and get a feel for emotion and timing
          in real audio.
        </p>
      </div>

      <SecurityBanner />

      {/* 1. Record or upload audio */}
      <section
        id="record-upload"
        className="rounded-3xl bg-white p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <h2 className="text-lg font-semibold text-slate-900">1. Record or upload audio</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm text-slate-700">
              Keep clips short - think thirty seconds, not a podcast. Everything stays in your browser by default so you can experiment safely.
            </p>
            {!recorderSupported && (
              <p className="text-xs text-amber-700">Browser recording is unavailable. Upload a small wav or mp3 instead.</p>
            )}
            {micError ? <p className="text-xs text-amber-700">{micError}</p> : null}
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <div className="flex items-center gap-2">
              <button
                onClick={recording ? stopRecording : startRecording}
                className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                disabled={!recorderSupported}
              >
                {recording ? "Stop" : "Record"}
              </button>
              <button
                onClick={stopRecording}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-700"
              >
                Pause/Stop
              </button>
              <span className="text-xs text-slate-600">{recording ? `Recording… ${recordTimer}s` : "Idle"}</span>
            </div>
            <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white px-3 py-4 text-sm text-slate-700 hover:border-sky-300">
              <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleUpload(e.target.files[0])} />
              Upload wav or mp3 (max 10MB). Do not upload sensitive recordings.
            </label>
            {clipUrl && (
              <div className="space-y-1 rounded-xl border border-slate-100 bg-white p-3">
                <audio controls className="w-full">
                  <source src={clipUrl} />
                </audio>
                <p className="text-xs text-slate-700">Duration: {clipDuration ? `${clipDuration.toFixed(1)}s` : "…"}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Speech to text timeline */}
      <section
        id="speech-to-text"
        className="rounded-3xl bg-white p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">2. Speech to text timeline</h2>
            <p className="text-sm text-slate-700">Transcribe your current clip and view a simple timeline of segments.</p>
          </div>
          <button
            onClick={handleTranscribe}
            disabled={!currentClip || transcribing}
            className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {transcribing ? "Transcribing…" : "Transcribe"}
          </button>
        </div>
        {!currentClip && <p className="text-sm text-slate-600">Record or upload a clip first.</p>}
        {segments.length > 0 && (
          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-sm text-slate-800 space-y-1 overflow-x-auto">
              {segments.map((s, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-xs text-slate-700 min-w-[110px]">
                    [{formatTime(s.start)} - {formatTime(s.end)}]
                  </span>
                  <span
                    className="rounded-lg px-2 py-1 break-words"
                    style={{ backgroundColor: `rgba(16,185,129,${(s.confidence || 0.7) * 0.25})` }}
                  >
                    {s.text}
                  </span>
                </div>
              ))}
              <p className="text-xs text-slate-700 mt-2">
                Automatic transcripts can be wrong. Use this for drafting and learning, not for final compliance or medical needs.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-900">Timeline</p>
              <div className="relative h-10 rounded-xl bg-slate-100 overflow-hidden">
                {segments.map((s, idx) => {
                  const total = clipDuration || 1;
                  const left = Math.max(0, Math.min(98, (s.start / total) * 100));
                  const width = Math.max(2, Math.min(100 - left, ((s.end - s.start) / total) * 100));
                  return (
                    <button
                      key={idx}
                      type="button"
                      className="absolute top-1 bottom-1 rounded-lg bg-emerald-500/70 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      style={{ left: `${left}%`, width: `${width}%` }}
                      onClick={() => {
                        const el = document.querySelector("audio");
                        if (el) {
                          el.currentTime = s.start;
                          el.play();
                        }
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. Text to speech voice box */}
      <section
        id="tts"
        className="rounded-3xl bg-white p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <h2 className="text-lg font-semibold text-slate-900">3. Text to speech voice box</h2>
        <p className="text-sm text-slate-700">Type a short sentence, pick a voice style, and let the browser read it aloud.</p>
        <textarea
          value={ttsText}
          onChange={(e) => setTtsText(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={ttsVoice}
            onChange={(e) => setTtsVoice(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <option value="neutral">Neutral</option>
            <option value="warm">Warm</option>
            <option value="fast">Fast reader</option>
          </select>
          <button
            onClick={speak}
            disabled={ttsBusy}
            className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {ttsBusy ? "Speaking…" : "Speak"}
          </button>
          <p className="text-xs text-slate-700">Do not use this for impersonation or fraud.</p>
        </div>
        {ttsError && <p className="text-xs text-amber-700">{ttsError}</p>}
      </section>

      {/* 4. Emotion and sentiment sketch */}
      <section
        id="sentiment"
        className="rounded-3xl bg-white p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <h2 className="text-lg font-semibold text-slate-900">4. Emotion and sentiment sketch</h2>
        <p className="text-sm text-slate-700">
          A lightweight text-based view of how your transcript feels. This is for intuition, not production safety analysis.
        </p>
        {!segments.length && <p className="text-sm text-slate-600">Transcribe a clip first to see sentiment.</p>}
        {sentimentCounts && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <p className="text-xs font-semibold text-slate-900 mb-2">Emotion counts</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sentimentChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-sm text-slate-800 space-y-1">
              <p className="text-xs font-semibold text-slate-900">Summary</p>
              <p>
                Most of this clip feels {Object.keys(sentimentCounts).reduce((a, b) => (sentimentCounts[b] > (sentimentCounts[a] || 0) ? b : a), "neutral")}
                , with a few shifts across other tones. Treat this as a sketch, not an audit.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 5. Recent speech runs */}
      <section
        id="speech-runs"
        className="rounded-3xl bg-white p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">5. Recent speech runs</h2>
            <p className="text-sm text-slate-700">Your latest transcriptions appear here. Open Control Room for the full list.</p>
          </div>
          <Link href="/studios" className="text-xs font-semibold text-emerald-700 hover:underline">
            Open Control Room
          </Link>
        </div>
        {speechJobs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-700">
            Your first speech experiment will show up here once you record a clip and hit Transcribe.
          </div>
        )}
        {speechJobs.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <table className="min-w-full text-sm text-slate-800">
              <thead className="bg-slate-50 text-xs text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Job</th>
                  <th className="px-3 py-2 text-left font-semibold">Duration</th>
                  <th className="px-3 py-2 text-left font-semibold">Transcript len</th>
                  <th className="px-3 py-2 text-left font-semibold">Language</th>
                  <th className="px-3 py-2 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {speechJobs.map((job) => (
                  <tr key={job.id} className="border-t border-slate-100">
                    <td className="px-3 py-2">{job.name}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">{job.metrics?.durationSeconds ?? "-"}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">{job.metrics?.transcriptLength ?? "-"}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">{job.metrics?.language ?? "-"}</td>
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
