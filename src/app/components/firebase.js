import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Create a shared Firebase app instance
const firebaseApp = getApps().length === 0 
  ? (typeof window !== 'undefined' ? initializeApp(firebaseConfig) : null)
  : getApps()[0];

// Export auth - will be null during SSR/build time, but valid on client
export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export default firebaseApp;
