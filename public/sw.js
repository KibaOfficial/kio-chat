// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const CACHE_NAME = 'kio-chat-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.claim();
});

// Push event handler
self.addEventListener('push', function(event) {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon || '/icon-192x192.png',
    badge: '/icon-72x72.png',
    tag: data.tag || 'message',
    data: data.data || {},
    actions: [
      {
        action: 'reply',
        title: 'Reply',
        icon: '/icons/reply.png'
      },
      {
        action: 'mark-read',
        title: 'Mark as Read',
        icon: '/icons/read.png'
      }
    ],
    vibrate: [200, 100, 200],
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'reply') {
    // Handle reply action
    event.waitUntil(
      clients.openWindow(`/app/chat/${encodeURIComponent(event.notification.data.chatId)}#reply`)
    );
  } else if (event.action === 'mark-read') {
    // Handle mark as read action
    fetch('/api/messages/mark-read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messageId: event.notification.data.messageId
      })
    });
  } else {
    // Default action - open chat
    event.waitUntil(
      clients.openWindow(`/app/chat/${encodeURIComponent(event.notification.data.chatId)}`)
    );
  }
});

// Background sync for offline support
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle background sync logic here
  return Promise.resolve();
}