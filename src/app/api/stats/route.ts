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

function getBaseUrl(): string {
  // In production, use VERCEL_URL or custom domain
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Custom domain (add to your .env)
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // Fallback for development
  return 'http://localhost:3000';
}

export async function GET() {
  try {
    const baseUrl = getBaseUrl();

    const githubResponse = await fetch(`${baseUrl}/api/github`, {
      headers: {
        'User-Agent': 'Kio-Chat/1.0'
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000) // 10 seconds timeout
    });

    let githubStats: GitHubStats = {
      stars: 0,
      version: '1.0.0', // Updated fallback version
      language: 'TypeScript',
      lastUpdated: new Date().toISOString()
    };

    if (githubResponse.ok) {
      try {
        githubStats = await githubResponse.json();
      } catch (parseError) {
        console.error('[Stats API] Failed to parse GitHub response:', parseError);
      }
    } else {
      console.error('[Stats API] GitHub API returned:', githubResponse.status, githubResponse.statusText);
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
      status: 200, // Return 200 to prevent frontend errors
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    });
  }
}