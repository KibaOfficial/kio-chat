// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { NextResponse } from "next/server";

export const revalidate = 300; // Revalidate every 5 minutes

interface GitHubRepoResponse {
  stargazers_count: number;
  language: string;
  updated_at: string;
}

interface GitHubContentsResponse {
  content: string;
  encoding: string;
}

interface GitHubStats {
  stars: number;
  version: string;
  language: string;
  lastUpdated: string;
}

export async function GET() {
  try {
    // 1. Get repository stats
    const repoResponse = await fetch('https://api.github.com/repos/KibaOfficial/kio-chat');

    if (!repoResponse.ok) {
      throw new Error('Failed to fetch repository data');
    }

    const repoData: GitHubRepoResponse = await repoResponse.json();

    // 2. Get version from package.json
    const packageResponse = await fetch('https://api.github.com/repos/KibaOfficial/kio-chat/contents/package.json');

    if (!packageResponse.ok) {
      throw new Error('Failed to fetch package.json');
    }

    const packageData: GitHubContentsResponse = await packageResponse.json();

    // Decode base64 content
    const packageJson = JSON.parse(atob(packageData.content));

    const stats: GitHubStats = {
      stars: repoData.stargazers_count,
      version: packageJson.version,
      language: repoData.language || 'Typescript',
      lastUpdated: repoData.updated_at
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('[GitHub API] Error fetching data:', error);

    // Fallback data
    const fallbackStats: GitHubStats = {
      stars: 0,
      version: '1.0.0',
      language: 'Typescript',
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(fallbackStats, { status: 500 });
  }
}