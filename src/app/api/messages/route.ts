// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendMessageNotification } from "@/lib/push-notifications";

const MESSAGES_BATCH = parseInt(process.env.MESSAGES_BATCH || "20", 10);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");
    const cursor = searchParams.get("cursor");
    const limit = Number(searchParams.get("limit") || MESSAGES_BATCH);

    if (!chatId) {
      return new Response("Missing chatId", { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "desc" },
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      include: { sender: true },
    });

    const nextCursor = messages.length === limit ? messages[messages.length - 1].id : null;

    return Response.json({
      messages: messages.reverse(), // oldest first
      nextCursor,
    });
  } catch (error) {
    console.error("[MESSAGES_GET]", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId, content, fileUrl, fileName } = await req.json();

    if (!chatId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify user is member of the chat
    const chatUser = await prisma.chatUser.findFirst({
      where: {
        chatId,
        userId: session.user.id
      }
    });

    if (!chatUser) {
      return NextResponse.json({ error: "Not authorized for this chat" }, { status: 403 });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        chatId,
        senderId: session.user.id,
        content,
        fileUrl,
        fileName
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    // Update chat's updatedAt timestamp
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() }
    });

    // Get all other users in the chat for notifications
    const otherChatUsers = await prisma.chatUser.findMany({
      where: {
        chatId,
        userId: { not: session.user.id }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Send push notifications to all other users in the chat
    const notificationPromises = otherChatUsers.map(chatUser =>
      sendMessageNotification(
        chatUser.userId,
        message.sender.name,
        content,
        chatId,
        message.id,
        message.sender.image || undefined
      )
    );

    // Send notifications in background (don't wait for them)
    Promise.all(notificationPromises).catch(error => {
      console.error('Failed to send push notifications:', error);
    });

    return NextResponse.json(message);

  } catch (error) {
    console.error("[MESSAGES_POST]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

