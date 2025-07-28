// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import ChatSidebarWrapper from "@/components/app/ChatSidebarWrapper";

export default async function AppPage() {
  return (
    <div className="flex h-full bg-background text-foreground flex-col md:flex-row">
      <ChatSidebarWrapper />
      <div className="hidden md:flex flex-1 items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Welcome to Kio-Chat</h1>
          <p className="text-muted-foreground text-sm">
            Select a chat to start messaging.
          </p>
        </div>
      </div>
    </div>
  );
}