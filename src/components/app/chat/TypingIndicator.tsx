// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use client"

import { useEffect, useState } from 'react';
import UserAvatar from '../user-avatar';

interface TypingUser {
  userId: string;
  username: string;
  avatar?: string;
}

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
}

const TypingDots = () => {
  return (
    <div className="flex space-x-1 items-center">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export const TypingIndicator = ({ typingUsers }: TypingIndicatorProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typingUsers.length > 0) {
      setIsVisible(true);
    } else {
      // Fade out animation
      const timeout = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [typingUsers]);

  if (!isVisible) return null;

  const getTypingText = () => {
    if (typingUsers.length === 0) return '';
    if (typingUsers.length === 1) {
      return `${typingUsers[0].username} is typing...`;
    }
    if (typingUsers.length === 2) {
      return `${typingUsers[0].username} and ${typingUsers[1].username} are typing...`;
    }
    return `${typingUsers[0].username} and ${typingUsers.length - 1} others are typing...`;
  };

  return (
    <div className={`flex items-center gap-2 px-4 py-2 transition-all duration-300 ${
      typingUsers.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    }`}>
      {/* Show avatars of typing users (max 3) */}
      <div className="flex -space-x-2">
        {typingUsers.slice(0, 3).map((user) => (
          <UserAvatar
            key={user.userId}
            src={user.avatar}
            className="h-6 w-6 border-2 border-slate-800"
          />
        ))}
      </div>
      
      {/* Typing text and dots */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-400">
          {getTypingText()}
        </span>
        <TypingDots />
      </div>
    </div>
  );
};