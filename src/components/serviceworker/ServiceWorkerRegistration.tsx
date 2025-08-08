// components/serviceworker/ServiceWorkerRegistration.tsx
'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function ServiceWorkerRegistration() {
  const { data: session } = useSession()
  const [pushSupported, setPushSupported] = useState<boolean | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator && session?.user) {
      registerServiceWorker()
    }
  }, [session])

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      
      // Check if this is Brave browser
      const isBrave = (navigator as any).brave !== undefined
      
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          console.log('Notification permission granted')
        }
      }

      // Subscribe to push notifications if permission granted
      if ('PushManager' in window && Notification.permission === 'granted') {
        const isBrave = (navigator as any).brave !== undefined
        if (isBrave) {
          console.warn('Brave browser detected. Push notifications may require "Use Google services for push messaging" to be enabled in brave://settings/privacy')
        }
        await subscribeToPushNotifications(registration)
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }

  const subscribeToPushNotifications = async (registration: ServiceWorkerRegistration) => {
    try {
      // Check if browser supports push notifications
      if (!('PushManager' in window)) {
        console.warn('Push notifications are not supported in this browser')
        setPushSupported(false)
        return
      }

      // Check if this is Brave browser
      const isBrave = (navigator as any).brave !== undefined
      if (isBrave) {
        console.warn('Brave browser detected. Push notifications may be blocked by Brave Shields.')
        // Don't return here, still try to subscribe
      }

      // VAPID public key - you'll need to generate this
      const applicationServerKey = urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
      )

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      })

      // Send subscription to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          userId: session?.user?.id
        })
      })

      console.log('Push subscription successful')
      setPushSupported(true)
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      setPushSupported(false)
      
      // Provide specific error messages for common issues
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.warn('Push notifications are not available in this browser (common in Brave)')
        } else if (error.name === 'NotSupportedError') {
          console.error('Push notifications are not supported')
        } else if (error.name === 'NotAllowedError') {
          console.error('Push notifications permission denied')
        }
      }
    }
  }

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }
  
  return (
    <div>
      {pushSupported === false && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded max-w-sm z-50">
          <div className="flex">
            <div className="py-1">
              <svg className="fill-current h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold">Push Notifications unavailable</p>
              <p className="text-sm">Your browser blocks push notifications. Try Chrome or Firefox for full functionality.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}