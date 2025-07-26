// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());