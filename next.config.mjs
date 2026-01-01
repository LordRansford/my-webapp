import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Silence Next.js 16 Turbopack warning when a webpack config is present.
  turbopack: {},

  webpack: (config, { dev, isServer }) => {
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      path: false,
    };

    // Mark optional dependencies as external to prevent build-time errors
    // These will be resolved at runtime if available
    if (!config.externals) {
      config.externals = [];
    }
    // Add function-based externals for optional dependencies
    config.externals.push(({ request }, callback) => {
      if (request === '@sentry/nextjs' || request === '@aws-sdk/client-s3') {
        // Mark as external - will be resolved at runtime
        return callback(null, `commonjs ${request}`);
      }
      callback();
    });

    // Windows watchpack + filesystem cache can be flaky and crash dev server.
    // Disable webpack filesystem cache in dev to avoid missing pack.gz errors.
    if (dev) {
      config.cache = false;
      config.watchOptions = {
        ...(config.watchOptions || {}),
        // Ignore Windows system files if a parent directory ever gets watched.
        ignored: [
          "**/DumpStack.log*",
          "**/pagefile.sys",
          "**/swapfile.sys",
          "**/hiberfil.sys",
          path.resolve("C:/DumpStack.log.tmp"),
          path.resolve("C:/pagefile.sys"),
          path.resolve("C:/swapfile.sys"),
          path.resolve("C:/hiberfil.sys"),
        ],
      };
    }
    return config;
  },

  async headers() {
    const isProd = process.env.NODE_ENV === "production";
    // NOTE: `next-mdx-remote` hydration uses `new Function(...)` in the browser, which requires 'unsafe-eval'.
    // Without this, MDX-driven pages (courses/notes/posts) will crash client-side under a strict CSP.
    const scriptSrc = "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:";
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "frame-ancestors 'self'",
              "form-action 'self'",
              "img-src 'self' data: https:",
              "font-src 'self' data: https:",
              "style-src 'self' 'unsafe-inline'",
              scriptSrc,
              "connect-src 'self' https:",
              "upgrade-insecure-requests",
            ].join("; "),
          },
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
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
