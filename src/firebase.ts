// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Use Vite environment variables when available, fall back to the embedded config
// Use provided env vars when available; fall back to Cookbookapp project's values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBk0y0IfKwXx2x1jmo40Gc8L3ucmTz1RtE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'cookbookapp-1a2fa.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'cookbookapp-1a2fa',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'cookbookapp-1a2fa.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1059224808298',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1059224808298:web:74e590c59a4bc30c335313',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-R07WVXMDWW',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize analytics only in browser environments
let analytics;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    // analytics may not be supported in some environments
    // ignore initialization errors
  }
}

export const analyticsClient = analytics;
export const auth = getAuth(app);
export const db = getFirestore(app);
