import { getMessaging, onMessage } from 'firebase/messaging';
import { firebaseApp } from 'src/boot/firebase';

export async function registrarPush() {
  if (
    typeof window === 'undefined' ||
    !('Notification' in window) ||
    !('serviceWorker' in navigator)
  ) {
    console.warn('Push notifications are not supported in this environment.');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      return null;
    }

    const messaging = getMessaging(firebaseApp);

    // Registra o Service Worker explicitamente para evitar erros de resolução em desenvolvimento (Vite/Quasar)
    // const swUrl =
    //   `/firebase-messaging-sw.js` +
    //   `?apiKey=${encodeURIComponent(import.meta.env.VITE_FIREBASE_API_KEY || '')}` +
    //   `&authDomain=${encodeURIComponent(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '')}` +
    //   `&projectId=${encodeURIComponent(import.meta.env.VITE_FIREBASE_PROJECT_ID || '')}` +
    //   `&storageBucket=${encodeURIComponent(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '')}` +
    //   `&messagingSenderId=${encodeURIComponent(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '')}` +
    //   `&appId=${encodeURIComponent(import.meta.env.VITE_FIREBASE_APP_ID || '')}`;

    return {
      provide: {
        messaging,
      },
    };
  } catch (error) {
    console.error('Erro ao obter token de push do Firebase:', error);
    return null;
  }
}

export function inicializarMensagensForeground() {
  if (
    typeof window === 'undefined' ||
    !('Notification' in window) ||
    !('serviceWorker' in navigator)
  ) {
    return;
  }

  try {
    const messaging = getMessaging(firebaseApp);
    onMessage(messaging, (payload) => {
      console.log('Mensagem push recebida em primeiro plano (foreground):', payload);

      if (Notification.permission === 'granted') {
        void navigator.serviceWorker.ready.then((registration) => {
          const options: NotificationOptions = {
            body: payload.notification?.body || '',
            icon: '/icons/icon-128x128.png',
            badge: '/icons/icon-128x128.png',
          };
          if (payload.collapseKey) {
            options.tag = payload.collapseKey;
          }
          void registration.showNotification(
            payload.notification?.title || 'Gestor Varandão',
            options,
          );
        });
      }
    });
  } catch (error) {
    console.error('Erro ao escutar mensagens no foreground:', error);
  }
}
