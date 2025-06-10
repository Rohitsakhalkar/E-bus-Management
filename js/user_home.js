import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { app } from './firebase.js';

const db = getFirestore(app);
const busTableBody = document.querySelector('#busTable tbody');

window.searchBuses = async function () {
  const source = document.getElementById("source").value.trim().toLowerCase();
  const destination = document.getElementById("destination").value.trim().toLowerCase();

  if (!source || !destination) {
    alert("Please enter both source and destination.");
    return;
  }

  busTableBody.innerHTML = ""; // Clear table

  const snapshot = await getDocs(collection(db, "buses"));
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (
      data.approved === true &&
      data.source.toLowerCase() === source &&
      data.destination.toLowerCase() === destination
    ) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.busNumber}</td>
        <td>${data.type}</td>
        <td>${data.source} → ${data.destination}</td>
        <td>${data.contact}</td>
        <td>
          <button onclick="viewLocation('${data.driverId}')">Track</button>
        </td>
      `;
      busTableBody.appendChild(row);
    }
  });
};

window.viewLocation = function(driverId) {
  window.open(`../tracker.html?uid=${driverId}`, "_blank");
};
