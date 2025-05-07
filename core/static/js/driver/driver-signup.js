// ==== FIREBASE IMPORTS ====
import { auth, db } from "../firebase-config.js";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  doc,
  setDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// ==== DOM ====
const signupForm = document.getElementById("driverSignupForm");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const first_name = signupForm.first_name.value.trim();
  const last_name = signupForm.last_name.value.trim();
  const school_district = signupForm.school_district.value.trim();
  const email = signupForm.email.value.trim();
  const password = signupForm.password.value;

  if (!first_name || !last_name || !school_district || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    // ✅ Create Firebase User
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ✅ Save Driver Profile in Firestore
    await setDoc(doc(db, "drivers", user.uid), {
      first_name,
      last_name,
      email,
      school_district,
      created_at: Timestamp.now()
    });

    // ✅ Send Verification Email
    await sendEmailVerification(user);

    alert("Account created! Please check your email to verify before logging in.");
    signupForm.reset();
    window.location.href = "/driver-login/";

  } catch (error) {
    console.error("❌ Signup error:", error);
    if (error.code === "auth/email-already-in-use") {
      alert("That email is already registered.");
    } else {
      alert("Something went wrong. Try again.");
    }
  }
});
