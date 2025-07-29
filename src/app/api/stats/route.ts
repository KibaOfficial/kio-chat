// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { NextResponse } from "next/server";

interface GitHubStats {
  stars: number;
  version: string;
  language: string;
  lastUpdated: string;
}

interface InfoStats {
  github: GitHubStats;
  uptime: string;
  lastUpdated: string;
}

function calculateUptime(): string {
  // Using initial commit date: 20. July 2025 16:00 (German time / CEST)
  // CEST is UTC+2, so 16:00 CEST is 14:00 UTC
  const startTime = new Date('2025-07-20T14:00:00Z');
  const now = new Date();
  const uptimeMs = now.getTime() - startTime.getTime();

  const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${days}d ${hours}h ${minutes}m`;
}

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

export async function GET() {
  try {
    // --- GitHub stats fetch logic (direct, not via local API) ---
    let githubStats: GitHubStats = {
      stars: 0,
      version: '1.0.0',
      language: 'TypeScript',
      lastUpdated: new Date().toISOString()
    };

    try {
      console.log('[Stats API] Fetching GitHub repository data...');
      const repoResponse = await fetchWithTimeout(
        'https://api.github.com/repos/KibaOfficial/kio-chat',
        {
          headers: {
            'User-Agent': 'kio-chat-app',
            'Accept': 'application/vnd.github.v3+json',
            ...(process.env.GITHUB_TOKEN && {
              'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
            })
          }
        },
        15000 // 15 Sekunden Timeout
      );

      if (repoResponse.ok) {
        const repoData = await repoResponse.json();
        console.log('[Stats API] GitHub repo data fetched successfully');
        
        // Get version from package.json
        let version = '1.0.0';
        try {
          console.log('[Stats API] Fetching package.json...');
          const packageResponse = await fetchWithTimeout(
            'https://api.github.com/repos/KibaOfficial/kio-chat/contents/package.json',
            {
              headers: {
                'User-Agent': 'kio-chat-app',
                'Accept': 'application/vnd.github.v3+json',
                ...(process.env.GITHUB_TOKEN && {
                  'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
                })
              }
            },
            10000 // 10 Sekunden für package.json
          );

          if (packageResponse.ok) {
            const packageData = await packageResponse.json();
            const packageJson = JSON.parse(atob(packageData.content));
            version = packageJson.version || '1.0.0';
            console.log(`[Stats API] Version fetched: ${version}`);
          }
        } catch (error) {
          console.warn('[Stats API] Failed to fetch package.json, using fallback version:', error);
        }

        githubStats = {
          stars: repoData.stargazers_count || 0,
          version,
          language: repoData.language || 'TypeScript',
          lastUpdated: repoData.updated_at || new Date().toISOString()
        };
      } else {
        console.warn(`[Stats API] GitHub API returned status ${repoResponse.status}`);
        // Check rate limit headers
        const rateLimitRemaining = repoResponse.headers.get('X-RateLimit-Remaining');
        const rateLimitReset = repoResponse.headers.get('X-RateLimit-Reset');
        
        if (rateLimitRemaining === '0') {
          let resetTime = 'unknown';
          if (rateLimitReset && !isNaN(Number(rateLimitReset))) {
            resetTime = new Date(Number(rateLimitReset) * 1000).toISOString();
          }
          console.warn(`[Stats API] Rate limit exceeded. Resets at: ${resetTime}`);
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('[Stats API] GitHub API request timed out');
      } else {
        console.error('[Stats API] Error fetching GitHub stats:', error);
      }
      // Fallback values are already set above
    }

    const stats: InfoStats = {
      github: githubStats,
      uptime: calculateUptime(),
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      }
    });
  } catch (error) {
    console.error('[Stats API] Critical error:', error);
    const fallbackStats: InfoStats = {
      github: {
        stars: 0,
        version: '1.0.0',
        language: 'TypeScript',
        lastUpdated: new Date().toISOString()
      },
      uptime: calculateUptime(),
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(fallbackStats, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    });
  }
}