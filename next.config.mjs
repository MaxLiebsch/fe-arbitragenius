/** @type {import('next').NextConfig} */
import webpack from 'webpack'

const nextConfig = {
  basePath: "/app",
  experimental: {
    serverComponentsExternalPackages: ['node-appwrite'],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack(config) {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^isomorphic-form-data$/,
        `${config.context}/form-data-mock.js`
      )
    );
    return config;
  },
};

export default nextConfig;
