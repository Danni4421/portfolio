import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    APP_ENV: process.env.APP_ENV || "development",
  },

  // Experimental
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: "./empty-module.ts",
      },
    },
  },
};

export default nextConfig;
