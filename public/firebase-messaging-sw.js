/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'Gestor Varandão';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/icons/icon-128x128.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// No final do seu firebase-messaging-sw.js, adicione:
self.addEventListener('push', (event) => {
  let payload = null;
  try {
    payload = event.data ? event.data.json() : null;
  } catch (e) {
    console.error('Erro ao converter payload para JSON', e);
  }

  if (payload) {
    // No iOS, se for enviado via Console, o payload geralmente segue esta estrutura:
    const notificationTitle = payload.notification?.title || 'Gestor Varandão';
    const notificationOptions = {
      body: payload.notification?.body || '',
      icon: '/icons/icon-128x128.png',
    };

    // Força o iOS a exibir a notificação imediatamente
    event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
  }
});
