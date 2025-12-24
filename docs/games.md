## Games (offline-first PWA) and shared Canvas engine

### What this adds
- Offline-first PWA support for **`/games`** routes
- A small reusable Canvas 2D engine under `src/games/engine`
- A demo scene used by the three placeholder games (same engine)

### Files
- PWA
  - `public/manifest.webmanifest`
  - `public/sw.js`
  - `src/app/games/SwStatus.client.tsx`
  - `src/app/games/offline/page.tsx`
- Engine
  - `src/games/engine/types.ts`
  - `src/games/engine/canvasView.ts`
  - `src/games/engine/loop.ts`
  - `src/games/engine/input.ts`
  - `src/games/engine/audio.ts`
  - `src/games/engine/persist.ts`
  - `src/games/engine/ui.ts`
- Game routes
  - `src/app/games/page.tsx`
  - `src/app/games/[slug]/page.tsx`
  - `src/app/games/[slug]/GameShell.client.tsx`
  - `src/games/scenes/demoScene.ts`

### Offline caching rules (safety)
The service worker:
- Caches **GET** requests only
- Never caches `/api/*`
- Never caches auth/admin/account pages
- Uses:
  - **Cache-first** for build assets and static files
  - **Network-first** for `/games/*` navigations with fallback to cached pages
  - If a game route was never loaded before, it shows `/games/offline`

### How to test offline mode
1. Run `npm run dev`
2. Visit:
   - `/games`
   - `/games/pulse-runner`
3. Confirm the hub shows **Offline ready** after SW activates.
4. In DevTools:
   - Application → Service Workers: confirm `sw.js` is active
   - Network → set **Offline**
5. Reload:
   - `/games` should still load
   - `/games/pulse-runner` should still load and run

### How to add a new game scene
1. Create a scene file implementing `GameScene`:

```ts
import type { GameScene } from "@/games/engine/types";
export function createMyScene(): GameScene { /* init/update/render/dispose */ }
```

2. In `GameShell.client.tsx`, swap `createDemoScene()` for your scene factory based on `slug`.

### Input support
- Keyboard: arrows + WASD
- Touch: swipe gestures (impulse movement)


