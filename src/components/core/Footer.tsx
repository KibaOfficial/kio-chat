// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Coffee, Github, Heart, Mail, Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden">

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* main footer content */}
      <div className="relative border-0 bg-gradient-to-br from-white/5 via-white/5 to-white/10 backdrop-blur-lg">
        <div className="absolute inset-0 ring-1 ring-white/10 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">

          {/* Top section */}
          <div className="grid grid-cols-1 gap-8 mb-8 text-center md:grid-cols-3 md:text-left">

            {/* Brand section */}
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <Sparkles className="w-7 h-7 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <h3 className="text-xl sm:text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Kio Chat
                </h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                A modern chat application with real-time messaging, end-to-end encryption, Custom Stickers and more.
                Build with 💜 by KibaOfficial
              </p>
            </div>
            
            {/* Quick links */}
            <div className="space-y-4">
              <h4 className="text-lg sm:text-base font-semibold text-white">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {[
                  { name: "Home", href: "/" }
                  // TODO: Add more links as needed
                ].map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-sm group flex items-center justify-center gap-2 md:justify-start"
                    >
                      <span className="w-1 h-1 bg-gray-500 rounded-full group-hover:bg-blue-400 transition-colors duration-300" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social & info */}
            <div className="space-y-4">
              <h4 className="text-lg sm:text-base font-semibold text-white">Connect</h4>
              <div className="flex justify-center gap-3 sm:justify-start">
                {[
                  { icon: Github, href: "https://github.com/KibaOfficial", color: "from-gray-500 to-gray-600" },
                  { icon: Mail, href: "mailto:kiba@kibaofficial.net", color: "from-blue-500 to-cyan-500" },
                  { icon: Coffee, href: "#", color: "from-orange-500 to-yellow-500" }
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    className={`group p-3 rounded-xl bg-gradient-to-br ${social.color} bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 hover:scale-110`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="w-6 h-6 sm:w-5 sm:h-5 text-white group-hover:text-white/90" />
                  </a>
                ))}
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Status: <span className="text-green-400">🟢 Online</span></p>
                <p>Version: <span className="text-blue-400">v1.0.0</span></p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />
          
          {/* Bottom section */}
          <div className="flex flex-col items-center gap-4 text-sm text-gray-400 text-center md:flex-row md:justify-between md:text-left">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <p>© 2025 KibaOfficial. All rights reserved.</p>
              <div className="flex items-center gap-4 md:hidden">
                <a href="/privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
                <span>•</span>
                <a href="/terms" className="hover:text-white transition-colors duration-300">Terms of Service</a>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <a href="/privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
                <span>•</span>
                <a href="/terms" className="hover:text-white transition-colors duration-300">Terms of Service</a>
                <span>•</span>
                <a href="/imprint" className="hover:text-white transition-colors duration-300">Imprint</a>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span>in Germany</span>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-4 left-4 opacity-20">
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
        </div>
        <div className="absolute top-4 right-8 opacity-30">
          <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" style={{animationDelay: '1s'}} />
        </div>
        <div className="absolute bottom-8 right-12 opacity-25">
          <Sparkles className="w-2 h-2 text-purple-400 animate-pulse" style={{animationDelay: '2s'}} />
        </div>

      </div>
    </footer>
  );
}
 
export default Footer;