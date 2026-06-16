// import { initializeApp } from 'firebase/app';
// import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';

/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config file > pwa > workboxMode is set to "InjectManifest"
 */

declare const self: ServiceWorkerGlobalScope &
  typeof globalThis & { skipWaiting: () => void; registration: ServiceWorkerRegistration };

import { clientsClaim } from 'workbox-core';
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
} from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';

void self.skipWaiting();
clientsClaim();

// const firebaseApp = initializeApp({
//   apiKey: process.env.FIREBASE_API_KEY!,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
//   projectId: process.env.FIREBASE_PROJECT_ID!,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
//   appId: process.env.FIREBASE_APP_ID!,
// });

// const messaging = getMessaging(firebaseApp);

// onBackgroundMessage(messaging, (payload) => {
//   console.log('Push recebida no Service Worker', payload);

//   void self.registration.showNotification(payload.notification?.title || 'Gestor Varandão', {
//     body: payload.notification?.body || '',
//     icon: '/icons/icon-128x128.png',
//     badge: '/icons/icon-128x128.png',
//     tag: payload.notification?.title || 'gestor-varandao-notification',
//   });
// });

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

// Non-SSR fallbacks to index.html
// Production SSR fallbacks to offline.html (except for dev)
if (process.env.PROD) {
  registerRoute(
    new NavigationRoute(createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML), {
      denylist: [new RegExp(process.env.PWA_SERVICE_WORKER_REGEX), /workbox-(.)*\.js$/],
    }),
  );
}
