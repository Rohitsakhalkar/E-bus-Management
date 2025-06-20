import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import { app } from './firebase.js';

const auth = getAuth(app);
const rtdb = getDatabase(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    startLocationSharing(user.uid);
  } else {
    alert("Driver not logged in!");
    window.location.href = "index.html";
  }
});

function startLocationSharing(uid) {
  if (!navigator.geolocation) {
    alert("Geolocation not supported ❌");
    return;
  }

  navigator.geolocation.watchPosition((pos) => {
    const { latitude, longitude } = pos.coords;

    set(ref(rtdb, `busLocations/${uid}`), {
      latitude,
      longitude,
      timestamp: Date.now()
    });

    // Optional: log for debugging
    console.log(`Location updated: Lat ${latitude}, Lng ${longitude}`);
  }, (err) => {
    console.error(err);
    alert("GPS permission denied ❌");
  }, {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 5000
  });
}