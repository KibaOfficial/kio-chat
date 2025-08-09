// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import webpush from 'web-push';
import { prisma } from './prisma';

// Configure web-push with VAPID keys
if (process.env.VAPID_EMAIL && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:' + process.env.VAPID_EMAIL,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export async function sendPushNotification(userId: string, payload: NotificationPayload) {
  try {
    // Get all push subscriptions for the user
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId }
    });

    if (subscriptions.length === 0) {
      console.log('No push subscriptions found for user:', userId);
      return { success: true, sent: 0, failed: 0 };
    }

    const notificationData = {
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/icon-192x192.png',
      badge: payload.badge || '/icon-72x72.png',
      tag: payload.tag || 'notification',
      data: payload.data || {},
      actions: payload.actions || [],
      vibrate: [200, 100, 200],
      requireInteraction: false
    };

    // Send notifications to all user's devices
    const results = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.p256dh,
                auth: subscription.auth
              }
            },
            JSON.stringify(notificationData)
          );
          return { success: true, endpoint: subscription.endpoint };
        } catch (error: any) {
          console.error('Failed to send notification:', error);
          
          // Remove invalid subscriptions (expired or unsubscribed)
          if (error.statusCode === 410 || error.statusCode === 404) {
            await prisma.pushSubscription.delete({
              where: { id: subscription.id }
            }).catch(() => {}); // Ignore deletion errors
          }
          
          throw error;
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Push notifications sent: ${successful} successful, ${failed} failed`);

    return {
      success: true,
      sent: successful,
      failed,
      results
    };

  } catch (error) {
    console.error('Error sending push notifications:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function sendMessageNotification(
  recipientUserId: string, 
  senderName: string, 
  messageContent: string, 
  chatId: string,
  messageId: string,
  senderImage?: string
) {
  const payload: NotificationPayload = {
    title: `New message from ${senderName}`,
    body: messageContent.length > 100 
      ? messageContent.substring(0, 100) + '...' 
      : messageContent,
    icon: senderImage || '/icon-192x192.png',
    tag: `chat-${chatId}`,
    data: {
      chatId,
      messageId,
      type: 'message'
    },
    actions: [
      {
        action: 'reply',
        title: 'Reply',
      },
      {
        action: 'mark-read',
        title: 'Mark as Read',
      }
    ]
  };

  return await sendPushNotification(recipientUserId, payload);
}

export async function sendTypingNotification(
  recipientUserId: string,
  senderName: string,
  chatId: string
) {
  const payload: NotificationPayload = {
    title: `${senderName} tippt...`,
    body: 'Neue Nachricht wird geschrieben',
    tag: `typing-${chatId}`,
    data: {
      chatId,
      type: 'typing'
    }
  };

  return await sendPushNotification(recipientUserId, payload);
}