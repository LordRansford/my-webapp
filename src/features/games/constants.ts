import type { GameId } from "./types";

export const GAMES_HUB_BANNER = "Dedicated to Charis Chung Amponsah. May your thumbs never tire.";
export const GAME_LOADING_DEDICATION = "For Charis, who actually knows how to win.";

export const LOADING_LINES = [
  "Charis says: one more run.",
  "Charis commissioned this pain. Good luck.",
  "Player One believes in you. Probably.",
  "Built with love. Balanced with suffering.",
] as const;

export const UI_COPY = {
  offlineReady: "Offline ready",
  offlinePreparing: "Preparing offline",
  backToHub: "Back to Games",
  mute: "Mute",
  unmute: "Unmute",
  reduceMotionOn: "Motion: reduced",
  reduceMotionOff: "Motion: normal",
  howToPlayTitle: "How to play",
  skillReviewTitle: "Skill review",
  trainsPrefix: "This game trains:",
  expand: "Read more",
  collapse: "Hide",
  dailyTitle: "Daily Challenge",
  dailySubtitle: "One run. Same seed for everyone. Offline-safe.",
  practiceLabel: "Practice mode (no rewards)",
  attemptUsed: "Attempt used",
  start: "Start",
  begin: "Begin",
  notFoundTitle: "Game not found",
  notFoundBody: "This game route does not exist yet.",
  devRoomLockedTitle: "The Dev Room (locked)",
  devRoomLockedBody: "Keep going. You are not there yet.",
  playerOneLockedTitle: "Player One (locked)",
  playerOneLockedBody: "Unlock the Charis Trophy to reveal this.",
} as const;

export const GAME_META: Record<
  GameId,
  {
    displayName: string;
    subtitle: string;
    conceptTitle: string;
    conceptShort: string;
    conceptLong: string;
    conceptExample: string;
  }
> = {
  "pulse-runner": {
    displayName: "Pulse Runner",
    subtitle: "Warm up timing and rhythm with simple dodges.",
    conceptTitle: "Focus under fatigue",
    conceptShort: "Stay calm when tempo rises.",
    conceptLong:
      "As pressure increases, the brain tends to rush inputs. The skill is staying steady and choosing fewer, cleaner moves that keep you safe.",
    conceptExample: "In ops work, slowing down after an incident helps you avoid cascading mistakes.",
  },
  "skyline-drift": {
    displayName: "Skyline Drift",
    subtitle: "Smooth turns and clean lines. Keep momentum.",
    conceptTitle: "Load management",
    conceptShort: "Small adjustments beat big corrections.",
    conceptLong:
      "Good control comes from tiny, consistent changes rather than panic swings. You are learning to manage momentum and attention like system load.",
    conceptExample: "In a system under load, gradual backoff often beats emergency hard limits.",
  },
  "vault-circuit": {
    displayName: "Vault Circuit",
    subtitle: "Tighter windows and faster patterns.",
    conceptTitle: "Signal vs noise",
    conceptShort: "Spot the cues that matter.",
    conceptLong:
      "As patterns get busy, not every stimulus is important. The goal is picking the few cues that predict danger and ignoring the rest.",
    conceptExample: "In security triage, one strong indicator beats a dozen weak alerts.",
  },
  daily: {
    displayName: "Daily Challenge",
    subtitle: "One run. Same seed for everyone. Offline-safe.",
    conceptTitle: "Feedback loops",
    conceptShort: "Improve with tight iteration, not grinding.",
    conceptLong:
      "A deterministic daily seed lets you iterate. Notice what failed, adjust one habit, and test again tomorrow. Improvement comes from loops, not volume.",
    conceptExample: "In engineering, short deploy-measure-adjust cycles beat big rewrites.",
  },
  "player-one": {
    displayName: "Player One",
    subtitle: "No instructions. You are ready.",
    conceptTitle: "Systems thinking",
    conceptShort: "Learn the system, not the trick.",
    conceptLong:
      "This mode is about understanding what changes, what stays stable, and how your inputs shape the next state. Mastery is pattern plus restraint.",
    conceptExample: "In architecture, understanding constraints beats memorizing templates.",
  },
  "dev-room": {
    displayName: "The Dev Room",
    subtitle: "No UI. No hints. Just you.",
    conceptTitle: "Pattern recognition",
    conceptShort: "Watch what your habits trigger.",
    conceptLong:
      "There is no instruction because the environment is the lesson. Observe what repeats, what escalates, and what your own habits cause.",
    conceptExample: "In debugging, the pattern is often in what you keep doing without noticing.",
  },
};


