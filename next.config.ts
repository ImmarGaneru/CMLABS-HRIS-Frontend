/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  
  experimental: {
    // serverActions: [],
  },
  // serverActions: {
  //   bodySizeLimit: '100mb', // atau sesuai kebutuhan, contoh 10mb
  // },
};


module.exports = nextConfig;
