/* eslint-disable no-unused-vars */
// Firebase Core Configuration - Stable v11.0.2 setup
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config from environment variables (Vite)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app first
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  // Fallback initialization
  app = initializeApp(firebaseConfig);
}

// Initialize services with error boundaries
let auth, db, storage;

try {
  auth = getAuth(app);
} catch (error) {
  console.error("Firebase Auth initialization error:", error);
}

try {
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase Firestore initialization error:", error);
}

try {
  storage = getStorage(app);
} catch (error) {
  console.error("Firebase Storage initialization error:", error);
}

// Export services
export { auth, db, storage };
