// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default async function AppPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Welcome to Kio-Chat</h1>
        <p className="text-muted-foreground text-sm">
          Select a chat to start messaging.
        </p>
      </div>
    </div>
  );
}
