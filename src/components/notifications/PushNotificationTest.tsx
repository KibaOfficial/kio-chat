// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { urlBase64ToUint8Array, isPushNotificationSupported, getNotificationPermission } from '@/lib/utils/webpush';

export default function PushNotificationTest() {
  const { data: session } = useSession();
  const [status, setStatus] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const checkNotificationPermission = () => {
    if (!('Notification' in window)) {
      setStatus('Notifications not supported');
      return false;
    }

    const permission = Notification.permission;
    setStatus(`Notification permission: ${permission}`);
    return permission === 'granted';
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      setStatus('Notifications not supported');
      return false;
    }

    const permission = await Notification.requestPermission();
    setStatus(`Permission ${permission === 'granted' ? 'granted' : 'denied'}`);
    return permission === 'granted';
  };

  const subscribeToPush = async () => {
    try {
      if (!session?.user?.id) {
        setStatus('Not logged in');
        return;
      }

      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        setStatus('Service worker not registered');
        return;
      }

      // Check if already subscribed
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        setStatus('Already subscribed to push notifications');
        setIsSubscribed(true);
        return;
      }

      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        setStatus('VAPID public key not configured');
        return;
      }

      const applicationServerKey = urlBase64ToUint8Array(publicKey);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });

      // Send subscription to server
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription })
      });

      if (response.ok) {
        setStatus('Successfully subscribed to push notifications!');
        setIsSubscribed(true);
      } else {
        setStatus('Failed to save subscription to server');
      }
    } catch (error) {
      console.error('Error subscribing to push:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const unsubscribeFromPush = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        setStatus('Service worker not registered');
        return;
      }

      const subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        setStatus('Not subscribed');
        return;
      }

      // Unsubscribe from push service
      await subscription.unsubscribe();

      // Remove from server
      await fetch('/api/push/subscribe', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint: subscription.endpoint })
      });

      setStatus('Unsubscribed from push notifications');
      setIsSubscribed(false);
    } catch (error) {
      console.error('Error unsubscribing:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const sendTestNotification = async () => {
    try {
      if (!session?.user?.id) {
        setStatus('Not logged in');
        return;
      }

      const response = await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          message: 'Test notification from Kio Chat! 🎉',
          chatId: 'test-chat'
        })
      });

      if (response.ok) {
        setStatus('Test notification sent!');
      } else {
        setStatus('Failed to send test notification');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
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
  };

  if (!session) {
    return <div className="p-4 text-gray-500">Please log in to test push notifications</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Push Notification Test</h2>
      
      <div className="space-y-3">
        <button
          onClick={checkNotificationPermission}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Check Permission
        </button>

        <button
          onClick={requestNotificationPermission}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Request Permission
        </button>

        <button
          onClick={subscribeToPush}
          disabled={isSubscribed}
          className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
        >
          {isSubscribed ? 'Already Subscribed' : 'Subscribe to Push'}
        </button>

        <button
          onClick={unsubscribeFromPush}
          disabled={!isSubscribed}
          className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
        >
          Unsubscribe from Push
        </button>

        <button
          onClick={sendTestNotification}
          disabled={!isSubscribed}
          className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-400"
        >
          Send Test Notification
        </button>
      </div>

      {status && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
          <strong>Status:</strong> {status}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p><strong>Note:</strong> Make sure VAPID keys are configured in your .env file</p>
        <p><strong>User ID:</strong> {session.user?.id}</p>
      </div>
    </div>
  );
}