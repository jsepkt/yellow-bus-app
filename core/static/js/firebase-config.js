// static/js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// ✅ Your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBTFsRc9EBysuTRLJaOydeKr5vK--QFFjw",
  authDomain: "yellow-bus-a29ab.firebaseapp.com",
  projectId: "yellow-bus-a29ab",
  storageBucket: "yellow-bus-a29ab.appspot.com",  // fixed typo (was 'firebasestorage.app')
  messagingSenderId: "23020286217",
  appId: "1:23020286217:web:9214aaade9ea1bc67de3d8",
  measurementId: "G-KN1Q1Y3S20"
};

// ✅ Initialize and export Firebase services
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
