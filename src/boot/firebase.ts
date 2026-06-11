// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCytMtL1AnjKk-QIfX04nuC4At7xaJ4p20',
  authDomain: 'gestor-varandao.firebaseapp.com',
  projectId: 'gestor-varandao',
  storageBucket: 'gestor-varandao.firebasestorage.app',
  messagingSenderId: '308057602519',
  appId: '1:308057602519:web:44df0896c36beeda4ff392',
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
