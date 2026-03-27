import type { NextConfig } from "next";

// When building for GitHub Pages (GITHUB_ACTIONS=true), produce a static export
// with the correct basePath. Local `npm run dev` works normally at localhost:3000.
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true'

const nextConfig: NextConfig = {
  output: isGitHubPages ? 'export' : undefined,
  basePath: isGitHubPages ? '/Claude' : '',
  images: { unoptimized: true },
  // Disable server-only features in static builds
  ...(isGitHubPages && { trailingSlash: true }),
}

export default nextConfig;
