import { initializeApp } from "firebase/app";
import {
  browserSessionPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCrsVBes3rkaRF8kIbWc8viGTJJB_7TNuQ",
  authDomain: "saksflyt-75921.firebaseapp.com",
  projectId: "saksflyt-75921",
  storageBucket: "saksflyt-75921.firebasestorage.app",
  messagingSenderId: "100234400524",
  appId: "1:100234400524:web:516507ef54407823a4af29",
  measurementId: "G-7F944653C5",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const authReady = setPersistence(auth, browserSessionPersistence);

export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
