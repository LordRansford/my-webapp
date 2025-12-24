"use client";

// Thin wrapper for incremental migration. The current implementation lives in the App Router route.
// This exists to provide a stable import path under src/features/games/ui/*.

import GameShellClient from "@/app/games/[slug]/GameShell.client";

export default GameShellClient;


