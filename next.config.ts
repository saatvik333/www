import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  // React Compiler for automatic memoization
  reactCompiler: true,
  
  // Turbopack configuration (faster than webpack)
  turbopack: {},
  
  // Experimental features for maximum speed
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['framer-motion', 'react-icons'],
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year cache
  },
  
  // Headers for caching
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Compress responses
  compress: true,
  
  // Power by header off for slightly smaller responses
  poweredByHeader: false,
};

const pwaConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

export default pwaConfig(nextConfig);
