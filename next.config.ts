import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  transpilePackages: ['firebase-admin', 'jwks-rsa', 'jose'],
  serverExternalPackages: ['playwright-core', 'cheerio', '@upstash/redis', '@upstash/ratelimit', 'openai'],
};
export default nextConfig;
