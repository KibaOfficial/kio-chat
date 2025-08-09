// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Utility functions for Web Push notifications
 */

/**
 * Converts a base64 URL-safe string to Uint8Array for VAPID keys
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Detects if the current browser is Brave
 */
export function isBraveBrowser(): boolean {
  return 'brave' in navigator;
}

/**
 * Checks if push notifications are supported
 */
export function isPushNotificationSupported(): boolean {
  return 'serviceWorker' in navigator && 
         'PushManager' in window && 
         'Notification' in window;
}

/**
 * Gets the current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  return Notification.permission;
}