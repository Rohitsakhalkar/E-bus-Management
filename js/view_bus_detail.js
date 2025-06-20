import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { app } from './firebase.js';

const auth = getAuth(app);
const db = getFirestore(app);
const busList = document.getElementById("busList");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Not logged in. Redirecting...");
    window.location.href = "index.html";
    return;
  }

  try {
    const q = query(collection(db, "buses"), where("driverId", "==", user.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      busList.innerHTML = "<p>No buses found 🚌</p>";
      return;
    }

    busList.innerHTML = ""; // clear loading text

    snapshot.forEach(doc => {
      const bus = doc.data();
      const card = document.createElement("div");
      card.className = "bus-card";
      card.innerHTML = `
        <p><strong>Bus Number:</strong> ${bus.busNumber}</p>
        <p><strong>Type:</strong> ${bus.type}</p>
        <p><strong>Route:</strong> ${bus.source} → ${bus.destination}</p>
        <p><strong>Contact:</strong> ${bus.contact}</p>
        <p><strong>Status:</strong> ${bus.approved ? "✅ Approved" : "❌ Not Approved"}</p>
        <p><strong>Doc ID:</strong> ${doc.id}</p>
      `;
      busList.appendChild(card);
    });
  } catch (err) {
    console.error("Error fetching bus data:", err);
    busList.innerHTML = "<p>Error loading bus data ❌</p>";
  }
});
