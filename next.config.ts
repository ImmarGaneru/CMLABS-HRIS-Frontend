import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
      return [
          {
              source: "/api/:path*",
              destination: "http://localhost:8000/api/:path*",
          },
      ];
  },
  
  experimental: {
    // serverActions: [],
  },
  // serverActions: {
  //   bodySizeLimit: '100mb', // atau sesuai kebutuhan, contoh 10mb
  // },
};

module.exports = nextConfig;
module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone'
}