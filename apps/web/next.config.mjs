/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@claimit/core"],
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
