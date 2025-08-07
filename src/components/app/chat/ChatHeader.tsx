// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import UserAvatar from "../user-avatar";
import Link from "next/link";

interface ChatHeaderProps {
  name: string;
  lastOnline?: string;
  image?: string;
  isOnline?: boolean;
  userId?: string;
  onProfileToggle?: () => void;
}

export const ChatHeader = ({
  name,
  lastOnline,
  image,
  isOnline = false,
  userId,
  onProfileToggle
}: ChatHeaderProps) => {
  return (
    <div className="h-14 sm:h-16 flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 border-b border-slate-800/50 bg-gradient-to-r from-slate-900/80 to-slate-800/50">
      <Link href="/app" className="flex items-center justify-center p-1 rounded hover:bg-slate-800/40 transition-colors md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </Link>
      <button
        onClick={onProfileToggle}
        className="flex items-center gap-2 sm:gap-3 hover:bg-slate-800/40 transition-colors rounded-lg p-1 sm:p-2 flex-1 min-w-0"
      >
        <UserAvatar
          src={image}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full shadow-lg border-2 border-slate-800/60 flex-shrink-0"
          showOnlineStatus={true}
          isOnline={isOnline}
        />
        <div className="flex flex-col items-start min-w-0 flex-1">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent truncate max-w-full">
            {name}
          </h2>
          {lastOnline && (
            <span className="text-xs text-slate-400 truncate max-w-full">
              {lastOnline}
            </span>
          )}
        </div>
      </button>
    </div>
  )
}