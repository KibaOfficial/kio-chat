// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";

interface Props {
  session: any;
}

export default function AppClientPage({ session }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      toast.error("You must be signed in to access this page.");
      router.push("/");
    }
  }, [session, router]);

  if (!session) return null; // oder ein Loading/Error-Fallback

  return (
    <div>
      <h1>Kio-Chat</h1>
      <p>Welcome to Kio-Chat, {session.user?.name}!</p>
    </div>
  );
}
