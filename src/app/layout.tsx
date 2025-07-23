// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Kio Chat",
  description: "A modern chat application built with Next.js and React.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <NextAuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </NextAuthProvider>
      </body>
    </html>
  );
}
