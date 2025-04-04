import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/',
          outputPath: 'static/',
        },
      },
    });
    return config;
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
      bodySizeLimit: '10mb'
    }
  },
  images: {
    domains: ['teck.s3.us-east-1.amazonaws.com'],
  },
  // API configuration is handled through middleware or route handlers in Next.js 13+
};

export default nextConfig;
