/**
 * Draft Duel Card Battler
 * 
 * Strategic card game with drafting mechanics
 * Supports solo and multiplayer (async)
 */

"use client";

import React, { useState, useCallback, useMemo } from "react";
import GameShell from "@/lib/games/framework/GameShell";
import { StateManager } from "@/lib/games/framework/StateManager";
import { DifficultyEngine } from "@/lib/games/framework/DifficultyEngine";
import { ExplainabilityEngine } from "@/lib/games/framework/ExplainabilityEngine";
import { InputLayer } from "@/lib/games/framework/InputLayer";
import { useGameAnalytics } from "@/lib/games/framework/useGameAnalytics";
import type { GameConfig, GameStatus, GameAnalysis } from "@/lib/games/framework/types";

const GAME_CONFIG: GameConfig = {
  id: "draft-duel",
  title: "Draft Duel Card Battler",
  description: "Strategic card game with drafting mechanics. Build your deck and battle opponents.",
  category: "card",
  modes: ["solo", "multiplayer"],
  supportsMultiplayer: true,
  minPlayers: 2,
  maxPlayers: 2,
  estimatedMinutes: 20,
  tutorialAvailable: true,
};

interface Card {
  id: string;
  name: string;
  cost: number;
  attack: number;
  defense: number;
  ability?: string;
}

interface Deck {
  cards: Card[];
}

const CARD_POOL: Card[] = [
  { id: "1", name: "Warrior", cost: 2, attack: 3, defense: 2 },
  { id: "2", name: "Mage", cost: 3, attack: 4, defense: 1 },
  { id: "3", name: "Guardian", cost: 2, attack: 1, defense: 4 },
  { id: "4", name: "Assassin", cost: 4, attack: 5, defense: 1 },
  { id: "5", name: "Paladin", cost: 5, attack: 3, defense: 4 },
];

export default function DraftDuel() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [mode, setMode] = useState<"solo" | "multiplayer">("solo");
  const [playerDeck, setPlayerDeck] = useState<Deck>({ cards: [] });
  const [opponentDeck, setOpponentDeck] = useState<Deck>({ cards: [] });
  const [playerHealth, setPlayerHealth] = useState(20);
  const [opponentHealth, setOpponentHealth] = useState(20);
  const [playerMana, setPlayerMana] = useState(1);
  const [opponentMana, setOpponentMana] = useState(1);
  const [turn, setTurn] = useState(1);
  const [analysis, setAnalysis] = useState<GameAnalysis | null>(null);

  const seed = useMemo(() => Math.floor(Math.random() * 1000000), []);
  const stateManager = useMemo(() => new StateManager({ status: "idle" }, seed), [seed]);
  const difficultyEngine = useMemo(
    () =>
      new DifficultyEngine({
        initial: 0.3,
        target: 0.7,
        rampTime: 1200000, // 20 minutes
        adaptive: true,
      }),
    []
  );
  const explainabilityEngine = useMemo(() => new ExplainabilityEngine(), []);

  // Analytics
  useGameAnalytics(GAME_CONFIG.id, status, stateManager.getState());

  const draftCard = useCallback(
    (card: Card) => {
      if (playerDeck.cards.length < 5) {
        setPlayerDeck((deck) => ({ cards: [...deck.cards, card] }));
        stateManager.recordMove("draft", { cardId: card.id });
      }
    },
    [playerDeck, stateManager]
  );

  const playCard = useCallback(
    (cardIndex: number) => {
      if (status !== "playing") return;
      const card = playerDeck.cards[cardIndex];
      if (!card || card.cost > playerMana) return;

      setPlayerMana((m) => m - card.cost);
      setOpponentHealth((h) => Math.max(0, h - card.attack));
      setPlayerDeck((deck) => ({
        cards: deck.cards.filter((_, i) => i !== cardIndex),
      }));

      stateManager.recordMove("play-card", { cardId: card.id, damage: card.attack });

      // Opponent turn (AI in solo mode)
      if (mode === "solo") {
        setTimeout(() => {
          const aiCard = opponentDeck.cards[0];
          if (aiCard && aiCard.cost <= opponentMana) {
            setOpponentMana((m) => m - aiCard.cost);
            setPlayerHealth((h) => Math.max(0, h - aiCard.attack));
            setOpponentDeck((deck) => ({ cards: deck.cards.slice(1) }));
            stateManager.recordMove("opponent-play", { cardId: aiCard.id });
          }
          setTurn((t) => t + 1);
          setPlayerMana((m) => Math.min(10, m + 1));
          setOpponentMana((m) => Math.min(10, m + 1));
        }, 1000);
      }

      // Check win condition
      if (opponentHealth <= 0) {
        setStatus("finished");
        stateManager.updateState({ status: "finished", score: 100 });
        const gameAnalysis = explainabilityEngine.analyzeGame(
          stateManager.getState(),
          { id: GAME_CONFIG.id, type: "card" }
        );
        setAnalysis(gameAnalysis);
      } else if (playerHealth <= 0) {
        setStatus("finished");
        stateManager.updateState({ status: "finished", score: 0 });
        const gameAnalysis = explainabilityEngine.analyzeGame(
          stateManager.getState(),
          { id: GAME_CONFIG.id, type: "card" }
        );
        setAnalysis(gameAnalysis);
      }
    },
    [status, playerDeck, playerMana, opponentHealth, opponentDeck, opponentMana, mode, stateManager, explainabilityEngine]
  );

  const handleStart = useCallback(() => {
    setStatus("playing");
    setPlayerHealth(20);
    setOpponentHealth(20);
    setPlayerMana(1);
    setOpponentMana(1);
    setTurn(1);
    // Draft initial cards
    const availableCards = [...CARD_POOL];
    const playerCards: Card[] = [];
    const opponentCards: Card[] = [];
    const rng = () => stateManager.random();

    for (let i = 0; i < 5; i++) {
      const playerIdx = Math.floor(rng() * availableCards.length);
      playerCards.push(availableCards[playerIdx]);
      availableCards.splice(playerIdx, 1);

      const opponentIdx = Math.floor(rng() * availableCards.length);
      opponentCards.push(availableCards[opponentIdx]);
      availableCards.splice(opponentIdx, 1);
    }

    setPlayerDeck({ cards: playerCards });
    setOpponentDeck({ cards: opponentCards });
    stateManager.updateState({ status: "playing", timestamp: Date.now() });
    stateManager.recordMove("start", {});
  }, [stateManager]);

  const handleReset = useCallback(() => {
    setStatus("idle");
    setPlayerDeck({ cards: [] });
    setOpponentDeck({ cards: [] });
    setPlayerHealth(20);
    setOpponentHealth(20);
    setPlayerMana(1);
    setOpponentMana(1);
    setTurn(1);
    setAnalysis(null);
    stateManager.updateState({ status: "idle", moves: [], score: 0 });
    difficultyEngine.reset();
  }, [stateManager, difficultyEngine]);

  return (
    <GameShell
      config={GAME_CONFIG}
      status={status}
      onStart={status === "idle" ? handleStart : undefined}
      onReset={handleReset}
      rightPanel={
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Player</h3>
            <div className="text-lg font-bold text-slate-900">Health: {playerHealth}</div>
            <div className="text-sm text-slate-600">Mana: {playerMana}/10</div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Opponent</h3>
            <div className="text-lg font-bold text-slate-900">Health: {opponentHealth}</div>
            <div className="text-sm text-slate-600">Mana: {opponentMana}/10</div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Turn</h3>
            <div className="text-sm text-slate-700">Turn {turn}</div>
          </div>
        </div>
      }
    >
      {status === "idle" && (
        <div className="text-center py-12">
          <p className="text-slate-600 mb-4">Ready to start drafting?</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setMode("solo")}
              className={`px-4 py-2 rounded-lg ${
                mode === "solo" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
              }`}
              type="button"
            >
              Solo vs AI
            </button>
            <button
              onClick={() => setMode("multiplayer")}
              className={`px-4 py-2 rounded-lg ${
                mode === "multiplayer" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
              }`}
              type="button"
            >
              Multiplayer (Coming Soon)
            </button>
          </div>
        </div>
      )}

      {status === "playing" && (
        <div className="space-y-6" role="region" aria-label="Game play area">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Your Hand</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" role="group" aria-label="Your hand cards">
              {playerDeck.cards.map((card, index) => (
                <button
                  key={card.id}
                  onClick={() => playCard(index)}
                  disabled={card.cost > playerMana}
                  className={`rounded-lg border-2 p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    card.cost > playerMana
                      ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                      : "bg-white border-blue-300 hover:bg-blue-50 cursor-pointer"
                  }`}
                  type="button"
                  aria-label={`Play ${card.name}, cost ${card.cost} mana, attack ${card.attack}, defense ${card.defense}${card.cost > playerMana ? ". Not enough mana" : ""}`}
                  aria-disabled={card.cost > playerMana}
                >
                  <div className="font-semibold text-slate-900">{card.name}</div>
                  <div className="text-sm text-slate-600 mt-1">
                    Cost: {card.cost} | Attack: {card.attack} | Defense: {card.defense}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {status === "finished" && analysis && (
        <div className="mt-6 space-y-4">
          <div className="text-center py-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {playerHealth > 0 ? "Victory!" : "Defeat"}
            </h2>
          </div>
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-blue-900">{analysis.summary}</p>
          </div>
        </div>
      )}
    </GameShell>
  );
}
