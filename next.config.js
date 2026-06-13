/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Auth0 SDK uses native <a> tags for /api/auth/* routes (not pages).
    // Next.js lint incorrectly flags these; we handle this via inline disables.
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
