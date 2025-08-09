// components/serviceworker/ServiceWorkerRegistration.tsx
'use client'
import { useEffect } from 'react'

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
        })
        .catch((registrationError) => {
        });
    }
  }, [])
  
  return null
}