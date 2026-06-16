// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.FIREBASE_PROJECT_ID!,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.FIREBASE_APP_ID!,
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
