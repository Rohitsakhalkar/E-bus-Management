import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { app } from './firebase.js';

const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, user => {
  if (!user) {
    alert("Not logged in. Redirecting...");
    window.location.href = "../index.html";
  }
});

document.getElementById('busForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const busId = document.getElementById('busId').value.trim();
  const busNumber = document.getElementById('busNumber').value.trim();
  const type = document.getElementById('busType').value.trim();
  const source = document.getElementById('source').value.trim();
  const destination = document.getElementById('destination').value.trim();
  const contact = document.getElementById('contact').value.trim();

  if (!busId || !busNumber || !type || !source || !destination || !contact) {
    alert("Please fill all fields.");
    return;
  }

  try {
    const busRef = doc(db, "buses", busId);
    await updateDoc(busRef, {
      busNumber,
      type,
      source,
      destination,
      contact
    });

    alert("Bus details updated successfully ✅");
  } catch (err) {
    console.error("Update error:", err);
    alert("Failed to update bus info ❌");
  }
});
