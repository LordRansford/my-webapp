export function evaluateDevRoomUnlock(state) {
  return Boolean(state.playerOneUnlocked) && Number(state.dailyChallengesCompleted || 0) >= 7 && Boolean(state.nearPerfectRun);
}


