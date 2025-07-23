// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { Github } from "lucide-react";
import Image from "next/image";

interface OAuthButtonProps {
  type: "github" | "discord";
}

const OAuthButton = ({ type }: OAuthButtonProps) => {
  const label = `Sign in with ${type[0].toUpperCase() + type.slice(1)}`;

  // Custom styles for each provider
  const baseClass =
    "mt-2 flex items-center justify-center w-full font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 text-white text-base";
  const githubClass =
    "bg-gradient-to-r from-slate-800 via-slate-900 to-blue-900 hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60";
  const discordClass =
    "bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/60";

  return (
    <Button
      variant="default"
      className={
        baseClass +
        " " +
        (type === "github" ? githubClass : discordClass)
      }
      onClick={() => signIn(type)}
      aria-label={label}
      type="button"
    >
      {type === "github" ? (
        <Github className="w-5 h-5 mr-2" />
      ) : (
        <Image
          src="/icons/discord.svg"
          alt="Discord Logo"
          width={20}
          height={20}
          className="mr-2"
        />
      )}
      {label}
    </Button>
  );
};

export default OAuthButton;
