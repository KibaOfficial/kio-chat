// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client"

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useToastWithSound } from "@/lib/toast/toast-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { title } from "process";
import { useEffect, useRef } from "react";
import { useMemo } from "react";
import io from "socket.io-client";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  content: z.string().min(1),
});

interface ChatInputProps {
  userName: string;
  chatId: string;
  senderId: string; // User ID of the sender, required for message sending
}

export const ChatInput = ({ userName, chatId, senderId }: ChatInputProps) => {
  // Socket.IO-Client initialisieren (Memoized, damit nicht bei jedem Render neu)
  const socket = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "wss://kiochatws.kibaofficial.net";
    return io(url);
  }, []);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px"; // max-h-40 = 160px
  }, [form.watch("content")]);

  useEffect(() => {
    if (form.watch("content") === "") {
      inputRef.current?.focus();
    }
  }, [form.watch("content")]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (isLoading) return;

    console.log("Sending message:", data);

    // Nachricht über Socket senden
    socket.emit("message", {
      chatId,
      senderId: senderId, // <-- MUSS eine User-ID sein!
      content: data.content,
    });
    form.resetField("content");
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Verhindert neue Zeile
      if (form.watch('content').trim()) {
        form.handleSubmit(onSubmit)(); // Sendet die Nachricht
      }
    }
    // Shift+Enter lässt das normale Verhalten zu (neue Zeile)
  };

  const { toast } = useToastWithSound();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative flex items-end bg-slate-900/60 border border-slate-800/50 rounded-2xl shadow-xl backdrop-blur-xl px-4 py-3 gap-3">
                  {/* Fileupload Button */}
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Fileupload not implemented yet');
                      toast.info("File upload feature is not implemented yet.")

                    }}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 shadow-lg border-4 border-slate-900/80 hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label="Upload file"
                  >
                    {/* Paperclip Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6.5v7a4.5 4.5 0 11-9 0v-7a3.5 3.5 0 117 0v7a2.5 2.5 0 11-5 0v-7" />
                    </svg>
                  </button>
                  {/* Textarea */}
                  <textarea
                    {...field}
                    ref={inputRef}
                    rows={1}
                    maxLength={1000}
                    placeholder={`Message @${userName}...`}
                    className="flex-1 resize-none bg-transparent text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-xl px-4 py-2 text-base max-h-40 min-h-[40px]"
                    disabled={isLoading}
                    onInput={field.onChange}
                    onBlur={field.onBlur}
                    onKeyDown={handleKeyDown}
                    value={field.value}
                  />
                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !form.watch('content')}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 shadow-lg border-4 border-slate-900/80 hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Send message"
                  >
                    {/* Send Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20l16-8-16-8v6l12 2-12 2v6z" />
                    </svg>
                  </button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}