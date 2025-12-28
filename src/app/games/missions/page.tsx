"use client";

import { useState, useMemo } from "react";
import { CampaignMap } from "@/components/games/CampaignMap";
import { PreGameSelection } from "@/components/games/PreGameSelection";
import { MissionBriefing } from "@/components/games/MissionBriefing";
import { FullscreenGameModal } from "@/components/games/FullscreenGameModal";
import { MissionGameShell } from "@/components/games/MissionGameShell";
import type { MissionId } from "@/games/missions/types";
import type { PlayerChoice } from "@/games/characters/types";
import { getMission } from "@/games/missions/definitions";
import { PersistStore } from "@/games/engine/persist";
import { CharisVoice } from "@/games/characters/voice";

export default function MissionsPage() {
  const store = useMemo(() => new PersistStore({ prefix: "rn_games", version: "v1" }), []);
  const [selectedMission, setSelectedMission] = useState<MissionId | null>(null);
  const [playerChoice, setPlayerChoice] = useState<PlayerChoice | null>(null);
  const [showBriefing, setShowBriefing] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [charisVoice] = useState(() => new CharisVoice());

  const handleSelectMission = (missionId: MissionId) => {
    setSelectedMission(missionId);
    setPlayerChoice(null);
    setShowBriefing(false);
    setGameStarted(false);
  };

  const handlePlayerChoice = (choice: PlayerChoice) => {
    setPlayerChoice(choice);
    setShowBriefing(true);
  };

  const handleStartGame = () => {
    setShowBriefing(false);
    setGameStarted(true);
  };

  const handleGameComplete = (
    won: boolean,
    stars: 0 | 1 | 2 | 3,
    objectivesCompleted: string[],
    sideQuestsCompleted: string[],
    timeMs: number
  ) => {
    // Progress will be saved by MissionGameShell
    setGameStarted(false);
    setSelectedMission(null);
    setPlayerChoice(null);
  };

  const handleCancel = () => {
    setSelectedMission(null);
    setPlayerChoice(null);
    setShowBriefing(false);
    setGameStarted(false);
  };

  if (gameStarted && selectedMission && playerChoice) {
    return (
      <FullscreenGameModal isOpen={true} onClose={handleCancel} title={`Mission ${selectedMission}`}>
        <MissionGameShell
          missionId={selectedMission}
          playerChoice={playerChoice}
          onComplete={handleGameComplete}
          onCancel={handleCancel}
        />
      </FullscreenGameModal>
    );
  }

  if (showBriefing && selectedMission) {
    const mission = getMission(selectedMission);
    if (mission) {
      return (
        <MissionBriefing
          mission={mission}
          onStart={handleStartGame}
          onSkip={handleStartGame}
          charisVoice={charisVoice}
        />
      );
    }
  }

  if (selectedMission && !playerChoice) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="container mx-auto px-4">
          <PreGameSelection onStart={handlePlayerChoice} onCancel={handleCancel} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <CampaignMap onSelectMission={handleSelectMission} store={store} />
      </div>
    </div>
  );
}

