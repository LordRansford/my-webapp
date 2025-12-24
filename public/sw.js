/* Offline-first service worker for /games routes and static assets.
   Safety constraints:
   - Never cache /api
   - Never cache non-GET
   - Avoid caching auth/session pages
*/

const VERSION = "rn-games-sw-v3";
const STATIC_CACHE = `${VERSION}:static`;
const PAGES_CACHE = `${VERSION}:pages`;

const PRECACHE_URLS = ["/games", "/games/daily", "/games/dev-room", "/games/offline", "/games/pulse-runner", "/games/skyline-drift", "/games/vault-circuit"];

function isApi(url) {
  return url.pathname.startsWith("/api/");
}

function isAuthish(url) {
  return url.pathname.startsWith("/signin") || url.pathname.startsWith("/account") || url.pathname.startsWith("/admin");
}

function isGameRoute(url) {
  return url.pathname === "/games" || url.pathname.startsWith("/games/");
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PAGES_CACHE);
      await cache.addAll(PRECACHE_URLS);
      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("rn-games-sw-") && !k.startsWith(VERSION))
          .map((k) => caches.delete(k))
      );
      self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (isApi(url)) return;
  if (isAuthish(url)) return;

  // Cache hashed build assets and images used by games.
  const isStaticAsset =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".gif") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".woff2");

  if (isStaticAsset) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE);
        const cached = await cache.match(req);
        if (cached) return cached;
        const res = await fetch(req);
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      })()
    );
    return;
  }

  // Navigations for /games/*: network-first, fallback to cached page, then offline page.
  const isNav = req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");
  if (isNav && isGameRoute(url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(PAGES_CACHE);
        try {
          const fresh = await fetch(req);
          if (fresh && fresh.ok) cache.put(req, fresh.clone());
          return fresh;
        } catch {
          const cached = await cache.match(req);
          if (cached) return cached;
          const fallback = await cache.match("/games/offline");
          return fallback || new Response("Offline", { status: 503, headers: { "content-type": "text/plain" } });
        }
      })()
    );
    return;
  }
});


