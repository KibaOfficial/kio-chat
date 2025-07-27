// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export { auth as middleware } from "@/auth";

// protect src/app/(main)/(routes)/app directory
export const config = {
  matcher: [
    "/app/:path*"
  ],
  runtime: "nodejs", // Ensure this is set to nodejs for compatibility with NextAuth
}