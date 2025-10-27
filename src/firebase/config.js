// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v9 and later, measurementId is optional
// Supports environment variables for easy migration between Firebase projects
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDOQHNX90UG3JfrGn8VXmPHCJ_Fa983XD4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "namaa-fc163.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "namaa-fc163",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "namaa-fc163.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "117620777227",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:117620777227:web:5e5bde97f349649840820e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-KKVH5PY6H8",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://namaa-fc163-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

export default app;
