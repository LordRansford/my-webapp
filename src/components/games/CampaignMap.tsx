"use client";

import { useMemo } from "react";
import type { MissionId } from "@/games/missions/types";
import { MISSION_DEFINITIONS } from "@/games/missions/definitions";
import { createCampaignProgressStore } from "@/games/missions/progress";
import { PersistStore } from "@/games/engine/persist";
import { Lock, Star, CheckCircle2 } from "lucide-react";

interface CampaignMapProps {
  onSelectMission: (missionId: MissionId) => void;
  store: PersistStore;
}

export function CampaignMap({ onSelectMission, store }: CampaignMapProps) {
  const progressStore = useMemo(() => createCampaignProgressStore(store), [store]);
  const progress = progressStore.get();

  const getMissionStatus = (missionId: MissionId) => {
    const missionProgress = progress.missions[missionId];
    if (!missionProgress) return "locked";
    return missionProgress.status;
  };

  const getMissionStars = (missionId: MissionId) => {
    const missionProgress = progress.missions[missionId];
    return missionProgress?.stars ?? 0;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-slate-900 mb-2">Campaign: Charis&apos;s Challenge</h2>
      <p className="text-slate-600 mb-8">12 missions dedicated to Charis Chung Amponsah</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {MISSION_DEFINITIONS.map((mission) => {
          const status = getMissionStatus(mission.id);
          const stars = getMissionStars(mission.id);
          const isLocked = status === "locked";
          const isCompleted = status === "completed";
          const isAvailable = status === "available" || status === "in-progress";

          return (
            <button
              key={mission.id}
              onClick={() => !isLocked && onSelectMission(mission.id)}
              disabled={isLocked}
              className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                isLocked
                  ? "border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed"
                  : isCompleted
                    ? "border-green-500 bg-green-50 hover:border-green-600 hover:shadow-lg"
                    : isAvailable
                      ? "border-blue-500 bg-blue-50 hover:border-blue-600 hover:shadow-lg"
                      : "border-slate-300 bg-white hover:border-slate-400"
              }`}
            >
              {isLocked && (
                <div className="absolute top-4 right-4">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
              )}

              {isCompleted && (
                <div className="absolute top-4 right-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              )}

              <div className="mb-2">
                <div className="text-sm font-semibold text-slate-500">Mission {mission.id}</div>
                <div className="text-lg font-bold text-slate-900">{mission.title}</div>
              </div>

              <p className="text-sm text-slate-600 mb-4">{mission.description}</p>

              {stars > 0 && (
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= stars ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
              )}

              <div className="text-xs text-slate-500">
                ~{Math.round(mission.durationMs / 1000 / 60)} min
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-slate-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-700">Total Progress</div>
            <div className="text-2xl font-bold text-slate-900">
              {progress.totalStars} / {MISSION_DEFINITIONS.length * 3} Stars
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-700">Total Points</div>
            <div className="text-2xl font-bold text-slate-900">{progress.totalPoints.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

