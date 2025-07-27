// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client"
import { useRef } from "react";

interface ChatMessagesProps {
  name: string
}

export const ChatMessages = ({
  name
}: ChatMessagesProps) => {

  const bottomRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  return (
    <div className="flex-1 flex flex-col justify-end px-2 py-4 overflow-y-auto">
      <div className="flex-1" />
      {/* Chat Header */}
      <div className="px-6 py-3 mb-2 rounded-2xl bg-gradient-to-r from-blue-900/60 via-purple-900/50 to-emerald-900/40 border border-slate-800/50 shadow-xl backdrop-blur-xl">
        <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
          @{name}
        </p>
        <p className="text-slate-400 text-sm mt-1">
          This is the start of your conversation with <span className="font-semibold">@{name}</span>.
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex flex-col gap-3 px-2 pb-2 mt-auto">
        {/* Beispiel-Nachrichten, ersetzen durch echte Messages */}
        <div className="self-end max-w-[70%] bg-gradient-to-br from-blue-600/80 to-purple-600/80 text-white rounded-2xl rounded-br-md px-4 py-2 shadow-lg">
          Hi @{name}, how are you?
        </div>
        <div className="self-start max-w-[70%] bg-slate-800/80 text-slate-100 rounded-2xl rounded-bl-md px-4 py-2 shadow-md border border-slate-700/60">
          I'm good! This is a demo message bubble.
        </div>
      </div>

      <div ref={bottomRef} />
    </div>
  )
}