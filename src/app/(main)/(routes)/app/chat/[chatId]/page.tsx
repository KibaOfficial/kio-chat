// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ChatContainer } from "@/components/app/chat/ChatContainer";
import ChatSidebarWrapper from "@/components/app/ChatSidebarWrapper";
import { getChatById } from "@/lib/chat/chatUtils";
import { getCurrentUser } from "@/lib/user/current-profile";
import { redirect } from "next/navigation";

interface ChatIdPageProps {
  params: Promise<{
    chatId: string;
  }>
}

const ChatIdPage = async ({
  params
}: ChatIdPageProps) => {

  // Get current user
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/?unauth=1");
  }

  // Validate chatId
  const { chatId } = await params;

  // find chat by ID
  let commonChat = await getChatById(chatId);

  if (!commonChat) {
    redirect("/app");
  }


  const isReady = true;

  if (!isReady) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-background text-foreground">
        Chat ID Page
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-900/60 backdrop-blur-xl">
      {/* Sidebar nur auf Desktop anzeigen */}
      <div className="hidden md:block">
        <ChatSidebarWrapper />
      </div>
      
      {/* Chat Content */}
      <ChatContainer
        chatId={chatId}
        currentUser={{ id: user.id, name: user.name || undefined, image: user.image || undefined }}
        otherUser={{
          id: commonChat.users.find(u => u.user.id !== user.id)?.user.id || "",
          name: commonChat.users.find(u => u.user.id !== user.id)?.user.name || "Unknown User",
          image: commonChat.users.find(u => u.user.id !== user.id)?.user.image || undefined
        }}
      />
    </div>
  );
}

export default ChatIdPage;