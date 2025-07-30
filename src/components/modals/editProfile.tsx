// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";
import { useModal } from "../hooks/useModal";
import { User } from "@prisma/client";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import UserAvatar from "../app/user-avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional().or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
});

export const EditProfileModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === 'editProfile';
  
  // Use user from modal data, fallback to empty
  const user: Partial<User> = (data && 'user' in data && (data as any).user) ? (data as any).user : { name: "", email: "", image: "" };
  const [avatarUrl, setAvatarUrl] = useState(user.image);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      image: user.image || "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Only send fields that have values (not empty strings)
      const updateData: any = {};
      
      if (values.name && values.name.trim() !== "") {
        updateData.name = values.name.trim();
      }
      
      if (values.image !== undefined) {
        updateData.image = values.image === "" ? null : values.image;
      }
      
      if (values.password && values.password !== "") {
        updateData.password = values.password;
      }

      // Don't send email updates for now (usually requires verification)
      // TODO: implement email update flow or authentication by current password

      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        form.setError("root", { message: errorData.error || "Update failed" });
        return;
      }

      // Reset form and close modal on success
      form.reset();
      onClose();
      
      // Optional: Show success message or refresh user data
      window.location.reload(); // Simple way to refresh user data

    } catch (error) {
      console.error("Profile update error:", error);
      form.setError("root", { message: "Update failed. Please try again." });
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl">
        
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
            Edit your Profile
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col items-center gap-2 mb-4">
              <UserAvatar src={avatarUrl} className="w-20 h-20 border-2 border-blue-400" />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Avatar URL (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="Avatar URL (optional)"
                        className="bg-slate-900 border border-slate-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/60 rounded-lg mt-1"
                        {...field}
                        onChange={e => {
                          field.onChange(e);
                          setAvatarUrl(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Name (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Your name (optional)"
                      className="bg-slate-900 border border-slate-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/60 rounded-lg mt-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">E-Mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Your email (cannot be changed)"
                      className="bg-slate-900 border border-slate-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/60 rounded-lg mt-1"
                      {...field}
                      readOnly
                    />
                  </FormControl>
                  <p className="text-xs text-slate-500 mt-1">
                    E-mail cannot be changed for security reasons.
                  </p>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">New Password (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="New Password (leave empty if not changing)"
                      className="bg-slate-900 border border-slate-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/60 rounded-lg mt-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <div className="text-red-400 text-sm text-center">
                {form.formState.errors.root.message}
              </div>
            )}

            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 text-white font-bold py-2 rounded-lg shadow-lg hover:scale-105 transition-transform border-2 border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={isLoading}
              >
                {isLoading ? "saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}