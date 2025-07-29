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

// Fallback data für Build-Zeit und Fehler
// const getFallbackStats = (): GitHubStats => ({
//   stars: 0,
//   version: '1.0.0',
//   language: 'TypeScript',
//   lastUpdated: new Date().toISOString()
// });

export async function GET() {
  try {

    // 1. Get repository stats with timeout and better error handling
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const repoResponse = await fetch('https://api.github.com/repos/KibaOfficial/kio-chat', {
      signal: controller.signal,
      headers: {
        'User-Agent': 'kio-chat-app',
        'Accept': 'application/vnd.github.v3+json',
        // Optionally add GitHub token for higher rate limits
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
        })
      }
    });

    clearTimeout(timeout);

    if (!repoResponse.ok) {
      throw new Error(`GitHub API responded with ${repoResponse.status}: ${repoResponse.statusText}`);
    }

    const repoData: GitHubRepoResponse = await repoResponse.json();

    // 2. Get version from package.json with timeout
    const packageController = new AbortController();
    const packageTimeout = setTimeout(() => packageController.abort(), 10000);

    const packageResponse = await fetch('https://api.github.com/repos/KibaOfficial/kio-chat/contents/package.json', {
      signal: packageController.signal,
      headers: {
        'User-Agent': 'kio-chat-app',
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
        })
      }
    });

    clearTimeout(packageTimeout);

    let version = '1.0.0'; // Default version

    if (packageResponse.ok) {
      try {
        const packageData: GitHubContentsResponse = await packageResponse.json();
        const packageJson = JSON.parse(atob(packageData.content));
        version = packageJson.version || '1.0.0';
      } catch (error) {
        console.warn('[GitHub API] Failed to parse package.json, using default version');
      }
    } else {
      console.warn('[GitHub API] Failed to fetch package.json, using default version');
    }

    const stats: GitHubStats = {
      stars: repoData.stargazers_count || 0,
      version,
      language: repoData.language || 'TypeScript',
      lastUpdated: repoData.updated_at || new Date().toISOString()
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('[GitHub API] Error fetching data:', error);

    // Check if it's a timeout or network error
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('[GitHub API] Request timed out');
      } else if (error.message.includes('fetch')) {
        console.error('[GitHub API] Network error:', error.message);
      }
    }

    return NextResponse.json({
      stars: 0,
      version: 'error',
      language: 'error',
      lastUpdated: new Date().toISOString()
    })
  }
}
