// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHkicnfGCo3lSaty1Wsln1uNDgyKCz4ds",
  authDomain: "campusfoundlost.firebaseapp.com",
  projectId: "campusfoundlost",
  storageBucket: "campusfoundlost.firebasestorage.app",
  messagingSenderId: "362890296785",
  appId: "1:362890296785:web:40c84b456659cf5ee5f4f0",
  measurementId: "G-C3ZCP0CFL9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ANALYTICS = getAnalytics(app);

export { db };
