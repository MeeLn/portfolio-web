import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  experimental: { useTypeScriptCli: false },
};
export default nextConfig;
