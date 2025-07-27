// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'


import { Suspense, ReactNode } from "react";
import Header from "@/components/core/Header";
import Footer from "@/components/core/Footer";

interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <Suspense fallback={<div className="text-center text-white py-12">Lade Seite...</div>}>
      <Header />
      {children}
      <Footer />
    </Suspense>
  );
}
