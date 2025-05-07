// ==== FIREBASE IMPORT ====
import { db } from '../firebase-config.js';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// ==== GLOBALS ====
const addStopForm = document.getElementById('addStopForm');
const stopTableBody = document.getElementById('stopTableBody');
const addStopModal = new bootstrap.Modal(document.getElementById('addStopModal'));

let currentEditId = null;

// ==== RENDER STOPS ====
async function loadStops() {
  try {
    const snapshot = await getDocs(collection(db, `routes/${routeId}/stops`));
    stopTableBody.innerHTML = '';
    let count = 1;

    snapshot.forEach(docSnap => {
      const stop = docSnap.data();
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${count++}</td>
        <td>${stop.name}</td>
        <td>${stop.location || '-'}</td>
        <td>${stop.pickup_time}</td>
        <td>${stop.dropoff_time}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2" onclick="editStop('${docSnap.id}', ${JSON.stringify(stop).replace(/"/g, '&quot;')})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteStop('${docSnap.id}')">Delete</button>
        </td>
      `;
      stopTableBody.appendChild(row);
    });

    if (count === 1) {
      stopTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No stops found.</td></tr>';
    }

  } catch (err) {
    console.error("❌ Failed to load stops:", err);
  }
}

// ==== ADD/EDIT STOP ====
addStopForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(addStopForm);
  const stopData = {
    name: formData.get('stop_name'),
    location: formData.get('location'),
    pickup_time: formData.get('pickup_time'),
    dropoff_time: formData.get('dropoff_time'),
    created_at: Timestamp.now()
  };

  try {
    if (currentEditId) {
      await updateDoc(doc(db, `routes/${routeId}/stops`, currentEditId), stopData);
      currentEditId = null;
    } else {
      await addDoc(collection(db, `routes/${routeId}/stops`), stopData);
    }

    addStopForm.reset();
    addStopModal.hide();
    loadStops();

  } catch (err) {
    console.error("❌ Failed to save stop:", err);
  }
});

// ==== EDIT STOP ====
window.editStop = function (stopId, stopData) {
  currentEditId = stopId;
  document.getElementById('addStopLabel').textContent = 'Edit Stop';
  addStopForm.stop_name.value = stopData.name;
  addStopForm.location.value = stopData.location || '';
  addStopForm.pickup_time.value = stopData.pickup_time;
  addStopForm.dropoff_time.value = stopData.dropoff_time;
  addStopModal.show();
};

// ==== DELETE STOP ====
window.deleteStop = async function (stopId) {
  if (!confirm("Are you sure you want to delete this stop?")) return;
  try {
    await deleteDoc(doc(db, `routes/${routeId}/stops`, stopId));
    loadStops();
  } catch (err) {
    console.error("❌ Failed to delete stop:", err);
  }
};

// ==== INIT ====
window.addEventListener('load', () => {
  loadStops();
});
