import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase config - REPLACE with your actual config from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDLbJ0idDwfQxWpWxYHCiDVxHRp2RQlf-k",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "chemgenius-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "chemgenius-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "chemgenius-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log("Firebase initialized");
