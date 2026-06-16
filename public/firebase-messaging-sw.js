/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Parse configuration from registration URL query parameters
const params = new URL(self.location.href).searchParams;

const firebaseConfig = {
  apiKey: params.get('apiKey'),
  authDomain: params.get('authDomain'),
  projectId: params.get('projectId'),
  storageBucket: params.get('storageBucket'),
  messagingSenderId: params.get('messagingSenderId'),
  appId: params.get('appId'),
};

firebase.initializeApp(firebaseConfig);
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);

//   // Se a mensagem já contiver a propriedade 'notification', o SDK do Firebase
//   // exibe a notificação automaticamente em segundo plano. Chamar showNotification
//   // aqui causaria notificações duplicadas.
//   if (payload.notification) {
//     return;
//   }

//   const notificationTitle = payload.data?.title || 'Gestor Varandão';
//   const notificationOptions = {
//     body: payload.data?.body || '',
//     icon: '/icons/icon-128x128.png',
//     tag: payload.data?.title || 'gestor-varandao-notification',
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
