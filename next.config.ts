// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ← これが重要
  },
}

module.exports = nextConfig

module.exports = {
  webpack(config:any) {
    config.module.rules.push({
      test: /\.json$/,
      type: 'json'
    });
    return config;
  }
}