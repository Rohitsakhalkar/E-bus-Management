import { db } from './firebase.js';
import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const driverTableBody = document.querySelector('#driverTable tbody');
const busTableBody = document.querySelector('#busTable tbody');

// Load Drivers
async function loadDrivers() {
  const snapshot = await getDocs(collection(db, "users"));
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.role === "driver") {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.name}</td>
        <td>${data.email}</td>
        <td>${data.uid}</td>
        <td>
          <button onclick="trackDriver('${data.uid}')">Track</button>
        </td>
      `;
      driverTableBody.appendChild(row);
    }
  });
}

// Load Buses with Approve/Reject
async function loadBuses() {
  const snapshot = await getDocs(collection(db, "buses"));
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const busId = docSnap.id;
    const isApproved = data.approved === true;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.busNumber}</td>
      <td>${data.type}</td>
      <td>${data.source} → ${data.destination}</td>
      <td>${data.contact}</td>
      <td>${data.driverId}</td>
      <td style="color: ${isApproved ? 'green' : 'orange'};">
        ${isApproved ? 'Approved' : 'Pending'}
      </td>
      <td>
        <button onclick="approveBus('${busId}', true)">Approve</button>
        <button onclick="approveBus('${busId}', false)">Reject</button>
      </td>
    `;
    busTableBody.appendChild(row);
  });
}

// Track Driver Button
window.trackDriver = function(uid) {
 window.location.href = `../tracker.html?uid=${uid}`;
};

// Approve / Reject Bus
window.approveBus = async function(busId, status) {
  try {
    const busRef = doc(db, "buses", busId);
    await updateDoc(busRef, {
      approved: status
    });
    alert(`Bus has been ${status ? "approved" : "rejected"} ✅`);
    location.reload(); // reload dashboard
  } catch (error) {
    console.error("Error updating bus:", error);
    alert("Failed to update status ❌");
  }
};

// Load both tables on page load
loadDrivers();
loadBuses();
