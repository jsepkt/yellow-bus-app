// ==== FIREBASE IMPORTS ====
import { db } from "../firebase-config.js";
import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// ==== DOM ELEMENTS ====
const loginForm = document.getElementById("studentLoginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const routeNumber = document.getElementById("routeNumber").value.trim();
  const firstName = document.getElementById("firstName").value.trim().toLowerCase();
  const lastName = document.getElementById("lastName").value.trim().toLowerCase();

  if (!routeNumber || !firstName || !lastName) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const studentsRef = collection(db, "students");
    const q = query(
      studentsRef,
      where("route_number", "==", routeNumber),
      where("first_name", "==", firstName),
      where("last_name", "==", lastName)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const studentDoc = querySnapshot.docs[0];
      const studentId = studentDoc.id;

      // Save to localStorage or sessionStorage
      localStorage.setItem("studentId", studentId);

      // Redirect to dashboard
      window.location.href = "/student-dashboard/";  // Django URL name
    } else {
      alert("❌ Student not found. Please check your details.");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong. Please try again.");
  }
});
