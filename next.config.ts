import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Use an absolute path to silence root inference warnings
    root: "/Users/sravanpolu/Projects/MarketBiasTerminal",
  },
};

export default nextConfig;
