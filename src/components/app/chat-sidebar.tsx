// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use client";
import Link from "next/link";
import UserAvatar from "./user-avatar";
import { useModal } from "../hooks/useModal";

const DUMMY_DATA = [
  {
    id: "0",
    name: "FluffCake",
    lastMessage: "I'm a silly boi",
    imageUrl: "/img/fluffcake.jpg", // FluffCake's avatar
  },
  {
    id: "1",
    name: "Alice",
    lastMessage: "Hey there!",
    imageUrl: "https://i.pravatar.cc/150?img=5", // Alice
  },
  {
    id: "2",
    name: "Bob",
    lastMessage: "How's it going?",
    imageUrl: "https://i.pravatar.cc/150?img=12", // Bob
  },
  {
    id: "3",
    name: "Charlie",
    lastMessage: "Let's catch up!",
    imageUrl: "https://i.pravatar.cc/150?img=33", // Charlie
  },
];

interface ChatSidebarProps {
  user: { 
    id: string;
    image: string | null;
    name: string;
  };
  chats: any[];
  
}

const ChatSidebar = ({ user, chats }: ChatSidebarProps) => {
  const { onOpen } = useModal();

  const chatPartners = chats.map((chat) => {
    const partner = chat.users.find((u: any) => u.user.id !== user.id);
    return {
      id: chat.id,
      name: partner?.user.name || "Unbekannt",
      lastMessage: chat.messages[0]?.content || "No messages yet",
      imageUrl: partner?.user.image,
    };
  }).sort((a, b) => {
    // Sort by last message time - newest first
    if (!a.lastMessageTime && !b.lastMessageTime) return 0;
    if (!a.lastMessageTime) return 1; // No messages go to bottom
    if (!b.lastMessageTime) return -1;
    return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
  });

  return (
    <aside className="w-full md:w-80 h-full bg-slate-900/60 backdrop-blur-xl border-r border-slate-800/50 shadow-2xl flex flex-col relative">
      {/* Header */}
      <div className="h-14 sm:h-16 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800/50 bg-gradient-to-r from-slate-900/80 to-slate-800/50 flex-shrink-0 flex items-center">
        <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
          Your Chats
        </h2>
        {/* User Avatar for the logged-in user - clickable to open edit profile */}
        <button
          onClick={() => onOpen('editProfile', { user })}
          className="ml-auto hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full"
          aria-label="Edit Profile"
        >
          <UserAvatar 
            src={user.image} 
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-slate-800 hover:border-blue-400 transition-colors"
          />
        </button>
      </div>

      {/* Chat List - mit padding-bottom für den Button */}
      <div className="flex-1 overflow-y-auto pb-16 sm:pb-20">
        {chatPartners.length === 0 ? (
          <div className="text-slate-400 px-4 sm:px-6 py-4 sm:py-6 text-center text-sm sm:text-base">
            No chats yet. Start a new one 🚀
          </div>
        ) : (
          chatPartners.map((user) => (
            <Link
              key={user.id}
              href={`/app/chat/${user.id}`}
              className="flex items-center gap-3 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4 hover:bg-slate-800/40 transition-colors group"
            >
              <div className="relative group-hover:scale-105 transition-transform flex-shrink-0">
                <UserAvatar src={user.imageUrl} className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-200 truncate text-sm sm:text-base">
                  {user.name}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 truncate">
                  {user.lastMessage}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Button Container - fixed am unteren Rand der Sidebar */}
      <div className="absolute bottom-0 right-0 p-3 sm:p-4 pointer-events-none">
        <button
          type="button"
          className="p-3 sm:p-4 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 shadow-xl hover:scale-105 transition-transform border-2 sm:border-4 border-slate-900/80 focus:outline-none focus:ring-2 focus:ring-blue-400 pointer-events-auto"
          aria-label="Start new chat"
          onClick={() => {
            onOpen('createNewChat');
          }}
        >
          {/* Pencil Icon (Lucide/Feather style) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default ChatSidebar;