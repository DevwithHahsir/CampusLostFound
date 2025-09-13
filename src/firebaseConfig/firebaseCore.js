// Core Firebase configuration with production-safe initialization
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyCHkicnfGCo3lSaty1Wsln1uNDgyKCz4ds",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "campusfoundlost.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "campusfoundlost",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "campusfoundlost.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "362890296785",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:362890296785:web:40c84b456659cf5ee5f4f0",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-C3ZCP0CFL9",
};

// Initialize Firebase app immediately to avoid circular dependencies
const app = initializeApp(firebaseConfig);

// Cache for initialized services
let authInstance = null;
let dbInstance = null;
let analyticsInstance = null;

// Service initialization flags to prevent multiple imports
let authImported = false;
let dbImported = false;
let analyticsImported = false;

export const getApp = () => app;

export const getAuth = async () => {
  if (authInstance) return authInstance;

  if (!authImported) {
    try {
      const { getAuth: getAuthService } = await import("firebase/auth");
      authInstance = getAuthService(app);
      authImported = true;
    } catch (error) {
      console.error("Firebase auth initialization error:", error);
      throw error;
    }
  }

  return authInstance;
};

export const getFirestore = async () => {
  if (dbInstance) return dbInstance;

  if (!dbImported) {
    try {
      const { getFirestore: getFirestoreService } = await import(
        "firebase/firestore"
      );
      dbInstance = getFirestoreService(app);
      dbImported = true;
    } catch (error) {
      console.error("Firebase firestore initialization error:", error);
      throw error;
    }
  }

  return dbInstance;
};

export const getAnalytics = async () => {
  if (analyticsInstance) return analyticsInstance;

  if (!analyticsImported) {
    try {
      const { getAnalytics: getAnalyticsService } = await import(
        "firebase/analytics"
      );
      analyticsInstance = getAnalyticsService(app);
      analyticsImported = true;
    } catch (error) {
      console.error("Firebase analytics initialization error:", error);
      throw error;
    }
  }

  return analyticsInstance;
};

export { firebaseConfig };
