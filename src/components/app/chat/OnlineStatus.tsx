// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use client"

interface OnlineStatusProps {
  isOnline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const OnlineStatus = ({ isOnline = false, size = 'md', className = '' }: OnlineStatusProps) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3', 
    lg: 'w-4 h-4'
  };

  const positionClasses = {
    sm: 'bottom-0 right-0',
    md: 'bottom-0.5 right-0.5',
    lg: 'bottom-1 right-1'
  };

  return (
    <div className={`absolute ${positionClasses[size]} ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full border-2 border-slate-800 ${
        isOnline 
          ? 'bg-green-500 shadow-lg shadow-green-500/20' 
          : 'bg-slate-500'
      } transition-all duration-200`}>
        {isOnline && (
          <div className={`${sizeClasses[size]} rounded-full bg-green-400 animate-ping absolute inset-0`} />
        )}
      </div>
    </div>
  );
};

// Component to show online count
export const OnlineCount = ({ count }: { count: number }) => {
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-1 text-xs text-slate-400">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span>{count} online</span>
    </div>
  );
};