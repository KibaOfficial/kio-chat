// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ChatHeader } from "@/components/app/chat/ChatHeader";
import { ChatMessages } from "@/components/app/chat/ChatMessages";
import { ChatInput } from "@/components/app/chat/Input";
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
    return null;
  }

  // Validate chatId
  const { chatId } = await params;

  // find chat by ID
  let commonChat = await getChatById(chatId);

  if (!commonChat) {
    redirect("/app");
  }

  // debug logs
  console.log("Chat ID:", chatId);
  console.log("Common Chat:", commonChat);

  const isReady = true;

  if (!isReady) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-background text-foreground">
        Chat ID Page
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-900/60 backdrop-blur-xl p-0">
      <div className="w-full h-full flex flex-col grow shadow-2xl border border-slate-800/50 bg-slate-900/60 backdrop-blur-xl overflow-hidden">
        {/* Chat Header */}
        <ChatHeader 
          name={commonChat.users.find(u => u.user.id !== user.id)?.user.name || "Unknown User"}
          lastOnline="Just now"
          image={commonChat.users.find(u => u.user.id !== user.id)?.user.image || ""}
        />
        <ChatMessages
          name={commonChat.users.find(u => u.user.id !== user.id)?.user.name || "Unknown User"}
        />
        <div className="px-2 pb-2">
          <ChatInput
            userName={commonChat.users.find(u => u.user.id !== user.id)?.user.name || "Unknown User"}
          />
        </div>
      </div>
    </div>
  )
  
}

 
export default ChatIdPage;