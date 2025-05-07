// ==== FIREBASE IMPORT ====
import { db } from "../firebase-config.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// ==== DOM ELEMENTS ====
const nameEl = document.getElementById("studentName");
const routeEl = document.getElementById("studentRoute");
const seatEl = document.getElementById("seatNumber");
const pickupEl = document.getElementById("pickupTime");
const dropoffEl = document.getElementById("dropoffTime");
const conductEl = document.getElementById("conductScore");

// ==== MAIN LOGIC ====
window.addEventListener("load", async () => {
  const studentId = localStorage.getItem("studentId");

  if (!studentId) {
    window.location.href = "/student-login/";
    return;
  }

  try {
    const studentRef = doc(db, "students", studentId);
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {
      alert("Student not found. Please login again.");
      localStorage.removeItem("studentId");
      window.location.href = "/student-login/";
      return;
    }

    const student = studentSnap.data();

    // Fill student details
    nameEl.textContent = `${capitalize(student.first_name)} ${capitalize(student.last_name)}`;
    routeEl.textContent = student.route_number || "-";
    seatEl.textContent = student.seat_number || "-";
    pickupEl.textContent = student.pickup_time || "-";
    dropoffEl.textContent = student.dropoff_time || "-";
    conductEl.textContent = student.conduct_score || 100;

    if (student.conduct_score < 50) {
      conductEl.classList.add("text-danger", "fw-bold");
    }

  } catch (err) {
    console.error("Error loading student dashboard:", err);
    alert("Error loading data. Try logging in again.");
    window.location.href = "/student-login/";
  }
});

// ==== Helper Function ====
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
