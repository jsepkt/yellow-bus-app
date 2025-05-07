// ==== FIREBASE IMPORTS ====
import { db, auth } from '../firebase-config.js';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// ==== DOM ELEMENTS ====
const studentTableBody = document.getElementById('studentTableBody');
const addStudentForm = document.getElementById('addStudentForm');
const studentSearchInput = document.getElementById('studentSearch');

// Edit Modal Elements
const editStudentForm = document.getElementById('editStudentForm');
const editModal = new bootstrap.Modal(document.getElementById('editStudentModal'));

// Current student ID being edited
let currentEditId = null;

// ==== LOAD STUDENTS ====
let studentCache = [];

async function loadStudents() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const q = query(collection(db, 'students'), where('driver_id', '==', user.uid));
    const snapshot = await getDocs(q);

    studentCache = [];
    snapshot.forEach(docSnap => {
      studentCache.push({ id: docSnap.id, ...docSnap.data() });
    });

    renderStudents(studentCache);
  } catch (err) {
    console.error("❌ Failed to load students:", err);
  }
}

// ==== RENDER STUDENTS TABLE ====
function renderStudents(students) {
  studentTableBody.innerHTML = '';

  if (students.length === 0) {
    studentTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No students found.</td></tr>';
    return;
  }

  students.forEach((student, i) => {
    const row = document.createElement('tr');
    const scoreBadge = student.conduct_score < 50 ? 'badge bg-danger' : 'badge bg-success';

    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${student.first_name}</td>
      <td>${student.last_name}</td>
      <td>${student.route_number}</td>
      <td>${student.seat_number || '-'}</td>
      <td><span class="${scoreBadge}">${student.conduct_score || 100}</span></td>
      <td>
        <button class="btn btn-sm btn-primary edit-btn" data-id="${student.id}">Edit</button>
        <button class="btn btn-sm btn-danger delete-btn" data-id="${student.id}">Delete</button>
      </td>
    `;
    studentTableBody.appendChild(row);
  });

  attachEditHandlers();
  attachDeleteHandlers();
}

// ==== ADD STUDENT ====
addStudentForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(addStudentForm);
  const data = Object.fromEntries(formData.entries());

  const user = auth.currentUser;
  if (!user) return alert("Not logged in.");

  try {
    await addDoc(collection(db, 'students'), {
      ...data,
      driver_id: user.uid,
      conduct_score: 100,
      created_at: Timestamp.now()
    });

    addStudentForm.reset();
    bootstrap.Modal.getInstance(document.getElementById('addStudentModal')).hide();
    await loadStudents();
  } catch (err) {
    console.error("❌ Error adding student:", err);
    alert("Something went wrong.");
  }
});

// ==== EDIT STUDENT ====
function attachEditHandlers() {
  const editButtons = document.querySelectorAll('.edit-btn');
  editButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const student = studentCache.find(s => s.id === id);
      if (!student) return;

      currentEditId = id;
      editStudentForm.first_name.value = student.first_name;
      editStudentForm.last_name.value = student.last_name;
      editStudentForm.route_number.value = student.route_number;
      editStudentForm.seat_number.value = student.seat_number || '';
      editModal.show();
    });
  });
}

editStudentForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!currentEditId) return;

  const formData = new FormData(editStudentForm);
  const updates = Object.fromEntries(formData.entries());

  try {
    await updateDoc(doc(db, 'students', currentEditId), updates);
    editStudentForm.reset();
    editModal.hide();
    currentEditId = null;
    await loadStudents();
  } catch (err) {
    console.error("❌ Error updating student:", err);
    alert("Update failed.");
  }
});

// ==== DELETE STUDENT ====
function attachDeleteHandlers() {
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.dataset.id;
      if (!confirm("Delete this student?")) return;

      try {
        await deleteDoc(doc(db, 'students', id));
        await loadStudents();
      } catch (err) {
        console.error("❌ Error deleting:", err);
      }
    });
  });
}

// ==== SEARCH FILTER ====
studentSearchInput.addEventListener('input', () => {
  const search = studentSearchInput.value.toLowerCase();
  const filtered = studentCache.filter(s =>
    s.first_name.toLowerCase().includes(search) ||
    s.seat_number?.toLowerCase().includes(search)
  );
  renderStudents(filtered);
});

// ==== INIT ====
window.addEventListener('load', () => {
  auth.onAuthStateChanged(user => {
    if (user) {
      loadStudents();
    } else {
      window.location.href = "/driver-login/";
    }
  });
});
