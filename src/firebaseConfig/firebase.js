// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
  console.log("Environment variables:", {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? "✓" : "✗",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? "✓" : "✗",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? "✓" : "✗",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? "✓" : "✗",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
      ? "✓"
      : "✗",
    appId: import.meta.env.VITE_FIREBASE_APP_ID ? "✓" : "✗",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ? "✓" : "✗",
  });
} else {
  console.log(
    "Firebase configuration loaded successfully for project:",
    firebaseConfig.projectId
  );
}

// Initialize Firebase
let app, db, auth, analytics, storage;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);

  try {
    analytics = getAnalytics(app);
  } catch (analyticsError) {
    console.warn("Analytics not available:", analyticsError.message);
    analytics = null;
  }

  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Failed to initialize Firebase:", error);
  throw new Error(
    "Firebase initialization failed. Please check your configuration."
  );
}

export { db, auth, analytics, storage };
