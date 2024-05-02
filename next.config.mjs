/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/app',
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
