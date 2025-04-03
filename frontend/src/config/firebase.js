import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD5Qh8Qh8Qh8Qh8Qh8Qh8Qh8Qh8Qh8Qh8Q",
  authDomain: "myheart-8463b.firebaseapp.com",
  projectId: "myheart-8463b",
  storageBucket: "myheart-8463b.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-ABCDEF1234"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth }; 