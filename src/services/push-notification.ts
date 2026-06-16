import { getMessaging, getToken, onMessage } from 'firebase/messaging';
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
    if (!firebaseApp) {
      console.warn('FCM não inicializado: firebaseApp está ausente.');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return null;
    }

    const messaging = getMessaging(firebaseApp);

    const registration = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      serviceWorkerRegistration: registration,
      vapidKey:
        process.env.FIREBASE_VAPID_KEY ||
        'BDGWDuVF5I1B6NlvpQhLBFkO4bqqL09SqO9vmPbyFqAzu9lN7_sdcXalb3UpZfjNbDNfvZpcQ8YVnVZjz_tagTE',
    });

    console.log('TOKEN GERADO:', token);

    console.log('CONFIG:', {
      projectId: firebaseApp.options.projectId,
      messagingSenderId: firebaseApp.options.messagingSenderId,
      appId: firebaseApp.options.appId,
    });

    return token;
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

  if (!firebaseApp) {
    console.warn('FCM não inicializado: firebaseApp está ausente.');
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
