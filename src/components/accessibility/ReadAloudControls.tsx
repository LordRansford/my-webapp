"use client";

import { useEffect, useRef, useState } from "react";
import { useAccessibility } from "./AccessibilityProvider";
import { ReadAloudEngine } from "@/lib/accessibility/readAloud";
import { Volume2, VolumeX, Play, Pause, Square, Highlighter } from "lucide-react";

export default function ReadAloudControls() {
  const { prefs, setReadAloudEnabled, setReadAloudHighlight } = useAccessibility();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const engineRef = useRef<ReadAloudEngine | null>(null);
  const mainElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Wait for voices to load
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = prefs.readAloudVoice
        ? voices.find((v) => v.name === prefs.readAloudVoice)
        : undefined;

      // Initialize engine
      engineRef.current = new ReadAloudEngine({
        rate: prefs.readAloudRate,
        pitch: prefs.readAloudPitch,
        highlight: prefs.readAloudHighlight,
        voice: selectedVoice,
        onChunkStart: () => {
          setIsPlaying(true);
          setIsPaused(false);
        },
        onChunkEnd: () => {
          // Will be set to false when reading completes
        },
      });
    };

    // Load voices immediately if available
    if (window.speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      // Wait for voices to load
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
      }
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [prefs.readAloudRate, prefs.readAloudPitch, prefs.readAloudVoice, prefs.readAloudHighlight]);

  const handleToggle = async () => {
    if (!engineRef.current) return;

    if (isPlaying) {
      engineRef.current.stop();
      setIsPlaying(false);
      setIsPaused(false);
      setReadAloudEnabled(false);
    } else {
      // Find main content element - try multiple selectors
      let mainElement = document.getElementById("main-content");
      if (!mainElement) {
        mainElement = document.querySelector("main");
      }
      if (!mainElement) {
        mainElement = document.querySelector("article");
      }
      if (!mainElement) {
        // Fallback to body if no main content found
        mainElement = document.body;
      }

      setReadAloudEnabled(true);
      await engineRef.current.readContent(mainElement as HTMLElement, false);
    }
  };

  const handleReadSelection = async () => {
    if (!engineRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.toString().trim().length === 0) {
      // If no selection, just start reading from top (same as play button)
      handleToggle();
      return;
    }

    setReadAloudEnabled(true);
    await engineRef.current.readContent(null, true);
  };

  const handlePause = () => {
    if (!engineRef.current) return;

    if (isPaused) {
      engineRef.current.resume();
      setIsPaused(false);
    } else {
      engineRef.current.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (!engineRef.current) return;
    engineRef.current.stop();
    setIsPlaying(false);
    setIsPaused(false);
    setReadAloudEnabled(false);
  };

  // Update playing state when engine state changes
  useEffect(() => {
    if (engineRef.current && !engineRef.current.playing && isPlaying) {
      setIsPlaying(false);
      setIsPaused(false);
      setReadAloudEnabled(false);
    }
  }, [isPlaying, setReadAloudEnabled]);

  // Check if SpeechSynthesis is available
  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  if (!isSupported) {
    return null;
  }

  return (
    <div className="read-aloud-controls fixed bottom-4 right-4 z-40 flex flex-col gap-3">
      <div className="rounded-2xl border-2 border-slate-200 bg-white p-3 shadow-xl backdrop-blur-sm flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggle}
          className={`flex items-center justify-center h-12 w-12 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:ring-offset-2 ${
            isPlaying
              ? "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg hover:shadow-xl hover:scale-110"
              : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl hover:scale-110"
          }`}
          aria-label={isPlaying ? "Stop reading" : "Start reading everything on page"}
          aria-pressed={isPlaying}
          title={isPlaying ? "Stop reading" : "Read everything on page"}
        >
          {isPlaying ? <Square className="h-5 w-5" aria-hidden="true" /> : <Play className="h-5 w-5" aria-hidden="true" />}
        </button>

        {isPlaying && (
          <>
            <button
              type="button"
              onClick={handlePause}
              className="flex items-center justify-center h-10 w-10 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200"
              aria-label={isPaused ? "Resume reading" : "Pause reading"}
              aria-pressed={isPaused}
              title={isPaused ? "Resume reading" : "Pause reading"}
            >
              {isPaused ? <Volume2 className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={handleStop}
              className="flex items-center justify-center h-10 w-10 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200"
              aria-label="Stop reading"
              title="Stop reading"
            >
              <Square className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        )}

        <button
          type="button"
          onClick={handleReadSelection}
          className="flex items-center justify-center h-10 w-10 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200"
          aria-label="Read selected text"
          title="Select text and click to read selection"
        >
          <Highlighter className="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => setReadAloudHighlight(!prefs.readAloudHighlight)}
          className={`flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 hover:scale-105 ${
            prefs.readAloudHighlight
              ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
          aria-label={prefs.readAloudHighlight ? "Disable highlight" : "Enable highlight"}
          aria-pressed={prefs.readAloudHighlight}
          title="Toggle text highlighting while reading"
        >
          <Highlighter className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

