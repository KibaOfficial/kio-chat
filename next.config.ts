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
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/f/**',
      },
      {
        protocol: 'https',
        hostname: 'sdsy3wlboo.ufs.sh',
        port: '',
        pathname: '/f/**',
      }
    ]
  },
  // TypeScript Konfiguration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint Konfiguration  
  eslint: {
    ignoreDuringBuilds: false,
  },

  // WICHTIG: Force dynamic rendering für problematische Routes
  // async generateStaticParams() {
  //   return []
  // },

  // Alternative: Redirect/Rewrites falls nötig
  async redirects() {
    return []
  },
}

export default nextConfig