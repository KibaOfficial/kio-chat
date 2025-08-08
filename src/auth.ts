// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export const runtime = "nodejs";
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import customAdapter from "./lib/adapter/customAdapter";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: customAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: (credentials.email as string).toLowerCase() },
        });
        if (!user || !user.password) return null;
        if (!user.approved) {
          // Throw error to show message in UI (NextAuth will catch and display)
          throw new Error("Dein Account wurde noch nicht freigeschaltet. Bitte warte auf die Freigabe durch einen Admin.");
        }
        const isValid = await bcrypt.compare(credentials.password as string, user.password);
        if (!isValid) return null;
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth",
    error: "/auth", // Redirect OAuth errors back to auth page
  },
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers (Discord), check if user is approved
      if (account?.provider === "discord") {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { approved: true }
        });
        
        if (dbUser && !dbUser.approved) {
          // Return false to prevent sign in - NextAuth will redirect to error page
          return false;
        }
      }
      
      return true;
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
