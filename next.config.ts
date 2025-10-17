import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove turbopack config for production builds
  // Turbopack is only used in development
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
