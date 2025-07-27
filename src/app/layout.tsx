// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import ServiceWorkerRegistration from "@/components/serviceworker/ServiceWorkerRegistration";
import { ModalProvider } from "@/components/providers/modalProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Kio Chat",
  description: "A modern chat application built with Next.js and React.",
  icons: {
    icon: [
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icons/icon-64x64.png', sizes: '64x64', type: 'image/png' },
      { url: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/icon-192x192.png' },
    ],
  },
  manifest: '/icons/manifest.json'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" className="dark">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Kio Chat" />
        <meta name="application-name" content="Kio Chat" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
      </head>
      <body>
        <NextAuthProvider>
          <ModalProvider />
          {children}
          <Toaster richColors position="top-right" kioTheme="aurora" />
          <ServiceWorkerRegistration />
        </NextAuthProvider>
      </body>
    </html>
  );
}
