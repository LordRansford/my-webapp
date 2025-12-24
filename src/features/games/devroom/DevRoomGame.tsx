"use client";

// Incremental wrapper. Dev Room is currently implemented as a scene under the existing canvas engine.
// The actual unlock mechanisms live in src/components/Footer.tsx and src/games/progress.ts.

import GameShellClient from "@/app/games/[slug]/GameShell.client";

export default function DevRoomGame() {
  return <GameShellClient slug="dev-room" />;
}


