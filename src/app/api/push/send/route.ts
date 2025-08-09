// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import webpush from 'web-push';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, message, chatId } = await req.json();

    if (!userId || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get user's push subscriptions
    const subscriptions = await prisma.pushSubscription.findMany({
      where: {
        userId: userId
      }
    });

    if (subscriptions.length === 0) {
      return NextResponse.json({ message: "No subscriptions found for user" });
    }

    // Configure web-push
    webpush.setVapidDetails(
      'mailto:' + process.env.VAPID_EMAIL,
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    );

    // Get sender info
    const sender = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, image: true }
    });

    const payload = JSON.stringify({
      title: `New message from ${sender?.name || 'Unbekannt'}`,
      body: message.length > 100 ? message.substring(0, 100) + '...' : message,
      icon: sender?.image || '/icon-192x192.png',
      tag: `chat-${chatId}`,
      data: {
        chatId,
        messageId: message.id,
        senderId: session.user.id
      }
    });

    // Send notifications to all user's devices
    const notificationPromises = subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth
            }
          },
          payload
        );
        return { success: true, endpoint: subscription.endpoint };
      } catch (error) {
        console.error('Failed to send notification:', error);
        
        // Remove invalid subscriptions
        if (
          typeof error === "object" &&
          error !== null &&
          "statusCode" in error &&
          (error as any).statusCode === 410 || (error as any).statusCode === 404
        ) {
          await prisma.pushSubscription.delete({
            where: { id: subscription.id }
          });
        }
        
        return { success: false, endpoint: subscription.endpoint, error };
      }
    });

    const results = await Promise.all(notificationPromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return NextResponse.json({ 
      message: `Notifications sent: ${successful} successful, ${failed} failed`,
      results 
    });

  } catch (error) {
    console.error("Push notification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}