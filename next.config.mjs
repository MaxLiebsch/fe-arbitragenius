/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/app',
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
