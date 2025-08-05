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
import { useState, useEffect } from "react";
// import { UploadButton } from "@/lib/uploadthing"; // Replaced with MinIO
import { useProfileImageUpload } from "@/components/hooks/useMinioStorage";
import { useToastWithSound } from "@/lib/toast/toast-wrapper";
import { X, Upload } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional().or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
  description: z.string().max(200, "Description must be 200 characters or less").optional().or(z.literal("")),
});

export const EditProfileModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === 'editProfile';
  
  // Use user from modal data, fallback to empty
  const user: Partial<User> = (data && 'user' in data && (data as any).user) ? (data as any).user : { name: "", email: "", image: "" };
  const [avatarUrl, setAvatarUrl] = useState<string | undefined | null>(user.image);
  // const [isUploading, setIsUploading] = useState(false); // Old UploadThing state
  const { toast } = useToastWithSound();
  
  // MinIO profile image upload hook
  const { uploadProfileImage, isUploading } = useProfileImageUpload({
    onUploadComplete: (response) => {
      if (response.url) {
        setAvatarUrl(response.url);
        form.setValue("image", response.url);
        toast.success("Profile image uploaded successfully!");
      }
    },
    onError: (error) => {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
    }
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      image: user.image || "",
      password: "",
      description: user.description || "",
    },
  });

  // Update form and avatar when modal opens with new user data
  useEffect(() => {
    if (isModalOpen && user) {
      setAvatarUrl(user.image);
      form.reset({
        name: user.name || "",
        email: user.email || "",
        image: user.image || "",
        password: "",
        description: user.description || "",
      });
    }
  }, [isModalOpen, user.id, user.image, user.name, user.email]); // Remove form from dependencies

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

      if (values.description !== undefined) {
        updateData.description = values.description === "" ? null : values.description.trim();
      }

      // Don't send email updates for now (usually requires verification)
      // TODO: implement email update flow or authentication by current password

      const response = await fetch("/api/profile/update", {
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
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="relative group">
                <UserAvatar src={avatarUrl} className="w-24 h-24 border-4 border-blue-400/50" />
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarUrl("");
                      form.setValue("image", "");
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
                    title="Remove avatar"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              <div className="flex flex-col items-center gap-2">
                {/* MinIO Upload Button */}
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      uploadProfileImage(file);
                    }
                  }}
                  disabled={isUploading}
                />
                <label
                  htmlFor="avatar-upload"
                  className={`bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-all hover:scale-105 shadow-lg cursor-pointer ${
                    isUploading ? 'animate-pulse opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Upload size={16} />
                    {isUploading ? "Uploading..." : "Upload Avatar"}
                  </div>
                </label>
                <p className="text-xs text-slate-500 text-center">
                  Upload a profile image or leave empty for default avatar
                </p>
                
                {/* Old UploadThing Implementation - Commented out */}
                {/*
                <UploadButton
                  endpoint="profileImage"
                  onUploadBegin={() => {
                    setIsUploading(true);
                  }}
                  onClientUploadComplete={(res) => {
                    const fileUrl = res?.[0]?.ufsUrl || res?.[0]?.url;
                    if (fileUrl) {
                      setAvatarUrl(fileUrl);
                      form.setValue("image", fileUrl);
                      toast.success("Profile image uploaded successfully!");
                    }
                    setIsUploading(false);
                  }}
                  onUploadError={(error) => {
                    console.error("Upload error:", error);
                    toast.error("Upload failed. Please try again.");
                    setIsUploading(false);
                  }}
                  appearance={{
                    button: "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-all hover:scale-105 shadow-lg ut-uploading:animate-pulse",
                    allowedContent: "text-xs text-slate-400 mt-1",
                  }}
                  content={{
                    button: (
                      <div className="flex items-center gap-2">
                        <Upload size={16} />
                        {isUploading ? "Uploading..." : "Upload Avatar"}
                      </div>
                    ),
                  }}
                />
                */}
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Username</FormLabel>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">About</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Tell others about yourself..."
                      className="w-full bg-slate-900 border border-slate-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/60 rounded-lg mt-1 p-3 resize-none"
                      rows={3}
                      maxLength={200}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center mt-1">
                    <FormMessage />
                    <span className="text-xs text-slate-500">
                      {field.value?.length || 0}/200
                    </span>
                  </div>
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
                  <FormLabel className="text-slate-300">New Password</FormLabel>
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