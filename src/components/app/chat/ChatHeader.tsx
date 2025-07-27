// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import UserAvatar from "../user-avatar";

interface ChatHeaderProps {
  name: string;
  lastOnline?: string;
  image: string;
}

export const ChatHeader = ({
  name,
  lastOnline,
  image
}: ChatHeaderProps) => {
  return (
    <div className="h-16 flex items-center gap-3 px-6 py-4 border-b border-slate-800/50 bg-gradient-to-r from-slate-900/80 to-slate-800/50">
      <UserAvatar
        src={image}
        className="w-8 h-8 rounded-full shadow-lg border-2 border-slate-800/60"
      />
      <h2 className="text-xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent ml-2">
        {name}
      </h2>
      {lastOnline && (
        <span className="text-xs text-slate-400 truncate ml-4">
          Last online: {lastOnline}
        </span>
      )}
    </div>
  )
}