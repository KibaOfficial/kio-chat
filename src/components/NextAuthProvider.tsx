// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";

import { SessionProvider } from "next-auth/react";

export function NextAuthProvider({children}: {children: React.ReactNode}) {
  return <SessionProvider>{children}</SessionProvider>
};