import type { NextConfig } from "next";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://api.hriscmlabs.my.id/api";

const nextConfig: NextConfig = {
  // async rewrites() {
  //     return [
  //         {
  //             source: "/api/:path*",
  //             destination: `${apiBaseUrl}/:path*`, 
  //         },
  //     ];
  // },
  
  experimental: {
    // serverActions: [],
  },
  // serverActions: {
  //   bodySizeLimit: '100mb', // atau sesuai kebutuhan, contoh 10mb
  // },
};

module.exports = nextConfig;
module.exports = {
  output: 'standalone'
}