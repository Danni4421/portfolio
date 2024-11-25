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
    cacheLife: {
      default: {
        stale: 60,
      },
    },
  },

  images: {
    domains: ["ik.imagekit.io", "secure.gravatar.com"],
  },
};

export default nextConfig;
