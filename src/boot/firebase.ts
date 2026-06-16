// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase safely
import type { FirebaseApp } from 'firebase/app';
import { initializeApp } from 'firebase/app';

let firebaseApp: FirebaseApp | null = null;
if (firebaseConfig.apiKey) {
  try {
    firebaseApp = initializeApp(firebaseConfig);
  } catch (error) {
    console.error('Erro ao inicializar o Firebase App:', error);
  }
} else {
  console.warn('Firebase não foi inicializado: apiKey está ausente nas variáveis de ambiente.');
}

export { firebaseApp };
