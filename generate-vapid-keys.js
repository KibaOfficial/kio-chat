// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const webpush = require('web-push');

const vapidKeys = webpush.generateVAPIDKeys();

console.log('🔑 VAPID Keys generated!');
console.log('');
console.log('Add these to your .env files:');
console.log('');
console.log('NEXT_PUBLIC_VAPID_PUBLIC_KEY=' + vapidKeys.publicKey);
console.log('VAPID_PRIVATE_KEY=' + vapidKeys.privateKey);
console.log('VAPID_EMAIL=your-email@domain.com');
console.log('');
console.log('⚠️  Make sure to use the SAME keys in both frontend and backend!');
console.log('⚠️  Keep the private key secret!');