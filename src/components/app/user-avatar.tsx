// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "../ui/avatar";


interface UserAvatarProps {
  src?: string;
  className?: string;
}

const UserAvatar = ({
  src,
  className
}: UserAvatarProps) => {
  // Default avatar from pravatar.cc if none provided
  const defaultAvatar = "https://i.pravatar.cc/150?u=default";
  return (
    <Avatar
      className={cn(
        "h-7 w-7 md:h-10 md:w-10",
        className
      )}
    >
      <AvatarImage src={src || defaultAvatar} />
    </Avatar>
  );
}

export default UserAvatar;