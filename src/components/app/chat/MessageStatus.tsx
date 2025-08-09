// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use client"

import { Check, CheckCheck } from "lucide-react";

interface MessageStatusProps {
  status: "SENT" | "DELIVERED" | "READ";
  className?: string;
}

export const MessageStatus = ({ status, className = "" }: MessageStatusProps) => {
  const baseClasses = "inline-flex items-center justify-center flex-shrink-0";
  
  switch (status) {
    case "SENT":
      return (
        <div className={`${baseClasses} ${className}`} title="Message sent">
          <Check className="w-4 h-4 text-slate-400" />
        </div>
      );
      
    case "DELIVERED":
      return (
        <div className={`${baseClasses} ${className}`} title="Message delivered">
          <CheckCheck className="w-4 h-4 text-slate-400" />
        </div>
      );
      
    case "READ":
      return (
        <div className={`${baseClasses} ${className}`} title="Message read">
          <CheckCheck className="w-4 h-4 text-blue-400" />
        </div>
      );
      
    default:
      return null;
  }
};

/**
 * Hook to determine message status based on timestamps
 * @param message Message object with status fields
 * @returns Current message status
 */
export const getMessageStatus = (message: any): "SENT" | "DELIVERED" | "READ" => {
  // If we have explicit status field, use it
  if (message.status) {
    return message.status;
  }
  
  // Fallback logic based on timestamps (for backward compatibility)
  if (message.readAt) {
    return "READ";
  }
  
  if (message.deliveredAt) {
    return "DELIVERED";
  }
  
  return "SENT";
};