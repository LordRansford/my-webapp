/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Silence Next.js 16 Turbopack warning when a webpack config is present.
  turbopack: {},

  webpack: (config, { dev }) => {
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
              "script-src 'self' 'unsafe-inline' https:",
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
  },
};

export default nextConfig;
