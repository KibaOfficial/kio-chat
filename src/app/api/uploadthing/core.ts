// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { auth } from "@/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();

const handleAuth = async () => {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    return { userId: session.user.id };
}
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  profileImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(({ metadata, file }) => {
      console.log("📤 Profile image upload complete:", { 
        url: file.url, 
        key: file.key, 
        name: file.name,
        size: file.size 
      });
      return { url: file.url, key: file.key, name: file.name };
    }),
  messageFile: f([ "image", "pdf" ])
    .middleware(() => handleAuth())
    .onUploadComplete(({ metadata, file }) => {
      console.log("📤 Message file upload complete:", { 
        url: file.url, 
        key: file.key, 
        name: file.name,
        size: file.size 
      });
      return { url: file.url, key: file.key, name: file.name };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;