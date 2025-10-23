import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove turbopack config for production builds
  // Turbopack is only used in development
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Fix the lockfile warning by specifying the correct root
  outputFileTracingRoot: '/Users/sravanpolu/Projects/MarketBiasTerminal'
};

export default nextConfig;
