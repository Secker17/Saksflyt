import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Disse verdiene kobler nettsiden til prosjektet mitt i Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyCrsVBes3rkaRF8kIbWc8viGTJJB_7TNuQ",
  authDomain: "saksflyt-75921.firebaseapp.com",
  projectId: "saksflyt-75921",
  storageBucket: "saksflyt-75921.firebasestorage.app",
  messagingSenderId: "100234400524",
  appId: "1:100234400524:web:516507ef54407823a4af29",
  measurementId: "G-7F944653C5"
};

const app = initializeApp(firebaseConfig);

// auth brukes av sidene som logger inn, registrerer og logger ut brukere.
export const auth = getAuth(app);

// Denne brukes når en bruker vil logge inn med Google.
export const googleProvider = new GoogleAuthProvider();
