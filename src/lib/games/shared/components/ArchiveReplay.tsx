/**
 * Archive Replay Component
 * 
 * Handles replaying archived game runs using challenge codes.
 */

"use client";

import React, { useCallback } from "react";
import { Play, X } from "lucide-react";
import { loadChallengeFromCode } from "../challengeCodes/challengeCodeLoader";
import type { ArchivedRun } from "./ArchiveBrowser";

interface ArchiveReplayProps {
  archivedRun: ArchivedRun;
  onReplay: (challengeCode: string, seed: number) => void;
  onCancel?: () => void;
}

export function ArchiveReplay({
  archivedRun,
  onReplay,
  onCancel,
}: ArchiveReplayProps) {
  const handleReplay = useCallback(() => {
    if (!archivedRun.challengeCode) {
      // If no challenge code, we can't replay
      alert("This archived run doesn't have a challenge code and cannot be replayed.");
      return;
    }

    const challengeData = loadChallengeFromCode(archivedRun.challengeCode);
    if (!challengeData) {
      alert("Could not load challenge data. The challenge may no longer be available.");
      return;
    }

    onReplay(archivedRun.challengeCode, challengeData.seed);
  }, [archivedRun, onReplay]);

  if (!archivedRun.challengeCode) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-sm text-yellow-800">
          This archived run cannot be replayed because it doesn't have a challenge code.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-blue-900">Replay Archived Run</h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-1 hover:bg-blue-100 rounded transition-colors"
            aria-label="Cancel"
          >
            <X className="h-4 w-4 text-blue-600" />
          </button>
        )}
      </div>
      <p className="text-sm text-blue-800 mb-4">
        Replay this challenge using challenge code: <code className="font-mono text-xs bg-blue-100 px-1 rounded">{archivedRun.challengeCode}</code>
      </p>
      <button
        onClick={handleReplay}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Play className="h-4 w-4" />
        Start Replay
      </button>
    </div>
  );
}
