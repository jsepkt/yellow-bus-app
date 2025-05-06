// ==== IMPORT FIREBASE CONFIG ====
import { db, auth } from '../firebase-config.js';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// ==== GLOBALS ====
const routeTableBody = document.getElementById('routeTableBody');
const addRouteForm = document.getElementById('addRouteForm');

// ==== FETCH AND DISPLAY ROUTES ====
async function loadRoutes() {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'routes'), where('driver_id', '==', user.uid));
    const snapshot = await getDocs(q);
    routeTableBody.innerHTML = '';

    snapshot.forEach(doc => {
      const route = doc.data();
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${route.route_number}</td>
        <td>${route.pickup_location}</td>
        <td>${route.dropoff_location}</td>
        <td>${route.pickup_time}</td>
        <td>${route.dropoff_time}</td>
        <td>${route.number_of_stops}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-2">Edit</button>
          <button class="btn btn-sm btn-outline-danger">Delete</button>
        </td>
      `;
      routeTableBody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error loading routes:', error);
  }
}

// ==== ADD NEW ROUTE ====
addRouteForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(addRouteForm);
  const data = Object.fromEntries(formData.entries());

  try {
    const user = auth.currentUser;
    if (!user) return alert("User not logged in.");

    await addDoc(collection(db, 'routes'), {
      ...data,
      driver_id: user.uid,
      created_at: Timestamp.now()
    });

    addRouteForm.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('addRouteModal'));
    modal.hide();
    loadRoutes();
  } catch (error) {
    console.error("Failed to add route:", error);
    alert("Error saving route.");
  }
});

// ==== INITIAL LOAD ====
window.addEventListener('load', () => {
  auth.onAuthStateChanged(user => {
    if (user) {
      loadRoutes();
    } else {
      window.location.href = "/driver-login/";
    }
  });
});
