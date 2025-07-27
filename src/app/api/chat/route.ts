// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user/current-profile";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const { username, isGroup } = await req.json();
    
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (!username || typeof username !== "string") {
      return new Response("Invalid username", { status: 400 });
    }

    // 1. search for target user
    const targetUser = await prisma.user.findFirst({
      where: { name: username },
    });

    if (!targetUser || targetUser.id === user.id) {
      return new Response("User not found or invalid", { status: 404 });
    }

    // 2. Check if a 1:1 chat already exists
    const existingChat = await prisma.chat.findFirst({
      where: {
        isGroup: false,
        users: {
          some: { userId: user.id },
        },
        AND: {
          users: {
            some: { userId: targetUser.id },
          },
        },
      },
      include: {
        users: { include: { user: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
    if (existingChat) {
      return new Response(JSON.stringify({ id: existingChat.id }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. Create chat with both users
    const chat = await prisma.chat.create({
      data: {
        isGroup: false,
        users: {
          create: [
            { userId: user.id },
            { userId: targetUser.id },
          ],
        },
        messages: {
          create: {
            content: `Chat created with ${targetUser.name}`,
            senderId: user.id,
          },
        },
      },
      include: {
        users: { include: { user: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
    return new Response(JSON.stringify({ id: chat.id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.group("CHAT_POST", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}