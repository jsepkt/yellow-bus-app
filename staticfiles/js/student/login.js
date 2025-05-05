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
      where("routeNumber", "==", routeNumber),
      where("firstName", "==", firstName),
      where("lastName", "==", lastName)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const studentDoc = querySnapshot.docs[0];
      const studentId = studentDoc.id;
      localStorage.setItem("studentId", studentId);
      window.location.href = "/student/dashboard"; // Adjust as needed
    } else {
      alert("Student not found. Please check your details.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred. Please try again.");
  }
});
