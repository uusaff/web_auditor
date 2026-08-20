import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['firebase-admin', 'playwright', 'cheerio', '@upstash/redis', '@upstash/ratelimit', 'openai'],
};

export default nextConfig;
