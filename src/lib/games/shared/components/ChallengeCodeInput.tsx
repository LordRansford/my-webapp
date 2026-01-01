/**
 * Challenge Code Input Component
 * 
 * UI for entering a challenge code to play a shared challenge
 */

"use client";

import React, { useState, useCallback } from "react";
import { Play, AlertCircle } from "lucide-react";
import { parseChallengeCode } from "../challengeCodes/challengeCodeParser";
import type { ParseResult } from "../challengeCodes/types";

interface ChallengeCodeInputProps {
  onCodeEntered: (code: string) => void;
  gameSlug: string;
  compact?: boolean;
}

export function ChallengeCodeInput({
  onCodeEntered,
  gameSlug,
  compact = false,
}: ChallengeCodeInputProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setValidating(true);

      const code = input.trim().toUpperCase();
      const result: ParseResult = parseChallengeCode(code);

      if (!result.success) {
        setError(result.error || "Invalid challenge code");
        setValidating(false);
        return;
      }

      if (result.code) {
        // Validate game matches
        const { getGameSlug } = require("../challengeCodes/challengeCodeGenerator");
        const codeGameSlug = getGameSlug(result.code.gameId);
        
        if (codeGameSlug !== gameSlug) {
          setError(`This code is for a different game. Expected: ${gameSlug}`);
          setValidating(false);
          return;
        }

        onCodeEntered(code);
        setValidating(false);
      }
    },
    [input, gameSlug, onCodeEntered]
  );

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value.toUpperCase());
              setError(null);
            }}
            placeholder="Enter code (e.g., COPT-2024-01-15-A1B2)"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={validating || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <Play className="h-4 w-4" />
          </button>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </form>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        Play Shared Challenge
      </h3>
      <p className="text-sm text-slate-600 mb-4">
        Enter a challenge code to play the same challenge as someone else
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value.toUpperCase());
              setError(null);
            }}
            placeholder="COPT-2024-01-15-A1B2"
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl font-mono text-lg text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={validating || !input.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          <Play className="h-5 w-5" />
          {validating ? "Loading..." : "Play Challenge"}
        </button>
      </form>
    </div>
  );
}