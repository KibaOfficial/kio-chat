// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messageId, chatId } = await req.json();

    if (!messageId && !chatId) {
      return NextResponse.json({ error: "Either messageId or chatId is required" }, { status: 400 });
    }

    if (messageId) {
      // Mark specific message as read
      const message = await prisma.message.findUnique({
        where: { id: messageId },
        include: { chat: { include: { users: true } } }
      });

      if (!message) {
        return NextResponse.json({ error: "Message not found" }, { status: 404 });
      }

      // Verify user is in the chat
      const isUserInChat = message.chat.users.some(u => u.userId === session.user?.id);
      if (!isUserInChat) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
      }

      // Update message status to READ and set readAt timestamp
      await prisma.message.update({
        where: { id: messageId },
        data: {
          status: 'READ',
          readAt: new Date()
        }
      });
    } else if (chatId) {
      // Mark all messages in chat as read
      const chatUser = await prisma.chatUser.findFirst({
        where: {
          chatId,
          userId: session.user.id
        }
      });

      if (!chatUser) {
        return NextResponse.json({ error: "Not authorized for this chat" }, { status: 403 });
      }

      // Update all unread messages in the chat to READ
      await prisma.message.updateMany({
        where: {
          chatId,
          senderId: { not: session.user.id }, // Don't mark own messages
          status: { in: ['SENT', 'DELIVERED'] }
        },
        data: {
          status: 'READ',
          readAt: new Date()
        }
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("[MARK_READ]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}