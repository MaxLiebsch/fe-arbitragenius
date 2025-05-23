import { withSentryConfig } from "@sentry/nextjs";
/** @type {import('next').NextConfig} */
import webpack from "webpack";
import fs from "fs";
import path from "path";

// Read and parse package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")
);

const version = packageJson.version;

const isVercel = process.env.VERCEL === "true";

const nextConfig = {
  basePath: "/app",
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_VERSION: version,
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "staging.arbispotter.com",
        "www.arbispotter.com",
        "arbispotter-staging-app.vercel.app",
        "arbispotter-app.vercel.app",
      ]
    },
    serverComponentsExternalPackages: ["node-appwrite"],
  },
  transpilePackages: ["jotai-devtools"],
  images: {
    unoptimized: isVercel ? false : true,
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

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "dipmaxtech",
  project: "arbispotter",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
