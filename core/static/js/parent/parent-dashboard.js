// ==== FIREBASE IMPORTS ====
import { db } from "../firebase-config.js";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// ==== DOM ELEMENTS ====
const studentNameEl = document.getElementById("studentName");
const routeEl = document.getElementById("routeNumber");
const seatEl = document.getElementById("seatNumber");
const pickupEl = document.getElementById("pickupTime");
const dropoffEl = document.getElementById("dropoffTime");
const conductList = document.getElementById("conductReports");
const requestForm = document.getElementById("parentRequestForm");
const requestInput = document.getElementById("requestMessage");
const requestSuccess = document.getElementById("requestSuccess");
const logoutBtn = document.getElementById("logoutBtn");

// ==== LOAD DASHBOARD ====
window.addEventListener("load", async () => {
  const studentId = localStorage.getItem("parentStudentId");

  if (!studentId) {
    window.location.href = "/parent-login/";
    return;
  }

  try {
    const studentRef = doc(db, "students", studentId);
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {
      alert("Student not found.");
      localStorage.removeItem("parentStudentId");
      window.location.href = "/parent-login/";
      return;
    }

    const student = studentSnap.data();

    studentNameEl.textContent = `${capitalize(student.first_name)} ${capitalize(student.last_name)}`;
    routeEl.textContent = student.route_number || "-";
    seatEl.textContent = student.seat_number || "-";
    pickupEl.textContent = student.pickup_time || "-";
    dropoffEl.textContent = student.dropoff_time || "-";

    loadConductReports(studentId);
  } catch (err) {
    console.error("❌ Error loading dashboard:", err);
  }
});

// ==== LOAD CONDUCT REPORTS ====
async function loadConductReports(studentId) {
  try {
    const q = query(
      collection(db, "conduct_reports"),
      where("student_id", "==", studentId)
    );

    const snapshot = await getDocs(q);
    conductList.innerHTML = "";

    if (snapshot.empty) {
      conductList.innerHTML = '<li class="list-group-item text-muted">No reports found.</li>';
      return;
    }

    snapshot.forEach(doc => {
      const report = doc.data();
      const dateStr = report.date?.seconds ? new Date(report.date.seconds * 1000).toLocaleString() : "-";

      const li = document.createElement("li");
      li.className = "list-group-item";
      li.innerHTML = `
        <strong>${report.issue_type || "Issue"}:</strong> ${report.description || "-"}
        <div class="text-muted small">${dateStr}</div>
      `;
      conductList.appendChild(li);
    });

  } catch (err) {
    console.error("❌ Failed to load conduct reports:", err);
  }
}

// ==== HANDLE PARENT REQUEST FORM ====
requestForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const studentId = localStorage.getItem("parentStudentId");
  const message = requestInput.value.trim();

  if (!message || !studentId) return;

  try {
    await addDoc(collection(db, "parent_requests"), {
      student_id: studentId,
      message: message,
      date: Timestamp.now()
    });

    requestForm.reset();
    requestSuccess.classList.remove("d-none");
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      requestSuccess.classList.add("d-none");
    }, 3000);

  } catch (err) {
    console.error("❌ Failed to send request:", err);
    alert("Something went wrong.");
  }
});

// ==== LOGOUT FUNCTION ====
if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("parentStudentId");
    window.location.href = "/parent-login/";
  });
}

// ==== HELPER ====
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
