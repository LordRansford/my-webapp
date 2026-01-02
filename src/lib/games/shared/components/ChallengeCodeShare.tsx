/**
 * Challenge Code Share Component
 * 
 * Beautiful UI for displaying and sharing challenge codes
 */

"use client";

import React, { useState, useCallback } from "react";
import { Copy, Check, Share2, ExternalLink } from "lucide-react";
import type { ChallengeCode } from "../challengeCodes/types";

interface ChallengeCodeShareProps {
  code: ChallengeCode;
  score?: number;
  onShare?: () => void;
  compact?: boolean;
}

export function ChallengeCodeShare({
  code,
  score,
  onShare,
  compact = false,
}: ChallengeCodeShareProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, [code.code]);

  const handleShare = useCallback(async () => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `Challenge Code: ${code.code}`,
          text: `Try this challenge! Code: ${code.code}`,
        });
        onShare?.();
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== "AbortError") {
          console.error("Share failed:", error);
        }
      }
    } else {
      // Fallback to copy
      handleCopy();
    }
  }, [code.code, onShare, handleCopy]);

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
        <code className="flex-1 font-mono text-sm font-semibold text-slate-900">
          {code.code}
        </code>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded hover:bg-slate-200 transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4 text-slate-600" />
          )}
        </button>
        {typeof navigator.share === 'function' && (
          <button
            onClick={handleShare}
            className="p-1.5 rounded hover:bg-slate-200 transition-colors"
            aria-label="Share code"
          >
            <Share2 className="h-4 w-4 text-slate-600" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Challenge Code
          </h3>
          <p className="text-sm text-slate-600">
            Share this code to play the same challenge
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-blue-300 p-4 mb-4">
        <code className="block font-mono text-2xl font-bold text-blue-900 text-center tracking-wider">
          {code.code}
        </code>
      </div>

      {score !== undefined && (
        <div className="mb-4 text-center">
          <div className="inline-block bg-blue-100 rounded-full px-4 py-2">
            <span className="text-sm font-medium text-blue-900">
              Your Score: {score.toFixed(1)}
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
            copied
              ? "bg-green-100 text-green-800 border-2 border-green-300"
              : "bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-600"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-5 w-5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-5 w-5" />
              Copy Code
            </>
          )}
        </button>

        {typeof navigator.share === 'function' && (
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-white text-blue-600 border-2 border-blue-300 hover:bg-blue-50 transition-all"
          >
            <Share2 className="h-5 w-5" />
            Share
          </button>
        )}
      </div>
    </div>
  );
}