import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse and pdfjs-dist use a worker that must be resolved by Node.js at
  // runtime — bundling them rewrites internal paths and breaks the worker loader.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
};

export default nextConfig;
