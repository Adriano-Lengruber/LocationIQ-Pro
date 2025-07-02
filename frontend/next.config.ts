import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignorar erros de linting durante o build para demo
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorar erros de TypeScript durante o build para demo
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
