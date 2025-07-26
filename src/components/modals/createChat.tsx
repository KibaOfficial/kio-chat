// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use cllient";

import z from "zod";
import { useModal } from "../hooks/useModal";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  isGroup: z.boolean().optional() // currently not needed as i take care first of the 1:1 chat creation
});

export const CreateChatModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === 'createNewChat';

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      isGroup: data?.isGroup || false,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          isGroup: values.isGroup,
        }),
      });

      if (response.status === 404) {
        form.setError("username", { message: "User not found or invalid." });
        return;
      }
      if (response.status === 401) {
        form.setError("username", { message: "You are not authorized." });
        return;
      }
      if (!response.ok) {
        form.setError("username", { message: "Failed to create chat." });
        return;
      }

      const chat = await response.json();
      form.reset();
      onClose();
      router.push(`/app/chat/${chat.id}`);
    } catch (error) {
      form.setError("username", { message: "An unexpected error occurred." });
      console.error("Error creating chat:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl text-white p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Create New Chat
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-400 text-lg font-semibold">Username</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter username"
                        {...field}
                        className="bg-slate-900 border border-slate-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 rounded-lg mt-1 px-4 py-3 transition-all duration-200 shadow-sm"
                        autoFocus
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="px-6 pb-8">
              <Button variant="primary" size="lg" className="w-full rounded-xl shadow-lg" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}