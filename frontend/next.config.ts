import type { NextConfig } from "next";
import path from "node:path";

const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/projects/new", destination: "/new-project", permanent: true },
    ];
  },
  turbopack: {
    root: projectRoot,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@base-ui/react"],
    webpackMemoryOptimizations: true,
  },
};

export default nextConfig;
