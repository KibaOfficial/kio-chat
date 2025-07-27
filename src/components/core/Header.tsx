// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { AuthButton } from "../auth/AuthButton";
import { useToastWithSound } from "@/lib/toast/toast-wrapper";

export function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchParams = useSearchParams();
  const { toast } = useToastWithSound();
  useEffect(() => {
    if (searchParams.get("unauth") === "1") {
      toast.error("You need to be logged in to access the dashboard");
    }
  }, [searchParams, toast]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const getNavLinkClass = (
    href: string,
    baseClass: string,
    activeClass: string,
    inactiveClass: string
  ) => {
    if (!mounted) return `${baseClass} ${inactiveClass}`;
    return `${baseClass} ${isActive(href) ? activeClass : inactiveClass}`;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <Suspense fallback={<div className="text-center text-white py-12">Loading...</div>}>
    <header className="w-full bg-bgdark/95 border-b border-accent shadow-md">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-6 py-4">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-4">
          <Image
            src="/img/kio-chat-logo.png"
            width={52}
            height={52}
            alt="Kio-Chat Logo"
            className="rounded-xl bg-white shadow-md border border-white/70"
            priority
          />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
              Kio-Chat
            </span>
            <span className="text-xs sm:text-sm text-gray-400 font-mono font-medium">
              A Kibaofficial project
              <span className="hidden sm:inline"> | Version: </span>
              <span className="hidden sm:inline text-primary font-semibold">1.0.0</span>
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-1 bg-accent/30 rounded-2xl px-6 py-3 backdrop-blur-sm border border-accent/50 shadow-lg"
          suppressHydrationWarning
        >
          <Link
            href="/"
            className={getNavLinkClass(
              "/",
              "hover:text-white hover:bg-primary/20 transition-all duration-300 font-medium px-4 py-2 rounded-xl relative group",
              "text-white bg-primary/30 shadow-lg",
              "text-gray-300"
            )}
          >
            <span className="relative z-10">Home</span>
            <div
              className={`absolute inset-0 bg-gradient-to-r rounded-xl transition-opacity duration-300 ${
                mounted && isActive("/")
                  ? "from-primary/20 to-primary/30 opacity-100"
                  : "from-primary/0 to-primary/10 opacity-0 group-hover:opacity-100"
              }`}
              suppressHydrationWarning
            ></div>
          </Link>
          <div className="w-px h-6 bg-gray-600/50 mx-2"></div>
          <Link
            href="/privacy"
            className={getNavLinkClass(
              "/privacy",
              "hover:text-gray-200 hover:bg-accent/50 transition-all duration-300 font-medium px-3 py-2 rounded-xl text-sm",
              "text-primary bg-primary/20 shadow-md",
              "text-gray-400"
            )}
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className={getNavLinkClass(
              "/terms",
              "hover:text-gray-200 hover:bg-accent/50 transition-all duration-300 font-medium px-3 py-2 rounded-xl text-sm",
              "text-primary bg-primary/20 shadow-md",
              "text-gray-400"
            )}
          >
            Terms of Service
          </Link>
          <div className="ml-6 flex items-center">
            <AuthButton />
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1 focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <div
            className={`w-6 h-0.5 bg-gray-300 transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-gray-300 transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-gray-300 transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Mobile Navigation Menu */}
      <nav
        className={`md:hidden fixed top-0 right-0 h-full w-80 bg-bgdark border-l border-accent shadow-xl transform transition-transform duration-300 z-50 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        suppressHydrationWarning
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-accent">
            <span className="text-lg font-semibold text-primary">Menu</span>
            <button
              onClick={closeMobileMenu}
              className="p-2 hover:bg-accent/50 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <div className="w-6 h-6 relative">
                <div className="absolute top-3 w-6 h-0.5 bg-gray-300 rotate-45"></div>
                <div className="absolute top-3 w-6 h-0.5 bg-gray-300 -rotate-45"></div>
              </div>
            </button>
          </div>

          {/* Mobile Menu Links */}
          <div className="flex flex-col py-6 px-6 space-y-2">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className={getNavLinkClass(
                "/",
                "block px-4 py-3 rounded-xl font-medium transition-all duration-200 text-base",
                "text-white bg-primary/30 shadow-md",
                "text-gray-300 hover:text-primary hover:bg-primary/10"
              )}
            >
              Home
            </Link>
            <Link
              href="/privacy"
              onClick={closeMobileMenu}
              className={getNavLinkClass(
                "/privacy",
                "block px-4 py-3 rounded-xl font-medium transition-all duration-200 text-base",
                "text-primary bg-primary/20 shadow-md",
                "text-gray-400 hover:text-gray-200 hover:bg-accent/50"
              )}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              onClick={closeMobileMenu}
              className={getNavLinkClass(
                "/terms",
                "block px-4 py-3 rounded-xl font-medium transition-all duration-200 text-base",
                "text-primary bg-primary/20 shadow-md",
                "text-gray-400 hover:text-gray-200 hover:bg-accent/50"
              )}
            >
              Terms of Service
            </Link>
            <div className="mt-4 flex items-center justify-center">
              <AuthButton />
            </div>
          </div>

          {/* Mobile Menu Footer */}
          <div className="mt-auto p-6 border-t border-accent">
            <div className="text-center">
              <span className="text-sm text-gray-400 font-mono">
                Version: <span className="text-primary font-semibold">1.0.0</span>
              </span>
            </div>
          </div>
        </div>
      </nav>
    </header>
    </Suspense>
  );
}

export default Header;