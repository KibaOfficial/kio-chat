// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import InfoCard from "@/components/core/InfoCard";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useToastWithSound } from "@/lib/toast/toast-wrapper";


const HomeComponent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      <div className="relative z-10 space-y-20 pb-20 pt-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4">
          <InfoCard />
        </section>
      </div>
    </div>
  );
}

const HomePage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    }>
      <HomeComponent />
    </Suspense>
  );
};
 
export default HomePage;