// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use client"
import { useEffect, useRef, useState, useCallback, Fragment } from "react";
import io from "socket.io-client";
import qs from "query-string";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface ChatMessagesProps {
  name: string;
  chatId: string;
  currentUserId: string;
}

export const ChatMessages = ({ name, chatId, currentUserId }: ChatMessagesProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const chatRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  // Fetch messages paginated (newest first)
  const fetchMessages = useCallback(async (cursorParam?: string) => {
    setLoading(true);
    const url = qs.stringifyUrl({
      url: `/api/messages`,
      query: {
        chatId,
        cursor: cursorParam,
        limit: 20,
      },
    });
    const res = await fetch(url);
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = await res.json();
    if (Array.isArray(data.messages)) {
      setMessages((prev) => cursorParam ? [...data.messages, ...prev] : data.messages);
      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
    }
    setLoading(false);
  }, [chatId]);

  // Initial fetch
  useEffect(() => {
    setMessages([]);
    setCursor(undefined);
    setHasMore(true);
    fetchMessages();
  }, [chatId, fetchMessages]);

  // Infinite scroll: load older messages when scrolled to top
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || loading) return;
      const el = chatRef.current;
      if (el && el.scrollTop < 100) {
        fetchMessages(cursor);
      }
    };
    const el = chatRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, [cursor, hasMore, loading, fetchMessages]);

  // Socket.io for live updates
  useEffect(() => {
    const socket = io("https://kiochatws.kibaofficial.net");
    socketRef.current = socket;
    socket.emit("join", chatId);
    socket.on("message", (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.emit("leave", chatId);
      socket.disconnect();
    };
  }, [chatId]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto" ref={chatRef}>
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
        {messages.map((m, i) => {
          const isOwn = (m.sender?.id || m.senderId) === currentUserId;
          return (
            <div
              key={m.id || i}
              className={
                isOwn
                  ? "self-end max-w-[70%] bg-gradient-to-br from-blue-600/80 to-purple-600/80 text-white rounded-2xl rounded-br-md px-4 py-2 shadow-lg break-words overflow-hidden"
                  : "self-start max-w-[70%] bg-slate-800/80 text-slate-100 rounded-2xl rounded-bl-md px-4 py-2 shadow-md border border-slate-700/60 break-words overflow-hidden"
              }
            >
              <div className="overflow-x-auto">
                <ReactMarkdown
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    // Paragraph wrapping
                    p: ({children}) => (
                      <p className="break-words whitespace-pre-wrap">{children}</p>
                    ),
                    // Code blocks with proper wrapping
                    code({node, className = "", children, ...props}) {
                      const codeRef = useRef<HTMLElement>(null);
                      const isBlock = (className || "").includes("language-");
                      const handleCopy = () => {
                        if (codeRef.current) {
                          navigator.clipboard.writeText(codeRef.current.innerText || "");
                        }
                      };
                      return isBlock ? (
                        <div className="relative group my-2">
                          <pre className={`${className} overflow-x-auto`} style={{margin:0}}>
                            <code ref={codeRef} className="whitespace-pre-wrap break-all" {...props}>{children}</code>
                          </pre>
                          <button
                            type="button"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-zinc-700/80 text-xs text-white px-2 py-1 rounded hover:bg-zinc-800 z-10"
                            title="Copy code"
                            onClick={handleCopy}
                          >
                            Copy
                          </button>
                        </div>
                      ) : (
                        <code className={`${className} break-words whitespace-pre-wrap`} {...props}>{children}</code>
                      );
                    },
                    // Long links should break
                    a: ({children, ...props}) => (
                      <a {...props} className="break-all underline hover:opacity-80">
                        {children}
                      </a>
                    )
                  }}
                >{m.content}</ReactMarkdown>
              </div>
            </div>
          );
        })}
        {loading && <div className="text-center text-slate-400 py-2">Loading...</div>}
        {!hasMore && <div className="text-center text-slate-500 py-2 text-xs">No more messages</div>}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};