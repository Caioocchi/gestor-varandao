/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: 'AIzaSyCytMtL1AnjKk-QIfX04nuC4At7xaJ4p20',
  authDomain: 'gestor-varandao.firebaseapp.com',
  projectId: 'gestor-varandao',
  storageBucket: 'gestor-varandao.firebasestorage.app',
  messagingSenderId: '308057602519',
  appId: '1:308057602519:web:44df0896c36beeda4ff392',
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
