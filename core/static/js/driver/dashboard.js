// ==== FIREBASE IMPORTS ====
import { auth, db } from '../firebase-config.js';
import {
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
  limit
} from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

// ==== DOM ELEMENTS ====
const driverNameEl = document.getElementById('driverName');
const routeCountEl = document.getElementById('routeCount');
const studentCountEl = document.getElementById('studentCount');
const alertCountEl = document.getElementById('alertCount');
const recentActivityList = document.getElementById('recentActivity');

// ==== MAIN LOGIC ====
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = '/driver-login/';
    return;
  }

  try {
    // ✅ Get Driver's Name
    const driverDocRef = doc(db, 'drivers', user.uid);
    const driverDocSnap = await getDoc(driverDocRef);
    const driverData = driverDocSnap.data();
    driverNameEl.textContent = driverData?.first_name || 'Driver';

    // ✅ Count Routes Assigned to This Driver
    const routesSnap = await getDocs(
      query(collection(db, 'routes'), where('driver_id', '==', user.uid))
    );
    routeCountEl.textContent = routesSnap.size;

    // ✅ Count Students Assigned to This Driver
    const studentsSnap = await getDocs(
      query(collection(db, 'students'), where('driver_id', '==', user.uid))
    );
    studentCountEl.textContent = studentsSnap.size;

    // ✅ Conduct Alerts (students with conduct_score < 50)
    let alertCount = 0;
    studentsSnap.forEach((doc) => {
      const data = doc.data();
      if (data.conduct_score && data.conduct_score < 50) {
        alertCount++;
      }
    });
    alertCountEl.textContent = alertCount;

    // ✅ Recent Activity (Latest 5 students)
    const recentSnap = await getDocs(
      query(
        collection(db, 'students'),
        where('driver_id', '==', user.uid),
        orderBy('created_at', 'desc'),
        limit(5)
      )
    );

    recentActivityList.innerHTML = '';
    if (recentSnap.empty) {
      recentActivityList.innerHTML = '<li class="list-group-item">No recent updates.</li>';
    } else {
      recentSnap.forEach((doc) => {
        const s = doc.data();
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `🧒 ${s.first_name} ${s.last_name} added to route ${s.route_number}`;
        recentActivityList.appendChild(li);
      });
    }

  } catch (err) {
    console.error('Dashboard Load Error:', err);
    recentActivityList.innerHTML = `<li class="list-group-item text-danger">Error loading data</li>`;
  }
});
