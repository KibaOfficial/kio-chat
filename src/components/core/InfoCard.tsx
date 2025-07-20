// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";

import useSWR from "swr";
import { Card, CardContent } from "../ui/card";
import { Activity, Camera, ExternalLink, Github, Loader2, Phone, Shield, Smile, Star, Users, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Image from "next/image";

interface InfoStats {
  github: {
    stars: number;
    version: string;
    language: string;
    lastUpdated: string;
  };
  uptime: string;
  lastUpdated: string;
}

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

const InfoCard = () => {

  const { data: stats, error, isLoading } = useSWR<InfoStats>('/api/stats', fetcher, {
    refreshInterval: 300000, // Refresh every 5 minutes
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20 animate-pulse"></div>
        <CardContent className="p-6 sm:p-8 lg:p-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4 text-center">
              <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
              <p className="text-slate-400 text-sm sm:text-base">Loading Info stats...</p>
            </div>
          </div>
        </CardContent>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="relative overflow-hidden">        
      <Card className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
          <CardContent className="p-6 sm:p-8 lg:p-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="text-red-400 text-4xl sm:text-3xl">⚠️</div>
                <p className="text-slate-400 text-sm sm:text-base">Failed to load stats</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  size="sm"
                  className="border-slate-600 hover:border-slate-500 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200"
                >
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return (
          <Badge className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-200 border-emerald-500/30 px-3 py-1">
            <Activity className="h-3 w-3 mr-1" />
            Online
          </Badge>
        );
      
      case 'offline':
        return (
          <Badge className="bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-200 border-red-500/30 px-3 py-1">
            <Activity className="h-3 w-3 mr-1" />
            Offline
          </Badge>
        );
      
      case 'maintenance':
        return (
          <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-200 border-yellow-500/30 px-3 py-1">
            <Activity className="h-3 w-3 mr-1" />
            Maintenance
          </Badge>
        );
      
      default:
        return (
          <Badge className="bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-200 border-gray-500/30 px-3 py-1">
            <Activity className="h-3 w-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  }

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-purple-500/10"></div>
      <Card className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
        <CardContent className="p-6 sm:p-8 lg:p-12">
          {/* Hero Section */}
          <div className="flex flex-col items-center gap-6 mb-8 text-center lg:flex-row lg:text-left lg:gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <Image
                src="/img/kio-chat-logo.png"
                alt="Kio-Chat Logo"
                width={80}
                height={80}
                className="relative rounded-xl shadow-xl bg-white/10 ring-2 ring-white/20 group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-col items-center gap-4 mb-4 lg:flex-row lg:items-center">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Kio-Chat
                </h1>
                <div className="flex flex-col items-center gap-2 sm:flex-row lg:justify-start">
                  <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 border-blue-500/30 px-3 py-1 text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    v{stats?.github.version || '0.0.0'}
                  </Badge>
                  {getStatusBadge('online')}
                </div>
              </div>
              
              <p className="text-lg sm:text-xl text-slate-300 mb-6 leading-relaxed">
                Your <span className="text-blue-400 font-semibold">all-in-one</span> chat solution for 
                <span className="text-purple-400 font-semibold"> seamless communication</span> with your{" "}
                <span className="text-green-400 font-semibold">family</span>, <span className="text-cyan-400 font-semibold">friends</span> and <span className="text-pink-400 font-semibold">others</span>
              </p>

              <div>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                  onClick={() => window.open('https://github.com/KibaOfficial/kio-chat', '_blank')}
                >
                  <Github className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                  View on GitHub
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm rounded-lg p-4 border border-slate-600/30 text-center sm:text-left">
              <div className="flex flex-col items-center gap-2 mb-1 sm:flex-row">
                <Star className="h-5 w-5 sm:h-4 sm:w-4 text-yellow-400" />
                <span className="text-sm sm:text-xs text-slate-400">Stars</span>
              </div>
              <div className="text-2xl sm:text-xl font-bold text-white">
                {stats?.github.stars || 0}
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm rounded-lg p-4 border border-slate-600/30 text-center sm:text-left">
              <div className="flex flex-col items-center gap-2 mb-1 sm:flex-row">
                <Activity className="h-5 w-5 sm:h-4 sm:w-4 text-green-400" />
                <span className="text-sm sm:text-xs text-slate-400">Uptime</span>
              </div>
              <div className="text-2xl sm:text-xl font-bold text-white">
                {stats?.uptime || '0d 0h 0m'}
              </div>
            </div>

          </div>

          {/* Feature Badges */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-base font-semibold text-white flex flex-col items-center gap-2 sm:flex-row">
              <Star className="h-6 w-6 sm:h-5 sm:w-5 text-yellow-400" />
              Core Features
            </h3>
            <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
              <Badge className="bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-200 border-red-500/30 px-4 py-2 text-sm">
                <Shield className="h-4 w-4 mr-2" />
                End-to-End Encrypted
              </Badge>
              <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-200 border-green-500/30 px-4 py-2 text-sm">
                <Users className="h-4 w-4 mr-2" />
                Group Chats
              </Badge>
              <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 border-purple-500/30 px-4 py-2 text-sm">
                <Phone className="h-4 w-4 mr-2" />
                Voice & Video Calls
              </Badge>
              <Badge className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-200 border-pink-500/30 px-4 py-2 text-sm">
                <Smile className="h-4 w-4 mr-2" />
                Custom Stickers
              </Badge>
              <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-200 border-blue-500/30 px-4 py-2 text-sm">
                <Zap className="h-4 w-4 mr-2" />
                Instant Delivery
              </Badge>
              <Badge className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-200 border-yellow-500/30 px-4 py-2 text-sm">
                <Camera className="h-4 w-4 mr-2" />
                Media Sharing
              </Badge>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <div className="flex flex-col items-center gap-4 text-sm text-slate-400 sm:flex-row sm:flex-wrap">
              <span className="font-medium text-slate-300">Build with:</span>
              <div className="flex flex-wrap justify-center gap-2 text-blue-300 rounded border border-blue-500/20 text-xs">
                <span className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded border border-blue-500/20 text-xs">
                  {stats?.github.language || 'TypeScript'}
                </span>
                <span className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded border border-purple-500/20 text-xs">
                  Next.js
                </span>
                <span className="px-2 py-1 bg-green-500/10 text-green-300 rounded border border-green-500/20 text-xs">
                  Prisma
                </span>
                <span className="px-2 py-1 bg-yellow-500/10 text-yellow-300 rounded border border-yellow-500/20 text-xs">
                  PostgreSQL
                </span>
                <span className="px-2 py-1 bg-red-500/10 text-red-300 rounded border border-red-500/20 text-xs">
                  Auth.js
                </span>
                <span className="px-2 py-1 bg-gray-500/10 text-gray-300 rounded border border-gray-500/20 text-xs">
                  Tailwind CSS
                </span>
                <span className="px-2 py-1 bg-indigo-500/10 text-indigo-300 rounded border border-indigo-500/20 text-xs">
                  WebSockets
                </span>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          { stats?.lastUpdated && (
            <div className="mt-4 text-xs text-slate-500 text-center">
              Last updated: {new Date(stats.lastUpdated).toLocaleString()}
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
 
export default InfoCard;