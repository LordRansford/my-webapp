/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security headers needed for WebAssembly tools like Pyodide/Runno
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
    ];
  },

  // Allow Next.js image optimisation for media from your WordPress site
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ransfordsnotes.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;