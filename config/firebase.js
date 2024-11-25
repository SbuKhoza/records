// config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Add this import
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDNzAK-oG8Ir0uV4PJFmM0LmhZvqU5qQ_o",
  authDomain: "audio-recorder-f75c4.firebaseapp.com",
  projectId: "audio-recorder-f75c4",
  storageBucket: "audio-recorder-f75c4.firebasestorage.app",
  messagingSenderId: "817376701682",
  appId: "1:817376701682:web:d3bb3ad9be83084585746b",
  measurementId: "G-HPVSDQTZ99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
const analytics = getAnalytics(app);

// Initialize Auth and export it
export const auth = getAuth(app);  // Add this line

// If you need to export analytics or app elsewhere
export { analytics, app };