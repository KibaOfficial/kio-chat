// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import Header from "@/components/core/Header";
import Footer from "@/components/core/Footer";
import { useSearchParams } from "next/navigation";
import { useToastWithSound } from "@/lib/toast/toast-wrapper";
import { useEffect } from "react";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
