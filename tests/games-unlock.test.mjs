import test from "node:test";
import assert from "node:assert/strict";
import { evaluateDevRoomUnlock } from "../src/features/games/unlock.core.mjs";

test("evaluateDevRoomUnlock: requires all three conditions", () => {
  assert.equal(
    evaluateDevRoomUnlock({ playerOneUnlocked: false, dailyChallengesCompleted: 7, nearPerfectRun: true, devRoomUnlocked: false }),
    false
  );
  assert.equal(
    evaluateDevRoomUnlock({ playerOneUnlocked: true, dailyChallengesCompleted: 6, nearPerfectRun: true, devRoomUnlocked: false }),
    false
  );
  assert.equal(
    evaluateDevRoomUnlock({ playerOneUnlocked: true, dailyChallengesCompleted: 7, nearPerfectRun: false, devRoomUnlocked: false }),
    false
  );
  assert.equal(
    evaluateDevRoomUnlock({ playerOneUnlocked: true, dailyChallengesCompleted: 7, nearPerfectRun: true, devRoomUnlocked: false }),
    true
  );
});


