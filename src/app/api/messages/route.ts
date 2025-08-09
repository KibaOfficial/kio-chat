// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

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

