// Core Firebase configuration - only the essentials
// This is loaded immediately, other Firebase services are loaded lazily

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

// Validate Firebase configuration
if (!firebaseConfig.projectId) {
  console.error("Firebase configuration error: Missing projectId");
}

// Lazy loading functions for Firebase services with proper initialization order
let app = null;
let auth = null;
let db = null;
let analytics = null;

// Prevent multiple simultaneous initializations
let appPromise = null;
let authPromise = null;
let dbPromise = null;
let analyticsPromise = null;

export const getApp = async () => {
  if (app) return app;
  if (appPromise) return appPromise;

  appPromise = (async () => {
    try {
      const { initializeApp } = await import("firebase/app");
      app = initializeApp(firebaseConfig);
      return app;
    } catch (error) {
      console.error("Firebase app initialization error:", error);
      appPromise = null; // Reset on error
      throw error;
    }
  })();

  return appPromise;
};

export const getAuth = async () => {
  if (auth) return auth;
  if (authPromise) return authPromise;

  authPromise = (async () => {
    try {
      const appInstance = await getApp();
      const { getAuth: getAuthService } = await import("firebase/auth");
      auth = getAuthService(appInstance);
      return auth;
    } catch (error) {
      console.error("Firebase auth initialization error:", error);
      authPromise = null; // Reset on error
      throw error;
    }
  })();

  return authPromise;
};

export const getFirestore = async () => {
  if (db) return db;
  if (dbPromise) return dbPromise;

  dbPromise = (async () => {
    try {
      const appInstance = await getApp();
      const { getFirestore: getFirestoreService } = await import(
        "firebase/firestore"
      );
      db = getFirestoreService(appInstance);
      return db;
    } catch (error) {
      console.error("Firebase firestore initialization error:", error);
      dbPromise = null; // Reset on error
      throw error;
    }
  })();

  return dbPromise;
};

export const getAnalytics = async () => {
  if (analytics) return analytics;
  if (analyticsPromise) return analyticsPromise;

  analyticsPromise = (async () => {
    try {
      const appInstance = await getApp();
      const { getAnalytics: getAnalyticsService } = await import(
        "firebase/analytics"
      );
      analytics = getAnalyticsService(appInstance);
      return analytics;
    } catch (error) {
      console.error("Firebase analytics initialization error:", error);
      analyticsPromise = null; // Reset on error
      throw error;
    }
  })();

  return analyticsPromise;
};

export { firebaseConfig };
