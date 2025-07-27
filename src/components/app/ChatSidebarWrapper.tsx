import { getCurrentUser } from "@/lib/user/current-profile";
import { redirect } from "next/navigation";
import { getChats } from "@/lib/chat/chatUtils";
import ChatSidebar from "./chat-sidebar";

export default async function ChatSidebarWrapper() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/?unauth=1");
    return null;
  }
  const chats = await getChats(user.id);
  return <ChatSidebar user={user} chats={chats} />;
}
