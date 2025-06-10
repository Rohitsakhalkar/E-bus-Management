import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import { app } from './firebase.js';

const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

let currentUser = null;

// Track auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    startLocationSharing(user.uid);
  } else {
    alert("Driver not logged in!");
    window.location.href = "index.html";
  }
});

// Post bus info to Firestore
window.postBus = async function () {
  const busNumber = document.getElementById('busNumber').value;
  const type = document.getElementById('busType').value;
  const source = document.getElementById('source').value;
  const destination = document.getElementById('destination').value;
  const contact = document.getElementById('contact').value;

  if (!busNumber || !type || !source || !destination || !contact) {
    alert("Please fill all fields.");
    return;
  }

  try {
    await addDoc(collection(db, "buses"), {
      driverId: currentUser.uid,
      busNumber,
      type,
      source,
      destination,
      contact,
      approved: false // default not approved
    });

    alert("Bus info posted successfully ✅");
    document.getElementById('busNumber').value = '';
    document.getElementById('busType').value = '';
    document.getElementById('source').value = '';
    document.getElementById('destination').value = '';
    document.getElementById('contact').value = '';
  } catch (error) {
    console.error("Error posting bus:", error);
    alert("Error saving bus data.");
  }
};

// Share live location to Realtime DB
function startLocationSharing(uid) {
  const status = document.getElementById('locationStatus');
  if (!navigator.geolocation) {
    status.textContent = "Geolocation not supported ❌";
    return;
  }

  navigator.geolocation.watchPosition((pos) => {
    const { latitude, longitude } = pos.coords;

    set(ref(rtdb, `busLocations/${uid}`), {
      latitude,
      longitude,
      timestamp: Date.now()
    });

    status.textContent = `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`;
  }, (err) => {
    console.error(err);
    status.textContent = "GPS permission denied ❌";
  }, {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 5000
  });
}
