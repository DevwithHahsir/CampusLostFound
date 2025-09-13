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

// Lazy loading functions for Firebase services
let app = null;
let auth = null;
let db = null;
let analytics = null;

export const getApp = async () => {
  if (!app) {
    const { initializeApp } = await import("firebase/app");
    app = initializeApp(firebaseConfig);
  }
  return app;
};

export const getAuth = async () => {
  if (!auth) {
    const [appInstance, { getAuth: getAuthService }] = await Promise.all([
      getApp(),
      import("firebase/auth"),
    ]);
    auth = getAuthService(appInstance);
  }
  return auth;
};

export const getFirestore = async () => {
  if (!db) {
    const [appInstance, { getFirestore: getFirestoreService }] =
      await Promise.all([getApp(), import("firebase/firestore")]);
    db = getFirestoreService(appInstance);
  }
  return db;
};

export const getAnalytics = async () => {
  if (!analytics) {
    const [appInstance, { getAnalytics: getAnalyticsService }] =
      await Promise.all([getApp(), import("firebase/analytics")]);
    analytics = getAnalyticsService(appInstance);
  }
  return analytics;
};

export { firebaseConfig };
