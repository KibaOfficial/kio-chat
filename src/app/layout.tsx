import type { Metadata } from "next";
import "./globals.css";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import { Toaster } from "sonner";
import Header from "@/components/core/Header";
import Footer from "@/components/core/Footer";


export const metadata: Metadata = {
  title: "Kio Chat",
  description: "A modern chat application built with Next.js and React."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <NextAuthProvider>
          <Header />
          {children}
          <Toaster richColors position="top-right" />
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}
