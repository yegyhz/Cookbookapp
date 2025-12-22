import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Use Vite env vars when available, otherwise fall back to Cookbookapp project defaults
const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY as string) || 'AIzaSyBk0y0IfKwXx2x1jmo40Gc8L3ucmTz1RtE',
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) || 'cookbookapp-1a2fa.firebaseapp.com',
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || 'cookbookapp-1a2fa',
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) || 'cookbookapp-1a2fa.firebasestorage.app',
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || '1059224808298',
  appId: (import.meta.env.VITE_FIREBASE_APP_ID as string) || '1:1059224808298:web:74e590c59a4bc30c335313',
};

const app = initializeApp(firebaseConfig as Record<string, string>);
export const auth = getAuth(app);