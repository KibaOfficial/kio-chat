// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Formats a date into a relative time string for chat messages
 * @param date - Date to format
 * @returns Formatted time string
 */
export function formatMessageTime(date: Date | string): string {
  const messageDate = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);
  
  // Less than 1 minute ago
  if (diffInSeconds < 60) {
    return "just now";
  }
  
  // Less than 1 hour ago
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  }
  
  // Today (within last 24 hours and same day)
  const isToday = messageDate.toDateString() === now.toDateString();
  if (isToday) {
    return messageDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }
  
  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = messageDate.toDateString() === yesterday.toDateString();
  if (isYesterday) {
    return `yesterday ${messageDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })}`;
  }
  
  // This week (within last 7 days)
  const diffInDays = Math.floor(diffInSeconds / (3600 * 24));
  if (diffInDays < 7) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayNames[messageDate.getDay()];
    return `${dayName} ${messageDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })}`;
  }
  
  // Older messages - show date in DD/MM format
  if (messageDate.getFullYear() === now.getFullYear()) {
    // Same year - show DD/MM format
    return messageDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit'
    });
  }
  
  // Different year - show DD/MM/YYYY format
  return messageDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formats a date for chat sidebar (last message time)
 * @param date - Date to format
 * @returns Formatted time string for sidebar
 */
export function formatSidebarTime(date: Date | string): string {
  const messageDate = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);
  
  // Less than 1 minute ago
  if (diffInSeconds < 60) {
    return "now";
  }
  
  // Less than 1 hour ago
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m`;
  }
  
  // Today
  const isToday = messageDate.toDateString() === now.toDateString();
  if (isToday) {
    return messageDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }
  
  // Yesterday  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = messageDate.toDateString() === yesterday.toDateString();
  if (isYesterday) {
    return "yesterday";
  }
  
  // This week
  const diffInDays = Math.floor(diffInSeconds / (3600 * 24));
  if (diffInDays < 7) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayNames[messageDate.getDay()];
  }
  
  // Older - just show date
  return messageDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit'
  });
}

/**
 * Checks if two dates are on the same day
 * @param date1 - First date
 * @param date2 - Second date  
 * @returns True if dates are on the same day
 */
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() === d2.toDateString();
}

/**
 * Checks if messages should be grouped together
 * @param message1 - Previous message
 * @param message2 - Current message
 * @returns True if messages should be grouped
 */
export function shouldGroupMessages(message1: any, message2: any): boolean {
  if (!message1 || !message2) return false;
  
  // Same sender
  const sameSender = (message1.sender?.id || message1.senderId) === (message2.sender?.id || message2.senderId);
  if (!sameSender) return false;
  
  // Within 2 minutes
  const timeDiff = Math.abs(new Date(message2.createdAt).getTime() - new Date(message1.createdAt).getTime());
  const within2Minutes = timeDiff < 2 * 60 * 1000;
  
  return within2Minutes;
}