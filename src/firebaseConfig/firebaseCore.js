// Firebase Core Configuration - Stable v11.0.2 setup
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your config
const firebaseConfig = {
  apiKey: "AIzaSyCHkicnfGCo3lSaty1Wsln1uNDgyKCz4ds",
  authDomain: "campusfoundlost.firebaseapp.com",
  projectId: "campusfoundlost",
  storageBucket: "campusfoundlost.firebasestorage.app",
  messagingSenderId: "362890296785",
  appId: "1:362890296785:web:40c84b456659cf5ee5f4f0",
};

// Initialize Firebase app first
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase initialization error:", error);
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
