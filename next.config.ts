import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // domains: ['cdn.discordapp.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        port: '',
        pathname: '/avatars/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.kibaofficial.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      }
    ]
  },
  // Experimental features removed for compatibility with Next.js 15
  
  // TypeScript Konfiguration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint Konfiguration  
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Ausgabe Konfiguration für bessere Vercel Performance
  output: 'standalone',

  // WICHTIG: Force dynamic rendering für problematische Routes
  async generateStaticParams() {
    return []
  },

  // Alternative: Redirect/Rewrites falls nötig
  async redirects() {
    return []
  },
}

export default nextConfig