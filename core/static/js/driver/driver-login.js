// ==== FIREBASE IMPORTS ====
import { auth } from "../firebase-config.js";
import {
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// ==== DOM ELEMENTS ====
const loginForm = document.getElementById("driverLoginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please enter your email and password.");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 🔐 Check email verification
    if (!user.emailVerified) {
      alert("⚠️ Please verify your email before logging in.");
      await signOut(auth);
      return;
    }

    // ✅ Success: redirect to dashboard
    alert("✅ Login successful!");
    window.location.href = "/driver-dashboard/";

  } catch (err) {
    console.error("❌ Login failed:", err);
    alert("Invalid email or password. Please try again.");
  }
});
