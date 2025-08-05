// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle } from "lucide-react";
import { useModal } from "../hooks/useModal";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import UserAvatar from "../app/user-avatar";

export const UserCardModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const isModalOpen = isOpen && type === 'userCard';
    
  // Use user from modal data, fallback to empty
  const user: Partial<User> = (data && 'user' in data && (data as any).user) ? (data as any).user : { name: "", email: "", image: "" };
  const currentUser: Partial<User> = (data && 'currentUser' in data && (data as any).currentUser) ? (data as any).currentUser : { name: "", email: "", image: "" };

  // Check if the user is viewing their own profile
  const isOwnProfile = user?.id === currentUser?.id;

  const handleMessageClick = () => {
    if (user?.id && !isOwnProfile) {
      router.push(`/app/chat/${user.id}`);
      onClose();
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 border border-slate-700/50 shadow-2xl p-0 overflow-hidden max-w-sm">
        <DialogTitle className="sr-only">
          User Profile - {user?.name}
        </DialogTitle>
        <div className="relative">
          {/* Banner */}
          <div className="h-20 bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-indigo-600/40" />

          {/* Message Button */}
          {!isOwnProfile && (
            <div className="absolute top-20 right-4 transform -translate-y-1/2 z-10">
              <Button
                onClick={handleMessageClick}
                size="sm"
                variant="primary"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Content */}
          <div className="relative px-6 pb-6">
            {/* Profile Picture with Online Status */}
            <div className="relative -mt-10 mb-3 w-20 h-20">
              <UserAvatar 
                src={user.image || undefined}
                fallbackText={user.name?.slice(0, 2).toUpperCase()}
                showFallback={!user.image}
                className="w-20 h-20 border-4 border-slate-800/60 shadow-lg"
              />
              {/* Online Status - Discord Style */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900/80 shadow-md" />
            </div>

            {/* Username */}
            <h3 className="text-blue-300 font-bold text-xl mb-2 bg-gradient-to-r from-blue-300 via-purple-300 to-emerald-300 bg-clip-text">
              {user.name}
            </h3>

            {/* About Me Section */}
            <div className="mt-4">
              <h4 className="text-purple-400 font-semibold text-sm mb-2 uppercase tracking-wide">
                About Me
              </h4>
              <p className="text-slate-400 text-sm mb-3">
                {user.description || "No bio available"}
              </p>

              {/* Member Since */}
              <div className="mt-4 pt-3 border-t border-slate-700/50">
                <h4 className="text-blue-400 font-semibold text-sm mb-1 uppercase tracking-wide">
                  Member Since
                </h4>
                <span className="text-slate-400 text-xs">
                  {new Date(user.createdAt!).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
