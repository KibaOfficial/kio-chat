// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AuthButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  return session ? (
    <div className="flex items-center gap-4">
      <Image 
        src={session.user?.image || "https://i.pravatar.cc/150?u=default"}
        alt="User Avatar"
        width={50}
        height={50}
        className="rounded-full"
      />
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => signOut()}
      >
        Logout
      </Button>
    </div>
  ) : (
    <Button
      variant="default"
      className="mt-4"
      onClick={() => router.push("/auth")}
    >
      Sign-In
    </Button>
  )
}