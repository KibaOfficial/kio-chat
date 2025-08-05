// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use client"

import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./Input";
import { UserProfileSidebar } from "./UserProfileSidebar";
import { useSocket } from "@/components/hooks/useSocket";
import { useState } from "react";

interface ChatContainerProps {
  chatId: string;
  currentUser: { id: string; name?: string; image?: string; description?: string };
  otherUser: { id: string; name?: string; image?: string; description?: string };
}

export const ChatContainer = ({ chatId, currentUser, otherUser }: ChatContainerProps) => {
  const { onlineUsers } = useSocket(chatId, currentUser);
  const isOtherUserOnline = onlineUsers.some(user => user.userId === otherUser.id);
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  const toggleProfile = () => {
    setIsProfileVisible(!isProfileVisible);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col shadow-2xl border border-slate-800/50 bg-slate-900/60 backdrop-blur-xl overflow-hidden">
        {/* Chat Header */}
        <ChatHeader 
          name={otherUser.name || "Unknown User"}
          lastOnline={isOtherUserOnline ? "Online" : "Offline"}
          image={otherUser.image || ""}
          isOnline={isOtherUserOnline}
          userId={otherUser.id}
          onProfileToggle={toggleProfile}
        />
        
        {/* Chat Messages */}
        <ChatMessages
          name={otherUser.name || "Unknown User"}
          chatId={chatId}
          currentUserId={currentUser.id}
          currentUser={currentUser}
        />
        
        {/* Chat Input */}
        <div className="px-2 pb-2">
          <ChatInput
            chatId={chatId}
            userName={otherUser.name || "Unknown User"}
            senderId={currentUser.id}
            currentUser={currentUser}
          />
        </div>
      </div>

      {/* User Profile Sidebar */}
      <UserProfileSidebar
        user={otherUser}
        isVisible={isProfileVisible}
        onClose={() => setIsProfileVisible(false)}
      />
    </div>
  );
};