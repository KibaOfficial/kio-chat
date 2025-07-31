// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use client"

import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';

interface TypingUser {
  userId: string;
  username: string;
  avatar?: string;
}

interface OnlineUser {
  userId: string;
  username: string;
  avatar?: string;
  lastSeen: Date;
}

export const useSocket = (chatId: string, currentUser: { id: string; name?: string; image?: string }) => {
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!chatId || !currentUser.id) return;

    // Initialize socket connection
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "https://kiochatws.kibaofficial.net");
    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected');
      
      // Join the chat room
      socket.emit('join', chatId);
      
      // Send user online status
      socket.emit('user_online', {
        chatId,
        userId: currentUser.id,
        username: currentUser.name || 'Unknown',
        avatar: currentUser.image
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    // Typing events
    socket.on('user_typing', (data: TypingUser) => {
      if (data.userId !== currentUser.id) {
        setTypingUsers(prev => {
          const exists = prev.find(user => user.userId === data.userId);
          if (!exists) {
            return [...prev, data];
          }
          return prev;
        });
      }
    });

    socket.on('user_stopped_typing', (data: { userId: string }) => {
      setTypingUsers(prev => prev.filter(user => user.userId !== data.userId));
    });

    // Online status events
    socket.on('user_online', (data: OnlineUser) => {
      if (data.userId !== currentUser.id) {
        setOnlineUsers(prev => {
          const filtered = prev.filter(user => user.userId !== data.userId);
          return [...filtered, data];
        });
      }
    });

    socket.on('user_offline', (data: { userId: string }) => {
      setOnlineUsers(prev => prev.filter(user => user.userId !== data.userId));
    });

    socket.on('online_users', (users: OnlineUser[]) => {
      // Filter out current user from online users list
      setOnlineUsers(users.filter(user => user.userId !== currentUser.id));
    });

    // Cleanup
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socket.emit('leave', chatId);
      socket.disconnect();
    };
  }, [chatId, currentUser.id, currentUser.name, currentUser.image]);

  // Start typing
  const startTyping = () => {
    if (!socketRef.current || !isConnected) return;

    socketRef.current.emit('typing', {
      chatId,
      userId: currentUser.id,
      username: currentUser.name || 'Unknown',
      avatar: currentUser.image
    });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto-stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  // Stop typing
  const stopTyping = () => {
    if (!socketRef.current || !isConnected) return;

    socketRef.current.emit('stop_typing', {
      chatId,
      userId: currentUser.id
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  // Send message (also stops typing)
  const sendMessage = (messageData: any) => {
    if (!socketRef.current || !isConnected) return;

    stopTyping();
    socketRef.current.emit('message', messageData);
  };

  return {
    socket: socketRef.current,
    isConnected,
    typingUsers,
    onlineUsers,
    startTyping,
    stopTyping,
    sendMessage
  };
};