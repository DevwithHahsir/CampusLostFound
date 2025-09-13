// Import the functions you need
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

// Initialize
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
