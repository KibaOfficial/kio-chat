// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use client"
import { useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "@/components/hooks/useSocket";
import { TypingIndicator } from "./TypingIndicator";
import io from "socket.io-client";
import qs from "query-string";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { useModal } from "@/components/hooks/useModal";
import UserAvatar from "../user-avatar";
import { FileIcon, ImageIcon, Download } from "lucide-react";
import Image from "next/image";
import { formatMessageTime, shouldGroupMessages } from "@/lib/utils/time";
import { MessageStatus, getMessageStatus } from "./MessageStatus";

interface ChatMessagesProps {
  name: string;
  chatId: string;
  currentUserId: string;
  currentUser: { id: string; name?: string; image?: string };
}

// Helper function to determine if URL or fileName is an image
const isImageFile = (url: string, fileName?: string) => {
  // Check filename first if available
  if (fileName && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileName)) {
    return true;
  }
  // Fallback to URL check
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
};

// Helper function to get filename from URL  
const getFileName = (url: string) => {
  if (!url) return 'file';
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return pathname.split('/').pop() || 'file';
  } catch {
    return url.split('/').pop() || 'file';
  }
};

export const ChatMessages = ({ name, chatId, currentUserId, currentUser }: ChatMessagesProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const chatRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { onOpen } = useModal();
  
  // Use socket hook for typing indicators and receive messages
  const { typingUsers, onlineUsers } = useSocket(chatId, currentUser);

  // Handle avatar click to open user card modal
  const handleAvatarClick = (user: any) => {
    onOpen('userCard', { 
      user: user,
      currentUser: currentUser 
    });
  };

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

  // Socket.io for live message updates (separate from typing indicators)
  useEffect(() => {
    const socket = io("https://kiochatws.kibaofficial.net");
    socket.emit("join", chatId);
    socket.on("message", (msg: any) => {
      setMessages((prev) => {
        // Check if message already exists to prevent duplicates (check by ID and content)
        const exists = prev.some(existingMsg => 
          existingMsg.id === msg.id || 
          (existingMsg.content === msg.content && 
           Math.abs(new Date(existingMsg.createdAt).getTime() - new Date(msg.createdAt).getTime()) < 1000)
        );
        if (exists) {
          return prev;
        }
        return [...prev, msg];
      });
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
    <div 
      className="flex-1 flex flex-col py-4 overflow-y-auto custom-scrollbar" 
      ref={chatRef}
    >
      {/* Chat Messages */}
      <div className="flex flex-col px-2 pb-2 mt-auto">
        {messages.map((m, i) => {
          const isOwn = (m.sender?.id || m.senderId) === currentUserId;
          const messageUser = m.sender || { id: m.senderId };
          const previousMessage = i > 0 ? messages[i - 1] : null;
          const nextMessage = i < messages.length - 1 ? messages[i + 1] : null;
          const isGrouped = shouldGroupMessages(previousMessage, m);
          const isLastInGroup = i === messages.length - 1 || !shouldGroupMessages(m, nextMessage);
          
          // Create truly unique key - prefer ID, fallback to index with random suffix
          const uniqueKey = m.id ? `msg-${m.id}` : `temp-${i}-${Math.random().toString(36).substr(2, 9)}`;
          
          return (
            <div key={uniqueKey} className={`${isGrouped ? 'mt-1' : 'mt-4'}`}>
              <div className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* User Avatar - only show if not grouped */}
                <div className="w-8 h-8 flex-shrink-0">
                  {!isGrouped && (
                    <div 
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleAvatarClick(messageUser)}
                    >
                      <UserAvatar 
                        src={messageUser.image} 
                        className="h-8 w-8"
                        showOnlineStatus={true}
                        isOnline={onlineUsers.some(user => user.userId === messageUser.id)}
                      />
                    </div>
                  )}
                </div>
              
              {/* Message Bubble */}
              <div
                className={
                  isOwn
                    ? `max-w-[70%] bg-gradient-to-br from-blue-600/80 to-purple-600/80 text-white rounded-2xl rounded-br-md shadow-lg break-words overflow-hidden ${
                        (m.fileUrl && isImageFile(m.fileUrl, m.fileName) && (!m.content || m.content.startsWith('📎'))) 
                          ? 'p-1' 
                          : (m.fileUrl && isImageFile(m.fileUrl, m.fileName)) 
                            ? 'p-1' 
                            : 'px-4 py-2'
                      }`
                    : `max-w-[70%] bg-slate-800/80 text-slate-100 rounded-2xl rounded-bl-md shadow-md border border-slate-700/60 break-words overflow-hidden ${
                        (m.fileUrl && isImageFile(m.fileUrl, m.fileName) && (!m.content || m.content.startsWith('📎'))) 
                          ? 'p-1' 
                          : (m.fileUrl && isImageFile(m.fileUrl, m.fileName)) 
                            ? 'p-1' 
                            : 'px-4 py-2'
                      }`
                }
              >
                {/* File Attachment */}
                {(m.fileUrl || (m.content && m.content.includes('📎'))) && (
                  <div className="">
                    {m.fileUrl ? (
                      (() => {
                        // Extract the MinIO key from the fileUrl
                        let minioKey = m.fileUrl;
                        try {
                          const urlObj = new URL(m.fileUrl);
                          const idx = urlObj.pathname.indexOf('/kio-chat-storage/');
                          minioKey = idx >= 0 ? urlObj.pathname.substring(idx + '/kio-chat-storage/'.length) : urlObj.pathname.slice(1);
                        } catch {
                          const idx = m.fileUrl.indexOf('/kio-chat-storage/');
                          minioKey = idx >= 0 ? m.fileUrl.substring(idx + '/kio-chat-storage/'.length) : m.fileUrl;
                        }
                        return isImageFile(m.fileUrl, m.fileName) ? (
                          <div className="relative group">
                            <div className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                              <Image 
                                src={m.fileUrl} 
                                alt={m.fileName || "Uploaded image"}
                                width={400}
                                height={256}
                                className="object-cover w-full h-auto max-h-64 rounded-lg"
                                onClick={() => window.open(`/api/storage/download?bucket=kio-chat-storage&file=${encodeURIComponent(minioKey)}`, '_blank')}
                                unoptimized
                              />
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <a 
                                href={`/api/storage/download?bucket=kio-chat-storage&file=${encodeURIComponent(minioKey)}`}
                                download={m.fileName}
                                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                title="Download image"
                              >
                                <Download size={16} />
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className={`flex items-center gap-3 p-3 rounded-lg ${
                            isOwn 
                              ? 'bg-white/10 hover:bg-white/20' 
                              : 'bg-slate-700/50 hover:bg-slate-700/70'
                          } transition-colors cursor-pointer`}>
                            <FileIcon size={24} className="text-blue-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {getFileName(m.fileUrl)}
                              </div>
                              <div className="text-xs opacity-70">
                                Click to download
                              </div>
                            </div>
                            <a 
                              href={`/api/storage/download?bucket=kio-chat-storage&file=${encodeURIComponent(minioKey)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-full hover:bg-white/10 transition-colors"
                              title="Open file"
                            >
                              <Download size={16} />
                            </a>
                          </div>
                        );
                      })()
                    ) : (
                      <div className={`flex items-center gap-3 p-3 rounded-lg ${
                        isOwn 
                          ? 'bg-white/10' 
                          : 'bg-slate-700/50'
                      }`}>
                        <FileIcon size={24} className="text-orange-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            File uploaded (URL missing)
                          </div>
                          <div className="text-xs opacity-70">
                            Server needs to save fileUrl
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Text Content */}
                {m.content && !m.content.startsWith('📎') && (
                  <div className={`overflow-x-auto ${m.fileUrl && isImageFile(m.fileUrl, m.fileName) ? 'px-3 pb-1' : ''}`}>
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
                )}
              </div>
              </div>
              
              {/* Timestamp and Message Status - only show if not grouped or last in group */}
              {(!isGrouped || isLastInGroup) && (
                <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mt-1 px-2`}>
                  <div className="ml-10 flex items-center gap-2">
                    <span className="text-xs text-slate-500 select-none">
                      {formatMessageTime(m.createdAt)}
                    </span>
                    {/* Message Status - only show for sent messages (own messages) */}
                    {isOwn && (
                      <MessageStatus 
                        status={getMessageStatus(m)}
                        className="ml-1"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {loading && <div className="text-center text-slate-400 py-2">Loading...</div>}
        {!hasMore && <div className="text-center text-slate-500 py-2 text-xs">No more messages</div>}
        
        {/* Typing Indicator */}
        <TypingIndicator typingUsers={typingUsers} />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};