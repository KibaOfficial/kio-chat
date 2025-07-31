// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { OnlineStatus } from "./chat/OnlineStatus";

interface UserAvatarProps {
  src?: string | null;
  className?: string;
  fallbackText?: string;
  showFallback?: boolean;
  isOnline?: boolean;
  showOnlineStatus?: boolean;
}

const UserAvatar = ({
  src,
  className,
  fallbackText,
  showFallback = true,
  isOnline = false,
  showOnlineStatus = false
}: UserAvatarProps) => {
  // Default avatar from pravatar.cc if none provided
  const defaultAvatar = "https://i.pravatar.cc/150?u=default";
  
  return (
    <div className="relative">
      <Avatar
        className={cn(
          // Only apply default size if no size classes are provided in className
          !className?.includes('w-') && !className?.includes('h-') && "h-7 w-7 md:h-10 md:w-10",
          className
        )}
      >
        <AvatarImage src={src || defaultAvatar} />
        {showFallback && fallbackText && (
          <AvatarFallback className="bg-indigo-500 text-white font-semibold">
            {fallbackText}
          </AvatarFallback>
        )}
      </Avatar>
      {showOnlineStatus && (
        <OnlineStatus 
          isOnline={isOnline} 
          size={className?.includes('h-6') || className?.includes('h-8') ? 'sm' : 'md'} 
        />
      )}
    </div>
  );
}

export default UserAvatar;