/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    turbo: true,
    serverActions: true,
  },
};

module.exports = nextConfig;
