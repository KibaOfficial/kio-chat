// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import ChatSidebarWrapper from "@/components/app/ChatSidebarWrapper";

function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={'h-full'}>
      <main className="flex h-full bg-background text-foreground">
        <ChatSidebarWrapper />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AppLayout;