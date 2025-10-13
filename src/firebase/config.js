// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v9 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGXlJvqwID-S2BAKmtZLGX6cq42h0xJuA",
  authDomain: "namaa-b268d.firebaseapp.com",
  projectId: "namaa-b268d",
  storageBucket: "namaa-b268d.appspot.com",
  messagingSenderId: "333417328323",
  appId: "1:333417328323:web:7e04a621c6be749db2fc76",
  measurementId: "your-measurement-id",
  databaseURL: "https://namaa-b268d-default-rtdb.europe-west1.firebasedatabase.app/"
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
