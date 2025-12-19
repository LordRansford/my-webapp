// #region agent log
fetch("http://127.0.0.1:7242/ingest/912cc721-944f-4c31-a38a-92b015cfe804", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    sessionId: "debug-session",
    runId: "pre-fix",
    hypothesisId: "H1",
    location: "next.config.mjs:entry",
    message: "next.config loaded",
    data: {
      nodeEnv: process.env.NODE_ENV || "unknown",
      vercel: !!process.env.VERCEL,
      stripeSecretPresent: !!process.env.STRIPE_SECRET_KEY,
      stripePublishablePresent: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    },
    timestamp: Date.now(),
  }),
}).catch(() => {});
// #endregion

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Silence Next.js 16 Turbopack warning when a webpack config is present.
  turbopack: {},

  webpack: (config, { dev }) => {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/912cc721-944f-4c31-a38a-92b015cfe804", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: "H2",
        location: "next.config.mjs:webpack",
        message: "webpack config invoked",
        data: {
          dev,
          cacheDisabled: dev ? false : config.cache === false,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      path: false,
    };

    // Windows watchpack + filesystem cache can be flaky and crash dev server.
    // Disable webpack filesystem cache in dev to avoid missing pack.gz errors.
    if (dev) {
      config.cache = false;
      config.watchOptions = {
        ...(config.watchOptions || {}),
        // Ignore Windows system files if a parent directory ever gets watched.
        ignored: [
          "**/DumpStack.log.tmp",
          "**/pagefile.sys",
          "**/swapfile.sys",
          "**/hiberfil.sys",
        ],
      };
    }
    return config;
  },

  async headers() {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/912cc721-944f-4c31-a38a-92b015cfe804", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: "H3",
        location: "next.config.mjs:headers",
        message: "headers config invoked",
        data: {
          headerCount: 1,
          coop: "same-origin",
          coep: "require-corp",
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // {
          //   key: "Content-Security-Policy",
          //   value:
          //     "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'",
          // },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ransfordsnotes.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
