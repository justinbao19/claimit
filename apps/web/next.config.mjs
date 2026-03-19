/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@claimit/core"],
  serverExternalPackages: ["pdf-parse", "mammoth", "playwright"],
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
