// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use client"

import UserAvatar from "../user-avatar";
import { useState } from "react";

interface UserProfileSidebarProps {
  user: {
    id: string;
    name?: string;
    image?: string;
  };
  isVisible: boolean;
  onClose: () => void;
}

export const UserProfileSidebar = ({ user, isVisible, onClose }: UserProfileSidebarProps) => {
  if (!isVisible) return null;

  return (
    <>
      {/* Mobile backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Profile Sidebar */}
      <div className={`
        fixed md:relative right-0 top-0 h-full w-full 
        md:w-72 lg:w-80 xl:w-80 2xl:w-80
        bg-slate-900/80 backdrop-blur-xl border-l border-slate-800/50 
        shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
        ${isVisible ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="h-14 px-4 py-3 border-b border-slate-800/50 bg-gradient-to-r from-slate-900/80 to-slate-800/50 flex items-center">
          <button
            onClick={onClose}
            className="flex items-center justify-center p-1 rounded hover:bg-slate-800/40 transition-colors mr-3 md:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-slate-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-lg font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
            Profile
          </h2>
        </div>

        {/* Profile Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <UserAvatar
              src={user.image}
              className="w-16 h-16 lg:w-18 lg:h-18 rounded-full shadow-lg border-3 border-slate-800/60 mb-3"
            />
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-1">
              {user.name || "Unknown User"}
            </h3>
            <p className="text-xs lg:text-sm text-slate-400">
              @{user.name?.toLowerCase().replace(/\s+/g, '') || 'unknown'}
            </p>
          </div>

          {/* Profile Info */}
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
              <h4 className="text-sm font-semibold text-slate-300 mb-1">About</h4>
              <p className="text-slate-400 text-sm">
                No bio available
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
              <h4 className="text-sm font-semibold text-slate-300 mb-1">Status</h4>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-slate-400 text-sm">Online</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-3">
              <button className="w-full p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 hover:bg-slate-700/40 transition-colors text-slate-300 text-sm">
                View Shared Media
              </button>
              <button className="w-full p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 hover:bg-slate-700/40 transition-colors text-slate-300 text-sm">
                Search Messages
              </button>
              <button className="w-full p-3 rounded-lg bg-red-900/20 border border-red-700/50 hover:bg-red-800/30 transition-colors text-red-400 text-sm">
                Block User
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};