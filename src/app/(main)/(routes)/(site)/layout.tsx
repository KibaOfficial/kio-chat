// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";
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

  const searchParams = useSearchParams();
  const { toast } = useToastWithSound();
  useEffect(() => {
    if (searchParams.get("unauth") === "1") {
      toast.error("You need to be logged in to access the dashboard");
    }
  }, [searchParams, toast]);


  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
